<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448" border>
      <v-row>
        <v-col cols="12">
          <v-cardtext>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCatNext！ 👋🏻
            </h5>
            <p class="mb-0">找回密码</p>
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
                v-model="email"
                variant="outlined"
                :rules="emailRules"
              ></v-text-field>
            </v-col>
            <v-col cols="9">
              <div id="recaptcha-div"></div>
            </v-col>
            <v-col cols="3">
              <v-btn @click="resetCaptcha()" variant="text">刷新</v-btn>
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
                text="找回密码"
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
                to="/account/login"
              ></v-btn>
              <!-- login button -->
              <v-btn
                class="text-none"
                color="white"
                rounded="xl"
                text="注册"
                variant="text"
                size="large"
                append-icon="mdi-arrow-right"
                to="/account/register"
              ></v-btn>
              <!-- login button -->
            </v-col>
            <!-- create account -->
          </v-row>
        </v-form>
      </v-cardtext>
      <!--<v-card
        class="mx-auto bg-surface-light"
        :href="BASE_API + '/user/login?redirect=new'"
      >
        <template v-slot:prepend>
          <v-icon icon="mdi-web"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon icon="mdi-arrow-right-circle"></v-icon>
        </template>
        <template v-slot:title> <span>在 ZeroCat 完成登录</span> </template
        ><template v-slot:subtitle>
          <span>您将在 {{ BASE_API }} 完成登录</span>
        </template>
      </v-card>-->
    </v-card>
  </div>
  <LoadingDialog :show="loading" text="正在发送邮件" />
</template>

<script>
import { localuser } from "@/stores/user";
import request from "../../axios/axios";
import LoadingDialog from "@/components/LoadingDialog.vue";
import "https://static.geetest.com/v4/gt4.js";
import {
  initRecaptcha,
  getResponse,
  resetCaptcha,
} from "../../stores/useRecaptcha";
import { useHead } from "@unhead/vue";
export default {
  components: { LoadingDialog },
  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      email: "",
      tryinguser: {},
      loading: false,
      initRecaptcha,
      getResponse,
      resetCaptcha,
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
    initRecaptcha("recaptcha-div", "popup");
  },
  setup() {
    useHead({
      title: "找回密码",
    });
  },
  methods: {
    async login() {
      this.loading = true;
      this.tryinguser = await request({
        url: "/account/repw",
        method: "post",
        data: {
          captcha: getResponse(),
          un: this.email,
        },
      });
      if (this.tryinguser.message != "OK") {
        this.loading = false;
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: this.tryinguser.msg || this.tryinguser.message,
          life: 3000,
        });
        return;
      }
      this.loading = false;

      //this.$toast.add({ severity: 'info', summary: 'info', detail: this.tryinguser.msg||this.tryinguser.message, life: 3000 });
      localuser.setuser(this.tryinguser.token);
      console.log(this.tryinguser);
      if (this.tryinguser.msg || this.tryinguser.message == "OK") {
        this.$router.push("/");
      }
    },
    addtoast(text) {
      this.$toast.add({
        severity: "info",
        summary: "info",
        detail: text,
        life: 3000,
      });
    },
  },
};
</script>
