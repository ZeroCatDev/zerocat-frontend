<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>站点地图管理</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="loadStatus"
          :loading="loading"
          prepend-icon="mdi-refresh"
        >
          刷新
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <!-- 设置卡片 -->
            <v-card variant="outlined">
              <v-card-title>基本设置</v-card-title>
              <v-card-text>
                <v-switch
                  v-model="settings.enabled"
                  label="启用站点地图"
                  :disabled="loading"
                  @change="saveSettings"
                ></v-switch>
                <v-switch
                  v-model="settings.autoUpdate"
                  label="启用自动更新"
                  :disabled="loading || !settings.enabled"
                  @change="saveSettings"
                ></v-switch>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <!-- 状态卡片 -->
            <v-card variant="outlined">
              <v-card-title>当前状态</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon :color="status.isGenerating ? 'warning' : 'success'">
                        {{ status.isGenerating ? 'mdi-cog-sync' : 'mdi-check-circle' }}
                      </v-icon>
                    </template>
                    <v-list-item-title>生成状态</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ status.isGenerating ? '正在生成中' : '空闲' }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-clock-outline</v-icon>
                    </template>
                    <v-list-item-title>最后全量更新</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ status.lastFullUpdate || '从未更新' }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-clock-outline</v-icon>
                    </template>
                    <v-list-item-title>最后增量更新</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ status.lastIncrementalUpdate || '从未更新' }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon>mdi-file-document-outline</v-icon>
                    </template>
                    <v-list-item-title>当前文件哈希</v-list-item-title>
                    <v-list-item-subtitle class="text-truncate">
                      {{ status.currentFileHash || '无' }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 操作按钮 -->
        <v-row class="mt-4">
          <v-col>
            <v-card variant="outlined">
              <v-card-title>手动生成</v-card-title>
              <v-card-text>
                <v-btn
                  color="primary"
                  :loading="generating"
                  :disabled="!settings.enabled || status.isGenerating"
                  class="mr-2"
                  @click="generateSitemap('full')"
                  prepend-icon="mdi-refresh"
                >
                  全量生成
                </v-btn>
                <v-btn
                  :loading="generating"
                  :disabled="!settings.enabled || status.isGenerating"
                  @click="generateSitemap('incremental')"
                  prepend-icon="mdi-refresh"
                >
                  增量更新
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 提示消息 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios/axios'
// 状态变量
const loading = ref(false)
const generating = ref(false)
const settings = ref({
  enabled: false,
  autoUpdate: false
})
const status = ref({
  enabled: false,
  autoUpdate: false,
  updateCron: '',
  currentFileHash: '',
  lastFullUpdate: '',
  lastIncrementalUpdate: '',
  isGenerating: false,
  isTaskScheduled: false
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// 方法
const loadStatus = async () => {
  loading.value = true
  try {
    const response = await axios.get('/admin/sitemap/status')
    if (response.status === 200 && response.data.status === 'success') {
      const data = response.data.data
      status.value = data
      settings.value.enabled = data.enabled
      settings.value.autoUpdate = data.autoUpdate
    }
  } catch (error) {
    showError('加载状态失败')
  }
  loading.value = false
}

const saveSettings = async () => {
  loading.value = true
  try {
    const response = await axios.post('/admin/sitemap/settings', {
      enabled: settings.value.enabled,
      autoUpdate: settings.value.autoUpdate
    })
    if (response.status === 200 && response.data.status === 'success') {
      showSuccess('设置已更新')
      loadStatus()
    }
  } catch (error) {
    showError('保存设置失败')
    // 回滚设置
    loadStatus()
  }
  loading.value = false
}

const generateSitemap = async (type) => {
  generating.value = true
  try {
    const response = await axios.post('/admin/sitemap/generate', { type })
    if (response.status === 200 && response.data.status === 'success') {
      showSuccess('站点地图生成成功')
      loadStatus()
    }
  } catch (error) {
    showError('生成站点地图失败')
  }
  generating.value = false
}

const showSuccess = (text) => {
  snackbar.value = {
    show: true,
    text,
    color: 'success'
  }
}

const showError = (text) => {
  snackbar.value = {
    show: true,
    text,
    color: 'error'
  }
}

// 生命周期
onMounted(() => {
  loadStatus()
})
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style>