import { ref, watch } from "vue";
import { defineStore } from "pinia";
import axiosInstance from "@/axios/axios";
import { get } from "@/services/serverConfig";
import { pushNotificationService } from "@/services/pushNotificationService.js";

// Constants for storage keys
const USER_INFO_KEY = "userInfo";
const TOKEN_KEY = "token";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";
const AUTH_REDIRECT_URL_KEY = "auth_redirect_url";

// Token refresh threshold (seconds before expiry to start refreshing)
const TOKEN_REFRESH_THRESHOLD = 5 * 60;
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

const DEFAULT_USER = {
  id: 0,
  display_name: "\u672A\u767B\u5F55",
  bio: "\u672A\u767B\u5F55\u7528\u6237",
  avatar: "",
  regTime: "",
  sex: "0",
  username: "virtual",
};

/**
 * Singleton token refresh manager
 */
const TokenRefreshManager = {
  timer: null,
  isRefreshing: false,
  isRunning: false,
  lastStartTime: 0,
  minStartInterval: 1000,

  canStart() {
    const now = Date.now();
    return !this.isRunning && now - this.lastStartTime >= this.minStartInterval;
  },

  clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      this.isRunning = false;
      window.tokenRefreshTimer = null;
    }
  },

  set(callback, delay) {
    this.clear();
    this.timer = setTimeout(callback, delay);
    this.isRunning = true;
    this.lastStartTime = Date.now();
    window.tokenRefreshTimer = this.timer;
  },

  setRefreshing(status) {
    this.isRefreshing = status;
  },
};

