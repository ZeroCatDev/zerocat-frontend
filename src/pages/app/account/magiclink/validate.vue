<template>
  <v-container>
    <v-card class="mx-auto" rel="noopener" target="_blank" border>
      <template v-slot:title> <span>您正在登录一个账户</span> </template
      ><template v-slot:subtitle>
        <span
          >其他页面传来了一个登录请求，正常情况下它会被自动处理</span
        > </template
      ><v-card-text class="bg-surface-light pt-4"
        >传入的token是：<br />
        {{ token }}
        <br />
        <br />处理后的数据是：<br />
        {{ user }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text="返回登录"
          variant="tonal"
          to="/app/account/login"
          @click="login"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import { localuser } from "@/services/localAccount";
import { validateMagicLink } from "@/services/accountService";
import { useHead } from "@unhead/vue";

export default {
  data() {
    return {
      token: "",
      user: {},
      BASE_API: import.meta.env.VITE_APP_BASE_API,
    };
  },
  mounted() {
    if (localuser.isLogin.value == true) {
      this.$router.push("/");
    }
  },
  async created() {
    useHead({
      title: "魔术链接登录",
    });
    if (this.$route.query.token) {
      try {
        await this.$nextTick(); // 确保$refs已被正确初始化
        const res = await validateMagicLink(this.$route.query.token);
        this.$toast.add({
          severity: res.data.status,
          summary: res.data.status,
          detail: res.data.message,
          life: 3000,
        });

        if (res.data.token) {
          this.token = res.data.token;
          await localuser.setUser(res.data.token);
          if (localuser.isLogin.value == true) {
            this.$router.push("/");
          }
        }
      } catch (error) {
        this.user = error;
      }
    } else {
      console.log("无token");
    }
  },
};
</script>
