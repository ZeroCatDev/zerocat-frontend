import axios from '@/axios/axios';

const getErrorMessage = (error, fallback = '请求失败') => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

/**
 * 标准化列表响应数据
 * @param {Object} res - API响应
 * @returns {Object} { posts, includes, nextCursor, hasMore }
 */
const normalizeListResponse = (res) => {
  const data = res?.data ?? res;

  // 处理posts数组
  let posts = [];
  if (Array.isArray(data)) {
    posts = data;
  } else if (Array.isArray(data?.posts)) {
    posts = data.posts;
  } else if (Array.isArray(data?.items)) {
    posts = data.items;
  } else if (Array.isArray(data?.data)) {
    posts = data.data;
  }

  // 处理includes
  const includes = data?.includes ?? { posts: {} };

  // 处理分页
  const nextCursor = data?.next_cursor ?? data?.nextCursor ?? null;
  const hasMore = data?.has_more ?? data?.hasMore ?? posts.length > 0;

  return { posts, includes, nextCursor, hasMore };
};

/**
 * 标准化单个帖子响应
 * @param {Object} res - API响应
 * @returns {Object} { post, includes }
 */
const normalizeSingleResponse = (res) => {
  const data = res?.data ?? res;
  const post = data?.post ?? data;
  const includes = data?.includes ?? { posts: {} };
  return { post, includes };
};

/**
 * 标准化线程响应
 * @param {Object} res - API响应
 * @returns {Object} { root, replies, includes, nextCursor, hasMore }
 */
const normalizeThreadResponse = (res) => {
  const data = res?.data ?? res;

  const root = data?.root ?? null;
  let replies = [];

  if (Array.isArray(data?.replies)) {
    replies = data.replies;
  } else if (Array.isArray(data)) {
    // 兼容旧API：整个返回值是数组
    replies = data;
  }

  const includes = data?.includes ?? { posts: {} };
  const nextCursor = data?.next_cursor ?? data?.nextCursor ?? null;
  const hasMore = data?.has_more ?? data?.hasMore ?? false;

  return { root, replies, includes, nextCursor, hasMore };
};

export const PostsService = {
  /**
   * 上传图片
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/posts/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '上传图片失败'));
    }
  },

  /**
   * 创建帖子
   * @param {Object} options
   * @param {string} options.content - 帖子内容
   * @param {number[]} options.mediaIds - 媒体ID列表
   * @param {Object} options.embed - 嵌入资源 { type, id, ... }
   */
  async createPost({ content, mediaIds, embed }) {
    try {
      const payload = { content };
      if (Array.isArray(mediaIds) && mediaIds.length) {
        payload.mediaIds = mediaIds;
      }
      if (embed && typeof embed === 'object' && embed.type) {
        payload.embed = embed;
      }
      const response = await axios.post('/posts', payload);
      return normalizeSingleResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '发帖失败'));
    }
  },

  /**
   * 回复帖子
   */
  async reply(postId, { content, mediaIds, embed }) {
    try {
      const payload = { content };
      if (Array.isArray(mediaIds) && mediaIds.length) {
        payload.mediaIds = mediaIds;
      }
      if (embed && typeof embed === 'object' && embed.type) {
        payload.embed = embed;
      }
      const response = await axios.post(`/posts/${postId}/reply`, payload);
      return normalizeSingleResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '回复失败'));
    }
  },

  /**
   * 引用帖子
   */
  async quote(postId, { content, mediaIds, embed }) {
    try {
      const payload = { content };
      if (Array.isArray(mediaIds) && mediaIds.length) {
        payload.mediaIds = mediaIds;
      }
      if (embed && typeof embed === 'object' && embed.type) {
        payload.embed = embed;
      }
      const response = await axios.post(`/posts/${postId}/quote`, payload);
      return normalizeSingleResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '引用推文失败'));
    }
  },

  /**
   * 转推
   */
  async retweet(postId) {
    try {
      const response = await axios.post(`/posts/${postId}/retweet`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '转推失败'));
    }
  },

  /**
   * 取消转推
   */
  async unretweet(postId) {
    try {
      const response = await axios.delete(`/posts/${postId}/retweet`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '取消转推失败'));
    }
  },

  /**
   * 点赞
   */
  async like(postId) {
    try {
      const response = await axios.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '点赞失败'));
    }
  },

  /**
   * 取消点赞
   */
  async unlike(postId) {
    try {
      const response = await axios.delete(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '取消点赞失败'));
    }
  },

  /**
   * 收藏
   */
  async bookmark(postId) {
    try {
      const response = await axios.post(`/posts/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '收藏失败'));
    }
  },

  /**
   * 取消收藏
   */
  async unbookmark(postId) {
    try {
      const response = await axios.delete(`/posts/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '取消收藏失败'));
    }
  },

  /**
   * 删除帖子
   */
  async remove(postId) {
    try {
      const response = await axios.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '删除推文失败'));
    }
  },

  /**
   * 获取单条帖子
   */
  async getPost(postId) {
    try {
      const response = await axios.get(`/posts/${postId}`);
      return normalizeSingleResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取推文失败'));
    }
  },

  /**
   * 获取线程
   * @param {string|number} postId - 根帖子ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getThread(postId, { cursor, limit = 50 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/thread/${postId}`, { params });
      return normalizeThreadResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取线程失败'));
    }
  },

  /**
   * 获取用户帖子
   * @param {string|number} userId - 用户ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   * @param {boolean} options.includeReplies - 是否包含回复
   */
  async getUserPosts(userId, { cursor, limit = 20, includeReplies = false } = {}) {
    try {
      const params = { limit, include_replies: String(includeReplies) };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/user/${userId}`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取用户推文失败'));
    }
  },

  /**
   * 获取首页信息流
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   * @param {boolean} options.includeReplies - 是否包含回复
   */
  async getFeed({ cursor, limit = 20, includeReplies = false } = {}) {
    try {
      const params = { limit, include_replies: String(includeReplies) };
      if (cursor) params.cursor = cursor;
      const response = await axios.get('/posts/feed', { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取时间线失败'));
    }
  },

  /**
   * 获取提及列表
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getMentions({ cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get('/posts/mentions', { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取提及失败'));
    }
  },

  /**
   * 计算字数
   */
  async count(content) {
    try {
      const response = await axios.post('/posts/count', { content });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '字数统计失败'));
    }
  }
};

export default PostsService;
