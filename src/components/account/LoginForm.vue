<template>
  <v-form>
    <v-row>
      <!-- 登录方式切换 -->
      <v-col cols="12">
        <v-tabs v-model="loginType" class="mb-4">
          <v-tab value="password" variant="text">密码登录</v-tab>
          <v-tab value="code" variant="text">验证码登录</v-tab>
          <v-tab value="magiclink" variant="text">魔术链接登录</v-tab>
        </v-tabs>

        <v-text-field
          label="邮箱"
          type="text"
          v-model="email"
          variant="outlined"
          :rules="emailRules"
        ></v-text-field>

        <!-- 密码登录 -->
        <v-text-field
          v-if="loginType === 'password'"
          label="密码"
          v-model="password"
          variant="outlined"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <!-- 验证码登录 -->
        <template v-if="loginType === 'code'">
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
            {{ countdown > 0 ? `${countdown}秒后重新发送` : "发送验证码" }}
          </v-btn>
        </template>
      </v-col>

      <v-col cols="12">
        <Recaptcha
          ref="recaptcha"
          recaptchaId="recaptcha-div"
          :showNormal="true"
          @bindVerified="handleBindVerified"
          @bindError="handleBindError"
          @bindClose="handleBindClose"
        />
      </v-col>

      <v-col cols="12">
        <v-btn
          class="text-none"
          color="primary"
          rounded="xl"
          :text="getLoginButtonText()"
          variant="flat"
          size="large"
          @click="handleLoginAction"
          append-icon="mdi-arrow-right"
          :loading="loading"
        ></v-btn>
      </v-col>

      <v-col cols="12" v-if="showLinks">
        <v-btn
          class="text-none"
          color="white"
          rounded="xl"
          text="注册"
          variant="text"
          size="large"
          append-icon="mdi-arrow-right"
          to="/app/account/register"
          @click="handleClose"
        ></v-btn>
        <v-btn
          class="text-none"
          color="white"
          rounded="xl"
          text="找回密码"
          variant="text"
          size="large"
          append-icon="mdi-arrow-right"
          to="/app/account/retrieve"
          @click="handleClose"
        ></v-btn>
      </v-col>
      <v-col cols="12" v-if="showOAuth">
        <OAuthButtons mode="login" divider-text="或使用以下方式登录" />
      </v-col>
    </v-row>
  </v-form>
  <LoadingDialog :show="loading" text="登录中" />
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { localuser } from "@/services/localAccount";
import AuthService from "@/services/authService";
import LoadingDialog from "@/components/LoadingDialog.vue";
import Recaptcha from "@/components/Recaptcha.vue";
import OAuthButtons from "@/components/account/OAuthButtons.vue";

