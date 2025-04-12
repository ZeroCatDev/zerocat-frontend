<template>
  <v-form v-model="valid" @submit.prevent="changePassword">
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="oldPassword"
          label="当前密码"
          variant="outlined"
          density="comfortable"
          type="password"
          :rules="[v => !!v || '请输入当前密码']"
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
      <v-col cols="12" md="8">
        <v-text-field
          v-model="confirmPassword"
          :rules="[
            v => !!v || '请确认新密码',
            v => v === newPassword || '两次输入的密码不一致'
          ]"
          label="确认新密码"
          variant="outlined"
          density="comfortable"
          type="password"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          @click="changePassword"
          :disabled="!valid"
          color="primary"
          size="large"
          prepend-icon="mdi-lock-reset"
          class="px-6"
          :loading="loading"
        >
          更新密码
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { updatePassword } from "@/services/accountService";

export default {
  name: "PasswordEditor",
  data() {
    return {
      loading: false,
      valid: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordRules: [
        v => !!v || "请输入新密码",
        v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&\.])[A-Za-z\d$@$!%*?&\.]{8,}/.test(v)
          || "密码必须由数字、大小写字母和特殊字符组成，且长度至少为8位"
      ]
    };
  },
  methods: {
    async changePassword() {
      if (!this.valid) return;

      this.loading = true;
      try {
        const response = await updatePassword({
          oldpw: this.oldPassword,
          newpw: this.newPassword
        });

        this.$emit('password-updated', response);

        // Reset the form after successful update
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      } catch (error) {
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>