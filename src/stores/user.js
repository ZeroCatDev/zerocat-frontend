import { jwtDecode } from "jwt-decode";
var token = "";
var user = {};
var islogin = false; // 用户登录状态

if (localStorage.getItem("token")) {
  token = localStorage.getItem("token"); // 获取本地存储的JWT令牌
  user = jwtDecode(token);
  console.log(user);
  islogin = true; // 用户登录状态
} else {
  islogin = false; // 用户登录状态
  user = {}; // 用户登录状态
}
console.log('用户登录信息----------');
console.log('token:'+token);

console.log(user);
console.log('是否登录:'+islogin);

export default {
  token, // 用户token身份
  user, // 用户登录状态
  islogin,
};
