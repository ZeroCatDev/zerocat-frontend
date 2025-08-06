<template>
  <div>
    <!-- 使用完全自包含的扩展显示组件 -->
    <ExtensionDisplayContent
      :extension-id="$route.params.id"
      :show-owner-content="true"
      scope="my"
      @extension-deleted="onExtensionDeleted"
    />
  </div>
</template>

<script>
import { localuser } from "@/services/localAccount";
import ExtensionDisplayContent from "@/components/extensions/ExtensionDisplayContent.vue";

export default {
  name: "ExtensionDetail",
  components: {
    ExtensionDisplayContent,
  },
  async created() {
    if (localuser.isLogin.value === false) {
      this.$router.push("/app/account/login");
      return;
    }
  },
  methods: {
    onExtensionDeleted() {
      // 扩展被删除后跳转到扩展管理
      this.$router.push("/app/extensions");
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>