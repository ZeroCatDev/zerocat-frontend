<template>
  <v-container>
    <v-card class="mx-auto" rel="noopener" target="_blank" border>
      <template v-slot:title>
        <span>{{ titlemessage }}</span> </template
      ><template v-slot:subtitle>
        <span>正在退出您的ZeroCat账户</span> </template
      ><v-card-text class="bg-surface-light pt-4" v-html="logs"> </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { localuser } from "@/stores/user";

export default {
  data() {
    return {
      titlemessage: "正在退出账户",
      logs: "",
    };
  },

  async created() {
    this.log("正在退出账户");

    try {
      this.log("正在清除localStorage中的账户数据");
      localStorage.removeItem("token");
      if (localStorage.getItem("token") === null) {
        this.log("成功清除localStorage中的账户数据");
      }
      this.log("已成功退出您的账户，请关闭此标签页并刷新其他标签页");

      localuser.loaduser();
    } catch (error) {
      this.log(error);
    }
  },
  methods: {
    currentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
    log(log) {
      this.logs = this.logs + `[${this.currentTime()}] ${log}<br/>`;
    },
  },
};
</script>
