<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <!-- User Profile Card -->
        <v-card hover class="mb-6 elevation-2" :disabled="userCardLoading" :loading="userCardLoading">
          <v-row no-gutters align="center">
            <v-col cols="12" sm="4" md="3" class="pa-4 text-center">
              <v-avatar size="120" class="mb-2 elevation-2">
                <v-img :alt="userInfo.display_name" :src="VITE_APP_S3_BUCKET + '/user/' + userInfo.images" cover></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12" sm="8" md="9" class="pa-4">
              <h2 class="text-h4 font-weight-bold mb-2">{{ userInfo.display_name }}</h2>
              <div class="d-flex flex-wrap gap-2 mb-2">
                <v-chip color="primary" variant="outlined">
                  <v-icon start icon="mdi-account-circle"></v-icon>
                  ID: {{ userInfo.id }}
                </v-chip>
                <v-chip color="success" variant="outlined">
                  <v-icon start icon="mdi-tag"></v-icon>
                  创作者
                </v-chip>
              </div>
              <v-expand-transition>
                <div v-if="userInfo.motto" class="mt-3 text-body-1 text-medium-emphasis">
                  {{ userInfo.motto }}
                </div>
              </v-expand-transition>
            </v-col>
          </v-row>
          <template v-slot:loader="{ isActive }">
            <v-progress-linear :active="isActive" height="4" indeterminate color="primary"></v-progress-linear>
          </template>
        </v-card>

        <!-- Account Settings Section -->
        <v-card class="elevation-2">
          <v-row no-gutters>
            <!-- Tabs for Desktop -->
            <v-col cols="12" md="3" class="hidden-sm-and-down">
              <v-list bg-color="background" class="py-0 h-100">
                <v-list-item
                  v-for="item in tabItems"
                  :key="item.value"
                  :value="item.value"
                  :active="tab === item.value"
                  @click="tab = item.value"
                  color="primary"
                  class="mb-1"
                  rounded="lg"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Tabs for Mobile -->
            <v-col cols="12" class="hidden-md-and-up">
              <v-tabs v-model="tab" show-arrows density="compact" bg-color="background" slider-color="primary" align-tabs="center">
                <v-tab v-for="item in tabItems" :key="item.value" :value="item.value">
                  <v-icon :icon="item.icon" class="mr-1"></v-icon>
                  {{ item.title }}
                </v-tab>
              </v-tabs>
            </v-col>

            <!-- Content Area -->
            <v-col cols="12" md="9">
              <v-card-text class="pa-4">
                <v-window v-model="tab">
                  <!-- User Info Tab -->
                  <v-window-item value="userInfo">
                    <h3 class="text-h5 mb-4">个人资料</h3>
                    <v-form v-model="valid">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="userInfo.display_name"
                            :counter="10"
                            label="显示名称"
                            variant="outlined"
                            density="comfortable"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="select"
                            :items="items"
                            item-title="state"
                            item-value="abbr"
                            label="性别"
                            variant="outlined"
                            density="comfortable"
                            persistent-hint
                            return-object
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            label="个人简介"
                            v-model="userInfo.motto"
                            :counter="500"
                            variant="outlined"
                            auto-grow
                            rows="3"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            @click="submit"
                            :disabled="!valid"
                            color="primary"
                            size="large"
                            prepend-icon="mdi-content-save"
                            class="px-6"
                          >
                            保存资料
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-window-item>

                  <!-- Username Tab -->
                  <v-window-item value="username">
                    <h3 class="text-h5 mb-4">修改用户名</h3>
                    <v-form v-model="usernamevalid">
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="userInfo.username"
                            :counter="10"
                            :rules="nameRules"
                            label="用户名"
                            variant="outlined"
                            density="comfortable"
                            required
                          ></v-text-field>
                          <div class="text-caption text-medium-emphasis">用户名只能包含小写字母</div>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            @click="changeusername"
                            :disabled="!usernamevalid"
                            color="primary"
                            size="large"
                            prepend-icon="mdi-check"
                            class="px-6"
                          >
                            保存用户名
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-window-item>

                  <!-- Password Tab -->
                  <v-window-item value="password">
                    <h3 class="text-h5 mb-4">修改密码</h3>
                    <v-form v-model="passwordvalid">
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="oldPassword"
                            label="当前密码"
                            variant="outlined"
                            density="comfortable"
                            type="password"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="newPassword"
                            :rules="passwordRules"
                            label="新密码"
                            variant="outlined"
                            density="comfortable"
                            type="password"
                            required
                          ></v-text-field>
                          <div class="text-caption text-medium-emphasis">
                            密码必须由数字、大小写字母和特殊字符组成，且长度至少为8位
                          </div>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            @click="changepassword"
                            :disabled="!passwordvalid"
                            color="primary"
                            size="large"
                            prepend-icon="mdi-lock-reset"
                            class="px-6"
                          >
                            更新密码
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-window-item>

                  <!-- Avatar Tab -->
                  <v-window-item value="avatar">
                    <h3 class="text-h5 mb-4">更新头像</h3>
                    <v-form v-model="avatarvalid">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-file-input
                            label="上传头像"
                            accept="image/*"
                            @change="onFileChange"
                            placeholder="选择图片上传"
                            prepend-icon="mdi-camera"
                            variant="outlined"
                            density="comfortable"
                            show-size
                          ></v-file-input>
                          <div class="text-caption text-medium-emphasis">图片将被自动压缩</div>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center justify-center">
                          <v-sheet v-if="previewImage" class="elevation-2 rounded-lg overflow-hidden" width="150" height="150">
                            <v-img :src="previewImage" height="150" width="150" cover></v-img>
                          </v-sheet>
                          <v-sheet v-else class="d-flex align-center justify-center bg-grey-lighten-3 rounded-lg" width="150" height="150">
                            <v-icon icon="mdi-image" size="64" color="grey-darken-1"></v-icon>
                          </v-sheet>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            @click="uploadAvatar"
                            :disabled="!previewImage"
                            color="primary"
                            size="large"
                            prepend-icon="mdi-cloud-upload"
                            class="px-6"
                          >
                            上传头像
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-window-item>

                  <!-- Email Tab -->
                  <v-window-item value="email">
                    <h3 class="text-h5 mb-4">邮箱管理</h3>
                    <email-manager ref="emailManager" />
                  </v-window-item>

                  <!-- OAuth Tab -->
                  <v-window-item value="oauth">
                    <h3 class="text-h5 mb-4">第三方账号关联</h3>
                    <OAuthManager />
                  </v-window-item>

                  <!-- Security Tab -->
                  <v-window-item value="security">
                    <h3 class="text-h5 mb-4">安全管理</h3>
                    <SecurityManager />
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { localuser } from "@/services/localAccount";
import "https://static.geetest.com/v4/gt4.js";
import Compressor from "compressorjs";
import { useHead } from "@unhead/vue";
//import Recaptcha from "@/components/Recaptcha.vue";
import {
  getAccount,
  updateUserInfo,
  updateUsername,
  updatePassword,
  uploadUserAvatar,
} from "@/services/accountService";
import EmailManager from '@/components/EmailManager.vue'
import OAuthManager from '@/components/OAuthManager.vue'
import SecurityManager from '@/components/SecurityManager.vue'

