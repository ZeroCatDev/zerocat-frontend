import axios from '@/axios/axios';

const getErrorMessage = (error, fallback = '请求失败') => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export const ProjectRecommendationService = {
  /**
   * 获取我的项目推荐
   * @param {Object} params - 查询参数
   * @param {number} [params.limit=20] - 返回数量
   * @param {number} [params.offset=0] - 分页偏移
   * @param {number} [params.min_similarity] - 相似度下限
   * @returns {Promise<Object>} 响应数据
   */
  async getMyRecommendations(params = {}) {
    try {
      const response = await axios.get('/project/recommend/me', { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取推荐项目失败'));
    }
  },

  /**
   * 获取上下文项目推荐（用户兴趣 + 当前项目）
   * @param {number} projectId - 当前项目 ID
   * @param {Object} params - 查询参数
   * @param {number} [params.limit=20] - 返回数量
   * @param {number} [params.offset=0] - 分页偏移
   * @param {number} [params.min_similarity] - 相似度下限
   * @returns {Promise<Object>} 响应数据
   */
  async getContextRecommendations(projectId, params = {}) {
    try {
      const response = await axios.get(`/project/recommend/context/${projectId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取相关推荐失败'));
    }
  },

  /**
   * 基于项目查找相似项目
   * @param {number} projectId - 源项目 ID
   * @param {Object} params - 查询参数
   * @param {number} [params.limit=20] - 返回数量
   * @param {number} [params.offset=0] - 分页偏移
   * @param {number} [params.min_similarity] - 相似度下限
   * @returns {Promise<Object>} 响应数据
   */
  async getSimilarProjects(projectId, params = {}) {
    try {
      const response = await axios.get(`/project/similar/${projectId}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取相似项目失败'));
    }
  },
};

export default ProjectRecommendationService;
