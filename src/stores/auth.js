import { ref, watch } from "vue";
import { defineStore } from "pinia";
import axiosInstance, {
  requestTokenRefresh,
  isTokenRefreshInFlight,
  TOKEN_REFRESHED_EVENT_NAME,
} from "@/axios/axios";
import { get } from "@/services/serverConfig";
import { pushNotificationService } from "@/services/pushNotificationService.js";

// Constants for storage keys
const USER_INFO_KEY = "userInfo";
const TOKEN_KEY = "token";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";
const AUTH_REDIRECT_URL_KEY = "auth_redirect_url";

// Token refresh threshold (seconds before expiry to start refreshing)
const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes
const AUTO_REFRESH_ENABLED = true;

// --- Internal helpers (not exported) ---

const shouldForceLogoutByCode = (code) => {
  return (
    code === "ZC_ERROR_INVALID_REFRESH_TOKEN" ||
    code === "ZC_ERROR_REFRESH_TOKEN_EXPIRED"
  );
};

const setStorageValue = (key, value) => {
  if (value === undefined || value === null || value === "") {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, String(value));
};

const parseDateTime = (value) => {
  if (value === undefined || value === null || value === "") return null;

  const raw = String(value).trim();
  const isNumericTs = /^\d+$/.test(raw);
  const numericValue = Number(raw);
  const date =
    isNumericTs && Number.isFinite(numericValue)
      ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue)
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

// JWT exp 解析（不做签名校验，只用于本地调度）
const base64UrlToJson = (base64Url) => {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  const str = atob(padded);
  // 处理 unicode
  const jsonStr = decodeURIComponent(
    Array.from(str)
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(jsonStr);
};

const getJwtExpSeconds = (jwt) => {
  if (!jwt || typeof jwt !== "string") return null;
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = base64UrlToJson(parts[1]);
    const exp = payload?.exp;
    if (!Number.isFinite(exp)) return null;
    return exp; // seconds
  } catch {
    return null;
  }
};

const DEFAULT_USER = {
  id: 0,
  display_name: "未登录",
  bio: "未登录用户",
  avatar: "",
  regTime: "",
  sex: "0",
  username: "virtual",
};

/**
 * Singleton token refresh manager (timer only)
 */
const TokenRefreshManager = {
  timer: null,

  clear() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    window.tokenRefreshTimer = null;
  },

  set(callback, delayMs) {
    this.clear();
    const d = Math.max(0, Number(delayMs) || 0);
    this.timer = setTimeout(() => {
      this.timer = null;
      window.tokenRefreshTimer = null;
      Promise.resolve(callback()).catch((error) => {
        console.error("Token refresh timer callback failed:", error);
      });
    }, d);
    window.tokenRefreshTimer = this.timer;
  },
};

// 防止重复绑定 window 事件（开发 HMR / 多实例）
let _listenersInstalled = false;

