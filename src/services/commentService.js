import request from "@/axios/axios";

// ===== Space CRUD =====

export function getSpaces() {
  return request.get("/commentservice/spaces").then((r) => r.data);
}

export function getSpace(cuid) {
  return request.get(`/commentservice/spaces/${cuid}`).then((r) => r.data);
}

export function createSpace(data) {
  return request.post("/commentservice/spaces", data).then((r) => r.data);
}

export function updateSpace(cuid, data) {
  return request.put(`/commentservice/spaces/${cuid}`, data).then((r) => r.data);
}

export function deleteSpace(cuid) {
  return request.delete(`/commentservice/spaces/${cuid}`).then((r) => r.data);
}

// ===== Space Config =====

export function getSpaceConfig(cuid) {
  return request.get(`/commentservice/spaces/${cuid}/config`).then((r) => r.data);
}

export function updateSpaceConfig(cuid, data) {
  return request.put(`/commentservice/spaces/${cuid}/config`, data).then((r) => r.data);
}

// ===== Space Stats =====

export function getSpaceStats(cuid) {
  return request.get(`/commentservice/spaces/${cuid}/stats`).then((r) => r.data);
}

// ===== Comments =====

export function getSpaceComments(cuid, params = {}) {
  return request
    .get(`/commentservice/spaces/${cuid}/comments`, { params })
    .then((r) => r.data);
}

export function updateComment(cuid, id, data) {
  return request
    .put(`/commentservice/spaces/${cuid}/comments/${id}`, data)
    .then((r) => r.data);
}

export function deleteComment(cuid, id) {
  return request
    .delete(`/commentservice/spaces/${cuid}/comments/${id}`)
    .then((r) => r.data);
}

// ===== Users =====

export function getSpaceUsers(cuid, params = {}) {
  return request
    .get(`/commentservice/spaces/${cuid}/users`, { params })
    .then((r) => r.data);
}

export function updateSpaceUser(cuid, userId, data) {
  return request
    .put(`/commentservice/spaces/${cuid}/users/${userId}`, data)
    .then((r) => r.data);
}

// ===== My Comments =====

export function getMyComments(params = {}) {
  return request
    .get("/commentservice/my/comments", { params })
    .then((r) => r.data);
}

// ===== Waline Login =====

export function walineLogin(spaceCuid) {
  return request
    .post("/commentservice/ui/login", { spaceCuid })
    .then((r) => r.data);
}
