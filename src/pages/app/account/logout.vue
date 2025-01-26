<template>
  <v-container>
    <v-card class="mx-auto" rel="noopener" target="_blank" border>
      <template v-slot:title>
        <span>{{ titlemessage }}</span> </template
      ><template v-slot:subtitle>
        <span>正在退出您的ZeroCat账户</span> </template
      ><v-card-text class="bg-surface-light pt-4">{{ log }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { localuser } from "@/services/localAccount";
import { useHead } from "@unhead/vue";

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
    this.log="正在退出账户";

    try {
      this.log="正在退出";
      localuser.logout();
      this.titlemessage="已退出";

      this.log="请关闭此标签页并刷新其他标签页";
    } catch (error) {
      this.titlemessage="出现错误";
      this.log=error;
    }
  },

};
</script>
