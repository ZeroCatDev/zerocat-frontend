<template>
  <div>
    <!-- 使用完全自包含的扩展显示组件 -->
    <ExtensionDisplayContent
      :extension-id="$route.params.id"
    />
  </div>
</template>

<script>
import { useHead } from "@unhead/vue";
import ExtensionDisplayContent from "@/components/extensions/ExtensionDisplayContent.vue";

export default {
  name: "ExtensionDetail",
  components: {
    ExtensionDisplayContent,
  },
  setup() {
    useHead({
      title: "扩展详情 - ZeroCat",
    });
  },

};
</script>
