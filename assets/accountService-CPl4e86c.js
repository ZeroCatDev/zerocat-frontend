import{Q as e}from"./index-CRa2tHx8.js";function o(){return e({url:"/user/me",method:"get"})}function a(t){return e({url:"/my/set/userInfo",method:"post",data:t})}function u(t){return e({url:"/my/set/username",method:"post",data:t})}function s(t){return e({url:"/my/set/pw",method:"post",data:t})}function c(t,r){return e({url:`/my/set/avatar?${t}`,method:"post",data:r,headers:{"Content-Type":"multipart/form-data"}})}function i(t){return e({url:"/account/register",method:"post",data:t})}function m(t){return e({url:`/account/magiclink/validate?token=${t}`,method:"get"})}function d(t){return e({url:"/account/magiclink/generate",method:"post",data:t})}function l(t){return e({url:"/account/login",method:"post",data:t})}function p(t){return e({url:"/account/torepw",method:"post",data:t})}export{u as a,a as b,c,d,p as e,o as g,l,i as r,s as u,m as v};
