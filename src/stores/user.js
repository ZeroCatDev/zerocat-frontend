
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token"); // 获取本地存储的JWT令牌
const user = jwtDecode(token);
console.log(user);
export default {
    token, // 用户token身份
    user // 用户登录状态
}