export const useAuthStore = defineStore("auth", () => {
  // --- S3 bucket URL ---
  const s3BucketUrl = get("s3.staticurl") || "";

  // --- Reactive state ---
  const token = ref(localStorage.getItem(TOKEN_KEY));
  const tokenExpiresAt = ref(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
  const refreshTokenExpiresAt = ref(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
  const user = ref({ ...DEFAULT_USER });
  const isLogin = ref(false);
  const devices = ref([]);
  const activeTokens = ref([]);
  const currentTokenDetails = ref(null);

  // --- Dialog & redirect ---
  const loginDialogVisible = ref(false);
  const authRedirectUrl = ref(sessionStorage.getItem(AUTH_REDIRECT_URL_KEY) || "");

  // --- Single-flight refresh lock (关键修复) ---
  let refreshPromise = null;

  // --- Actions: Login dialog ---

  const showLoginDialog = (redirectUrl) => {
    if (redirectUrl) setAuthRedirectUrl(redirectUrl);
    loginDialogVisible.value = true;
  };

  const hideLoginDialog = () => {
    loginDialogVisible.value = false;
  };

  // --- Actions: Redirect URL management ---

  const setAuthRedirectUrl = (url) => {
    authRedirectUrl.value = url || "";
    if (url) sessionStorage.setItem(AUTH_REDIRECT_URL_KEY, url);
    else sessionStorage.removeItem(AUTH_REDIRECT_URL_KEY);
  };

  const consumeAuthRedirectUrl = () => {
    let url =
      authRedirectUrl.value ||
      sessionStorage.getItem(AUTH_REDIRECT_URL_KEY) ||
      "";

    // Security: only allow relative paths starting with '/' but not '//'
    if (!url || !url.startsWith("/") || url.startsWith("//")) {
      url = "/app/dashboard";
    }

    authRedirectUrl.value = "";
    sessionStorage.removeItem(AUTH_REDIRECT_URL_KEY);
    return url;
  };

  // --- Token helpers ---

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const syncTokenStateFromStorage = () => {
    token.value = localStorage.getItem(TOKEN_KEY);
    tokenExpiresAt.value = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
    refreshTokenExpiresAt.value = localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  };

  // 返回 access token 剩余秒数；优先 JWT exp，其次 storage 的 expiresAt；未知返回 -1
  const getTokenExpirationTime = () => {
    const t = getToken();
    if (!t) return 0;

    const expSec = getJwtExpSeconds(t);
    if (Number.isFinite(expSec)) {
      const nowSec = Math.floor(Date.now() / 1000);
      return Math.max(0, expSec - nowSec);
    }

    // fallback：兼容旧逻辑
    const expiresAt = parseDateTime(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
    if (!expiresAt) return -1;
    const diffMs = expiresAt.getTime() - Date.now();
    if (!Number.isFinite(diffMs)) return -1;
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  const isTokenValid = () => {
    const t = getToken();
    if (!t) return false;

    const exp = getTokenExpirationTime();
    if (exp < 0) return true; // 不知道就认为有效，兜底靠 401 刷新
    return exp > 0;
  };

  const isRefreshTokenValid = () => {
    const refreshExpiresAt = parseDateTime(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
    const now = new Date();
    // 如果你用 HttpOnly-cookie refresh，这里可能拿不到到期时间 → 认为有效
    if (!refreshExpiresAt) return true;
    return refreshExpiresAt > now;
  };

  // --- Actions: User loading ---

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance({
        url: "/user/me",
        method: "get",
      });

      const data = response.data;
      if (data.status !== "success") {
        console.warn("fetchUserInfo: non-success response", data.message);
        return;
      }

      user.value = {
        id: data.data.id,
        display_name: data.data.display_name,
        bio: data.data.bio,
        avatar: data.data.avatar,
        regTime: data.data.regTime,
        sex: data.data.sex,
        username: data.data.username,
      };
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value));
      isLogin.value = true;
    } catch (error) {
      console.error("fetchUserInfo failed:", error);
      if (error?.response?.status === 401) {
        await logout(false);
      }
    }
  };

  const loadUser = async (force) => {
    const t = getToken();
    if (!t) {
      isLogin.value = false;
      user.value = { ...DEFAULT_USER };
      return;
    }

    // 启动时如果 token 已过期，先尝试刷新一次（不会并发）
    const exp = getTokenExpirationTime();
    if (exp === 0) {
      const ok = await refreshAccessToken();
      if (!ok) return;
    }

    if (force === true) {
      await fetchUserInfo();
      return;
    }

    const cached = localStorage.getItem(USER_INFO_KEY);
    if (cached) {
      try {
        isLogin.value = true;
        user.value = JSON.parse(cached);
      } catch {
        await fetchUserInfo();
      }
    } else {
      await fetchUserInfo();
    }
  };

  // --- Actions: Set user/token after login ---

  const updateToken = (newToken, expiresAt) => {
    if (!newToken) return false;

    setStorageValue(TOKEN_KEY, newToken);
    token.value = newToken;

    // 你说是 JWT 且含 exp：我们把 exp 写进 storage，方便你看，但调度仍以 JWT 为准
    const expSec = getJwtExpSeconds(newToken);
    if (Number.isFinite(expSec)) {
      setStorageValue(TOKEN_EXPIRES_AT_KEY, expSec * 1000);
      tokenExpiresAt.value = String(expSec * 1000);
    } else if (expiresAt !== undefined && expiresAt !== null && expiresAt !== "") {
      setStorageValue(TOKEN_EXPIRES_AT_KEY, expiresAt);
      tokenExpiresAt.value = String(expiresAt);
    }

    return true;
  };

  const setUser = async (data) => {
    // data.token 必须存在
    updateToken(data.token, data.expires_at);

    // refresh_expires_at 你目前存本地，保留
    setStorageValue(REFRESH_TOKEN_EXPIRES_AT_KEY, data.refresh_expires_at);
    refreshTokenExpiresAt.value = data.refresh_expires_at || null;

    await loadUser(true);
    startTokenRefreshTimer(); // 登录完成立刻排程
  };

  // --- Actions: Token refresh (single-flight) ---

  const refreshAccessToken = async () => {
    // 无 token / refresh 无效时，直接失败
    if (!getToken() && !isRefreshTokenValid()) return false;

    // single-flight：如果已有刷新在进行，直接等待它
    if (refreshPromise) return await refreshPromise;

    refreshPromise = (async () => {
      try {
        // 这里如果 axios 层也有 inFlight，也没关系；store 层先锁住
        if (isTokenRefreshInFlight()) {
          // 仅提示，不额外发起
          console.log("令牌刷新进行中（axios层），store层将等待刷新结果");
        }

        await requestTokenRefresh(); // 约定：内部会把新 token 写入 localStorage 或触发事件
        syncTokenStateFromStorage();

        // 刷新成功后，立刻重排程（不依赖 watch）
        startTokenRefreshTimer();

        return !!getToken();
      } catch (error) {
        console.error("Token refresh failed:", error);

        if (shouldForceLogoutByCode(error?.response?.data?.code || error?.code)) {
          await logout(false);
        }
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    return await refreshPromise;
  };

  // --- Refresh decision ---

  const checkAndRefreshToken = async () => {
    const t = getToken();
    if (!t) return false;

    const expirationTime = getTokenExpirationTime();
    if (expirationTime < 0) {
      // 不知道什么时候过期：不主动刷新，靠 401 或者低频检查
      return true;
    }

    if (expirationTime === 0) {
      return await refreshAccessToken();
    }

    if (expirationTime <= TOKEN_REFRESH_THRESHOLD) {
      console.log(`访问令牌将在${expirationTime}秒后过期，正在刷新...`);
      return await refreshAccessToken();
    }

    return true;
  };

  // --- Timer scheduling (修复核心) ---

  const calculateRefreshDelayMs = () => {
    const exp = getTokenExpirationTime();
    if (exp < 0) {
      // 未知过期时间：低频检查，避免无意义刷新
      return 5 * 60 * 1000;
    }

    // 已过期：立即触发（0ms）
    if (exp === 0) return 0;

    // 还没进入阈值：安排在“进入阈值”那一刻触发
    // delaySec = exp - threshold（到达阈值剩余秒数）
    const delaySec = exp - TOKEN_REFRESH_THRESHOLD;

    // 如果已经进入阈值：尽快刷新（0~1s）
    if (delaySec <= 0) return 0;

    // 给一个下限，避免太频繁 setTimeout；也给上限避免太久不检查
    const delayMs = delaySec * 1000;
    return Math.min(Math.max(delayMs, 1000), 10 * 60 * 1000); // 1s ~ 10min
  };

  const startTokenRefreshTimer = () => {
    if (!AUTO_REFRESH_ENABLED) {
      console.log("令牌自动刷新功能已禁用");
      return;
    }

    const t = getToken();
    if (!t) {
      stopTokenRefreshTimer();
      return;
    }

    const exp = getTokenExpirationTime();
    const delayMs = calculateRefreshDelayMs();

    if (exp >= 0) {
      console.log(
        `[单例] 令牌自动刷新计划: ${Math.floor(delayMs / 1000)}秒后检查 (令牌剩余${exp}秒)`
      );
    } else {
      console.log(
        `[单例] 令牌自动刷新计划: ${Math.floor(delayMs / 1000)}秒后检查 (无法解析exp，低频检查)`
      );
    }

    TokenRefreshManager.set(async () => {
      const ok = await checkAndRefreshToken();
      if (ok) {
        // 成功（或无需刷新）→ 继续排程
        startTokenRefreshTimer();
      } else {
        // 失败策略：10 秒后重试一次；再失败就按下一次排程（最多 30 秒）
        console.log("令牌刷新失败，将在10秒后重试");
        TokenRefreshManager.set(async () => {
          const retryOk = await checkAndRefreshToken();
          if (retryOk) startTokenRefreshTimer();
          else {
            const next = Math.min(calculateRefreshDelayMs(), 30_000);
            console.log(`令牌刷新重试失败，将在${Math.floor(next / 1000)}秒后再次尝试排程`);
            TokenRefreshManager.set(() => startTokenRefreshTimer(), next);
          }
        }, 10_000);
      }
    }, delayMs);
  };

  const stopTokenRefreshTimer = () => {
    TokenRefreshManager.clear();
  };

  // --- Auth status utility ---

  const isAuthenticationNeeded = () => {
    if (isTokenValid()) return false;

    if (isRefreshTokenValid()) {
      // 不要 block UI：异步尝试刷新
      void refreshAccessToken();
      return false;
    }

    return true;
  };

  // --- Logout ---

  const logout = async (logoutFromServer = true) => {
    stopTokenRefreshTimer();

    if (logoutFromServer && isLogin.value) {
      try {
        await axiosInstance({ url: "/account/logout", method: "post" });
      } catch (error) {
        console.error("Error during server logout:", error);
      }
    }

    try {
      await pushNotificationService.unsubscribe();
      console.log("推送通知已在退出时注销");
    } catch (error) {
      console.warn("退出时注销推送通知失败:", error);
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
    localStorage.removeItem(USER_INFO_KEY);

    token.value = null;
    tokenExpiresAt.value = null;
    refreshTokenExpiresAt.value = null;
    user.value = { ...DEFAULT_USER };
    isLogin.value = false;
    devices.value = [];
    activeTokens.value = [];
    currentTokenDetails.value = null;

    // 清掉 redirect（可选）
    // setAuthRedirectUrl("");
  };

  const logoutAllDevices = async () => {
    try {
      const response = await axiosInstance({
        url: "/account/logout-all-devices",
        method: "post",
      });

      if (response.data.status === "success") {
        await logout(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during logout from all devices:", error);
      return false;
    }
  };

  // --- Devices / Sessions ---

  const getDevices = async () => {
    try {
      const response = await axiosInstance({
        url: "/account/devices",
        method: "get",
      });

      if (response.data.status === "success") {
        devices.value = response.data.data;
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching devices:", error);
      return [];
    }
  };

  const fetchDevices = getDevices;

  const getActiveTokens = async (includeLocation = true) => {
    try {
      const response = await axiosInstance({
        url: `/account/active-tokens${includeLocation ? "?include_location=true" : ""}`,
        method: "get",
      });

      if (response.data.status === "success") {
        activeTokens.value = response.data.data;
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching active tokens:", error);
      return [];
    }
  };

  const fetchActiveTokens = getActiveTokens;

  const getTokenDetails = async (tokenId, includeLocation = true) => {
    try {
      const response = await axiosInstance({
        url: `/account/token-details/${tokenId}${includeLocation ? "?include_location=true" : ""}`,
        method: "get",
      });

      if (response.data.status === "success") {
        currentTokenDetails.value = response.data.data;
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching token details:", error);
      return null;
    }
  };

  const fetchTokenDetails = getTokenDetails;

  const revokeToken = async (tokenId) => {
    try {
      const response = await axiosInstance({
        url: "/account/revoke-token",
        method: "post",
        data: { token_id: tokenId },
      });

      if (response.data.status === "success") {
        await getActiveTokens();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error revoking token:", error);
      return false;
    }
  };

  // --- Profile ---

  const updateUserProfile = async (profileData) => {
    try {
      const response = await axiosInstance({
        url: "/user/update-profile",
        method: "post",
        data: profileData,
      });

      if (response.data.status === "success") {
        await loadUser(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance({
        url: "/account/change-password",
        method: "post",
        data: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      });

      return response.data.status === "success";
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  };

  // --- Avatar ---

  const getUserAvatar = (avatar) => {
    const a = avatar ?? user.value.avatar;
    if (!a) return "";
    return `${s3BucketUrl}/assets/${a.slice(0, 2)}/${a.slice(2, 4)}/${a}.webp`;
  };

  // --- Initialization ---

  const installListenersOnce = () => {
    if (_listenersInstalled) return;
    _listenersInstalled = true;

    window.addEventListener("forceLogout", () => {
      void logout(false);
    });

    window.addEventListener(TOKEN_REFRESHED_EVENT_NAME, () => {
      syncTokenStateFromStorage();
      // 刷新事件到来后，确保排程续命（不依赖 token watch）
      startTokenRefreshTimer();
    });
  };

  async function initializeTokenRefresh() {
    const t = getToken();
    if (!t) return;

    // 若已进入阈值（或已过期）就先 refresh 一次
    const exp = getTokenExpirationTime();
    const shouldRefresh = exp >= 0 && exp <= TOKEN_REFRESH_THRESHOLD;
    if (shouldRefresh) {
      console.log("初始化时发现令牌即将过期/已过期，正在刷新...");
      const ok = await refreshAccessToken();
      if (!ok && !isTokenValid()) return;
    }

    startTokenRefreshTimer();
  }

  installListenersOnce();

  // Load user on store creation
  loadUser().catch((err) => console.error("Initial loadUser failed:", err));
  initializeTokenRefresh().catch((err) =>
    console.error("Initial token refresh failed:", err)
  );

  // Watch token AND tokenExpiresAt（修复：不依赖 token 字符串变化）
  watch([token, tokenExpiresAt], () => {
    // 有 token 就尽量启动 timer；没有就停
    if (getToken() && AUTO_REFRESH_ENABLED) startTokenRefreshTimer();
    else stopTokenRefreshTimer();

    // 同步用户
    void loadUser().catch((err) =>
      console.error("loadUser on token/expires change failed:", err)
    );
  });

  // --- Return public API ---
  return {
    // State
    token,
    tokenExpiresAt,
    refreshTokenExpiresAt,
    user,
    isLogin,
    devices,
    activeTokens,
    currentTokenDetails,

    // New state
    loginDialogVisible,
    authRedirectUrl,

    // User loading
    loadUser,
    fetchUserInfo,
    setUser,

    // Logout
    logout,
    logoutAllDevices,

    // Token access
    getToken,
    updateToken,

    // Token refresh
    refreshAccessToken,
    checkAndRefreshToken,

    // Token refresh timer
    startTokenRefreshTimer,
    stopTokenRefreshTimer,
    initializeTokenRefresh,

    // Token status
    isTokenValid,
    isRefreshTokenValid,
    isAuthenticationNeeded,
    getTokenExpirationTime,

    // Devices / Sessions
    getDevices,
    getActiveTokens,
    getTokenDetails,
    revokeToken,
    fetchDevices,
    fetchActiveTokens,
    fetchTokenDetails,

    // Profile
    updateUserProfile,
    changePassword,

    // Avatar
    getUserAvatar,

    // Login dialog
    showLoginDialog,
    hideLoginDialog,

    // Redirect URL
    setAuthRedirectUrl,
    consumeAuthRedirectUrl,

    // Constants / debug
    AUTO_REFRESH_ENABLED,
    TokenRefreshManager,
    DEFAULT_USER,
  };
});
