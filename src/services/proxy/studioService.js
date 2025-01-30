import request from "@/axios/axios";

export function getStudioInfo(id) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/studios/${id}`);
}

export function getStudioProjects(id, page, limit) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/studios/${id}/projects?&offset=${page * 16 - 16}&limit=${limit}`);
}

export function getStudioCurators(id, page, limit) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/studios/${id}/curators?&offset=${page * 16 - 16}&limit=${limit}`);
}

export function getStudioManagers(id, page, limit) {
  return request.get(import.meta.env.VITE_APP_SCRATCH_PROXY + `/studios/${id}/managers?&offset=${page * 16 - 16}&limit=${limit}`);
}
