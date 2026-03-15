import axios from '@/axios/axios';

const getErrorMessage = (error, fallback = '请求失败') => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

export const Mirror40codeService = {
  async getStatus() {
    try {
      const response = await axios.get('/admin/mirror40code/status');
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '获取镜像状态失败'));
    }
  },

  async triggerFullSync() {
    try {
      const response = await axios.post('/admin/mirror40code/full-sync', {});
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '触发全量同步失败'));
    }
  },

  async triggerUserSync(userId) {
    try {
      const response = await axios.post(`/admin/mirror40code/users/${userId}/sync`, {});
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '触发用户同步失败'));
    }
  },

  async triggerProjectSync(projectId, remoteUserId) {
    try {
      const payload = {};
      if (remoteUserId !== undefined && remoteUserId !== null && `${remoteUserId}` !== '') {
        payload.remoteUserId = Number(remoteUserId);
      }
      const response = await axios.post(`/admin/mirror40code/projects/${projectId}/sync`, payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, '触发项目同步失败'));
    }
  },
};

export default Mirror40codeService;
