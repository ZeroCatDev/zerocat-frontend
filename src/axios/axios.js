import axios from "axios";

// 基本配置
const BASE_URL = import.meta.env.VITE_APP_BASE_API;

// 业务请求实例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 携带 HttpOnly refresh cookie
  // timeout: 8000,
});

const TOKEN_KEY = "token";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "refreshTokenExpiresAt";

const FORCE_LOGOUT_CODES = new Set([
  "ZC_ERROR_INVALID_REFRESH_TOKEN",
  "ZC_ERROR_REFRESH_TOKEN_EXPIRED",
]);

export const TOKEN_REFRESHED_EVENT_NAME = "auth:token-refreshed";

// 用独立 refresh client，避免走 axiosInstance 的响应拦截器（防递归）
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  // timeout: 8000,
});

let refreshPromise = null;

const normalizeUrlPath = (url) => {
  if (!url) return "";
  try {
    // 处理绝对 URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).pathname;
    }
    // 处理相对 URL：确保能被 URL 解析
    const base = BASE_URL?.startsWith("http") ? BASE_URL : "http://localhost";
    return new URL(url, base).pathname;
  } catch {
    return String(url);
  }
};

const isRefreshEndpoint = (url) => {
  const path = normalizeUrlPath(url);
  return path === "/account/refresh-token";
};

const shouldForceLogoutByCode = (code) => FORCE_LOGOUT_CODES.has(code);

const getErrorCode = (error) => error?.response?.data?.code || error?.code;

const triggerForceLogout = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("forceLogout"));
  }
};

const emitTokenRefreshed = (refreshData) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(TOKEN_REFRESHED_EVENT_NAME, {
      detail: {
        token: refreshData.token,
        expires_at: refreshData.expires_at || null,
        refresh_expires_at: refreshData.refresh_expires_at || null,
      },
    })
  );
};

const saveRefreshedToken = (refreshData) => {
  localStorage.setItem(TOKEN_KEY, refreshData.token);

  // 这里保留后端给的 expires_at（若你 store 用 JWT exp 为准，也没问题）
  if (refreshData.expires_at) {
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, refreshData.expires_at);
  } else {
    // 如果后端不返回 expires_at，你也可以选择清掉，让 store 走 JWT exp
    // localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  }

  if (refreshData.refresh_expires_at) {
    localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, refreshData.refresh_expires_at);
  }

  emitTokenRefreshed(refreshData);
};

const performRefreshRequest = async () => {
  const resp = await refreshClient.post("/account/refresh-token", {});
  const data = resp?.data || {};

  if (data.status !== "success" || !data.token) {
    const err = new Error(data.message || "Refresh token failed");
    err.code = data.code || "REFRESH_FAILED";
    err.response = resp; // 保留一些上下文（可选）
    throw err;
  }

  saveRefreshedToken(data);
  return data.token;
};

export const requestTokenRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = performRefreshRequest().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const isTokenRefreshInFlight = () => refreshPromise !== null;

// 请求拦截器：附加 access token
axiosInstance.interceptors.request.use(
  (config) => {
    const t = localStorage.getItem(TOKEN_KEY);

    // AxiosHeaders / plain object 都兼容
    config.headers = config.headers || {};

    if (t) {
      config.headers.Authorization = `Bearer ${t}`;
    } else {
      // 避免发送 Bearer null
      try {
        delete config.headers.Authorization;
      } catch {}
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：401 → 刷新 → 重放
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const response = error?.response;

    // 没有响应（网络断开/超时）直接抛出
    if (!originalRequest || !response) {
      return Promise.reject(error);
    }

    // 刷新接口本身不参与重试
    if (isRefreshEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // 只处理 401，且同一个请求只重试一次
    if (response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await requestTokenRefresh();

        // 兼容 headers 类型：合并而不是替换
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const code = getErrorCode(refreshError);

        // 1) 明确的 refresh token 失效 → 强制登出
        if (shouldForceLogoutByCode(code)) {
          triggerForceLogout();
          return Promise.reject(refreshError);
        }

        // 2) refresh 接口返回 401/403（有些后端不带业务 code）→ 也登出更合理
        const refreshStatus = refreshError?.response?.status;
        if (refreshStatus === 401 || refreshStatus === 403) {
          triggerForceLogout();
          return Promise.reject(refreshError);
        }

        // 3) 网络错误/500：不强制登出，让上层决定（可弹提示）
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
