<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448" border rounded="lg">
      <v-row>
        <v-col cols="12">
          <v-cardtext>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCatNext！ 👋🏻
            </h5>
            <p class="mb-0">登录你的账户</p>
          </v-cardtext>
        </v-col>
      </v-row>

      <v-cardtext>
        <v-form>
          <v-row>
            <!-- 登录方式切换 -->
            <v-col cols="12">
              <v-btn-toggle v-model="loginType" mandatory color="primary" rounded="lg" class="mb-4">
                <v-btn value="password" variant="text">密码登录</v-btn>
                <v-btn value="code" variant="text">验证码登录</v-btn>
              </v-btn-toggle>
            </v-col>

            <!-- email -->
            <v-col cols="12">
              <v-text-field label="邮箱" type="text" v-model="username" variant="outlined"
                :rules="emailRules"></v-text-field>

              <!-- 密码登录 -->
              <v-text-field v-if="loginType === 'password'" label="密码" v-model="password" variant="outlined"
                :rules="usernameRules" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'" @click:append="show1 = !show1"></v-text-field>

              <!-- 验证码登录 -->
              <template v-else>
                <v-text-field v-model="verificationCode" label="验证码" variant="outlined" maxlength="6"
                  :rules="[rules.required, rules.length]"></v-text-field>
                <v-btn class="mb-4" variant="text" @click="sendVerificationCode" :disabled="countdown > 0">
                  {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
                </v-btn>
              </template>
            </v-col>

            <v-col cols="9">
              <Recaptcha ref="recaptcha" recaptchaId="recaptcha-div" :showNormal="loginType === 'password'"
                @bindVerified="handleBindVerified" @bindError="handleBindError" @bindClose="handleBindClose" />
            </v-col>

            <v-col cols="12">
              <v-btn class="text-none" color="primary" rounded="xl" text="登录" variant="flat" size="large"
                @click="handleLogin" append-icon="mdi-arrow-right"></v-btn>
            </v-col>

            <v-col cols="12">
              <v-btn class="text-none" color="white" rounded="xl" text="注册" variant="text" size="large"
                append-icon="mdi-arrow-right" to="/app/account/register"></v-btn>
              <v-btn class="text-none" color="white" rounded="xl" text="找回密码" variant="text" size="large"
                append-icon="mdi-arrow-right" to="/app/account/retrieve"></v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-cardtext>
    </v-card>
  </div>
  <LoadingDialog :show="loading" text="登录中" />
</template>

<script>
import { localuser } from "@/services/localAccount";
import request from "../../../axios/axios";
import LoadingDialog from "@/components/LoadingDialog.vue";
import Recaptcha from "@/components/Recaptcha.vue";
import { useHead } from "@unhead/vue";
import { loginUser } from "@/services/accountService";
import { ref } from "vue";

export default {
  components: { LoadingDialog, Recaptcha },

  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      username: "",
      password: "",
      verificationCode: "",
      loginType: "password",
      countdown: 0,
      tryinguser: {},
      loading: false,
      localuser,
      show1: ref(false),
      rules: {
        required: value => !!value || '此字段为必填项',
        length: value => value?.length === 6 || '验证码必须是6位数字'
      },
      emailRules: [
        (value) => {
          if (value) return true;
          return "必须填写邮箱";
        },
        (value) => {
          if (/.+@.+\..+/.test(value)) return true;
          return "不符合格式";
        },
      ],
      usernameRules: [
        (value) => {
          if (value) return true;
          return "必须填写密码";
        },
      ],
    };
  },

  created() {
    if (localuser.isLogin.value === true) {
      this.$router.push("/");
    }
  },

  setup() {
    useHead({
      title: "登录",
    });
  },

  methods: {
    async handleLogin() {
      if (this.loginType === 'password') {
        await this.loginWithPassword();
      } else {
        await this.loginWithCode();
      }
    },

    async loginWithPassword() {
      this.loading = true;
      try {
        const response = await loginUser({
          captcha: this.$refs.recaptcha.getResponse(),
          un: this.username,
          pw: this.password,
        });
        this.handleLoginResponse(response);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async loginWithCode() {
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "请输入6位验证码",
          life: 3000,
        });
        return;
      }

      this.loading = true;
      try {
        const response = await request.post('/account/login-with-code', {
          email: this.username,
          code: this.verificationCode,
        });
        this.handleLoginResponse(response);
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async sendVerificationCode() {
      if (this.countdown > 0) return;

      if (!this.username || !/.+@.+\..+/.test(this.username)) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "请输入正确的邮箱地址",
          life: 3000,
        });
        return;
      }

      // 显示验证码
      this.$refs.recaptcha.showBindCaptcha();
    },

    async handleBindVerified(response) {
      this.loading = true;
      try {
        const apiResponse = await request.post('/account/send-login-code', {
          email: this.username,
          captcha: response,
        });

        if (apiResponse.data.status === 'success') {
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "验证码已发送",
            life: 3000,
          });
          this.startCountdown();
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: apiResponse.data.message,
            life: 3000,
          });
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    handleBindError() {
      this.$toast.add({
        severity: "error",
        summary: "错误",
        detail: "验证失败，请重试",
        life: 3000,
      });
    },

    handleBindClose() {
      // 可以添加关闭验证码弹窗的处理逻辑
    },

    startCountdown() {
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },

    async handleLoginResponse(response) {
      this.tryinguser = response.data;
      if (this.tryinguser.status === "success") {
        await localuser.setUser(this.tryinguser.token);
        this.$router.push("/");

      } else {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: this.tryinguser.message,
          life: 3000,
        });
      }
    },

    handleError(error) {
      this.$toast.add({
        severity: "error",
        summary: "错误",
        detail: error.response?.data?.message || error.message,
        life: 3000,
      });
    },
  },
};
</script>
