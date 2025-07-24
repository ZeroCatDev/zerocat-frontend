<template>
  <v-container>
    <v-card border class="mx-auto" rel="noopener" target="_blank">
      <template v-slot:title>
        <span>{{ titlemessage }}</span></template
      >
      <template v-slot:subtitle>
        <span>正在退出您的ZeroCat账户</span></template
      >
      <v-card-text class="bg-surface-light pt-4">{{ log }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {localuser} from "@/services/localAccount";
import {useHead} from "@unhead/vue";

export default {
  data() {
    return {
      titlemessage: "正在退出账户",
      log: "",
    };
  },
  setup() {
    useHead({
      title: "退出",
    });
  },
  async created() {
    this.log = "正在退出账户...";

    try {
      // 使用新的异步注销方法
      await localuser.logout(true);
      this.titlemessage = "已成功退出";
      this.log = "您已安全退出账户。请关闭此标签页并刷新其他标签页。";

      // 3秒后跳转到登录页面
      setTimeout(() => {
        this.$router.push('/app/account/login');
      }, 3000);
    } catch (error) {
      this.titlemessage = "退出时发生错误";
      this.log = error.message || "未知错误，请稍后重试";
    }
  },
};
</script>
