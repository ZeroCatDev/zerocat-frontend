import { liveQuery } from "dexie";
import request from "../../axios/axios.js";
import { db } from "../db.js";

// 获取用户信息函数
export async function fetchUserDetails(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return Promise.all(
    ids.map((id) =>
      db.users.get(Number(id)).then((user) => user || { id, cached: false })
    )
  ).then((users) => (ids.length === 1 ? users[0] : users));
}

// 缓存用户信息函数
export async function cacheUserInfo(user) {
  user.id = Number(user.id); // 确保 id 类型为 number
  const existingUser = await db.users.get(user.id);
  if (existingUser) {
    await db.users.put(user);
    return `用户 ${user.display_name} 更新成功.`;
  } else {
    const id = await db.users.add(user);
    return `用户 ${user.display_name} 成功缓存. 获取到id为 ${id}`;
  }
}

// 添加用户缓存函数
export async function addUserCache(data) {
  try {
    if (!Array.isArray(data)) {
      data = [data];
    }

    const results = await Promise.all(
      data.map(async (user) => {
        return await cacheUserInfo(user);
      })
    );

    return results.join("\n");
  } catch (error) {
    return `添加缓存失败: ${error}`;
  }
}

// 删除缓存函数
export async function removeUserCache(UserID) {
  try {
    const existingUser = await db.users.get(Number(UserID));

    if (existingUser) {
      await db.users.delete(Number(UserID));
      return `用户 ${existingUser.display_name} 删除成功.`;
    } else {
      return `删除 ${UserID} 失败: User not found`;
    }
  } catch (error) {
    return `删除 ${UserID} 失败: ${error}`;
  }
}

// 刷新缓存函数
export async function refreshUserCache(UserID) {
  if (!Array.isArray(UserID)) {
    UserID = [UserID];
  }

  try {
    const results = await Promise.all(
      UserID.map(async (id) => {
        const data = await request.get(`/api/getuserinfo?id=${id}`).data;
        console.log(data);
        if (data.status === "success") {
          const user = {
            id: data.info.user.id,
            display_name: data.info.user.display_name,
            motto: data.info.user.motto,
            images: data.info.user.images,
            regTime: data.info.user.regTime,
            sex: data.info.user.sex,
            username: data.info.user.username,
          };
          return await cacheUserInfo(user);
        } else {
          return `刷新 ${id} 失败: ${data.status}`;
        }
      })
    );

    return results.join("\n");
  } catch (error) {
    return `刷新 ${UserID} 失败: ${error}`;
  }
}

// 实时查询并更新用户信息函数
export function liveFetchUserDetails(ids, callback) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return liveQuery(() => db.users.where('id').anyOf(ids).toArray()).subscribe(callback);
}
// 实时查询并更新用户信息函数
export function DebugliveFetchAllUserDetails(callback) {
  return liveQuery(() => db.users.toArray()).subscribe(callback);
}

// 直接读取数据库中指定id的数据，不使用实时查询
export function getUserDetailsFromCache(id) {
  return db.users.get(Number(id)).then((user) => user || { id, display_name: "未知用户", motto: "", images: "" });
}

// 从云端获取数据，返回，并存入数据库中
export async function fetchUserDetailsFromCloud(id) {
  const data = await request.get(`/api/getuserinfo?id=${id}`).data;
  if (data.status === "success") {
    const user = {
      id: data.info.user.id,
      display_name: data.info.user.display_name,
      motto: data.info.user.motto,
      images: data.info.user.images,
      regTime: data.info.user.regTime,
      sex: data.info.user.sex,
      username: data.info.user.username,
    };
    await cacheUserInfo(user);
    return user;
  } else {
    return { id, display_name: "未知用户", motto: "", images: "" };
  }
}


// 简单易用的获取用户信息函数
export async function getUserInfo(userId) {
  const cachedUser = await db.users.get(Number(userId));
  if (cachedUser) {
    refreshUserCache(userId); // 后台刷新用户信息
    return cachedUser;
  } else {
    const exampleUser = {
      id: userId,
      display_name: "示例用户",
      motto: "这是一个示例",
      images: "default.png",
      regTime: "0000-00-00T00:00:00.000Z",
      sex: "未知",
      username: "exampleuser",
    };
    refreshUserCache(userId); // 后台刷新用户信息
    return exampleUser;
  }
}


