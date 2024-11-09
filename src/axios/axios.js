import axios from "axios";
// 基本配置
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 根据实际情况修改API地址
  //  timeout: 5000 // 设置超时时间，单位为ms
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (requestConfig) => {
    requestConfig.headers["Authorization"] = localStorage.getItem("token"); // 设置请求头部分，这里举例使用了localStorage存储的token作为身份标识
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
    const responseData = response.data;
    //if (data && data.code !== 200) { // 根据接口返回的状态码判断是否有错误
    //    alert(`Error code ${data.code}: ${data.message}`); // 自定义错误提示
    //    return Promise.reject(new Error(data.message));
    //} else {
    return responseData;
    //}
  },
  (error) => {
    console.log(error);
    alert(`Error: ${error.message}`); // 自定义错误提示
    return Promise.reject(error);
  }
);

export default axiosInstance;
