<template>
  <v-container>
    <div class="mb-2">
      <v-card hover border class="mx-auto" :disabled="userCardLoading" :loading="userCardLoading">
        <template v-slot:prepend>
          <v-avatar class="mb-2">
            <v-img :alt="userInfo.display_name" :src="'https://s4-1.wuyuan.1r.ink/user/' + userInfo.images"></v-img>
          </v-avatar>
        </template>
        <template v-slot:title>
          <span class="font-weight-black">{{ userInfo.display_name }}</span>
        </template>
        <template v-slot:loader="{ isActive }">
          <v-progress-linear :active="isActive" height="4" indeterminate></v-progress-linear>
        </template>
        <template v-slot:subtitle>
          <v-chip>
            <v-icon icon="mdi-account-circle" start></v-icon>
            ID:{{ userInfo.id }}
          </v-chip>
          <v-chip>
            <v-icon icon="mdi-tag" start></v-icon>
            创作者
          </v-chip>
        </template>
        <v-card-text class="bg-surface-light pt-4">
          {{ userInfo }}
        </v-card-text>
      </v-card>
    </div>
    <v-card hover border>
      <v-tabs v-model="tab">
        <v-tab value="userInfo">用户信息</v-tab>
        <v-tab value="username">用户名</v-tab>
        <v-tab value="password">密码</v-tab>
        <v-tab value="avatar">头像</v-tab>
        <v-tab value="email" @click="$router.push('/app/account/email')">邮箱</v-tab>
        <v-tab value="email" @click="$router.push('/app/account/oauth')">OAuth</v-tab>

      </v-tabs>
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="userInfo">
            <v-form v-model="valid">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="userInfo.display_name" :counter="10" label="显示名称" required></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea label="显示简介" v-model="userInfo.motto" :counter="500"></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="select" :items="items" item-title="state" item-value="abbr" label="性别"
                    persistent-hint return-object></v-select>
                </v-col>
                <!--<v-col cols="12">
                  <Recaptcha recaptchaId="recaptcha-div1" ref="recaptcha1" />
                </v-col>-->
                <v-col cols="12">
                  <v-btn @click="submit" :disabled="!valid" color="primary" class="mt-4">提交</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
          <v-tabs-window-item value="username">
            <v-form v-model="usernamevalid">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="userInfo.username" :counter="10" :rules="nameRules" label="用户名"
                    required></v-text-field>
                </v-col>
                <!--<v-col cols="12">
                  <Recaptcha recaptchaId="recaptcha-div2" ref="recaptcha2" />
                </v-col>-->
                <v-col cols="12">
                  <v-btn @click="changeusername" :disabled="!usernamevalid" color="primary" class="mt-4">提交</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
          <v-tabs-window-item value="password">
            <v-form v-model="passwordvalid">
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field v-model="oldPassword" hint="此框不验证输入值" label="原密码" required></v-text-field>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field v-model="newPassword" :rules="passwordRules" label="新密码" required></v-text-field>
                </v-col>
                <!-- <v-col cols="12">
                  <Recaptcha recaptchaId="recaptcha-div3" ref="recaptcha3" />
                </v-col>-->
                <v-col cols="12">
                  <v-btn @click="changepassword" :disabled="!passwordvalid" color="primary" class="mt-4">提交</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
          <v-tabs-window-item value="avatar">
            <v-form v-model="avatarvalid">
              <v-row>
                <v-col cols="12" md="8">
                  <v-file-input label="上传头像" accept="image/*" @change="onFileChange" placeholder="头像会被压缩"
                    prepend-icon="mdi-account-circle"></v-file-input>
                  <v-img v-if="previewImage" :src="previewImage" max-height="200" max-width="200"></v-img>
                </v-col>
                <!--<v-col cols="12">
                  <Recaptcha recaptchaId="recaptcha-div4" ref="recaptcha4" />
                </v-col>-->
                <v-col cols="12">
                  <v-btn @click="uploadAvatar" :disabled="!avatarvalid" color="primary" class="mt-4">提交</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
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

export default {
  //components: { Recaptcha },
  data() {
    return {
      userCardLoading: false,
      localuser: localuser,
      userInfo: {},
      tab: null,
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
