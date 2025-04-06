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
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// 请求拦截器
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    requestConfig.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`; // 设置请求头部分，这里举例使用了localStorage存储的token作为身份标识
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
    // const responseData = response.data;
    // if (data && data.code !== 200) { // 根据接口返回的状态码判断是否有错误
    //     alert(`Error code ${data.code}: ${data.message}`); // 自定义错误提示
    //     return Promise.reject(new Error(data.message));
    // } else {
    return response;
    // }
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果响应状态码是401（未授权）且不是刷新token的请求，尝试刷新token
    if (error.response && error.response.status === 401 && !originalRequest._retry &&
        originalRequest.url !== '/account/refresh-token') {

      if (isRefreshing) {
        // 如果已经在刷新token，将请求加入队列等待token刷新完成
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers['Authorization'] = token;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 从localStorage获取刷新令牌
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // 如果没有刷新令牌，执行登出操作
          const { localuser } = await import('../services/localAccount');
          localuser.logout(false);
          return Promise.reject(error);
        }

        // 调用刷新令牌接口
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_API}/account/refresh-token`,
          { refresh_token: refreshToken }
        );

        if (response.data.status === 'success') {
          // 更新localStorage中的令牌
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('tokenExpiresAt', response.data.expires_at);

          // 更新请求头并重发请求
          originalRequest.headers['Authorization'] = response.data.token;

          // 执行队列中的请求
          onRefreshed(response.data.token);

          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          // 刷新失败，执行登出操作
          const { localuser } = await import('../services/localAccount');
          localuser.logout(false);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // 刷新失败，执行登出操作
        const { localuser } = await import('../services/localAccount');
        localuser.logout(false);
        isRefreshing = false;
        return Promise.reject(error);
      }
    }

    console.log(error);
    //alert(`Error: ${error.message}`); // 自定义错误提示
    return Promise.reject(error);
  }
);

export default axiosInstance;
