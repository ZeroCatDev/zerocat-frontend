<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448" border>
      <v-row>
        <v-col cols="12">
          <v-cardtext>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCatNext！ 👋🏻
            </h5>
            <p class="mb-0">重设密码</p>
          </v-cardtext>
        </v-col></v-row
      >

      <v-cardtext>
        <v-form>
          <v-row>
            <!-- email -->
            <v-col cols="12">
              <v-text-field
                label="密码"
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
            <v-col cols="9">
              <Recaptcha ref="recaptcha" recaptchaId="recaptcha-div" />
            </v-col>
            <!-- password -->
            <v-col cols="12">
              <!-- remember me checkbox
              <div class="d-flex align-center justify-space-between flex-wrap ">
                <VCheckbox disabled label="Remember me" />


              </div>-->

              <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                text="重设密码"
                variant="flat"
                size="large"
                @click="login"
                append-icon="mdi-arrow-right"
              ></v-btn>
              <!-- login button -->
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
              <!-- login button -->
            </v-col>
            <!-- create account -->
          </v-row>
        </v-form>
      </v-cardtext>

    </v-card>
  </div>
  <LoadingDialog :show="loading" text="正在重设密码" />
</template>

<script>
import { localuser } from "@/middleware/userMiddleware";
import request from "../../../axios/axios";
import LoadingDialog from "@/components/LoadingDialog.vue";
import Recaptcha from "@/components/Recaptcha.vue";
import { useHead } from "@unhead/vue";
import { resetPassword } from "@/services/userService";

export default {
  components: { LoadingDialog, Recaptcha },
  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      password: "",
      password2: "",
      show1: ref(false),
      show2: ref(false),

      tryinguser: {},
      loading: false,
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
          if (value != this.password) return "必须与前者相同";
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
    async login() {
      this.loading = true;
      try {
        await this.$nextTick(); // 确保$refs已被正确初始化
        const response = await resetPassword({
          jwttoken: this.$route.query.token,
          captcha: this.$refs.recaptcha.getResponse(),
          pw: this.password,
        });
        this.tryinguser = response.data;
        if (this.tryinguser.message != "OK") {
          this.$toast.add({
            severity: "info",
            summary: "info",
            detail: this.tryinguser.msg || this.tryinguser.message,
            life: 3000,
          });
        } else {
          localuser.setUser(this.tryinguser.token);
          if (this.tryinguser.msg || this.tryinguser.message == "OK") {
            this.$router.push("/");
          }
        }
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: error.message,
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
