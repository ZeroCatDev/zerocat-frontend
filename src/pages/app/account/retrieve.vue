<template>
  <div>
    <AuthCard subtitle="重设密码">
      <v-form @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="邮箱"
              type="text"
              v-model="email"
              variant="outlined"
              :rules="emailRules"
              :disabled="step > 1"
            ></v-text-field>
          </v-col>

          <!-- 验证码输入 -->
          <v-col cols="12" v-if="step >= 2">
            <v-text-field
              v-model="verificationCode"
              label="验证码"
              variant="outlined"
              maxlength="6"
              :rules="[rules.required, rules.length]"
            ></v-text-field>
            <v-btn
              class="mb-4"
              variant="text"
              @click="sendVerificationCode"
              :disabled="countdown > 0"
            >
              {{ countdown > 0 ? `${countdown}秒后重新发送` : "重新发送验证码" }}
            </v-btn>
          </v-col>

          <!-- 密码输入 -->
          <v-col cols="12" v-if="step >= 2">
            <v-text-field
              label="新密码"
              v-model="password"
              variant="outlined"
              :rules="passwordRules"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field
              label="确认密码"
              v-model="confirmPassword"
              variant="outlined"
              :rules="confirmPasswordRules"
              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showConfirmPassword ? 'text' : 'password'"
              @click:append="showConfirmPassword = !showConfirmPassword"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-btn
              class="text-none"
              color="primary"
              rounded="xl"
              :text="step === 1 ? '获取验证码' : '重设密码'"
              variant="flat"
              size="large"
              @click="step === 1 ? sendVerificationCode() : resetPassword()"
              append-icon="mdi-arrow-right"
              :loading="loading"
            ></v-btn>
          </v-col>

          <v-col cols="12">
            <v-btn
              class="text-none"
              color="white"
              rounded="xl"
              text="登录"
              variant="text"
              size="large"
              append-icon="mdi-arrow-right"
              to="/app/account/login"
            ></v-btn>
            <v-btn
              class="text-none"
              color="white"
              rounded="xl"
              text="注册"
              variant="text"
              size="large"
              append-icon="mdi-arrow-right"
              to="/app/account/register"
            ></v-btn>
          </v-col>
        </v-row>
      </v-form>
    </AuthCard>
    <LoadingDialog :show="loading" :text="loadingText" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { localuser } from "@/services/localAccount";
import AuthService from "@/services/authService";
import LoadingDialog from "@/components/LoadingDialog.vue";
import AuthCard from "@/components/AuthCard.vue";
import { useHead } from "@unhead/vue";

export default {
  components: { LoadingDialog, AuthCard },

  setup() {
    const router = useRouter();

    // State variables
    const email = ref("");
    const verificationCode = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const step = ref(1);
    const loading = ref(false);
    const countdown = ref(0);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const loadingText = ref("处理中...");

    // Validation rules
    const rules = {
      required: (value) => !!value || "此字段为必填项",
      length: (value) => value?.length === 6 || "验证码必须是6位数字",
    };

    const emailRules = [
      (v) => !!v || "必须填写邮箱",
      (v) => /.+@.+\..+/.test(v) || "不符合格式",
    ];

    const passwordRules = [
      (v) => !!v || "必须填写密码",
      (v) => v.length >= 8 || "密码至少需要8个字符",
      (v) => /[A-Za-z]/.test(v) && /[0-9]/.test(v) || "密码必须包含字母和数字",
    ];

    const confirmPasswordRules = computed(() => [
      (v) => !!v || "必须确认密码",
      (v) => v === password.value || "两次输入的密码不一致",
    ]);

    // Check if user is already logged in
    if (localuser.isLogin.value === true) {
      router.push("/app/explore");
    }

    // Set page title
    useHead({
      title: "重设密码",
    });

    const sendVerificationCode = async () => {
      if (countdown.value > 0) return;

      if (!email.value || !/.+@.+\..+/.test(email.value)) {
        showErrorToast("请输入正确的邮箱地址");
        return;
      }

      loading.value = true;
      loadingText.value = "正在发送验证码...";

      try {
        const response = await AuthService.sendPasswordResetCode(email.value);

        if (response.status === "success") {
          showSuccessToast("验证码已发送到您的邮箱");
          step.value = 2; // Move to next step
          startCountdown();
        } else {
          showErrorToast(response.message || "发送验证码失败");
        }
      } catch (error) {
        showErrorToast(error.response?.data?.message || "发送验证码失败");
      } finally {
        loading.value = false;
      }
    };

    const resetPassword = async () => {
      if (!verificationCode.value || verificationCode.value.length !== 6) {
        showErrorToast("请输入6位验证码");
        return;
      }

      if (!password.value || password.value !== confirmPassword.value) {
        showErrorToast("请确保输入了密码且两次输入一致");
        return;
      }

      loading.value = true;
      loadingText.value = "正在重设密码...";

      try {
        const response = await AuthService.resetPasswordWithCode(
          email.value,
          verificationCode.value,
          password.value
        );

        if (response.status === "success") {
          showSuccessToast("密码重置成功，请使用新密码登录");
          setTimeout(() => {
            router.push("/app/account/login");
          }, 2000);
        } else {
          showErrorToast(response.message || "重置密码失败");
        }
      } catch (error) {
        showErrorToast(error.response?.data?.message || "重置密码失败");
      } finally {
        loading.value = false;
      }
    };

    const startCountdown = () => {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    };

    const showSuccessToast = (message) => {
      // Using PrimeVue toast
      this?.$toast?.add({
        severity: "success",
        summary: "成功",
        detail: message,
        life: 3000,
      });
    };

    const showErrorToast = (message) => {
      // Using PrimeVue toast
      this?.$toast?.add({
        severity: "error",
        summary: "错误",
        detail: message,
        life: 3000,
      });
    };

    return {
      email,
      verificationCode,
      password,
      confirmPassword,
      step,
      loading,
      countdown,
      showPassword,
      showConfirmPassword,
      loadingText,
      rules,
      emailRules,
      passwordRules,
      confirmPasswordRules,
      sendVerificationCode,
      resetPassword,
    };
  },
};
</script>
