<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="generateTOTP" color="primary" class="mb-4">生成新的TOTP验证器</v-btn>
      </v-col>
      <v-col cols="12">
        <v-list>
          <v-list-item
            v-for="totp in totpList"
            :key="totp.id"
            @click="selectTOTP(totp)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ totp.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ totp.status }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click.stop="renameTOTP(totp.id)" color="info">重命名</v-btn>
              <v-btn @click.stop="deleteTOTP(totp.id)" color="error">删除</v-btn>
              <v-btn @click.stop="activateTOTP(totp.id)" color="success">激活</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import request from "@/axios/axios";

export default {
  data() {
    return {
      totpList: [],
    };
  },
  methods: {
    async fetchTOTPList() {
      try {
        const response = await request.get("/totp/list");
        if (response.status === "success") {
          this.totpList = response.data.list;
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
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
      }
    },
    async renameTOTP(totpId) {
      const newName = prompt("请输入新的名称");
      if (newName) {
        try {
          const response = await request.post("/totp/rename", { totpId, name: newName });
          if (response.status === "success") {
            this.fetchTOTPList();
            this.$toast.add({
              severity: "success",
              summary: "成功",
              detail: "TOTP验证器重命名成功",
              life: 3000,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "错误",
              detail: response.message,
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
        }
      }
    },
    async deleteTOTP(totpId) {
      try {
        const response = await request.post("/totp/delete", { totpId });
        if (response.status === "success") {
          this.fetchTOTPList();
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "TOTP验证器删除成功",
            life: 3000,
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
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
      }
    },
    async generateTOTP() {
      try {
        const response = await request.post("/totp/generate");
        if (response.status === "success") {
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: `新的TOTP验证器已生成: ${response.data.secret}`,
            life: 3000,
          });
          this.fetchTOTPList();
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
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
      }
    },
    async activateTOTP(totpId) {
      const totpToken = prompt("请输入TOTP令牌");
      if (totpToken) {
        try {
          const response = await request.post("/totp/activate", { totpId, totpToken });
          if (response.status === "success") {
            this.fetchTOTPList();
            this.$toast.add({
              severity: "success",
              summary: "成功",
              detail: "TOTP验证器激活成功",
              life: 3000,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: "错误",
              detail: response.message,
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
        }
      }
    },
  },
  mounted() {
    this.fetchTOTPList();
  },
};
</script>
