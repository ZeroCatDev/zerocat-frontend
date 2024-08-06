import { jwtDecode } from "jwt-decode";
import { ref } from "vue";
import request from "../axios/axios";
var token = ref(null);
var user = ref({});
var islogin = ref(false);

const loaduser = () => {
  //try {
  console.log("加载用户信息");
    if (localStorage.getItem("token") && localStorage.getItem("token")!='{}') {
      token.value = localStorage.getItem("token");
      console.log(token.value);
      user.value = jwtDecode(token.value);
      islogin.value = true;
    } else {
      islogin.value = false;
      user.value = {};
    }
    console.log("用户登录信息----------");
    console.log("token:" + token.value);
    console.log(user.value);
    console.log("是否登录:" + islogin.value);
  //} catch (error) {
  //  console.log(error);
  //}
};
//const refresh = async () => {
  //try {
//  console.log("刷新token");
//  console.log(token.value);
//  if (localStorage.getItem("user")) {
//    await request({
//      url: "/api/v1/auth/refresh",
//      method: "post",
//      data: {
//        clientId: "newlangs",
//        clientSecret: "p3n9mx0y3aPzcMWJQb6qvrEFusVDfyZN",
//        grantType: "refresh_token",
//        refreshToken: token.value.refreshToken,
//      },
//      notauth: true,
//    }).then((res) => {
//      setuser(res.data);
//      console.log(res.data);
//    });
//  } else {
//    islogin.value = false;
//    user.value = {};
//  }
//  console.log("用户登录信息----------");
//  console.log("token:" + token.value);
//  console.log(user.value);
//  console.log("是否登录:" + islogin.value);
//  } catch (error) {
//    console.log(error);
//  }
//};

//const checkexp = () => {
//  if (user.value.exp * 1000 < Date.now()) {
//    console.log("token expired!");
//    refresh();
//  } else {
//    console.log("token not expired!");
//  }
//};
const setuser = (data) => {
  localStorage.setItem("token",data);
  console.log("用户登录信息----------");
  console.log(data);
  loaduser();
};
loaduser();

export const localuser = {
  token,
  user,
  islogin,
  loaduser,
  setuser,
  //refresh,
  //checkexp,
};
