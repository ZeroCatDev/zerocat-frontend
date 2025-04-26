<template>
  <v-card border style="min-width: 400px; max-width: 450px; max-height: 500px; overflow: hidden;">
    <v-tabs v-model="activeTab" grow>
      <v-tab value="notifications">
        <v-icon start>mdi-bell</v-icon>
        通知
        <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" floating dot></v-badge>
      </v-tab>
      <v-tab value="profile">
        <v-icon start>mdi-account</v-icon>
        我的
      </v-tab>
    </v-tabs>

    <v-card-text class="pa-0">
      <v-window v-model="activeTab">
        <!-- Notifications Tab -->
        <v-window-item value="notifications">
          <div style="max-height: 420px; overflow-y: auto;">
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
                  <v-icon v-if="notification.high_priority" color="error" size="small">mdi-alert-circle</v-icon>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="py-8 text-center">
              <v-icon size="large" color="grey">mdi-bell-off</v-icon>
              <div class="text-body-2 text-grey mt-2">暂无通知</div>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="d-flex align-center justify-space-between pa-2">
            <v-btn
              variant="text"
              size="small"
              @click="markAllAsRead"
              :disabled="!hasUnread"
            >
              标记全部已读
            </v-btn>
            <v-btn variant="text" size="small" to="/app/notifications">
              查看全部通知
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-window-item>

        <!-- Profile Tab -->
        <v-window-item value="profile">
          <div class="pa-4">
            <v-card @click="loadUser(true)" :title="user.display_name" :subtitle="user.username"
                    :prepend-avatar="avatarUrl" class="mb-4">
            </v-card>
            <v-list>
              <v-list-item :to="`/${user.username}`" prepend-icon="mdi-account" title="个人主页" rounded="xl"
                color="primary"></v-list-item>
              <v-list-item to="/app/account" prepend-icon="mdi-cog" title="设置" rounded="xl" color="primary"></v-list-item>
              <v-list-item to="/app/project" prepend-icon="mdi-xml" title="项目" rounded="xl" color="primary"></v-list-item>
              <v-list-item to="/app/projectlist" prepend-icon="mdi-format-list-bulleted" title="列表" rounded="xl"
                color="primary"></v-list-item>
            </v-list>
            <v-divider class="my-2"></v-divider>
            <v-list>
              <v-list-item to="/app/account/logout" prepend-icon="mdi-logout" title="退出" color="error" active
                variant="plain" rounded="xl"></v-list-item>
            </v-list>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notificationService';
import { localuser } from '@/services/localAccount';

export default {
  props: {
    menuOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const activeTab = ref('notifications');
    const notifications = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const user = computed(() => localuser.user);
    const avatarUrl = computed(() => import.meta.env.VITE_APP_S3_BUCKET + '/user/' + user.value.avatar);

    const loadUser = (force = false) => {
      localuser.loadUser(force);
    };

    const fetchNotifications = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await getNotifications();
        notifications.value = data.notifications || [];
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

    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });

    const hasUnread = computed(() => unreadCount.value > 0);

    // Fetch notifications when menu is opened
    watch(() => props.menuOpen, (newVal) => {
      if (newVal && activeTab.value === 'notifications') {
        fetchNotifications();
      }
    });

    // Watch for tab change to fetch notifications if needed
    watch(activeTab, (newVal) => {
      if (newVal === 'notifications' && props.menuOpen) {
        fetchNotifications();
      }
    });

    // Fetch notifications initially if menu is open
    onMounted(() => {
      if (props.menuOpen) {
        fetchNotifications();
      }
    });

    return {
      activeTab,
      notifications,
      loading,
      error,
      user,
      avatarUrl,
      loadUser,
      markAsRead,
      markAllAsRead,
      formatDate,
      unreadCount,
      hasUnread
    };
  }
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>