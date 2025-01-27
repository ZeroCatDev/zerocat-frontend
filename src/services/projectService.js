import request from "../axios/axios";

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

export const getBranchInfo = async (projectId) => {
  const response = await request({
    url: "/project/branches/" + projectId,
    method: "get",
  });
  return response.data;
};



export const getProjectFile = async (projectId, branch, branchId) => {
  const response = await request({
    url: `/project/${projectId}/${branch}/${branchId}`,
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
  };
};

export const getBranchHistory = async (projectId, branch) => {
  const response = await request({
    url: `/project/commits?projectid=${projectId}&branch=${branch}`,
    method: "get",
  });
  return response.data;
};
