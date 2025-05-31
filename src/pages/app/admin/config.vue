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
          class="mr-2"
        >
          刷新
        </v-btn>
        <v-btn
          color="success"
          @click="saveAllChanges"
          :loading="saving"
          :disabled="!hasChanges"
          prepend-icon="mdi-content-save"
        >
          保存全部
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="hasChanges"
          color="warning"
          variant="tonal"
          class="mb-4"
        >
          您有未保存的修改，点击每项设置后的 <v-icon size="small" icon="mdi-check" color="success" /> 保存单项，或点击右上角的"保存全部"按钮保存所有修改。
        </v-alert>

        <config-item-group
          :items="configs"
          @update="handleConfigUpdate"
          @refresh="loadConfigs"
          @validation-error="handleValidationError"
          @save-error="handleSaveError"
        />
      </v-card-text>
    </v-card>

    <!-- 验证错误对话框 -->
    <v-dialog v-model="showValidationDialog" max-width="500">
      <v-card>
        <v-card-title class="text-error">
          配置验证失败
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="error in validationErrors" :key="error.key">
              <v-list-item-title class="text-subtitle-1">
                {{ error.description }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-error">
                {{ error.error }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showValidationDialog = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 保存确认提示 -->
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
import { ref, computed, onMounted } from 'vue'
import ConfigItemGroup from '@/components/admin/ConfigItemGroup.vue'
import axios from '@/axios/axios'

// 状态变量
const loading = ref(false)
const saving = ref(false)
const configs = ref([])
const pendingChanges = ref({})
const showValidationDialog = ref(false)
const validationErrors = ref([])
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// 计算属性
const hasChanges = computed(() => Object.keys(pendingChanges.value).length > 0)

// 方法
const loadConfigs = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/admin/config/list')
    if (data.status === 'success') {
      configs.value = data.data
      // 重置待保存的修改
      pendingChanges.value = {}
    }
  } catch (error) {
    showError('加载配置失败')
  }
  loading.value = false
}

const handleConfigUpdate = (key, value) => {
  // 将修改添加到待保存队列
  pendingChanges.value[key] = value
}

const saveAllChanges = async () => {
  saving.value = true
  validationErrors.value = []
  let hasError = false

  try {
    // 逐个保存修改
    for (const [key, value] of Object.entries(pendingChanges.value)) {
      const { data } = await axios.put(`/admin/config/${key}`, { value })

      if (data.status === 'success') {
        if (!data.data.valid) {
          // 收集验证错误
          const config = configs.value.find(c => c.key === key)
          validationErrors.value.push({
            key,
            description: config.description,
            error: data.data.error
          })
          hasError = true
        }
      }
    }

    if (hasError) {
      showValidationDialog.value = true
    } else {
      showSuccess('所有配置已保存')
      // 重新加载配置以获取最新状态
      await loadConfigs()
    }
  } catch (error) {
    showError('保存配置失败')
  }

  saving.value = false
}

const handleValidationError = (error) => {
  validationErrors.value = [error]
  showValidationDialog.value = true
}

const handleSaveError = (key) => {
  const config = configs.value.find(c => c.key === key)
  showError(`保存 ${config.description} 失败`)
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
