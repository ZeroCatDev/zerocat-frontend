import { ref, watch } from "vue";
import request from "../axios/axios";

const USER_INFO_KEY = 'userInfo';
const TOKEN_KEY = 'token';

const token = ref(localStorage.getItem(TOKEN_KEY));
const user = ref({});
const isLogin = ref(false);

const DEFAULT_USER = {
  id: 0,
  display_name: "未登录",
  motto: "未登录用户",
  images: "",
  regTime: "",
  sex: "0",
  username: "virtual"
};

const loadUser = async () => {
  if (token.value) {
    try {
      await fetchUserInfo();
      isLogin.value = true;
    } catch (error) {
      console.error(error);
      logout();
    }
  } else {
    resetUser();
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
  const token = getToken();
  if (!token) {
    alert('Token not found, please login again');
    resetUser();
    return;
  }

  const response = await request({
    url: "/user/me",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data;
  if (data.status !== 'success') {
    throw new Error('Failed to fetch user info');
  }

  user.value = {
    id: data.info.id,
    display_name: data.info.display_name,
    motto: data.info.motto,
    images: data.info.images,
    regTime: data.info.regTime,
    sex: data.info.sex,
    username: data.info.username
  };
  cacheUserInfo(user.value);
};

const getUserInfo = async () => {
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
  await loadUser();
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
  getUserInfo,
  logout
};
