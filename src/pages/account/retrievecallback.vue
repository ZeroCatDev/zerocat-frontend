<template>




  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">

      <v-row>
        <v-col cols="12">
          <VCardText>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCatNext！ 👋🏻
            </h5>
            <p class="mb-0">
              重设密码 </p>
          </VCardText>
        </v-col></v-row>


      <VCardText>
        <VForm>
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField label="密码"  v-model='password' variant="outlined" :rules="passwordRules"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              >
              </VTextField>
              <VTextField label="确认密码"  v-model='password2' variant="outlined" :rules="password2Rules"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2">
              </VTextField>

            </VCol>
            <VCol cols="9">
              <div id="recaptcha-div"></div>
            </VCol>
            <VCol cols="3"> <v-btn @click="resetCaptcha()" variant="text">刷新</v-btn> </VCol>
            <!-- password -->
            <VCol cols="12">

              <!-- remember me checkbox
              <div class="d-flex align-center justify-space-between flex-wrap ">
                <VCheckbox disabled label="Remember me" />


              </div>-->

              <v-btn class="text-none" color="primary" rounded="xl" text="重设密码" variant="flat" size="large"
                @click="login" append-icon="mdi-arrow-right"></v-btn> <!-- login button -->

            </VCol>
            <VCol cols="12">

              <v-btn class="text-none" color="white" rounded="xl" text="登录" variant="text" size="large"
                append-icon="mdi-arrow-right" to="/account/login"></v-btn> <!-- login button -->

            </VCol>
            <!-- create account -->



          </VRow>
        </VForm>
      </VCardText> <v-card class="mx-auto bg-surface-light" :href="BASE_API + '/user/login?redirect=new'">
        <template v-slot:prepend>
          <v-icon icon="mdi-web"></v-icon>
        </template>
        <template v-slot:append>
          <v-icon icon="mdi-arrow-right-circle"></v-icon>
        </template>
        <template v-slot:title>

          <span>在 ZeroCat 完成登录</span> </template><template v-slot:subtitle>
          <span>您将在 {{ BASE_API }} 完成登录</span> </template>
      </v-card>
    </VCard>
  </div>
  <LoadingDialog :show="loading" text='正在重设密码' />

</template>

<script>
import { localuser } from '@/stores/user';
import request from "../../axios/axios";
import LoadingDialog from '@/components/LoadingDialog.vue';
import 'https://static.geetest.com/v4/gt4.js'
import { initRecaptcha, getResponse, resetCaptcha } from '../../stores/useRecaptcha';

export default {
  components: { LoadingDialog },
  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      password: '',
      password2: '',
      show1 : ref(false),
      show2 : ref(false),

      tryinguser: {},
      loading: false,
      initRecaptcha,
      getResponse,
      resetCaptcha,
      emailRules: [
        value => {
          if (value) return true

          return '必须填写邮箱'
        },
        value => {
          if (/.+@.+\..+/.test(value)) return true

          return '不符合格式'
        },
      ],
      passwordRules: [
        value => {
          if (value) return true

          return '必须填写密码'
        },

      ],
      password2Rules: [
        value => {
          if (value) return true

          return '必须填写密码'
        },
        value => {
          if (value != this.password)

          return '必须与前者相同'
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
    initRecaptcha('recaptcha-div');
  },
  methods: {

    async login() {
      this.loading = true
      this.tryinguser = await request({
        url: '/account/torepw',
        method: 'post',
        data: {
          "jwttoken": this.$route.query.token,
          "captcha": getResponse(),
          "pw": this.password,
        }
      })
      if (this.tryinguser.message != 'OK') {
        this.loading = false
        this.$toast.add({ severity: 'info', summary: 'info', detail: this.tryinguser.msg || this.tryinguser.message, life: 3000 });
        return
      }
      this.loading = false

      //this.$toast.add({ severity: 'info', summary: 'info', detail: this.tryinguser.msg||this.tryinguser.message, life: 3000 });
      localuser.setuser(this.tryinguser.token)
      console.log(this.tryinguser)
      if (this.tryinguser.msg || this.tryinguser.message == 'OK') {
        this.$router.push("/");
      }
    },
    addtoast(text) {
      this.$toast.add({ severity: 'info', summary: 'info', detail: text, life: 3000 });
    }
  }

};
</script>
