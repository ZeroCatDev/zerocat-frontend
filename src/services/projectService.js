import request from "../axios/axios.js";

// 通用项目对象模板
const defaultProject = (id) => ({
  id,
  title: "未知项目",
  description: "未知项目",
  authorid: 0,
  type: "scratch",
  license: "unknow",
  state: "unknow",
  view_count: 0,
  time: 0,
  tags: [],
  source: "unknow",
  author: {
    id: 0,
    username: "未知用户",
    display_name: "未知用户",
    motto: "",
    images: "",
    regTime: null
  },
});

// 获取项目详情函数
export async function getProjectInfo(ids) {
  if (Array.isArray(ids)) {
    try {
      const { data } = await request.post(`/project/batch`, {
        projectIds: ids,
      });
      return data.data;
    } catch (error) {
      return ids.map((id) => defaultProject(id));
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
export async function getProjectListById(id) {
  try {
    const { data } = await request.get(`/projectlist/lists/listid/${id}`);
    return data.data;
  } catch (error) {
    console.error("获取项目列表失败:", error);
    return { projects: [] };
  }
}

// 使用 [username]/[projectname] 获取项目信息函数
export async function getProjectInfoByNamespace(username, projectname) {
  try {
    const { data } = await request.get(
      `/project/namespace/${username}/${projectname}`
    );
    return data;
  } catch (error) {
    return defaultProject(0); // 返回默认项目对象
  }
}

export async function initProject(projectid) {
  try {
    const { data } = await request.post(
      `/project/initlize?projectid=${projectid}`
    );
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

export const getCommitInfo = async (projectId, commitid) => {
  const response = await request({
    url: `/project/commit?projectid=${projectId}&commitid=${commitid}`,
    method: "get",
  });
  return response.data;
};
export const getBranchHistoryByCommit = async (projectId, commitid) => {
  console.log(`Fetching commits for projectId: ${projectId}`);
  const response = await request({
    url: `/project/commits?projectid=${projectId}`,
    method: "get",
  });

  const commits = response.data.data;
  console.log(`Fetched ${commits.length} commits`);

  const findCommitById = (id) => {
    console.log(`Finding commit by id: ${id}`);
    return commits.find((commit) => commit.id === id);
  };

  const getCommitHistory = (commitid) => {
    console.log(`Building commit history starting from commitid: ${commitid}`);
    const commitHistory = [];
    let currentCommit = findCommitById(commitid);

    while (currentCommit) {
      console.log(`Adding commit to history: ${currentCommit.id}`);
      commitHistory.push(currentCommit);
      if (!currentCommit.parent_commit_id) {
        console.log(`No parent commit found for commitid: ${currentCommit.id}`);
        break;
      }
      currentCommit = findCommitById(currentCommit.parent_commit_id);
    }

    return commitHistory;
  };

  return getCommitHistory(commitid);
};

export const createBranch = async (projectId, branchName, sourceBranch) => {
  const response = await request({
    url: `/project/branches`,
    method: "post",
    data: {
      projectid: projectId,
      name: branchName,
      branch: sourceBranch,
    },
  });
  return response.data;
};

export const deleteBranch = async (projectId, branchName) => {
  const response = await request({
    url: `/project/branches`,
    method: "delete",
    data: {
      projectid: projectId,
      branch: branchName,
    },
  });
  return response.data;
};
