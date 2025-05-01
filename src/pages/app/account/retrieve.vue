<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448" border rounded="lg">
      <v-row>
        <v-col cols="12">
          <v-cardtext>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCat！ 👋🏻
            </h5>
            <p class="mb-0">重设密码</p>
          </v-cardtext>
        </v-col>
      </v-row>

      <v-cardtext>
        <v-form>
          <v-row>
            <!-- email -->
            <v-col cols="12">
              <v-text-field
                label="邮箱"
                type="text"
                v-model="email"
                variant="outlined"
                :rules="emailRules"
              ></v-text-field>
            </v-col>

            <!-- verification code -->
            <v-col cols="12" v-if="showVerificationInput">
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
                {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
              </v-btn>
            </v-col>

            <!-- password fields -->
            <v-col cols="12">
              <v-text-field
                label="新密码"
                v-model="password"
                variant="outlined"
                :rules="passwordRules"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
              >
              </v-text-field>
              <v-text-field
                label="确认密码"
                v-model="password2"
                variant="outlined"
                :rules="password2Rules"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show2 ? 'text' : 'password'"
                @click:append="show2 = !show2"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                :text="showVerificationInput ? '确认重设' : '获取验证码'"
                variant="flat"
                size="large"
                @click="showVerificationInput ? handleResetPassword() : startResetPassword()"
                append-icon="mdi-arrow-right"
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
      </v-cardtext>
    </v-card>
  </div>
  <LoadingDialog :show="loading" :message="loadingText" />
</template>

<script>
import { ref } from 'vue';
import { localuser } from "@/services/localAccount";
import LoadingDialog from "@/components/LoadingDialog.vue";
import { useHead } from "@unhead/vue";
import axios from '@/axios/axios';

export default {
  components: { LoadingDialog },
  data() {
    return {
      email: "",
      password: "",
      password2: "",
      show1: false,
      show2: false,
      loading: false,
      loadingText: "正在处理...",
      showVerificationInput: false,
      verificationCode: "",
      countdown: 0,
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
      passwordRules: [
        (value) => {
          if (value) return true;
          return "必须填写密码";
        },
      ],
      password2Rules: [
        (value) => {
          if (value) return true;
          return "必须填写密码";
        },
        (value) => {
          if (value === this.password) return true;
          return "必须与前者相同";
        },
      ],
    };
  },

  created() {
    if (localuser.isLogin.value == true) {
      this.$router.push("/");
    }
  },

  setup() {
    useHead({
      title: "重设密码",
    });
  },

  methods: {
    startResetPassword() {
      if (!this.email || !this.password || !this.password2) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "请填写所有必填字段",
          life: 3000,
        });
        return;
      }
      if (this.password !== this.password2) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "两次输入的密码不一致",
          life: 3000,
        });
        return;
      }
      this.sendVerificationCode();
      this.showVerificationInput = true;
    },

    async sendVerificationCode() {
      if (this.countdown > 0) return;

      this.loading = true;
      this.loadingText = "正在发送验证码...";
      try {
        const response = await axios.post('/account/retrievePassword', {
          email: this.email
        });

        if (response.data.status === 'success') {
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
            detail: response.data.message,
            life: 3000,
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: error.response?.data?.message || "发送验证码失败",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
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

    async handleResetPassword() {
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
      this.loadingText = "正在重设密码...";
      try {
        const response = await axios.post('/account/reset-password', {
          email: this.email,
          verificationCode: this.verificationCode,
          newPassword: this.password
        });

        if (response.data.status === 'success') {
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "密码重置成功",
            life: 3000,
          });
          this.$router.push("/app/account/login");
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: response.data.message,
            life: 3000,
          });
        }
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: error.response?.data?.message || "重置密码失败",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
