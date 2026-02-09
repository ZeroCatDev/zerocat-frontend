import axios from "axios";

// 基本配置
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 根据实际情况修改API地址
  //  timeout: 5000 // 设置超时时间，单位为ms
});

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";
const FORCE_LOGOUT_CODES = new Set([
  "ZC_ERROR_INVALID_REFRESH_TOKEN",
  "ZC_ERROR_REFRESH_TOKEN_EXPIRED",
]);

let refreshPromise = null;

const isRefreshEndpoint = (url) => {
  return !!url && url.includes("/account/refresh-token");
};

const shouldForceLogoutByCode = (code) => FORCE_LOGOUT_CODES.has(code) || code === "NO_REFRESH_TOKEN";

const triggerForceLogout = () => {
  window.dispatchEvent(new CustomEvent("forceLogout"));
};

const getErrorCode = (error) => {
  return error?.response?.data?.code || error?.code;
};

const saveRefreshedToken = (refreshData) => {
  localStorage.setItem(TOKEN_KEY, refreshData.token);

  if (refreshData.expires_at) {
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, refreshData.expires_at);
  }

  // 兼容后端刷新令牌轮换
  if (refreshData.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshData.refresh_token);
  }
  if (refreshData.refresh_expires_at) {
    localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, refreshData.refresh_expires_at);
  }
};

const refreshAccessToken = async () => {
  const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!storedRefreshToken) {
    const noTokenError = new Error("No refresh token");
    noTokenError.code = "NO_REFRESH_TOKEN";
    throw noTokenError;
  }

  const refreshResponse = await axios.post(
    `${import.meta.env.VITE_APP_BASE_API}/account/refresh-token`,
    { refresh_token: storedRefreshToken }
  );

  const refreshData = refreshResponse?.data || {};
  if (refreshData.status !== "success" || !refreshData.token) {
    const refreshError = new Error(refreshData.message || "Refresh token failed");
    refreshError.code = refreshData.code || "REFRESH_FAILED";
    throw refreshError;
  }

  saveRefreshedToken(refreshData);
  return refreshData.token;
};

// 请求拦截器
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    requestConfig.headers = requestConfig.headers || {};

    // 仅在有token时附加Authorization，避免发送Bearer null
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    } else {
      delete requestConfig.headers.Authorization;
    }

    return requestConfig;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const response = error.response;

    if (!originalRequest || !response) {
      return Promise.reject(error);
    }

    // 如果响应状态码是401（未授权）且不是刷新token的请求，尝试刷新token
    if (
      response.status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (shouldForceLogoutByCode(getErrorCode(refreshError))) {
          triggerForceLogout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
