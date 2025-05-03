<template>
  <div>
    <AuthCard subtitle="邮箱验证">
      <v-card-text>
        <div class="d-flex align-center mb-6">
          <div class="me-3">
            <v-icon color="success" icon="mdi-check-circle" size="large" v-if="verificationStep === 'success'" />
            <v-icon color="success" icon="mdi-check-circle" size="large" v-else-if="verificationStep === 'completed'" />
            <v-icon icon="mdi-circle-outline" size="large" v-else />
          </div>
          <div>
            <div class="text-h5 mb-1">欢迎来到 {{ appName }}!</div>
            <div class="text-body-1">快完成了！我们向 {{ email }} 发送了一封激活邮件。请按照邮件中的说明操作来激活您的账户。</div>
          </div>
        </div>

        <div v-if="verificationStep === 'waiting'" class="mb-4">
          <div class="text-body-1 mb-2">如果您没有收到邮件，请检查您的垃圾邮件文件夹。</div>

          <v-btn
            color="primary"
            variant="flat"
            block
            class="mb-3"
            :loading="resendLoading"
            @click="resendVerificationEmail"
            prepend-icon="mdi-email-outline"
          >
            重新发送激活电子邮件
          </v-btn>

          <v-btn
            color="secondary"
            variant="flat"
            block
            @click="showChangeEmailDialog = true"
            prepend-icon="mdi-pencil"
          >
            更改电子邮件地址
          </v-btn>
        </div>

        <div v-if="verificationStep === 'success'" class="text-center my-4">
          <v-icon color="success" icon="mdi-check-circle-outline" size="x-large" class="mb-2" />
          <div class="text-h6 mb-1">邮箱验证成功！</div>
          <div class="text-body-1 mb-4">您的账户已激活，现在可以使用所有功能。</div>
          <v-btn color="primary" variant="flat" to="/app/dashboard">
            开始使用
          </v-btn>
        </div>
      </v-card-text>
    </AuthCard>

    <v-dialog v-model="showChangeEmailDialog" max-width="500px">
      <v-card title="更改电子邮件地址">
        <v-card-text>
          <v-form ref="emailForm" @submit.prevent="changeEmail">
            <v-text-field
              v-model="newEmail"
              label="新的电子邮件地址"
              type="email"
              :rules="emailRules"
              variant="outlined"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" @click="showChangeEmailDialog = false"></v-btn>
          <v-btn
            color="primary"
            text="确认"
            :loading="changeEmailLoading"
            @click="changeEmail"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <LoadingDialog :show="loading" text="请稍候" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingDialog from '@/components/LoadingDialog.vue';
import AuthCard from '@/components/AuthCard.vue';
import AuthService from '@/services/authService';

export default {
  components: {
    AuthCard,
    LoadingDialog
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const emailForm = ref(null);

    // State variables
    const appName = ref('WuyuanDev');
    const email = ref('');
    const token = ref('');
    const loading = ref(false);
    const resendLoading = ref(false);
    const changeEmailLoading = ref(false);
    const showChangeEmailDialog = ref(false);
    const newEmail = ref('');
    const verificationStep = ref('waiting'); // waiting, success, completed

    // Form validation rules
    const emailRules = [
      v => !!v || '请输入电子邮件地址',
      v => /.+@.+\..+/.test(v) || '请输入有效的电子邮件地址'
    ];

    // Initialize state from URL query parameters or localStorage
    onMounted(() => {
      // Check for token in route or localStorage
      token.value = route.query.token || localStorage.getItem('verificationToken');
      email.value = route.query.email || localStorage.getItem('verificationEmail');

      if (token.value) {
        localStorage.setItem('verificationToken', token.value);
      }

      if (email.value) {
        localStorage.setItem('verificationEmail', email.value);
      }

      // Check if the user is coming back after verification
      if (route.query.verified === 'true') {
        verificationStep.value = 'success';
      }
    });

    // Methods
    const resendVerificationEmail = async () => {
      if (!token.value) {
        showErrorToast('无法重新发送验证邮件：缺少验证令牌');
        return;
      }

      resendLoading.value = true;

      try {
        const response = await AuthService.resendVerificationEmail(token.value);

        if (response.status === 'success') {
          // Update token with new one
          token.value = response.temporaryToken;
          localStorage.setItem('verificationToken', token.value);

          showSuccessToast('验证邮件已重新发送，请查收');
        } else {
          showErrorToast(response.message || '发送验证邮件失败');
        }
      } catch (error) {
        console.error('Error resending verification email:', error);
        const errorMessage = error.response?.data?.message || '发送验证邮件时出错，请稍后再试';
        showErrorToast(errorMessage);
      } finally {
        resendLoading.value = false;
      }
    };

    const changeEmail = async () => {
      if (!emailForm.value) return;

      const { valid } = await emailForm.value.validate();
      if (!valid) return;

      changeEmailLoading.value = true;

      try {
        const response = await AuthService.changeRegisterEmail(token.value, newEmail.value);

        if (response.status === 'success') {
          // Update email and token
          email.value = response.email;
          token.value = response.temporaryToken;

          localStorage.setItem('verificationEmail', email.value);
          localStorage.setItem('verificationToken', token.value);

          showChangeEmailDialog.value = false;
          showSuccessToast('邮箱已更改，请查收验证邮件');
        } else {
          showErrorToast(response.message || '更改邮箱失败');
        }
      } catch (error) {
        console.error('Error changing email:', error);
        const errorMessage = error.response?.data?.message || '更改邮箱时出错，请稍后再试';
        showErrorToast(errorMessage);
      } finally {
        changeEmailLoading.value = false;
      }
    };

    const showSuccessToast = (message) => {
      // Try different toast systems
      if (window.$toast) {
        window.$toast.add({
          severity: 'success',
          summary: '成功',
          detail: message,
          life: 3000
        });
      } else if (window.$notify) {
        window.$notify({
          title: '成功',
          message: message,
          type: 'success'
        });
      } else {
        console.log('Success:', message);
        alert(message);
      }
    };

    const showErrorToast = (message) => {
      // Try different toast systems
      if (window.$toast) {
        window.$toast.add({
          severity: 'error',
          summary: '错误',
          detail: message,
          life: 3000
        });
      } else if (window.$notify) {
        window.$notify({
          title: '错误',
          message: message,
          type: 'error'
        });
      } else {
        console.error('Error:', message);
        alert(message);
      }
    };

    return {
      appName,
      email,
      token,
      loading,
      resendLoading,
      changeEmailLoading,
      showChangeEmailDialog,
      newEmail,
      verificationStep,
      emailRules,
      emailForm,
      resendVerificationEmail,
      changeEmail
    };
  }
}
</script>
