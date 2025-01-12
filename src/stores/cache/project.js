import { liveQuery } from "dexie";
import request from "../../axios/axios.js";

import {db} from "../db.js";


// 获取用户信息函数
export async function fetchProjectDetails(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return Promise.all(
    ids.map((id) =>
      db.projects.get(Number(id)).then(
        (project) =>
          project || {
            id,
            cached: false,
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
          }
      )
    )
  ).then((projects) => (ids.length === 1 ? projects[0] : projects));
}

// 缓存用户信息函数
export async function cacheProjectInfo(project) {
  project.id = Number(project.id); // 确保 id 类型为 number
  const existingProject = await db.projects.get(project.id);
  if (existingProject) {
    await db.projects.put(project);
    return `项目 ${project.title} 更新成功.`;
  } else {
    const id = await db.projects.add(project);
    return `项目 ${project.title} 成功缓存. 获取到id为 ${id}`;
  }
}

// 添加用户缓存函数
export async function addProjectCache(data) {
  try {
    if (!Array.isArray(data)) {
      data = [data];
    }

    const results = await Promise.all(
      data.map(async (project) => {
        return await cacheProjectInfo(project);
      })
    );

    return results.join("\n");
  } catch (error) {
    return `添加缓存失败: ${error}`;
  }
}

// 删除缓存函数
export async function removeProjectCache(ProjectID) {
  try {
    const existingProject = await db.projects.get(Number(ProjectID));

    if (existingProject) {
      await db.projects.delete(Number(ProjectID));
      return `项目 ${existingProject.title} 删除成功.`;
    } else {
      return `删除 ${ProjectID} 失败: Project not found`;
    }
  } catch (error) {
    return `删除 ${ProjectID} 失败: ${error}`;
  }
}

// 刷新缓存函数
export async function refreshProjectCache(ProjectIDs) {
  if (!Array.isArray(ProjectIDs)) {
    ProjectIDs = [ProjectIDs];
  }

  try {
    const results = await Promise.all(
      ProjectIDs.map(async (ProjectID) => {
        const data = await request.get(`/project/${ProjectID}`);

        const project = {
          id: data.id,
          type: data.type,
          licence: data.licence,
          authorid: data.authorid,
          state: data.state,
          view_count: data.view_count,
          time: data.time,
          title: data.title,
          description: data.description,
          tags: data.tags,
          source: data.source,
        };

        return await cacheProjectInfo(project);
      })
    );

    return results.join("\n");
  } catch (error) {
    return `刷新失败: ${error}`;
  }
}

// 实时查询并更新项目信息函数
export function liveFetchProjectDetails(ids, callback) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return liveQuery(() => db.projects.where('id').anyOf(ids).toArray()).subscribe(callback);
}

// 实时查询并更新项目信息函数
export function DebugliveFetchAllProjectDetails(callback) {
  return liveQuery(() => db.projects.toArray()).subscribe(callback);
}

