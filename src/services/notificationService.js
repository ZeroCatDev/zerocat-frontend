import axios from "@/axios/axios";

// 获取用户通知列表
export const getNotifications = async (params = {}) => {
  try {
    const { limit = 20, offset = 0, unread_only = false, url } = params;
    
    // 如果提供了自定义URL（用于加载更多），直接使用
    if (url) {
      const response = await axios.get(url);
      return response.data;
    }
    
    // 否则使用标准参数
    const response = await axios.get("/notifications", {
      params: { limit, offset, unread_only }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      notifications: [],
      total_rows_notifications: 0,
      seen_notification_id: null,
      load_more_notifications: null,
    };
  }
};

// 获取单个通知详情（访问时自动标记为已读）
export const getNotificationById = async (id) => {
  try {
    const response = await axios.get(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notification details:", error);
    throw error;
  }
};

// 标记通知为已读
export const markNotificationAsRead = async (notificationIds) => {
  try {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    const response = await axios.post("/notifications/mark-read", {
      notification_ids: ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return {status: "error"};
  }
};

// 标记所有通知为已读
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.put("/notifications/read_all");
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return {status: "error"};
  }
};

// 删除通知
export const deleteNotifications = async (notificationIds) => {
  try {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    const response = await axios.delete("/notifications", {
      data: { notification_ids: ids }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting notifications:", error);
    throw error;
  }
};

// 获取未读通知数量
export const getUnreadNotificationCount = async () => {
  try {
    const response = await axios.get("/notifications/unread-count");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notification count:", error);
    return { count: 0 };
  }
};

// 注册浏览器推送通知
export const registerBrowserNotification = async (subscription, deviceInfo = {}) => {
  try {
    const response = await axios.post("/notifications/register-browser", {
      subscription,
      device_info: deviceInfo
    });
    return response.data;
  } catch (error) {
    console.error("Error registering browser notification:", error);
    throw error;
  }
};

// 取消浏览器推送通知
export const unregisterBrowserNotification = async (endpoint) => {
  try {
    const response = await axios.delete("/notifications/register-browser", {
      data: { endpoint }
    });
    return response.data;
  } catch (error) {
    console.error("Error unregistering browser notification:", error);
    throw error;
  }
};

// 获取推送订阅列表
export const getPushSubscriptions = async () => {
  try {
    const response = await axios.get("/notifications/push-subscriptions");
    return response.data;
  } catch (error) {
    console.error("Error fetching push subscriptions:", error);
    throw error;
  }
};

// 调试用：测试通知
export const debugNotificationTest = async () => {
  try {
    const response = await axios.post("/notifications/test");
    return response.data;
  } catch (error) {
    console.error("Error in notification test:", error);
    return {status: "error"};
  }
};
