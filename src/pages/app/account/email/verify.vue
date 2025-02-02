<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-center text-h4 font-weight-bold">
            邮箱验证
          </v-card-title>
          <v-card-subtitle class="text-center mt-2">
            请输入您的邮箱和验证码
          </v-card-subtitle>

          <v-form @submit.prevent="verifyEmail" class="mt-6">
            <v-text-field
              v-model="email"
              label="邮箱地址"
              type="email"
              required
              :rules="[rules.required, rules.email]"
              placeholder="请输入邮箱地址"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="token"
              label="验证码"
              type="text"
              required
              :rules="[rules.required, rules.length]"
              maxlength="6"
              placeholder="请输入6位验证码"
              variant="outlined"
              class="mt-4"
            ></v-text-field>

            <v-btn
              type="submit"
              :loading="isLoading"
              :disabled="isLoading"
              color="primary"
              block
              class="mt-6"
              size="large"
            >
              {{ isLoading ? '验证中...' : '验证' }}
            </v-btn>
          </v-form>

          <v-alert
            v-if="message"
            :type="messageType"
            class="mt-4"
            variant="tonal"
          >
            {{ message }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/axios/axios'

const route = useRoute()
const email = ref('')
const token = ref('')
const isLoading = ref(false)
const message = ref('')
const messageType = ref('success')

const rules = {
  required: value => !!value || '此字段为必填项',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || '请输入有效的邮箱地址'
  },
  length: value => value?.length === 6 || '验证码必须是6位数字'
}

onMounted(() => {
  // 从 URL query 参数中获取邮箱和验证码
  const queryEmail = route.query.email
  const queryToken = route.query.token
  
  if (queryEmail) {
    email.value = queryEmail
  }
  if (queryToken) {
    token.value = queryToken
  }

  // 如果同时存在邮箱和验证码，自动进行验证
  if (queryEmail && queryToken) {
    verifyEmail()
  }
})

const verifyEmail = async () => {
  if (isLoading.value) return

  // 验证输入
  if (!email.value || !token.value) {
    showMessage('请输入邮箱和验证码', 'error')
    return
  }

  if (token.value.length !== 6) {
    showMessage('验证码必须是6位数字', 'error')
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    const response = await axios.post('/account/verify-email', {
      email: email.value,
      token: token.value
    })

    showMessage(response.data.message || '邮箱验证成功！', 'success')
  } catch (error) {
    showMessage(error.response?.data?.message || '验证失败，请重试', 'error')
  } finally {
    isLoading.value = false
  }
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
}
</script>
