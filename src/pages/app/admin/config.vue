<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>系统配置</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="loadConfigs"
          :loading="loading"
          prepend-icon="mdi-refresh"
        >
          刷新
        </v-btn>
      </v-card-title>

      <v-card-text>
        <config-item-group
          :configs="configs"
          @save-error="handleSaveError"
          @delete="handleDelete"
        />
      </v-card-text>
    </v-card>

    <!-- 保存错误提示 -->
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
import ConfigItemGroup from '@/components/admin/ConfigItemGroup.vue'
import axios from '@/axios/axios'

// 状态变量
const loading = ref(false)
const configs = ref([])

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// 方法
const loadConfigs = async () => {
  loading.value = true
  try {
    const unified = await axios.get('/admin/config/unified')
    if (unified.status === 200) {
      configs.value = unified.data.configs
    }
  } catch (error) {
    showError('加载配置失败')
  }
  loading.value = false
}

const handleSaveError = (key) => {
  const config = configs.value.find(c => c.key === key)
  showError(`保存 ${config?.description || key} 失败`)
}

const handleDelete = async (key) => {
  try {
    const result = await axios.delete(`/admin/config/${key}`)
    if (result.status === 200) {
      showSuccess('删除配置成功')
      loadConfigs()
    }
  } catch (error) {
    showError('删除配置失败')
  }
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
  loadConfigs()
})
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style>
