import { ref, watch } from "vue";
import request from "../axios/axios";

const USER_INFO_KEY = "userInfo";
const TOKEN_KEY = "token";

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
var user = ref(DEFAULT_USER);
var isLogin = ref(false);

const loadUser = async (force) => {
  if (localStorage.getItem(TOKEN_KEY) === null) {
    isLogin.value = false;
    user.value = DEFAULT_USER;
    return;
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

const setUser = async (data) => {
  localStorage.setItem(TOKEN_KEY, data);
  token.value = data;
  await loadUser(true);
};
const getToken =()=>{
  return localStorage.getItem('token')
}
const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  token.value = null;
  user.value = DEFAULT_USER;
  isLogin.value = false;
};
loadUser();
watch(token, loadUser);

export const localuser = {
  user,
  isLogin,
  loadUser,
  setUser,
  logout,
  getToken
};