export const useAuthStore = defineStore("auth", () => {
  // --- S3 bucket URL ---
  var s3BucketUrl = "";
  s3BucketUrl = get("s3.staticurl");

  // --- Reactive state ---
  const token = ref(localStorage.getItem(TOKEN_KEY));
  const tokenExpiresAt = ref(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
  const refreshTokenExpiresAt = ref(
    localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY)
  );
  const user = ref({ ...DEFAULT_USER });
  const isLogin = ref(false);
  const devices = ref([]);
  const activeTokens = ref([]);
  const currentTokenDetails = ref(null);

  // --- New state for dialog & redirect ---
  const loginDialogVisible = ref(false);
  const authRedirectUrl = ref(
    sessionStorage.getItem(AUTH_REDIRECT_URL_KEY) || ""
  );

  // --- Actions: Login dialog ---

  const showLoginDialog = (redirectUrl) => {
    if (redirectUrl) {
      setAuthRedirectUrl(redirectUrl);
    }
    loginDialogVisible.value = true;
  };

  const hideLoginDialog = () => {
    loginDialogVisible.value = false;
  };

  // --- Actions: Redirect URL management ---

  const setAuthRedirectUrl = (url) => {
    authRedirectUrl.value = url || "";
    if (url) {
      sessionStorage.setItem(AUTH_REDIRECT_URL_KEY, url);
    } else {
      sessionStorage.removeItem(AUTH_REDIRECT_URL_KEY);
    }
  };

  const consumeAuthRedirectUrl = () => {
    let url = authRedirectUrl.value || sessionStorage.getItem(AUTH_REDIRECT_URL_KEY) || "";

    // Security: only allow relative paths starting with '/' but not '//'
    if (!url || !url.startsWith("/") || url.startsWith("//")) {
      url = "/app/dashboard";
    }

    // Clear after consuming
    authRedirectUrl.value = "";
    sessionStorage.removeItem(AUTH_REDIRECT_URL_KEY);

    return url;
  };

  // --- Actions: User loading ---

  const loadUser = async (force) => {
    if (localStorage.getItem(TOKEN_KEY) === null) {
      isLogin.value = false;
      user.value = { ...DEFAULT_USER };
      return;
    }

    const now = new Date();
    const expiresAt = parseDateTime(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));

    if (expiresAt && expiresAt <= now) {
      const rtExpiresAt = parseDateTime(
        localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY)
      );
      if (!rtExpiresAt || rtExpiresAt <= now) {
        logout();
        return;
      }

      const refreshSuccessful = await refreshAccessToken();
      if (!refreshSuccessful) {
        return;
      }
    }

    if (force === true) {
      await fetchUserInfo();
    } else {
      if (localStorage.getItem(USER_INFO_KEY) !== null) {
        isLogin.value = true;
        user.value = JSON.parse(localStorage.getItem(USER_INFO_KEY));
      } else {
        await fetchUserInfo();
      }
    }
  };

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
      // 401 means token is invalid and refresh also failed — logout gracefully
      if (error?.response?.status === 401) {
        logout(false);
      }
    }
  };

  const setUser = async (data) => {
    setStorageValue(TOKEN_KEY, data.token);
    setStorageValue(TOKEN_EXPIRES_AT_KEY, data.expires_at);
    setStorageValue(REFRESH_TOKEN_EXPIRES_AT_KEY, data.refresh_expires_at);

    token.value = data.token || null;
    tokenExpiresAt.value = data.expires_at || null;
    refreshTokenExpiresAt.value = data.refresh_expires_at || null;

    await loadUser(true);
    startTokenRefreshTimer();
  };

  // --- Actions: Token access ---

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const updateToken = (newToken, expiresAt) => {
    if (!newToken) return false;

    setStorageValue(TOKEN_KEY, newToken);
    token.value = newToken;

    if (expiresAt !== undefined && expiresAt !== null && expiresAt !== "") {
      setStorageValue(TOKEN_EXPIRES_AT_KEY, expiresAt);
      tokenExpiresAt.value = String(expiresAt);
    }

    return true;
  };

  // --- Actions: Token refresh ---

  const refreshAccessToken = async () => {
    if (TokenRefreshManager.isRefreshing) {
      console.log("\u4EE4\u724C\u5237\u65B0\u5DF2\u5728\u8FDB\u884C\u4E2D\uFF0C\u8DF3\u8FC7\u91CD\u590D\u8BF7\u6C42");
      return false;
    }

    try {
      TokenRefreshManager.setRefreshing(true);

      const response = await axiosInstance({
        url: "/account/refresh-token",
        method: "post",
      });

      const data = response.data;
      if (data.status !== "success" || !data.token) {
        if (shouldForceLogoutByCode(data.code)) {
          logout(false);
        }
        return false;
      }

      setStorageValue(TOKEN_KEY, data.token);
      token.value = data.token;
      if (data.expires_at) {
        setStorageValue(TOKEN_EXPIRES_AT_KEY, data.expires_at);
        tokenExpiresAt.value = data.expires_at;
      }

      if (data.refresh_expires_at) {
        setStorageValue(REFRESH_TOKEN_EXPIRES_AT_KEY, data.refresh_expires_at);
        refreshTokenExpiresAt.value = data.refresh_expires_at;
      }

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);

      if (shouldForceLogoutByCode(error?.response?.data?.code)) {
        logout(false);
      }

      return false;
    } finally {
      TokenRefreshManager.setRefreshing(false);
    }
  };

  const checkAndRefreshToken = async () => {
    if (!isLogin.value) {
      return false;
    }

    const expirationTime = getTokenExpirationTime();
    if (expirationTime < 0) {
      return true;
    }

    if (expirationTime <= TOKEN_REFRESH_THRESHOLD) {
      if (!isRefreshTokenValid()) {
        console.log("\u5237\u65B0\u4EE4\u724C\u5DF2\u8FC7\u671F\uFF0C\u6267\u884C\u767B\u51FA...");
        logout(false);
        return false;
      }

      console.log(
        `\u8BBF\u95EE\u4EE4\u724C\u5C06\u5728${expirationTime}\u79D2\u540E\u8FC7\u671F\uFF0C\u6B63\u5728\u5237\u65B0...`
      );
      return await refreshAccessToken();
    }

    return true;
  };

  // --- Actions: Token refresh timer ---

  const calculateRefreshDelay = () => {
    const expirationTime = getTokenExpirationTime();
    if (expirationTime < 0) {
      return 5 * 60 * 1000;
    }

    if (expirationTime <= 0) {
      return 0;
    }

    const halfExpirationTime = Math.floor(expirationTime / 2);
    const nextRefreshIn = Math.min(
      expirationTime - TOKEN_REFRESH_THRESHOLD,
      halfExpirationTime
    );

    return Math.max(nextRefreshIn * 1000, 10000);
  };

  const startTokenRefreshTimer = () => {
    if (!AUTO_REFRESH_ENABLED) {
      console.log("\u4EE4\u724C\u81EA\u52A8\u5237\u65B0\u529F\u80FD\u5DF2\u7981\u7528");
      return;
    }

    if (!TokenRefreshManager.canStart()) {
      console.log(
        "\u4EE4\u724C\u5237\u65B0\u5B9A\u65F6\u5668\u5DF2\u5728\u8FD0\u884C\u6216\u542F\u52A8\u95F4\u9694\u8FC7\u77ED\uFF0C\u8DF3\u8FC7\u91CD\u590D\u542F\u52A8"
      );
      return;
    }

    if (!isLogin.value) {
      TokenRefreshManager.clear();
      return;
    }

    const expirationTime = getTokenExpirationTime();
    if (expirationTime < 0) {
      TokenRefreshManager.set(() => {
        startTokenRefreshTimer();
      }, 5 * 60 * 1000);
      return;
    }

    if (expirationTime <= 0) {
      checkAndRefreshToken();
      return;
    }

    const timeoutDuration = calculateRefreshDelay();

    console.log(
      `[\u5355\u4F8B] \u4EE4\u724C\u81EA\u52A8\u5237\u65B0\u8BA1\u5212: ${Math.floor(timeoutDuration / 1000)}\u79D2\u540E\u68C0\u67E5 (\u4EE4\u724C\u5269\u4F59${expirationTime}\u79D2)`
    );

    TokenRefreshManager.set(async () => {
      const refreshed = await checkAndRefreshToken();
      if (refreshed) {
        startTokenRefreshTimer();
      } else {
        console.log("\u4EE4\u724C\u5237\u65B0\u5931\u8D25\uFF0C\u5C06\u572810\u79D2\u540E\u91CD\u8BD5");
        TokenRefreshManager.set(async () => {
          const retryRefreshed = await checkAndRefreshToken();
          if (retryRefreshed) {
            startTokenRefreshTimer();
          } else {
            const retryDelay = Math.min(calculateRefreshDelay(), 30000);
            console.log(
              `\u4EE4\u724C\u5237\u65B0\u91CD\u8BD5\u5931\u8D25\uFF0C\u5C06\u5728${Math.floor(retryDelay / 1000)}\u79D2\u540E\u518D\u6B21\u91CD\u8BD5`
            );
            TokenRefreshManager.set(() => {
              startTokenRefreshTimer();
            }, retryDelay);
          }
        }, 10000);
      }
    }, timeoutDuration);
  };

  const stopTokenRefreshTimer = () => {
    TokenRefreshManager.clear();
  };

  // --- Actions: Token status ---

  const isTokenValid = () => {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    if (!currentToken) return false;

    const expiresAt = parseDateTime(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
    const now = new Date();

    if (!expiresAt) return true;
    return expiresAt > now;
  };

  const isRefreshTokenValid = () => {
    const refreshExpiresAt = parseDateTime(
      localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY)
    );
    const now = new Date();

    if (!refreshExpiresAt) return false;
    return refreshExpiresAt > now;
  };

  const isAuthenticationNeeded = () => {
    const tokenValid = isTokenValid();
    if (tokenValid) return false;

    const refreshValid = isRefreshTokenValid();
    if (refreshValid) {
      refreshAccessToken();
      return false;
    }

    return true;
  };

  const getTokenExpirationTime = () => {
    const expiresAt = parseDateTime(
      localStorage.getItem(TOKEN_EXPIRES_AT_KEY)
    );
    if (!expiresAt) return -1;

    const now = new Date();
    const diffMs = expiresAt - now;

    if (!Number.isFinite(diffMs)) return -1;
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  // --- Actions: Logout ---

  const logout = async (logoutFromServer = true) => {
    stopTokenRefreshTimer();

    if (logoutFromServer && isLogin.value) {
      try {
        await axiosInstance({
          url: "/account/logout",
          method: "post",
        });
      } catch (error) {
        console.error("Error during server logout:", error);
      }
    }

    try {
      await pushNotificationService.unsubscribe();
      console.log("\u63A8\u9001\u901A\u77E5\u5DF2\u5728\u9000\u51FA\u65F6\u6CE8\u9500");
    } catch (error) {
      console.warn("\u9000\u51FA\u65F6\u6CE8\u9500\u63A8\u9001\u901A\u77E5\u5931\u8D25:", error);
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

  // --- Actions: Devices / Sessions ---

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
        data: {
          token_id: tokenId,
        },
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

  // --- Actions: Profile ---

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

  // --- Actions: Avatar ---

  const getUserAvatar = (avatar) => {
    return `${s3BucketUrl}/assets/${avatar ? avatar.slice(0, 2) : user.value.avatar.slice(0, 2)}/${avatar ? avatar.slice(2, 4) : user.value.avatar.slice(2, 4)}/${avatar ? avatar : user.value.avatar}.webp`;
  };

  // --- Initialization ---

  // Listen for force logout event
  window.addEventListener("forceLogout", () => {
    logout(false);
  });

  // Load user on store creation
  loadUser().catch((err) => console.error("Initial loadUser failed:", err));
  initializeTokenRefresh().catch((err) => console.error("Initial token refresh failed:", err));

  // Watch token changes
  watch(token, (newToken) => {
    loadUser().catch((err) => console.error("loadUser on token change failed:", err));

    if (TokenRefreshManager.isRefreshing) {
      console.log("[\u5355\u4F8B] \u4EE4\u724C\u5237\u65B0\u4E2D\uFF0C\u8DF3\u8FC7\u5B9A\u65F6\u5668\u542F\u52A8");
      return;
    }

    if (newToken && AUTO_REFRESH_ENABLED) {
      startTokenRefreshTimer();
    } else {
      stopTokenRefreshTimer();
    }
  });

  // --- Helper: initializeTokenRefresh ---

  async function initializeTokenRefresh() {
    if (getToken()) {
      const tokenExpirationTime = getTokenExpirationTime();
      const shouldRefresh =
        tokenExpirationTime >= 0 &&
        tokenExpirationTime <= TOKEN_REFRESH_THRESHOLD;

      if (shouldRefresh) {
        if (isRefreshTokenValid()) {
          console.log("\u521D\u59CB\u5316\u65F6\u53D1\u73B0\u4EE4\u724C\u5373\u5C06\u8FC7\u671F\uFF0C\u6B63\u5728\u5237\u65B0...");
          await refreshAccessToken();
        } else {
          console.log("\u5237\u65B0\u4EE4\u724C\u5DF2\u8FC7\u671F\uFF0C\u6267\u884C\u767B\u51FA...");
          logout(false);
          return;
        }
      }

      if (AUTO_REFRESH_ENABLED) {
        startTokenRefreshTimer();
      }
    }
  }

  // --- Return public API ---
  return {
    // State (refs — Pinia unwraps on store instance, use storeToRefs for raw refs)
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
    calculateRefreshDelay,

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
