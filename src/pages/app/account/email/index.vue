<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>邮箱管理</span>
            <v-btn color="primary" @click="showAddDialog = true" :disabled="emails.length >= 5">
              添加邮箱
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>邮箱地址</th>
                  <th>状态</th>
                  <th>添加时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="email in emails" :key="email.contact_id">
                  <td>
                    {{ email.contact_value }}
                    <v-chip v-if="email.is_primary" color="primary" size="small" class="ml-2">主邮箱</v-chip>
                  </td>
                  <td>
                    <v-chip
                      :color="email.verified ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ email.verified ? '已验证' : '未验证' }}
                    </v-chip>
                  </td>
                  <td>{{ new Date(email.created_at).toLocaleString() }}</td>
                  <td>
                    <v-btn
                      v-if="!email.verified"
                      variant="text"
                      color="primary"
                      size="small"
                      @click="handleVerifyClick(email.contact_value)"
                    >
                      验证
                    </v-btn>
                    <v-btn
                      v-if="!email.is_primary"
                      variant="text"
                      color="error"
                      size="small"
                      @click="confirmDelete(email)"
                    >
                      删除
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 添加邮箱对话框 -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>添加新邮箱</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="sendPrimaryVerification" ref="addForm">
            <v-text-field
              v-model="newEmail"
              label="新邮箱地址"
              :rules="[rules.required, rules.email]"
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-if="showVerificationInput"
              v-model="verificationCode"
              label="主邮箱验证码"
              :rules="[rules.required, rules.length]"
              maxlength="6"
              variant="outlined"
            ></v-text-field>
            <v-alert
              v-if="addMessage"
              :type="addMessageType"
              variant="tonal"
              class="mt-3"
            >
              {{ addMessage }}
            </v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeAddDialog">取消</v-btn>
          <v-btn
            color="primary"
            :loading="isLoading"
            @click="showVerificationInput ? addNewEmail() : sendPrimaryVerification()"
          >
            {{ showVerificationInput ? '添加' : '发送验证码' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title>删除邮箱</v-card-title>
        <v-card-text>
          <p>确认要删除邮箱 {{ emailToDelete?.contact_value }} 吗？</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDeleteDialog">取消</v-btn>
          <v-btn
            color="error"
            :loading="isLoading"
            @click="startDeleteEmail"
          >
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 使用验证码组件 -->
    <verify-email
      v-model="showVerifyDialog"
      :email="currentVerifyEmail"
      :title="verifyTitle"
      @verified="handleVerified"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios/axios'
import VerifyEmail from '@/components/verifyEmail.vue'

const emails = ref([])
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const showVerificationInput = ref(false)
const isLoading = ref(false)
const newEmail = ref('')
const verificationCode = ref('')
const deleteVerificationCode = ref('')
const emailToDelete = ref(null)
const addMessage = ref('')
const addMessageType = ref('info')
const deleteMessage = ref('')
const deleteMessageType = ref('info')
const addForm = ref(null)
const showVerifyDialog = ref(false)
const currentVerifyEmail = ref('')
const verifyTitle = ref('')
const currentVerifyAction = ref(null)

const rules = {
  required: value => !!value || '此字段为必填项',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || '请输入有效的邮箱地址'
  },
  length: value => value?.length === 6 || '验证码必须是6位数字'
}

onMounted(async () => {
  await fetchEmails()
})

const fetchEmails = async () => {
  try {
    const response = await axios.get('/account/emails')
    if (response.data.status === 'success') {
      emails.value = response.data.data
    }
  } catch (error) {
    console.error('获取邮箱列表失败:', error)
  }
}

const sendVerificationCode = async (email, onSuccess) => {
  try {
    const response = await axios.post('/account/send-verification-code', {
      email: email
    })
    
    if (response.data.status === 'success') {
      if (onSuccess) {
        onSuccess()
      } else {
        currentVerifyEmail.value = email
        verifyTitle.value = '验证邮箱'
        currentVerifyAction.value = null
        showVerifyDialog.value = true
      }
    } else {
      if (!onSuccess) {
        addMessage.value = response.data.message
        addMessageType.value = 'error'
      }
    }
  } catch (error) {
    if (!onSuccess) {
      addMessage.value = error.response?.data?.message || '发送验证码失败'
      addMessageType.value = 'error'
    }
  }
}

const requestVerifyCode = (email, title, callback) => {
  currentVerifyEmail.value = email
  verifyTitle.value = title
  currentVerifyAction.value = callback
  showVerifyDialog.value = true
}

const handleVerified = (code) => {
  if (currentVerifyAction.value) {
    currentVerifyAction.value(code)
    currentVerifyAction.value = null
  }
}

const sendPrimaryVerification = async () => {
  if (!newEmail.value) {
    addMessage.value = '请输入新邮箱地址'
    addMessageType.value = 'error'
    return
  }

  const primaryEmail = emails.value.find(e => e.is_primary)
  if (!primaryEmail) {
    addMessage.value = '未找到主邮箱'
    addMessageType.value = 'error'
    return
  }

  requestVerifyCode(
    primaryEmail.contact_value,
    '验证主邮箱',
    (code) => {
      verificationCode.value = code
      addNewEmail()
    }
  )
}

const addNewEmail = async () => {
  if (!newEmail.value || !verificationCode.value) return
  
  isLoading.value = true
  try {
    const response = await axios.post('/account/add-email', {
      email: newEmail.value,
      verificationCode: verificationCode.value
    })
    
    if (response.data.status === 'success') {
      await fetchEmails()
      closeAddDialog()
    } else {
      addMessage.value = response.data.message
      addMessageType.value = 'error'
    }
  } catch (error) {
    addMessage.value = '添加邮箱失败'
    addMessageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = (email) => {
  emailToDelete.value = email
  showDeleteDialog.value = true
}

const startDeleteEmail = () => {
  const primaryEmail = emails.value.find(e => e.is_primary)
  if (primaryEmail && emailToDelete.value) {
    requestVerifyCode(
      primaryEmail.contact_value,
      '验证主邮箱',
      async (code) => {
        isLoading.value = true
        try {
          const response = await axios.post('/account/remove-email', {
            email: emailToDelete.value.contact_value,
            verificationCode: code
          })
          
          if (response.data.status === 'success') {
            await fetchEmails()
            closeDeleteDialog()
          }
        } catch (error) {
          console.error('删除失败:', error)
        } finally {
          isLoading.value = false
        }
      }
    )
  }
}

const closeAddDialog = () => {
  showAddDialog.value = false
  showVerificationInput.value = false
  newEmail.value = ''
  verificationCode.value = ''
  addMessage.value = ''
  if (addForm.value) {
    addForm.value.reset()
  }
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  emailToDelete.value = null
}

const handleVerifyClick = (email) => {
  requestVerifyCode(
    email,
    '验证邮箱',
    async (code) => {
      isLoading.value = true
      try {
        const response = await axios.post('/account/verify-email', {
          email: email,
          token: code
        })
        
        if (response.data.status === 'success') {
          await fetchEmails()
        }
      } catch (error) {
        console.error('验证失败:', error)
      } finally {
        isLoading.value = false
      }
    }
  )
}
</script>
