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
 * 标准化单个帖子响应（含祖先链和回复）
 * @param {Object} res - API响应
 * @returns {Object} { post, ancestors, replies: { featured, regular }, includes }
 */
const normalizeSingleResponse = (res) => {
  const data = res?.data ?? res;
  const post = data?.post ?? data;
  const ancestors = Array.isArray(data?.ancestors) ? data.ancestors : [];

  // 处理回复：支持新格式 { featured, regular } 和旧格式数组
  let replies = { featured: [], regular: [] };
  if (data?.replies) {
    if (Array.isArray(data.replies)) {
      // 兼容旧格式：将数组作为 regular
      replies.regular = data.replies;
    } else if (typeof data.replies === 'object') {
      replies.featured = Array.isArray(data.replies.featured) ? data.replies.featured : [];
      replies.regular = Array.isArray(data.replies.regular) ? data.replies.regular : [];
    }
  }

  const includes = data?.includes ?? { posts: {} };
  return { post, ancestors, replies, includes };
};

/**
 * 标准化线程响应
 * @param {Object} res - API响应
 * @returns {Object} { post, ancestors, repliesByParent, includes, nextCursor, hasMore }
 */
const normalizeThreadResponse = (res) => {
  const data = res?.data ?? res;

  const post = data?.post ?? null;
  const ancestors = Array.isArray(data?.ancestors) ? data.ancestors : [];

  // 处理按父帖ID分组的回复
  let repliesByParent = {};
  if (data?.replies_by_parent || data?.repliesByParent) {
    const rawReplies = data.replies_by_parent ?? data.repliesByParent;
    for (const [parentId, group] of Object.entries(rawReplies)) {
      repliesByParent[parentId] = {
        featured: Array.isArray(group?.featured) ? group.featured : [],
        regular: Array.isArray(group?.regular) ? group.regular : []
      };
    }
  } else if (Array.isArray(data?.replies)) {
    // 兼容旧API：replies是数组，全部归入post的regular
    if (post?.id) {
      repliesByParent[post.id] = {
        featured: [],
        regular: data.replies
      };
    }
  }

  const includes = data?.includes ?? { posts: {} };
  const nextCursor = data?.next_cursor ?? data?.nextCursor ?? null;
  const hasMore = data?.has_more ?? data?.hasMore ?? false;

  return { post, ancestors, repliesByParent, includes, nextCursor, hasMore };
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
  },

  // ==================== 帖子级接口 ====================

  /**
   * 获取帖子的所有转推
   * @param {string|number} postId - 帖子ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getRetweets(postId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/${postId}/retweets`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取转推列表失败'));
    }
  },

  /**
   * 获取帖子的所有引用
   * @param {string|number} postId - 帖子ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getQuotes(postId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/${postId}/quotes`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取引用列表失败'));
    }
  },

  /**
   * 获取帖子的点赞用户列表（仅发帖人可见）
   * @param {string|number} postId - 帖子ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   * @returns {Object} { users, total, nextCursor, hasMore }
   */
  async getLikes(postId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/${postId}/likes`, { params });
      const data = response.data;
      return {
        users: data?.users || [],
        total: data?.total || 0,
        nextCursor: data?.next_cursor ?? data?.nextCursor ?? null,
        hasMore: data?.has_more ?? data?.hasMore ?? false
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取点赞列表失败'));
    }
  },

  /**
   * 获取帖子互动分析（收藏数仅作者可见）
   * @param {string|number} postId - 帖子ID
   * @returns {Object} { postId, replyCount, retweetCount, quoteCount, likeCount, bookmarkCount? }
   */
  async getAnalytics(postId) {
    try {
      const response = await axios.get(`/posts/${postId}/analytics`);
      const data = response.data;
      return {
        postId: data?.post_id ?? data?.postId ?? postId,
        replyCount: data?.reply_count ?? data?.replyCount ?? 0,
        retweetCount: data?.retweet_count ?? data?.retweetCount ?? 0,
        quoteCount: data?.quote_count ?? data?.quoteCount ?? 0,
        likeCount: data?.like_count ?? data?.likeCount ?? 0,
        bookmarkCount: data?.bookmark_count ?? data?.bookmarkCount // 仅作者可见，可能为 undefined
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取帖子分析失败'));
    }
  },

  // ==================== 用户级接口 ====================

  /**
   * 获取用户的所有回帖（带祖先链）
   * @param {string|number} userId - 用户ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   * @returns {Object} { items: [{ post, ancestors }], includes, nextCursor, hasMore }
   */
  async getUserReplies(userId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/user/${userId}/replies`, { params });
      const data = response.data;
      return {
        items: data?.items || [],
        includes: data?.includes ?? { posts: {} },
        nextCursor: data?.next_cursor ?? data?.nextCursor ?? null,
        hasMore: data?.has_more ?? data?.hasMore ?? false
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取用户回帖失败'));
    }
  },

  /**
   * 获取用户的所有主贴（原创帖子）
   * @param {string|number} userId - 用户ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getUserOriginals(userId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/user/${userId}/originals`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取用户主贴失败'));
    }
  },

  /**
   * 获取用户的所有带媒体帖子
   * @param {string|number} userId - 用户ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getUserMedia(userId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/user/${userId}/media`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取用户媒体帖子失败'));
    }
  },

  /**
   * 获取用户喜欢的帖子（仅自己可见）
   * @param {string|number} userId - 用户ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getUserLikes(userId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/user/${userId}/likes`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取用户喜欢的帖子失败'));
    }
  },

  /**
   * 获取用户的收藏（仅自己可见）
   * @param {string|number} userId - 用户ID
   * @param {Object} options
   * @param {string} options.cursor - 分页游标
   * @param {number} options.limit - 每页数量
   */
  async getUserBookmarks(userId, { cursor, limit = 20 } = {}) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`/posts/user/${userId}/bookmarks`, { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取用户收藏失败'));
    }
  }
};

export default PostsService;
