import request from "../../axios/axios.js";

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
