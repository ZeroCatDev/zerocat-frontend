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

const token = ref(localStorage.getItem(TOKEN_KEY));
const user = ref(
  JSON.parse(localStorage.getItem(USER_INFO_KEY)) || DEFAULT_USER
);
const isLogin = ref(true);

const loadUser = async (force) => {
  if (user.value.id === 0 || force === true) {
    await fetchUserInfo();
  }
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const getCachedUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

const cacheUserInfo = (userInfo) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
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
  cacheUserInfo(user.value);
  isLogin.value = true;
};

const getUserById = async () => {
  let userInfo = getCachedUserInfo();
  if (!userInfo) {
    userInfo = await fetchUserInfo();
    cacheUserInfo(userInfo);
  }
  return userInfo;
};

const setUser = async (data) => {
  localStorage.setItem(TOKEN_KEY, data);
  token.value = data;
  await loadUser(true);
};

const resetUser = () => {
  user.value = DEFAULT_USER;
  isLogin.value = false;
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  token.value = null;
  resetUser();
};

watch(token, loadUser);

export const localuser = {
  token,
  user,
  isLogin,
  loadUser,
  setUser,
  getUserById,
  logout,
};
