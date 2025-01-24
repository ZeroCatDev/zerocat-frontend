<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <v-card class="auth-card pa-4 pt-7" max-width="448" border>
      <v-row>
        <v-col cols="12">
          <v-cardtext>
            <h5 class="text-h5 font-weight-semibold mb-1">
              欢迎来到ZeroCatNext！ 👋🏻
            </h5>
            <p class="mb-0">创建你的账户</p>
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
                type="email"
                v-model="email"
                variant="outlined"
                required
                :rules="emailRules"
              >
              </v-text-field>
              <v-text-field
                label="用户名"
                type="text"
                v-model="username"
                variant="outlined"
                required
                :rules="usernameRules"
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

              <v-dialog persistent>
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    class="text-none"
                    color="primary"
                    rounded="xl"
                    text="注册"
                    variant="flat"
                    size="large"
                    append-icon="mdi-arrow-right"
                  ></v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card
                    title="您正在使用由厚浪(及孙悟元)提供的服务
"
                  >
                    <v-card-text>
                      我们可能会收集您的个人信息,具体参见
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <a
                            href="https://wuyuan.dev/privacy-policy/privacy-policy.html"
                            target="_blank"
                            v-bind="props"
                            @click.stop
                          >
                            隐私策略
                          </a>
                        </template>
                        孙悟元网站与服务隐私策略
                      </v-tooltip>
                      <v-checkbox v-model="agreement.privacy">
                        <template v-slot:label>
                          <div>我已阅读并同意隐私策略</div>
                        </template> </v-checkbox
                      >我们将在中国大陆安全的存储您的数据，我们暂不提供自助删除您的个人数据，如果您希望删除您的数据，您需要优先选择联系我们
                      <v-checkbox v-model="agreement.datadelete">
                        <template v-slot:label>
                          <div>
                            我理解并同意我无法自助删除我的个人数据，在需要时我会主动联系管理员删除
                          </div>
                        </template>
                      </v-checkbox>
                      在 ZeroCatNext 上,你需要遵守
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <a
                            href="https://scratch.mit.edu/community_guidelines"
                            target="_blank"
                            v-bind="props"
                            @click.stop
                          >
                            社区行为准则(第三方站点)
                          </a>
                        </template>
                        你的当前地区可能无法访问此网站
                      </v-tooltip>
                      <v-checkbox v-model="agreement.rules">
                        <template v-slot:label>
                          <div>我已阅读并同意将会遵守社区行为准则</div>
                        </template>
                      </v-checkbox>
                      你需要同意<v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <a
                            href="https://wuyuan.dev/privacy-policy/terms-of-service.html"
                            target="_blank"
                            v-bind="props"
                            @click.stop
                          >
                            用户协议
                          </a>
                        </template>
                        孙悟元网站与服务用户协议
                      </v-tooltip>
                      <v-checkbox v-model="agreement.terms">
                        <template v-slot:label>
                          <div>我已阅读并同意用户协议</div>
                        </template>
                      </v-checkbox>
                      <v-btn
                        class="text-none"
                        color="primary"
                        rounded="xl"
                        text="注册"
                        variant="flat"
                        size="large"
                        @click="register"
                        append-icon="mdi-arrow-right"
                      ></v-btn>
                      <br />
                      <br />
                      对于技术手段绕过此页面的行为视为对 ZeroCat
                      的基础设施进行攻击，涉嫌非法入侵计算机系统，我们将保留追究法律责任的权利，违规获得的账户不被授权访问网站，账户将不受保护，如果您同意以上内容，请点击“复选框”以完成注册流程.
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text="取消"
                        @click="
                          isActive.value = false;
                          agreement = {
                            privacy: false,
                            terms: false,
                            rules: false,
                            datadelete: false,
                          };
                        "
                      ></v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
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
          </v-row>
        </v-form>
      </v-cardtext>

    </v-card>
  </div>

  <LoadingDialog :show="loading" text="正在注册" />
</template>

<script>
import { localuser } from "@/stores/user";
import { registerUser } from "@/services/userService";
import LoadingDialog from "@/components/LoadingDialog.vue";
import Recaptcha from "@/components/Recaptcha.vue";
import { useHead } from "@unhead/vue";

export default {
  components: { LoadingDialog, Recaptcha },

  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      email: "",
      username: "",
      tryinguser: {},
      loading: false,
      agreement: {
        privacy: false,
        terms: false,
        rules: false,
        datadelete: false,
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
      title: "注册",
    });
  },
  methods: {
    async register() {
      for (const key in this.agreement) {
        if (this.agreement[key] === false) {
          this.$toast.add({
            severity: "info",
            summary: "info",
            detail: "请先阅读并同意有关协议",
            life: 3000,
          });
          return;
        }
      }

      this.loading = true;
      try {
        const response = await registerUser({
          captcha: this.$refs.recaptcha.getResponse(),
          un: this.email,
          pw: this.username,
        });
        this.tryinguser = response.data;
        if (this.tryinguser.status == "success") {
          this.$toast.add({
            severity: "success",
            summary: "注册成功",
            detail: this.tryinguser.message,
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "info",
            summary: "info",
            detail: this.tryinguser.msg || this.tryinguser.message,
            life: 3000,
          });
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
