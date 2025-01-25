import request from "../../axios/axios.js";

// 通用项目对象模板
const defaultProject = (id) => ({
  id,
  title: "未知项目",
  description: "项目信息未缓存",
  authorid: 0,
  type: "scratch",
  licence: "unknow",
  state: "unknow",
  view_count: 0,
  time: 0,
  tags: [],
  source: "unknow",
});

// 获取项目详情函数
export async function fetchProjectDetails(ids) {
  if (!Array.isArray(ids)) ids = [ids];
  return Promise.all(
    ids.map(async (id) => {
      try {
        const { data } = await request.get(`/project/${id}`);
        return data;
      } catch (error) {
        return defaultProject(id);
      }
    })
  ).then((projects) => (ids.length === 1 ? projects[0] : projects));
}

// 从云端获取数据，返回项目详情
export async function fetchProjectDetailsFromCloud(id) {
  try {
    const { data } = await request.get(`/project/${id}`);
    return data;
  } catch (error) {
    return defaultProject(id);
  }
}
