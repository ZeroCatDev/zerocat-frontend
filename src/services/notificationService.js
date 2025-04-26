import axios from "@/axios/axios";

export const getNotifications = async () => {
  try {
    const response = await axios.get("/notifications");
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

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put("/notifications/read", {
      notification_ids: [notificationId],
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { status: "error" };
  }
};

export const debugNotificationTest = async () => {
  try {
    const response = await axios.post("/notifications/test");
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { status: "error" };
  }
};
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.put("/notifications/read_all");
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { status: "error" };
  }
};
