import request from "@/axios/axios";

export function getUserById(userId) {
  return request({
    url: `/api/getUserById?id=${userId}`,
    method: "get",
  });
}

export function updateUserInfo(data) {
  return request({
    url: "/my/set/userInfo",
    method: "post",
    data,
  });
}

export function updateUsername(data) {
  return request({
    url: "/my/set/username",
    method: "post",
    data,
  });
}

export function updatePassword(data) {
  return request({
    url: "/my/set/pw",
    method: "post",
    data,
  });
}

export function uploadUserAvatar(queryParams, formData) {
  return request({
    url: `/my/set/avatar?${queryParams}`,
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function retrievePassword(data) {
  return request({
    url: "/account/retrievePassword",
    method: "post",
    data,
  });
}

export function registerUser(data) {
  return request({
    url: "/account/register",
    method: "post",
    data,
  });
}

export function validateMagicLink(token) {
  return request({
    url: `/account/magiclink/validate?token=${token}`,
    method: "get",
  });
}

export function generateMagicLink(data) {
  return request({
    url: "/account/magiclink/generate",
    method: "post",
    data,
  });
}

export function loginUser(data) {
  return request({
    url: "/account/login",
    method: "post",
    data,
  });
}

export function resetPassword(data) {
  return request({
    url: "/account/torepw",
    method: "post",
    data,
  });
}
