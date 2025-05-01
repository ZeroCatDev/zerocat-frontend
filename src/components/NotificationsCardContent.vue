<template>
  <div>
    <!-- 加载中 -->
    <div v-if="loading" class="d-flex justify-center align-center py-4">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <!-- 加载错误 -->
    <div v-else-if="error" class="text-center py-4 text-error">
      {{ error }}
      <v-btn variant="text" @click="fetchNotifications()">重试</v-btn>
    </div>

    <!-- 通知列表 -->
    <template v-else>
      <div
        ref="notificationsContainer"
        :style="{ 'overflow-y': 'auto' }"
        @scroll="handleScroll"
      >
        <v-list v-if="notifications.length > 0">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :to="notification.redirect_url"
            lines="three"
            color="primary"
            :active="!notification.read"
            @click="handleNotificationClick(notification)"
            :class="{ 'clickable-item': !!notification.redirect_url }"
          >
            <template v-slot:prepend>
              <v-avatar
                size="40"
                v-if="notification.actor?.avatar_url"
              >
                <v-img :src="notification.actor.avatar_url"></v-img>
              </v-avatar>
              <v-avatar v-else-if="notification.template_info?.icon" color="primary" size="40">
                <v-icon>{{ getIconForType(notification.template_info.icon) }}</v-icon>
              </v-avatar>
              <v-avatar v-else color="primary" size="40">
                <v-icon>mdi-bell</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              <span v-if="notification.template_info?.title">
                {{ notification.template_info.title }}
              </span>
              <span v-else-if="notification.actor?.name">
                {{ notification.actor.name }}
              </span>
              <span v-else>系统消息</span>
            </v-list-item-title>

            <v-list-item-subtitle>
              <span v-if="notification.template_info?.template">
                {{ renderTemplate(notification.template_info.template, notification) }}
              </span>
              <span v-else>{{ notification.content || '新的通知' }}</span>
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

        <!-- 无通知状态 -->
        <div v-else class="py-8 text-center">
          <v-icon size="large" color="grey">mdi-bell-off</v-icon>
          <div class="text-body-2 text-grey mt-2">暂无通知</div>
        </div>

        <!-- 加载更多区域 -->
        <div v-if="hasMoreNotifications" class="text-center py-4">
          <v-btn
            v-if="!autoLoadMore"
            variant="text"
            :loading="loadingMore"
            @click="loadMoreNotifications"
          >
            加载更多
          </v-btn>
          <v-progress-circular
            v-else-if="loadingMore"
            indeterminate
            size="24"
          ></v-progress-circular>
        </div>
      </div>

      <!-- 底部控制区 -->
      <template v-if="!showPagination">
        <v-divider class="my-1"></v-divider>
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
      </template>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notificationService";

export default {
  name: 'NotificationsCardContent',
  props: {
    showPagination: {
      type: Boolean,
      default: false
    },
    autoLoadMore: {
      type: Boolean,
      default: true
    },
    autoFetch: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:unread-count'],
  setup(props, { emit }) {
    const router = useRouter();
    const notifications = ref([]);
    const loading = ref(false);
    const loadingMore = ref(false);
    const error = ref(null);
    const unreadCount = ref(0);
    const hasMoreNotifications = ref(false);
    const loadMoreUrl = ref(null);
    const notificationsContainer = ref(null);

    const hasUnread = computed(() => unreadCount.value > 0);

    // 处理API错误
    const handleApiError = (error, customMessage = "操作失败") => {
      console.error(error);
      return error.response?.data?.message || error.message || customMessage;
    };

    // 获取通知数据
    const fetchNotifications = async () => {
      if (loading.value) return;

      loading.value = true;
      error.value = null;

      try {
        const data = await getNotifications();
        notifications.value = data.notifications || [];
        loadMoreUrl.value = data.load_more_url || null;
        hasMoreNotifications.value = !!loadMoreUrl.value;
        updateUnreadCount();
      } catch (err) {
        error.value = handleApiError(err, "加载通知失败");
      } finally {
        loading.value = false;
      }
    };

    // 加载更多通知
    const loadMoreNotifications = async () => {
      if (loadingMore.value || !loadMoreUrl.value) return;

      loadingMore.value = true;
      try {
        const data = await getNotifications({ url: loadMoreUrl.value });
        notifications.value = [...notifications.value, ...(data.notifications || [])];
        loadMoreUrl.value = data.load_more_url || null;
        hasMoreNotifications.value = !!loadMoreUrl.value;
      } catch (err) {
        error.value = handleApiError(err, "加载更多通知失败");
      } finally {
        loadingMore.value = false;
      }
    };

    // 处理滚动加载
    const handleScroll = async (event) => {
      if (!props.autoLoadMore || !hasMoreNotifications.value || loadingMore.value) return;

      const container = event.target;
      const { scrollHeight, scrollTop, clientHeight } = container;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      if (scrollBottom < 50) {
        await loadMoreNotifications();
      }
    };

    // 标记通知为已读
    const markAsRead = async (id) => {
      try {
        await markNotificationAsRead(id);
        const notification = notifications.value.find((n) => n.id === id);
        if (notification) {
          notification.read = true;
          updateUnreadCount();
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    };

    // 标记所有通知为已读
    const markAllAsRead = async () => {
      try {
        await markAllNotificationsAsRead();
        notifications.value.forEach((notification) => {
          notification.read = true;
        });
        updateUnreadCount();
      } catch (err) {
        console.error("Error marking all notifications as read:", err);
      }
    };

    // 更新未读计数
    const updateUnreadCount = () => {
      unreadCount.value = notifications.value.filter((n) => !n.read).length;
      emit('update:unread-count', unreadCount.value);
    };

    // 处理通知点击
    const handleNotificationClick = async (notification) => {
      if (!notification.read) {
        await markAsRead(notification.id);
      }
    };

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "刚刚";
      if (diffMins < 60) return `${diffMins}分钟前`;
      if (diffHours < 24) return `${diffHours}小时前`;
      if (diffDays < 30) return `${diffDays}天前`;
      return date.toLocaleDateString();
    };

    // 根据通知类型获取图标
    const getIconForType = (iconType) => {
      const iconMap = {
        follow: 'mdi-account-plus',
        like: 'mdi-heart',
        comment: 'mdi-comment-text',
        fork: 'mdi-source-fork',
        mention: 'mdi-at',
        system: 'mdi-information',
        admin: 'mdi-shield-account',
        update: 'mdi-update'
      };

      return iconMap[iconType] || 'mdi-bell';
    };

    // 渲染通知模板
    const renderTemplate = (template, notification) => {
      if (!template) return '';

      let result = template;
      const { actor } = notification;

      if (actor) {
        result = result.replace(/{{actor_name}}/g, actor.name || '');
      }

      // 替换其他可能的模板变量
      Object.entries(notification.template_data || {}).forEach(([key, value]) => {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      return result;
    };

    if (props.autoFetch) {
      onMounted(() => {
        fetchNotifications();
      });
    }

    return {
      notifications,
      loading,
      loadingMore,
      error,
      unreadCount,
      hasUnread,
      hasMoreNotifications,
      notificationsContainer,
      fetchNotifications,
      loadMoreNotifications,
      handleScroll,
      markAsRead,
      markAllAsRead,
      updateUnreadCount,
      handleNotificationClick,
      formatDate,
      renderTemplate,
      getIconForType
    };
  }
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.clickable-item {
  cursor: pointer;
}
.clickable-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>