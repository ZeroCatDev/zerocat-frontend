<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div>
                <v-icon start>mdi-bell</v-icon>
                通知中心
              </div>
              <div>  <v-btn
                  variant="outlined"
                  prepend-icon="mdi-check-all"
                  @click="debugNotificationTest"
                >
                  测试
                </v-btn>
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-check-all"
                  @click="markAllAsRead"
                  :disabled="!hasUnread"
                >
                  标记全部已读
                </v-btn>
              </div>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text v-if="loading">
              <div class="d-flex justify-center pa-4">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
            </v-card-text>

            <template v-else>
              <v-list v-if="notifications.length > 0">
                <v-list-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  :to="notification.redirect_url"
                  lines="three"
                  color="primary"
                  :active="!notification.read"
                  @click="markAsRead(notification.id)"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40" v-if="notification.acting_user_avatar_template">
                      <v-img :src="notification.acting_user_avatar_template"></v-img>
                    </v-avatar>
                    <v-avatar v-else color="primary" size="40">
                      <v-icon>mdi-bell</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title>
                    <span v-if="notification.acting_user_name">{{ notification.acting_user_name }}</span>
                    <span v-else>系统消息</span>
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <span v-if="notification.notification_type === 1">在项目 {{ notification.data.project_title }} 中评论了</span>
                    <span v-else-if="notification.notification_type === 2">点赞了项目 {{ notification.data.project_title }}</span>
                    <span v-else-if="notification.notification_type === 3">Fork了项目 {{ notification.data.project_title }}</span>
                    <span v-else-if="notification.notification_type === 20">关注了你</span>
                    <span v-else-if="notification.notification_type === 101">点赞了你的评论</span>
                    <span v-else-if="notification.notification_type === 50">系统公告</span>
                    <span v-else-if="notification.notification_type === 802">在话题中提到了你</span>
                    <span v-else-if="notification.notification_type === 21">在项目中提到了你</span>
                    <span v-else-if="notification.notification_type === 800">{{ notification.data.title }}</span>
                    <span v-else>新的通知</span>
                  </v-list-item-subtitle>

                  <v-list-item-subtitle class="text-caption text-grey">
                    {{ formatDate(notification.created_at) }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-chip
                      v-if="notification.high_priority"
                      color="error"
                      size="small"
                      class="mr-2"
                    >
                      重要
                    </v-chip>
                    <v-icon v-if="!notification.read" color="primary" size="small">mdi-circle-small</v-icon>
                  </template>
                </v-list-item>
              </v-list>

              <div v-else class="py-8 text-center">
                <v-icon size="large" color="grey">mdi-bell-off</v-icon>
                <div class="text-body-1 text-grey mt-2">暂无通知</div>
              </div>

              <v-divider v-if="notifications.length > 0"></v-divider>

              <v-card-actions v-if="notifications.length > 0" class="d-flex justify-center pa-4">
                <v-pagination
                  v-if="totalPages > 1"
                  v-model="currentPage"
                  :length="totalPages"
                  @update:model-value="fetchNotifications"
                ></v-pagination>
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, debugNotificationTest } from '@/services/notificationService';

export default {
  setup() {
    const notifications = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = ref(20);
    const totalItems = ref(0);

    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

    const hasUnread = computed(() => notifications.value.some(n => !n.read));

    const fetchNotifications = async (page = 1) => {
      loading.value = true;
      error.value = null;
      currentPage.value = page;

      try {
        const data = await getNotifications();
        notifications.value = data.notifications || [];
        totalItems.value = data.total_rows_notifications || 0;
      } catch (err) {
        error.value = err.message || 'Failed to load notifications';
        console.error('Error loading notifications:', err);
      } finally {
        loading.value = false;
      }
    };

    const markAsRead = async (id) => {
      try {
        await markNotificationAsRead(id);
        const notification = notifications.value.find(n => n.id === id);
        if (notification) {
          notification.read = true;
        }
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    };

    const markAllAsRead = async () => {
      try {
        await markAllNotificationsAsRead();
        notifications.value.forEach(notification => {
          notification.read = true;
        });
      } catch (err) {
        console.error('Error marking all notifications as read:', err);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) {
        return '刚刚';
      } else if (diffMins < 60) {
        return `${diffMins}分钟前`;
      } else if (diffHours < 24) {
        return `${diffHours}小时前`;
      } else if (diffDays < 30) {
        return `${diffDays}天前`;
      } else {
        return date.toLocaleDateString();
      }
    };

    onMounted(() => {
      fetchNotifications();
    });

    return {
      notifications,
      loading,
      error,
      currentPage,
      totalPages,
      hasUnread,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      formatDate,
      debugNotificationTest
    };
  }
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>