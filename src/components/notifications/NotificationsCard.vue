<template>
  <v-card>
    <v-card-title class="d-flex align-center justify-space-between">
      <div>
        <v-icon start color="primary">mdi-bell</v-icon>
        通知中心
      </div>
      
      <div class="d-flex align-center ga-2">
        <!-- 未读计数徽章 -->
        <v-chip
          v-if="unreadCount > 0"
          :text="`${unreadCount} 条未读`"
          color="error"
          variant="tonal"
          prepend-icon="mdi-circle"
        ></v-chip>
        
        <!-- 全部已读按钮 -->
        <v-btn
          v-if="unreadCount > 0"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-check-all"
          @click="markAllAsRead"
          :loading="loading"
          size="small"
        >
          全部已读
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-0">
      <notifications-card-content
        :show-pagination="true"
        :auto-load-more="false"
        :auto-fetch="true"
        @update:unread-count="updateUnreadCount"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { ref } from "vue";
import { markAllNotificationsAsRead } from "@/services/notificationService";
import { showSnackbar } from '@/composables/useNotifications.js';

export default {
  name: "NotificationsCard",
  setup() {
    const unreadCount = ref(0);
    const loading = ref(false);

    const updateUnreadCount = (count) => {
      unreadCount.value = count;
    };

    const markAllAsRead = async () => {
      loading.value = true;
      
      try {
        await markAllNotificationsAsRead();
        unreadCount.value = 0;
        showSnackbar('所有通知已标记为已读', 'success');
      } catch (err) {
        showSnackbar('操作失败', 'error');
        console.error("Error marking all notifications as read:", err);
      } finally {
        loading.value = false;
      }
    };

    return {
      unreadCount,
      loading,
      updateUnreadCount,
      markAllAsRead,
    };
  },
};
</script>

<style scoped>
.notification-item.unread-notification {
  background-color: rgba(var(--v-theme-primary), 0.04);
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.clickable-item {
  cursor: pointer;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

code {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.detail-info {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
  padding: 12px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 12px;
}
</style>