export default {
  //components: { Recaptcha },
  components: {
    EmailManager,
    OAuthManager,
    SecurityManager,
  },
  data() {
    return {
      userCardLoading: false,
      localuser: localuser,
      userInfo: {},
      tab: "userInfo",
      tabItems: [
        { title: '用户信息', value: 'userInfo', icon: 'mdi-account-circle' },
        { title: '账户', value: 'username', icon: 'mdi-cog' },
        { title: '密码', value: 'password', icon: 'mdi-lock' },
        { title: '头像', value: 'avatar', icon: 'mdi-image' },
        { title: '邮箱', value: 'email', icon: 'mdi-email' },
        { title: 'OAuth', value: 'oauth', icon: 'mdi-link-variant' },
        { title: '安全', value: 'security', icon: 'mdi-security' },
      ],
      select: { state: "未知", abbr: "3" },
      items: [
        { state: "男", abbr: "0" },
        { state: "女", abbr: "1" },
        { state: "猫娘", abbr: "2" },
        { state: "未知", abbr: "3" },
      ],
      valid: false,
      nameRules: [
        (value) => (value ? true : "Name is required."),
        (value) =>
          value?.length <= 10 ? true : "Name must be less than 10 characters.",
        (value) => (/^[a-z]+$/.test(value) ? true : "仅小写字母"),
      ],
      passwordRules: [
        (value) => (value ? true : "password is required."),
        (value) =>
          value?.length <= 10 ? true : "Name must be less than 10 characters.",
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&\.])[A-Za-z\d$@$!%*?&\.]{8,}/.test(
            value
          )
            ? true
            : "密码必须由数字、大小写字母和特殊字符组成，且长度至少为8位",
      ],
      avatarrules: [
        (value) =>
          !value ||
          !value.length ||
          value[0].size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
      oldPassword: "",
      newPassword: "",
      passwordvalid: false,
      usernamevalid: false,
      useravatarfile: null,
      previewImage: null,
      avatarvalid: false,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    };
  },
  setup() {
    useHead({ title: "账户" });
  },
  async created() {
    if (!localuser.isLogin.value) {
      this.$router.push("/app/account/login");
    } else {
      await this.getUserById();
    }
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files ? event.target.files[0] : null;
      if (file instanceof File && file.type.startsWith("image/")) {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 500,
          maxHeight: 500,
          success: (compressedFile) => {
            this.previewImage = URL.createObjectURL(compressedFile);
            this.useravatarfile = compressedFile;
          },
          error: (err) => {
            console.error("图片压缩出错：", err.message);
            this.$toast.add({
              severity: "error",
              summary: "错误",
              detail: err.message,
              life: 3000,
            });
          },
        });
      } else {
        console.error("请选择有效的图片文件");
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "请选择有效的图片文件",
          life: 3000,
        });
      }
    },
    async uploadAvatar() {
      const formData = new FormData();
      formData.append("zcfile", this.useravatarfile);
      try {
        //const responseData = await this.$refs.recaptcha4.getResponse();
        //const queryParams = new URLSearchParams(responseData).toString();
        //await uploadUserAvatar(queryParams, formData);
        const response = await uploadUserAvatar("", formData);

        this.showToast(response.data.status || "info", "修改头像", response.data.message);
      } catch (error) {
        this.showToast("error", "错误", error.message);
      }
    },
    async getUserById() {
      this.userCardLoading = true;
      try {
        const response = await getAccount(localuser.user.value.id);
        this.userInfo = response.data.info;
        console.log(this.userInfo);
        this.select = this.items.find((item) => item.abbr == this.userInfo.sex);
      } catch (error) {
        this.showToast("error", "错误", error.message);
      } finally {
        this.userCardLoading = false;
      }
    },
    async submit() {
      this.userCardLoading = true;
      try {
        const response = await updateUserInfo({
          //captcha: this.$refs.recaptcha1.getResponse() || "",
          display_name: this.userInfo.display_name,
          aboutme: this.userInfo.motto,
          sex: this.select.abbr,
        });
        this.showToast(
          response.data.status || "info",
          "修改个人信息",
          response.data.message
        );
        await this.getUserById();
      } catch (error) {
        this.showToast("error", "错误", error.message);
      } finally {
        this.userCardLoading = false;
      }
    },
    async changeusername() {
      this.userCardLoading = true;
      try {
        const response = await updateUsername({
          //captcha: this.$refs.recaptcha2.getResponse() || "",
          username: this.userInfo.username,
        });
        this.showToast(
          response.data.status || "info",
          "修改用户名",
          response.data.message
        );
        await this.getUserById();
      } catch (error) {
        this.showToast("error", "错误", error.message);
      } finally {
        this.userCardLoading = false;
      }
    },
    async changepassword() {
      this.userCardLoading = true;
      try {
        const response = await updatePassword({
          //captcha: this.$refs.recaptcha3.getResponse() || "",
          oldpw: this.oldPassword,
          newpw: this.newPassword,
        });
        this.showToast(response.data.status || "info", "修改密码", response.data.message);
        await this.getUserById();
      } catch (error) {
        this.showToast("error", "错误", error.message);
      } finally {
        this.userCardLoading = false;
      }
    },
    showToast(severity, summary, detail) {
      this.$toast.add({ severity, summary, detail, life: 3000 });
    },
  },
};
</script>
