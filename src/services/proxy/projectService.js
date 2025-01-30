import request from "@/axios/axios";

export function searchProjects(order, text, page, limit) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/projects/search/projects?mode=${order}&q=${text}&offset=${page * 16 - 16}&limit=${limit}&language=zh-cn`);
}

export function getFeaturedProjects() {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/proxy/featured`);
}

export function exploreProjects(order, tag, page, limit) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/projects/explore/projects?mode=${order}&q=${tag}&offset=${page * 16 - 16}&limit=${limit}&language=zh-cn`);
}

export function getProjectById(id) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/projects/${id}`);
}

export function getProjectFileById(id, token) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/projects/source/${id}?token=${token}`);
}
