<template>
  <v-container>
    <!-- Add New TOTP Button -->

    <v-btn to="./totp/add" color="primary" class="mb-4">
      <v-icon left>mdi-plus</v-icon>新的验证器
    </v-btn>

    <!-- TOTP List Cards -->
    <v-row
      ><v-col v-for="totp in totpList" :key="totp.id" cols="12" md="4"
        ><v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-card border v-bind="activatorProps">
              <v-card-title>
                <span class="headline">{{ totp.name }}</span>
              </v-card-title>
              <v-card-subtitle>{{ totp.status }}</v-card-subtitle>
              <v-card-text> 点击打开管理 </v-card-text>
            </v-card>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card :title="totp.name" border>
              <v-card-text>
                <v-text-field
                  v-model="totp.name"
                  :counter="100"
                  :rules="nameRules"
                  label="验证器名称"
                  required
                ></v-text-field>
                <v-btn color="primary" @click="renameTOTP(totp.id, totp.name)"
                  >重命名</v-btn
                >
              </v-card-text>

              <v-card-actions
                ><v-btn
                  color="error"
                  variant="text"
                  @click="deleteTOTP(totp.id)"
                  border
                  >删除</v-btn
                >
                <v-spacer></v-spacer>

                <v-btn text="关闭" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import request from "@/axios/axios";
import { useHead } from "@unhead/vue";
export default {
  data() {
    return {
      totpList: [],
      loading: false,
      renameDialog: false, // 控制重命名弹框的显示与隐藏
      deleteDialog: false, // 控制删除弹框的显示与隐藏
      selectedTOTPId: null, // 选中的TOTP ID，用于重命名或删除
      newName: "", // 新的TOTP名称
      renameError: "", // 重命名输入框的错误消息
      nameRules: [
        (value) => {
          if (value) return true;

          return "Name is required.";
        },
        (value) => {
          if (value?.length <= 100) return true;

          return "Name must be less than 10 characters.";
        },
      ],
    };
  },
  setup() {
    useHead({
      title: "验证器",
    });
  },
  methods: {
    // 获取TOTP列表
    async fetchTOTPList() {
      this.loading = true;
      try {
        const response = await request.get("/account/totp/list").data;
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
      } finally {
        this.loading = false;
      }
    },

    // 提交重命名
    async renameTOTP(totpid, newname) {
      if (newname == "") {
        this.renameError = "名称不能为空";
        return;
      }

      try {
        const response = await request.post("/account/totp/rename", {
          totp_id: totpid,
          name: newname,
        }).data;

        if (response.status === "success") {
          this.fetchTOTPList();
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "验证器重命名成功",
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

    // 删除TOTP
    async deleteTOTP(totpid) {
      try {
        const response = await request.post("/account/totp/delete", {
          totp_id: totpid,
        }).data;

        if (response.status === "success") {
          this.fetchTOTPList();
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "验证器删除成功",
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
  },
  mounted() {
    this.fetchTOTPList();
  },
};
</script>
