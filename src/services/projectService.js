// 文件已删除
import request from "../axios/axios.js";

// 通用项目对象模板
const defaultProject = (id) => ({
  id,
  title: "未知项目",
  description: "项目信息未缓存",
  authorid: 0,
  type: "scratch",
  license: "unknow",
  state: "unknow",
  view_count: 0,
  time: 0,
  tags: [],
  source: "unknow",
});

// 获取项目详情函数
export async function getProjectInfo(ids) {
  if (Array.isArray(ids)) {
    try {
      const { data } = await request.post(`/project/batch`, { projectIds: ids });
      return data.data;
    } catch (error) {
      return ids.map(id => defaultProject(id));
    }
  } else {
    try {
      const { data } = await request.get(`/project/id/${ids}`);
      return data;
    } catch (error) {
      return defaultProject(ids);
    }
  }
}

// 使用 [username]/[projectname] 获取项目信息函数
export async function getProjectInfoByNamespace(username, projectname) {
  try {
    const { data } = await request.get(`/project/namespace/${username}/${projectname}`);
    return data;
  } catch (error) {
    return defaultProject(0); // 返回默认项目对象
  }
}

export async function initProject(projectid) {
  try {
    const { data } = await request.post(`/project/initlize?projectid=${projectid}`);
    return data;
  } catch (error) {
    return defaultProject(0); // 返回默认项目对象
  }
}

export const saveFile = async (projectFile) => {
  const response = await request({
    url: "/project/savefile",
    data: { source: projectFile },
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const commit = async (projectId, commitInfo) => {
  const response = await request({
    url: "/project/commit/id/" + projectId,
    data: {
      branch: commitInfo.branch,
      projectid: projectId,
      accessFileToken: commitInfo.accessFileToken,
      message: commitInfo.message,
      parent_commit: commitInfo.parent_commit,
    },
    method: "put",
  });
  return response.data;
};

export const getBranchs = async (projectId) => {
  const response = await request({
    url: `/project/branches?projectid=${projectId}`,
    method: "get",
  });
  return response.data;
};

export const getProjectFile = async (projectId, branch, commitid) => {
  const response = await request({
    url: `/project/${projectId}/${branch}/${commitid}`,
    method: "get",
  });
  const projectFileData = response.data;
  const fileResponse = await request({
    url: `/project/files/${projectFileData.commit.commit_file}?accessFileToken=${projectFileData.accessFileToken}`,
    method: "get",
  });
  return {
    projectFileData,
    fileData: fileResponse.data.file,
    branchInfo: response,
  };
};

export const getBranchInfo = async (projectId, branch, commitid) => {
  const response = await request({
    url: `/project/${projectId}/${branch}/${commitid}`,
    method: "get",
  });
  return response.data;
};

export const getBranchHistory = async (projectId, branch) => {
  const response = await request({
    url: `/project/commits?projectid=${projectId}&branch=${branch}`,
    method: "get",
  });
  return response.data;
};
