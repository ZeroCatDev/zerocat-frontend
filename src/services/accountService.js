import request from "@/axios/axios";

export function getAccount() {
  return request({
    url: `/user/me`,
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

// New authentication API functions

export function refreshToken(refreshToken) {
  return request({
    url: "/account/refresh-token",
    method: "post",
    data: {
      refresh_token: refreshToken
    },
  });
}

export function logout() {
  return request({
    url: "/account/logout",
    method: "post",
  });
}

export function logoutAllDevices() {
  return request({
    url: "/account/logout-all-devices",
    method: "post",
  });
}

export function getDevices() {
  return request({
    url: "/account/devices",
    method: "get",
  });
}

export function getActiveTokens() {
  return request({
    url: "/account/active-tokens",
    method: "get",
  });
}

export function revokeToken(tokenId) {
  return request({
    url: "/account/revoke-token",
    method: "post",
    data: {
      token_id: tokenId
    },
  });
}

export function trustDevice(deviceId) {
  return request({
    url: "/account/trust-device",
    method: "post",
    data: {
      device_id: deviceId
    },
  });
}

export function untrustDevice(deviceId) {
  return request({
    url: "/account/untrust-device",
    method: "post",
    data: {
      device_id: deviceId
    },
  });
}
