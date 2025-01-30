import request from "@/axios/axios";

export function getUserById(username) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/users/${username}`);
}

export function getUserProjects(username, page, limit) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/users/${username}/projects?&offset=${page * 16 - 16}&limit=${limit}`);
}
