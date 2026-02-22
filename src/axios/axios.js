import axios from "axios";

// 基本配置
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 根据实际情况修改API地址
  withCredentials: true, // 确保跨域请求携带 cookie（refresh_token 已迁移至 HttpOnly Cookie）
  //  timeout: 5000 // 设置超时时间，单位为ms
});

const TOKEN_KEY = "token";
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

const shouldForceLogoutByCode = (code) => FORCE_LOGOUT_CODES.has(code);

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

  if (refreshData.refresh_expires_at) {
    localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, refreshData.refresh_expires_at);
  }
};

const refreshAccessToken = async () => {
  const refreshResponse = await axios.post(
    `${import.meta.env.VITE_APP_BASE_API}/account/refresh-token`,
    {},
    { withCredentials: true }
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