export default {
  name: "LoginForm",
  components: { LoadingDialog, Recaptcha, OAuthButtons },
  props: {
    showLinks: {
      type: Boolean,
      default: true
    },
    showOAuth: {
      type: Boolean,
      default: true
    },
    redirectPath: {
      type: String,
      default: "/app/dashboard"
    }
  },
  emits: ["login-success", "login-error", "close"],

  setup(props, { emit }) {
    const router = useRouter();

    // State variables
    const email = ref("");
    const password = ref("");
    const verificationCode = ref("");
    const loginType = ref("password");
    const countdown = ref(0);
    const loading = ref(false);
    const showPassword = ref(false);
    const recaptcha = ref(null);
    const magicLinkSent = ref(false);

    // Validation rules
    const rules = {
      required: (value) => !!value || "此字段为必填项",
      length: (value) => value?.length === 6 || "验证码必须是6位数字",
    };

    const emailRules = [
      (value) => !!value || "必须填写邮箱",
      (value) => /.+@.+\..+/.test(value) || "不符合格式",
    ];

    const passwordRules = [
      (value) => !!value || "必须填写密码",
    ];

    // Methods
    const handleClose = () => {
      emit('close');
    };

    const getLoginButtonText = () => {
      if (loginType.value === "password") return "登录";
      if (loginType.value === "code") {
        return verificationCode.value ? "登录" : "发送验证码";
      }
      if (loginType.value === "magiclink") {
        return magicLinkSent.value ? "已发送，请检查邮箱" : "发送登录链接";
      }
      return "登录";
    };

    const handleLoginAction = async () => {
      switch (loginType.value) {
        case "password":
          await loginWithPassword();
          break;
        case "code":
          if (verificationCode.value) {
            await loginWithCode();
          } else {
            await sendVerificationCode();
          }
          break;
        case "magiclink":
          await sendMagicLink();
          break;
      }
    };

    const loginWithPassword = async () => {
      if (!email.value || !password.value) {
        showErrorToast("请输入邮箱和密码");
        return;
      }

      loading.value = true;
      try {
        const captcha = recaptcha.value?.getResponse() || null;
        const response = await AuthService.loginWithPassword(
          email.value,
          password.value,
          captcha
        );

        handleLoginResponse(response);
      } catch (error) {
        handleError(error);
      } finally {
        loading.value = false;
      }
    };

    const loginWithCode = async () => {
      if (!email.value || !verificationCode.value) {
        showErrorToast("请输入邮箱和验证码");
        return;
      }

      loading.value = true;
      try {
        const response = await AuthService.loginWithCode(
          email.value,
          verificationCode.value
        );

        handleLoginResponse(response);
      } catch (error) {
        handleError(error);
      } finally {
        loading.value = false;
      }
    };

    const sendVerificationCode = async () => {
      if (countdown.value > 0) return;

      if (!email.value || !/.+@.+\..+/.test(email.value)) {
        showErrorToast("请输入正确的邮箱地址");
        return;
      }

      loading.value = true;
      try {
        const captcha = recaptcha.value?.getResponse() || null;
        const response = await AuthService.sendLoginCode(email.value, captcha);

        if (response.status === "success") {
          showSuccessToast("验证码已发送");
          startCountdown();
        } else {
          showErrorToast(response.message);
        }
      } catch (error) {
        handleError(error);
      } finally {
        loading.value = false;
      }
    };

    const sendMagicLink = async () => {
      if (magicLinkSent.value) return;

      if (!email.value || !/.+@.+\..+/.test(email.value)) {
        showErrorToast("请输入正确的邮箱地址");
        return;
      }

      loading.value = true;
      try {
        const captcha = recaptcha.value?.getResponse() || null;
        if (!captcha) {
          showErrorToast("请完成人机验证");
          loading.value = false;
          return;
        }

        const response = await AuthService.generateMagicLink(
          email.value,
          window.location.origin + '/app/account/magiclink/validate',
          captcha
        );

        if (response.status === "success") {
          showSuccessToast("登录链接已发送到您的邮箱");
          magicLinkSent.value = true;
        } else {
          showErrorToast(response.message);
        }
      } catch (error) {
        handleError(error);
      } finally {
        loading.value = false;
      }
    };

    const handleLoginResponse = (response) => {
      if (response.status === "success") {
        showSuccessToast("登录成功，欢迎回来，" + response.display_name);
        emit('login-success', response);
        setTimeout(() => {
          router.push(props.redirectPath);
        }, 1000);
      } else {
        showErrorToast(response.message);
        emit('login-error', response);
      }
    };

    const handleError = (error) => {
      const message = error.response?.data?.message || error.message;
      showErrorToast(message);
      emit('login-error', { message });
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

    const startCountdown = () => {
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    };

    // ReCAPTCHA handlers
    const handleBindVerified = (response) => {
      if (loginType.value === "code" && !verificationCode.value) {
        sendVerificationCode();
      }
    };

    const handleBindError = () => {
      showErrorToast("验证失败，请重试");
    };

    const handleBindClose = () => {
      // Handle close
    };

    // Reset verification code when login type changes
    watch(loginType, (newValue) => {
      verificationCode.value = "";
      magicLinkSent.value = false;

      setTimeout(() => {
        if (recaptcha.value) {
          recaptcha.value.resetCaptcha();
        }
      }, 100);
    });

    return {
      email,
      password,
      verificationCode,
      loginType,
      countdown,
      loading,
      showPassword,
      rules,
      emailRules,
      passwordRules,
      recaptcha,
      magicLinkSent,
      getLoginButtonText,
      handleLoginAction,
      loginWithPassword,
      loginWithCode,
      sendVerificationCode,
      sendMagicLink,
      handleBindVerified,
      handleBindError,
      handleBindClose,
      handleClose, // Add this to the returned object
    };
  },
};
</script>