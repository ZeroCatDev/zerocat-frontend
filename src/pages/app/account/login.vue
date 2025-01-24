<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448" border>
      <v-row>
        <v-col cols="12">
          <v-cardtext>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCatNext！ 👋🏻
            </h5>
            <p class="mb-0">登录你的账户</p>
          </v-cardtext>
        </v-col></v-row
      >

      <v-cardtext>
        <v-form>
          <v-row>
            <!-- email -->
            <v-col cols="12">
              <v-text-field
                label="邮箱"
                type="text"
                v-model="username"
                variant="outlined"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                label="密码"
                v-model="password"
                variant="outlined"
                :rules="usernameRules"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
              ></v-text-field>
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
                text="登录"
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
                text="注册"
                variant="text"
                size="large"
                append-icon="mdi-arrow-right"
                to="/app/account/register"
              ></v-btn>
              <v-btn
                class="text-none"
                color="white"
                rounded="xl"
                text="邮箱验证登录"
                variant="text"
                size="large"
                append-icon="mdi-arrow-right"
                to="/app/account/magiclink"
              ></v-btn>
              <!-- login button -->
              <v-btn
                class="text-none"
                color="white"
                rounded="xl"
                text="找回密码"
                variant="text"
                size="large"
                append-icon="mdi-arrow-right"
                to="/app/account/retrieve"
              ></v-btn>
              <!-- login button -->
            </v-col>
            <!-- create account -->
          </v-row>
        </v-form>
      </v-cardtext>

    </v-card>
  </div>
  <LoadingDialog :show="loading" text="登录中" />
</template>

<script>
import { localuser } from "@/stores/user";
import request from "../../../axios/axios";
import LoadingDialog from "@/components/LoadingDialog.vue";
import Recaptcha from "@/components/Recaptcha.vue";
import { useHead } from "@unhead/vue";
import { loginUser } from "@/services/userService";

export default {
  components: { LoadingDialog, Recaptcha },

  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      username: "",
      password: "",
      tryinguser: {},
      loading: false,
      localuser: localuser,
      show1: ref(false),
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

          return "必须填写用户名";
        },
      ],
    };
  },

  created() {
    if (localuser.islogin.value == true) {
      this.$router.push("/");
    }
  },

  setup() {
    useHead({
      title: "登录",
    });
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const response = await loginUser({
          captcha: this.$refs.recaptcha.getResponse(),
          un: this.username,
          pw: this.password,
        });
        this.tryinguser = response.data;
        if (this.tryinguser.message == "error") {
          this.$toast.add({
            severity: "info",
            summary: "info",
            detail: this.tryinguser.message,
            life: 3000,
          });
        } else {
          localuser.setuser(this.tryinguser.token);
          if (localuser.islogin.value) {
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
