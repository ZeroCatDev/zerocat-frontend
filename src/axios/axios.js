import axios from "axios";

// 基本配置
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 根据实际情况修改API地址
  //  timeout: 5000 // 设置超时时间，单位为ms
});

// 存储正在刷新token的promise
let isRefreshing = false;
let refreshSubscribers = [];

// 用于处理刷新token后的请求重发
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// 用于执行队列中的请求
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 请求拦截器
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    requestConfig.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "token"
    )}`; // 设置请求头部分，这里举例使用了localStorage存储的token作为身份标识
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

    // 如果响应状态码是401（未授权）且不是刷新token的请求，尝试刷新token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/account/refresh-token"
    ) {
      // 检查是否是需要登出的错误
      if (
        error.response.data &&
        (error.response.data.code === "ZC_ERROR_NEED_LOGIN" ||
          error.response.data.code === "ZC_ERROR_INVALID_REFRESH_TOKEN" ||
          error.response.data.code === "ZC_ERROR_REFRESH_TOKEN_EXPIRED")
      ) {
        // 发出登出事件，让 localAccount.js 处理
        window.dispatchEvent(new CustomEvent('forceLogout'));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 如果已经在刷新token，将请求加入队列等待token刷新完成
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 从localStorage获取刷新令牌
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          window.dispatchEvent(new CustomEvent('forceLogout'));
          return Promise.reject(error);
        }

        // 调用刷新令牌接口
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_API}/account/refresh-token`,
          {refresh_token: refreshToken}
        );

        if (response.data.status === "success") {
          // 更新localStorage中的令牌
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("tokenExpiresAt", response.data.expires_at);

          // 更新请求头并重发请求
          const newToken = response.data.token;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // 执行队列中的请求
          onRefreshed(newToken);

          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          // 只在刷新令牌确实无效时才登出
          if (response.data.code === "ZC_ERROR_INVALID_REFRESH_TOKEN" ||
            response.data.code === "ZC_ERROR_REFRESH_TOKEN_EXPIRED") {
            window.dispatchEvent(new CustomEvent('forceLogout'));
          }
          isRefreshing = false;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // 网络错误等临时问题，不执行登出
        isRefreshing = false;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
