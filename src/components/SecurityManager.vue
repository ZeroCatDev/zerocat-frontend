<template>
  <div>
    <div class="mb-6">
      <h4 class="text-h6 mb-3">登录设备</h4>
      <v-alert v-if="activeTokens.length === 0 && !isLoadingTokens" type="info" text="没有活跃的会话" class="mb-3"></v-alert>
      <v-data-table
        v-else
        :headers="tokenHeaders"
        :items="activeTokens"
        :loading="isLoadingTokens"
        loading-text="加载会话列表..."
        no-data-text="没有找到活跃会话"
        class="elevation-1 rounded-lg"
      >
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template v-slot:item.device_info="{ item }">
          <div class="d-flex align-center">

            {{ item.device_info?.os || '未知' }} ({{ item.device_info?.browser || '未知' }}) <v-chip
            v-if="item.is_current"
            color="success"
            size="small"
            text="当前"
          ></v-chip>
          </div>
        </template>
        <template v-slot:item.ip_address="{ item }">
          {{ item.ip_address }}
        </template>
        <template v-slot:item.ip_location="{ item }">
          <span v-if="item.ip_location">
            {{ formatIpLocation(item.ip_location) }}
          </span>
          <span v-else>-</span>
        </template>
        <template v-slot:item.activity_count="{ item }">
          <v-chip
            :color="getActivityColor(item.activity_count)"
            size="small"
            :text="getActivityText(item.activity_count)"
          ></v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            @click="handleRevokeToken(item.id)"
            size="small"
            color="error"
            variant="text"
            :loading="loadingTokenId === item.id"
            :disabled="isLoadingTokens || isPerformingAction"
          >
            <v-icon>mdi-logout</v-icon>
            结束会话
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <div class="d-flex gap-4 mt-6">
      <v-btn
        color="error"
        prepend-icon="mdi-logout-variant"
        @click="confirmLogoutAll"
        :loading="isLoggingOutAll"
        :disabled="isPerformingAction || isLoadingTokens"
      >
        退出所有会话
      </v-btn>
    </div>

    <!-- 确认对话框 -->
    <v-dialog v-model="showConfirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">{{ confirmDialogTitle }}</v-card-title>
        <v-card-text>{{ confirmDialogText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showConfirmDialog = false">取消</v-btn>
          <v-btn color="error" variant="flat" @click="executeConfirmedAction">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { localuser } from '@/services/localAccount';
import { formatDistance, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default {
  name: 'SecurityManager',
  data() {
    return {
      activeTokens: [],
      isLoadingTokens: false,
      isLoggingOutAll: false,
      loadingTokenId: null,
      isPerformingAction: false,
      showConfirmDialog: false,
      confirmDialogTitle: '',
      confirmDialogText: '',
      confirmedAction: null,
      tokenHeaders: [
        { title: '创建时间', key: 'created_at', sortable: true },
        { title: '设备信息', key: 'device_info', sortable: false },
        { title: 'IP地址', key: 'ip_address', sortable: true },
        { title: 'IP属地', key: 'ip_location', sortable: true },
        { title: '操作', key: 'actions', sortable: false },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      await this.loadActiveTokens();
    },
    async loadActiveTokens() {
      this.isLoadingTokens = true;
      try {
        this.activeTokens = await localuser.getActiveTokens();
      } catch (error) {
        console.error('获取会话列表失败:', error);
        this.$toast.add({
          severity: 'error',
          summary: '错误',
          detail: '获取会话列表失败',
          life: 3000,
        });
      } finally {
        this.isLoadingTokens = false;
      }
    },

    getActivityColor(count) {
      if (!count) return 'grey';
      if (count < 5) return 'info';
      if (count < 20) return 'primary';
      if (count < 50) return 'success';
      return 'purple';
    },

    formatIpLocation(ipLocation) {
      if (!ipLocation) return '-';

      // 如果ipLocation是字符串，尝试解析它
      let locationData = ipLocation;
      if (typeof ipLocation === 'string') {
        try {
          locationData = JSON.parse(ipLocation);
        } catch (e) {
          return ipLocation; // 如果解析失败，直接返回原始字符串
        }
      }

      let location = '';
      if (locationData.country) {
        location += locationData.country;
      }
      if (locationData.region) {
        location += ' ' + locationData.region;
      }
      if (locationData.city && locationData.city !== locationData.region) {
        location += ' ' + locationData.city;
      }

      if (locationData.isp) {
        location += ` (${locationData.isp})`;
      }

      return location || '-';
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      const now = new Date();

      // 如果是当天的日期，使用"x小时前"的格式
      const formattedDate = formatDistance(date, now, {
        addSuffix: true,
        locale: zhCN,
      });

      // 添加具体日期时间的提示
      const fullDate = format(date, 'yyyy-MM-dd HH:mm:ss');

      return `${formattedDate} (${fullDate})`;
    },
    async handleRevokeToken(tokenId) {
      this.loadingTokenId = tokenId;
      this.isPerformingAction = true;

      try {
        const success = await localuser.revokeToken(tokenId);
        if (success) {
          this.$toast.add({
            severity: 'success',
            summary: '成功',
            detail: '会话已成功结束',
            life: 3000,
          });
          await this.loadActiveTokens();
        } else {
          this.$toast.add({
            severity: 'error',
            summary: '错误',
            detail: '会话结束失败',
            life: 3000,
          });
        }
      } catch (error) {
        console.error('会话结束失败:', error);
        this.$toast.add({
          severity: 'error',
          summary: '错误',
          detail: '会话结束失败',
          life: 3000,
        });
      } finally {
        this.loadingTokenId = null;
        this.isPerformingAction = false;
      }
    },
    confirmLogoutAll() {
      this.confirmDialogTitle = '确认退出所有会话';
      this.confirmDialogText = '这将使所有会话立即失效，包括当前会话。您需要重新登录才能继续使用。确定要执行此操作吗？';
      this.confirmedAction = this.logoutAllSessions;
      this.showConfirmDialog = true;
    },
    async logoutAllSessions() {
      this.isLoggingOutAll = true;

      try {
        const success = await localuser.logoutAllDevices(); // 后端端点名称未更改，但概念上是会话
        if (success) {
          this.$toast.add({
            severity: 'success',
            summary: '成功',
            detail: '已成功退出所有会话',
            life: 3000,
          });
          // 重定向到登录页面
          this.$router.push('/app/account/login');
        } else {
          this.$toast.add({
            severity: 'error',
            summary: '错误',
            detail: '退出所有会话失败',
            life: 3000,
          });
        }
      } catch (error) {
        console.error('退出所有会话失败:', error);
        this.$toast.add({
          severity: 'error',
          summary: '错误',
          detail: '退出所有会话失败',
          life: 3000,
        });
      } finally {
        this.isLoggingOutAll = false;
      }
    },
    executeConfirmedAction() {
      if (typeof this.confirmedAction === 'function') {
        this.confirmedAction();
      }
      this.showConfirmDialog = false;
    },
  },
};
</script>