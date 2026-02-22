import {ref, watch} from "vue";
import axiosInstance from "@/axios/axios";
import { get } from "./serverConfig";
import { pushNotificationService } from "./pushNotificationService.js";
// Constants for storage keys
const USER_INFO_KEY = "userInfo";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";

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
  const date = isNumericTs && Number.isFinite(numericValue)
    ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue)
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};
// 令牌过期前多少秒开始刷新（默认5分钟前）
const TOKEN_REFRESH_THRESHOLD = 5 * 60;
// 是否启用自动刷新（默认启用）
const AUTO_REFRESH_ENABLED = true;

/**
 * 单例模式的令牌刷新管理器
 */
const TokenRefreshManager = {
  // 定时器实例
  timer: null,
  // 是否正在刷新令牌
  isRefreshing: false,
  // 定时器是否正在运行
  isRunning: false,
  // 上次启动时间戳（防止短时间内重复启动）
  lastStartTime: 0,
  // 最小启动间隔（毫秒）
  minStartInterval: 1000,

  /**
   * 检查是否可以启动新的定时器
   */
  canStart() {
    const now = Date.now();
    return !this.isRunning && (now - this.lastStartTime) >= this.minStartInterval;
  },

  /**
   * 清除定时器
   */
  clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      this.isRunning = false;
      window.tokenRefreshTimer = null;
    }
  },

  /**
   * 设置定时器
   */
  set(callback, delay) {
    // 先清除旧的定时器
    this.clear();

    // 设置新定时器
    this.timer = setTimeout(callback, delay);
    this.isRunning = true;
    this.lastStartTime = Date.now();

    // 导出到window用于调试
    window.tokenRefreshTimer = this.timer;
  },

  /**
   * 设置刷新状态
   */
  setRefreshing(status) {
    this.isRefreshing = status;
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
var s3BucketUrl = ""
s3BucketUrl=get('s3.staticurl')
// Reactive states
var token = ref(localStorage.getItem(TOKEN_KEY));
var refreshToken = ref(localStorage.getItem(REFRESH_TOKEN_KEY));
var tokenExpiresAt = ref(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
var refreshTokenExpiresAt = ref(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
var user = ref(DEFAULT_USER);
var isLogin = ref(false);
var devices = ref([]);
var activeTokens = ref([]);
var currentTokenDetails = ref(null);

// 监听强制登出事件
window.addEventListener('forceLogout', () => {
  logout(false);
});

/**
 * Load user information
 * @param {boolean} force Force refresh user info from server
 * @returns {Promise<void>}
 */
const loadUser = async (force) => {
  if (localStorage.getItem(TOKEN_KEY) === null) {
    isLogin.value = false;
    user.value = DEFAULT_USER;
    return;
  }

  // Check if token is expired
  const now = new Date();
  const expiresAt = parseDateTime(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));

  if (expiresAt && expiresAt <= now) {
    // Token expired, check refresh token validity first
    const refreshTokenExpiresAt = parseDateTime(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
    if (!refreshTokenExpiresAt || refreshTokenExpiresAt <= now) {
      // Refresh token is also expired, logout
      logout();
      return;
    }

    // Try to refresh token
    const refreshSuccessful = await refreshAccessToken();
    if (!refreshSuccessful) {
      // Only logout if refresh token is invalid (will be handled in refreshAccessToken)
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

/**
 * Fetch user information from server
 * @returns {Promise<void>}
 */
const fetchUserInfo = async () => {
  const response = await axiosInstance({
    url: "/user/me",
    method: "get",
  });

  const data = response.data;
  if (data.status !== "success") {
    alert(data.message);
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
};

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<boolean>} Whether refresh was successful
 */
const refreshAccessToken = async () => {
  // 防止并发刷新
  if (TokenRefreshManager.isRefreshing) {
    console.log('令牌刷新已在进行中，跳过重复请求');
    return false;
  }

  try {
    TokenRefreshManager.setRefreshing(true);

    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      logout(false);
      return false;
    }

    const response = await axiosInstance({
      url: "/account/refresh-token",
      method: "post",
      data: {
        refresh_token: storedRefreshToken
      }
    });

    const data = response.data;
    if (data.status !== "success" || !data.token) {
      // Only logout if the error indicates refresh token is invalid
      if (shouldForceLogoutByCode(data.code)) {
        logout(false);
      }
      return false;
    }

    // 更新access token
    setStorageValue(TOKEN_KEY, data.token);
    token.value = data.token;
    if (data.expires_at) {
      setStorageValue(TOKEN_EXPIRES_AT_KEY, data.expires_at);
      tokenExpiresAt.value = data.expires_at;
    }

    // 兼容后端刷新令牌轮换
    if (data.refresh_token) {
      setStorageValue(REFRESH_TOKEN_KEY, data.refresh_token);
      refreshToken.value = data.refresh_token;
    }
    if (data.refresh_expires_at) {
      setStorageValue(REFRESH_TOKEN_EXPIRES_AT_KEY, data.refresh_expires_at);
      refreshTokenExpiresAt.value = data.refresh_expires_at;
    }

    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);

    // 刷新接口直接返回401时，也需要识别无效刷新令牌并退出
    if (shouldForceLogoutByCode(error?.response?.data?.code)) {
      logout(false);
    }

    // Don't logout on network errors or other temporary issues
    return false;
  } finally {
    TokenRefreshManager.setRefreshing(false);
  }
};

/**
 * 检查并处理令牌是否需要刷新
 * @returns {Promise<boolean>} 是否成功刷新
 */
const checkAndRefreshToken = async () => {
  // 如果没有登录，不需要刷新
  if (!isLogin.value) {
    return false;
  }

  // 检查访问令牌是否快过期
  const expirationTime = getTokenExpirationTime();
  if (expirationTime < 0) {
    // 过期时间未知时不主动登出，交由服务端401兜底
    return true;
  }

  // 如果令牌已过期或即将过期
  if (expirationTime <= TOKEN_REFRESH_THRESHOLD) {
    // 先检查刷新令牌是否有效
    if (!isRefreshTokenValid()) {
      // 只有在刷新令牌无效时才登出
      console.log('刷新令牌已过期，执行登出...');
      logout(false);
      return false;
    }

    // 尝试刷新访问令牌
    console.log(`访问令牌将在${expirationTime}秒后过期，正在刷新...`);
    return await refreshAccessToken();
  }

  return true;
};

/**
 * 根据实时令牌过期时间动态计算定时器延迟时间
 * @returns {number} 定时器延迟时间（毫秒）
 */
const calculateRefreshDelay = () => {
  const expirationTime = getTokenExpirationTime();
  if (expirationTime < 0) {
    // 过期时间未知时，保守地每5分钟检查一次
    return 5 * 60 * 1000;
  }

  if (expirationTime <= 0) {
    return 0; // 已过期，立即处理
  }

  // 计算下一次刷新的时间（过期前TOKEN_REFRESH_THRESHOLD秒或一半时间，取小的那个）
  const halfExpirationTime = Math.floor(expirationTime / 2);
  const nextRefreshIn = Math.min(
    expirationTime - TOKEN_REFRESH_THRESHOLD,
    halfExpirationTime
  );

  // 至少等待10秒再检查，最多等待一半的剩余时间
  return Math.max(nextRefreshIn * 1000, 10000);
};

/**
 * 启动自动令牌刷新定时任务（单例模式）
 */
const startTokenRefreshTimer = () => {
  // 如果禁用了自动刷新，不启动定时器
  if (!AUTO_REFRESH_ENABLED) {
    console.log('令牌自动刷新功能已禁用');
    return;
  }

  // 使用单例模式，检查是否可以启动
  if (!TokenRefreshManager.canStart()) {
    console.log('令牌刷新定时器已在运行或启动间隔过短，跳过重复启动');
    return;
  }

  // 如果没有登录，不需要启动定时器
  if (!isLogin.value) {
    TokenRefreshManager.clear();
    return;
  }

  // 获取当前令牌的剩余有效期
  const expirationTime = getTokenExpirationTime();
  if (expirationTime < 0) {
    // 无法解析过期时间，使用保守轮询，避免误登出
    TokenRefreshManager.set(() => {
      startTokenRefreshTimer();
    }, 5 * 60 * 1000);
    return;
  }

  if (expirationTime <= 0) {
    // 已经过期，立即尝试刷新一次
    checkAndRefreshToken();
    return;
  }

  // 根据实时时间动态计算定时器延迟
  const timeoutDuration = calculateRefreshDelay();

  console.log(`[单例] 令牌自动刷新计划: ${Math.floor(timeoutDuration / 1000)}秒后检查 (令牌剩余${expirationTime}秒)`);

  // 使用单例管理器设置定时器
  TokenRefreshManager.set(async () => {
    const refreshed = await checkAndRefreshToken();
    if (refreshed) {
      // 如果刷新成功，重新启动定时器
      startTokenRefreshTimer();
    } else {
      // 如果刷新失败，尝试再次刷新
      console.log('令牌刷新失败，将在10秒后重试');
      // 使用内部重试机制
      TokenRefreshManager.set(async () => {
        const retryRefreshed = await checkAndRefreshToken();
        if (retryRefreshed) {
          startTokenRefreshTimer();
        } else {
          // 重试仍然失败，根据动态时间安排下次重试
          const retryDelay = Math.min(calculateRefreshDelay(), 30000); // 最多重试延迟30秒
          console.log(`令牌刷新重试失败，将在${Math.floor(retryDelay / 1000)}秒后再次重试`);
          TokenRefreshManager.set(() => {
            startTokenRefreshTimer();
          }, retryDelay);
        }
      }, 10000);
    }
  }, timeoutDuration);
};

/**
 * 停止令牌刷新定时任务
 */
const stopTokenRefreshTimer = () => {
  TokenRefreshManager.clear();
};

/**
 * Set user authentication data
 * @param {Object} data Authentication data containing tokens
 * @returns {Promise<void>}
 */
const setUser = async (data) => {
  setStorageValue(TOKEN_KEY, data.token);
  setStorageValue(REFRESH_TOKEN_KEY, data.refresh_token);
  setStorageValue(TOKEN_EXPIRES_AT_KEY, data.expires_at);
  setStorageValue(REFRESH_TOKEN_EXPIRES_AT_KEY, data.refresh_expires_at);

  token.value = data.token || null;
  refreshToken.value = data.refresh_token || null;
  tokenExpiresAt.value = data.expires_at || null;
  refreshTokenExpiresAt.value = data.refresh_expires_at || null;

  await loadUser(true);

  // 登录成功后，启动令牌刷新定时器
  startTokenRefreshTimer();
};
const getUserAvatar = (avatar) => {
  return `${s3BucketUrl}/assets/${avatar ? avatar.slice(0,2) : user.value.avatar.slice(0,2)}/${avatar ? avatar.slice(2,4) : user.value.avatar.slice(2,4)}/${avatar ? avatar : user.value.avatar}.webp`;
};
/**
 * Get the current access token
 * @returns {string|null} The access token
 */
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the current refresh token
 * @returns {string|null} The refresh token
 */
const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Update access token and expiration time
 * @param {string} newToken New access token
 * @param {string|number|Date} expiresAt Access token expiration time
 * @returns {boolean} Whether update was successful
 */
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

/**
 * Check if the current token is valid and not expired
 * @returns {boolean} Whether the token is valid
 */
const isTokenValid = () => {
  const currentToken = localStorage.getItem(TOKEN_KEY);
  if (!currentToken) return false;

  const expiresAt = parseDateTime(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
  const now = new Date();

  if (!expiresAt) return true;
  return expiresAt > now;
};

/**
 * Check if the current refresh token is valid and not expired
 * @returns {boolean} Whether the refresh token is valid
 */
const isRefreshTokenValid = () => {
  const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!currentRefreshToken) return false;

  const refreshExpiresAt = parseDateTime(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
  const now = new Date();

  if (!refreshExpiresAt) return true;
  return refreshExpiresAt > now;
};

/**
 * Check if authentication is needed
 * @returns {boolean} Whether authentication is needed
 */
const isAuthenticationNeeded = () => {
  // Only need authentication if both tokens are invalid
  const tokenValid = isTokenValid();
  if (tokenValid) return false;

  // If access token is invalid, check refresh token
  const refreshValid = isRefreshTokenValid();
  if (refreshValid) {
    // Try to refresh the token
    refreshAccessToken();
    return false;
  }

  return true;
};

/**
 * Get time left until token expiration in seconds
 * @returns {number} Seconds until expiration, 0 if expired, -1 if unknown
 */
const getTokenExpirationTime = () => {
  const expiresAt = parseDateTime(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
  if (!expiresAt) return -1;

  const now = new Date();
  const diffMs = expiresAt - now;

  if (!Number.isFinite(diffMs)) return -1;
  return Math.max(0, Math.floor(diffMs / 1000));
};

/**
 * Logout user
 * @param {boolean} logoutFromServer Whether to also logout from server
 * @returns {Promise<void>}
 */
const logout = async (logoutFromServer = true) => {
  // 停止令牌刷新定时器
  stopTokenRefreshTimer();

  if (logoutFromServer && isLogin.value) {
    try {
      await axiosInstance({
        url: "/account/logout",
        method: "post"
      });
    } catch (error) {
      console.error("Error during server logout:", error);
      // Continue with local logout even if server logout fails
    }
  }

  // 注销推送通知
  try {
    await pushNotificationService.unsubscribe();
    console.log('推送通知已在退出时注销');
  } catch (error) {
    console.warn('退出时注销推送通知失败:', error);
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(USER_INFO_KEY);

  token.value = null;
  refreshToken.value = null;
  tokenExpiresAt.value = null;
  refreshTokenExpiresAt.value = null;
  user.value = DEFAULT_USER;
  isLogin.value = false;
  devices.value = [];
  activeTokens.value = [];
};

/**
 * Logout from all devices
 * @returns {Promise<boolean>} Whether logout was successful
 */
const logoutAllDevices = async () => {
  try {
    const response = await axiosInstance({
      url: "/account/logout-all-devices",
      method: "post"
    });

    if (response.data.status === "success") {
      // Perform local logout after successful server logout
      await logout(false);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error during logout from all devices:", error);
    return false;
  }
};

/**
 * Get all devices with active sessions
 * @returns {Promise<Array>} List of devices
 */
const getDevices = async () => {
  try {
    const response = await axiosInstance({
      url: "/account/devices",
      method: "get"
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

/**
 * Alias for getDevices for backward compatibility
 * @returns {Promise<Array>} List of devices
 */
const fetchDevices = getDevices;

/**
 * Get all active tokens
 * @param {boolean} includeLocation Whether to include location info
 * @returns {Promise<Array>} List of active tokens
 */
const getActiveTokens = async (includeLocation = true) => {
  try {
    const response = await axiosInstance({
      url: `/account/active-tokens${includeLocation ? '?include_location=true' : ''}`,
      method: "get"
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

/**
 * Alias for getActiveTokens for backward compatibility
 * @param {boolean} includeLocation Whether to include location info
 * @returns {Promise<Array>} List of active tokens
 */
const fetchActiveTokens = getActiveTokens;

/**
 * Get details for a specific token
 * @param {string|number} tokenId Token ID
 * @param {boolean} includeLocation Whether to include location info
 * @returns {Promise<Object|null>} Token details
 */
const getTokenDetails = async (tokenId, includeLocation = true) => {
  try {
    const response = await axiosInstance({
      url: `/account/token-details/${tokenId}${includeLocation ? '?include_location=true' : ''}`,
      method: "get"
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

/**
 * Alias for getTokenDetails for backward compatibility
 * @param {string|number} tokenId Token ID
 * @param {boolean} includeLocation Whether to include location info
 * @returns {Promise<Object|null>} Token details
 */
const fetchTokenDetails = getTokenDetails;

/**
 * Revoke a specific token
 * @param {string|number} tokenId Token ID to revoke
 * @returns {Promise<boolean>} Whether revocation was successful
 */
const revokeToken = async (tokenId) => {
  try {
    const response = await axiosInstance({
      url: "/account/revoke-token",
      method: "post",
      data: {
        token_id: tokenId
      }
    });

    if (response.data.status === "success") {
      // Refresh the active tokens list
      await getActiveTokens();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error revoking token:", error);
    return false;
  }
};

/**
 * Update user profile information
 * @param {Object} profileData User profile data to update
 * @returns {Promise<boolean>} Whether update was successful
 */
const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance({
      url: "/user/update-profile",
      method: "post",
      data: profileData
    });

    if (response.data.status === "success") {
      // Refresh user info after successful update
      await loadUser(true);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
};

/**
 * Change user password
 * @param {string} currentPassword Current password
 * @param {string} newPassword New password
 * @returns {Promise<boolean>} Whether password change was successful
 */
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axiosInstance({
      url: "/account/change-password",
      method: "post",
      data: {
        current_password: currentPassword,
        new_password: newPassword
      }
    });

    return response.data.status === "success";
  } catch (error) {
    console.error("Error changing password:", error);
    return false;
  }
};

/**
 * 检查当前令牌是否有效，如果需要则刷新
 * 此函数可以在APP初始化时调用，确保令牌状态有效
 */
const initializeTokenRefresh = async () => {
  // 如果有令牌，检查其状态并初始化自动刷新
  if (getToken()) {
    // 检查访问令牌是否过期或即将过期
    const tokenExpirationTime = getTokenExpirationTime();
    const shouldRefresh = tokenExpirationTime >= 0 && tokenExpirationTime <= TOKEN_REFRESH_THRESHOLD;

    if (shouldRefresh) {
      // 检查刷新令牌是否有效
      if (isRefreshTokenValid()) {
        console.log('初始化时发现令牌即将过期，正在刷新...');
        await refreshAccessToken();
      } else {
        // 只有在刷新令牌也无效时才登出
        console.log('刷新令牌已过期，执行登出...');
        logout(false);
        return;
      }
    }

    // 启动自动刷新定时器
    if (AUTO_REFRESH_ENABLED) {
      startTokenRefreshTimer();
    }
  }
};

// 初始化时加载用户信息并设置自动刷新
loadUser();
initializeTokenRefresh();

// 监听token变化
watch(token, (newToken) => {
  loadUser();

  // 如果正在刷新令牌过程中，跳过启动定时器（避免重复日志）
  if (TokenRefreshManager.isRefreshing) {
    console.log('[单例] 令牌刷新中，跳过定时器启动');
    return;
  }

  // 如果有新的token，启动自动刷新
  if (newToken && AUTO_REFRESH_ENABLED) {
    startTokenRefreshTimer();
  } else {
    stopTokenRefreshTimer();
  }
});

// Export both the new standardized functions and original ones for backward compatibility
export const localuser = {
  // User state
  user,
  isLogin,

  // Original functions
  loadUser,
  setUser,
  logout,
  getToken,
  updateToken,
  getUserAvatar,
  getRefreshToken,
  refreshAccessToken,
  logoutAllDevices,
  getDevices,
  getActiveTokens,
  getTokenDetails,
  revokeToken,

  // New functions
  fetchUserInfo,
  isTokenValid,
  isRefreshTokenValid,
  isAuthenticationNeeded,
  getTokenExpirationTime,
  updateUserProfile,
  changePassword,

  // Backward compatibility aliases
  fetchDevices,
  fetchActiveTokens,
  fetchTokenDetails,

  // Reactive state
  devices,
  activeTokens,
  currentTokenDetails,

  // 自动刷新配置
  AUTO_REFRESH_ENABLED,

  // 添加新函数到导出
  checkAndRefreshToken,
  startTokenRefreshTimer,
  stopTokenRefreshTimer,
  initializeTokenRefresh,
  calculateRefreshDelay,

  // 单例管理器（用于调试）
  TokenRefreshManager,
};
