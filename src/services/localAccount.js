import { ref, watch } from "vue";
import request from "../axios/axios";

const USER_INFO_KEY = "userInfo";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";

const DEFAULT_USER = {
  id: 0,
  display_name: "未登录",
  motto: "未登录用户",
  images: "",
  regTime: "",
  sex: "0",
  username: "virtual",
};

var token = ref(localStorage.getItem(TOKEN_KEY));
var refreshToken = ref(localStorage.getItem(REFRESH_TOKEN_KEY));
var tokenExpiresAt = ref(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
var refreshTokenExpiresAt = ref(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
var user = ref(DEFAULT_USER);
var isLogin = ref(false);
var devices = ref([]);
var activeTokens = ref([]);
var currentTokenDetails = ref(null);

const loadUser = async (force) => {
  if (localStorage.getItem(TOKEN_KEY) === null) {
    isLogin.value = false;
    user.value = DEFAULT_USER;
    return;
  }

  // Check if token is expired
  const now = new Date();
  const expiresAt = new Date(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));

  if (expiresAt && expiresAt <= now) {
    // Token expired, try to refresh
    const refreshSuccessful = await refreshAccessToken();
    if (!refreshSuccessful) {
      // If refresh failed, logout
      logout();
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
  const response = await request({
    url: "/user/me",
    method: "get",
  });

  const data = response.data;
  if (data.status !== "success") {
    alert(data.message);
    return;
  }

  user.value = {
    id: data.info.id,
    display_name: data.info.display_name,
    motto: data.info.motto,
    images: data.info.images,
    regTime: data.info.regTime,
    sex: data.info.sex,
    username: data.info.username,
  };
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value));
  isLogin.value = true;
};

const refreshAccessToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      return false;
    }

    const response = await request({
      url: "/account/refresh-token",
      method: "post",
      data: {
        refresh_token: storedRefreshToken
      }
    });

    const data = response.data;
    if (data.status !== "success") {
      return false;
    }

    // Update only token and expires_at (refresh token no longer updated)
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, data.expires_at);
    token.value = data.token;
    tokenExpiresAt.value = data.expires_at;

    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

const setUser = async (data) => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  localStorage.setItem(TOKEN_EXPIRES_AT_KEY, data.expires_at);
  localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, data.refresh_expires_at);

  token.value = data.token;
  refreshToken.value = data.refresh_token;
  tokenExpiresAt.value = data.expires_at;
  refreshTokenExpiresAt.value = data.refresh_expires_at;

  await loadUser(true);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const logout = async (logoutFromServer = true) => {
  if (logoutFromServer && isLogin.value) {
    try {
      await request({
        url: "/account/logout",
        method: "post"
      });
    } catch (error) {
      console.error("Error during server logout:", error);
      // Continue with local logout even if server logout fails
    }
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

const logoutAllDevices = async () => {
  try {
    const response = await request({
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

const getDevices = async () => {
  try {
    const response = await request({
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

const getActiveTokens = async (includeLocation = true) => {
  try {
    const response = await request({
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

const getTokenDetails = async (tokenId, includeLocation = true) => {
  try {
    const response = await request({
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

const revokeToken = async (tokenId) => {
  try {
    const response = await request({
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


loadUser();
watch(token, loadUser);

export const localuser = {
  user,
  isLogin,
  loadUser,
  setUser,
  logout,
  getToken,
  getRefreshToken,
  refreshAccessToken,
  logoutAllDevices,
  getDevices,
  getActiveTokens,
  getTokenDetails,
  revokeToken,
  devices,
  activeTokens,
  currentTokenDetails
};
