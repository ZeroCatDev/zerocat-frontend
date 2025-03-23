<template>
  <showProjectList :listId="listId" />
</template>

<script>
import showProjectList from "@/components/projectlist/showProjectList.vue";
import { useHead } from "@unhead/vue";
import { getProjectListById } from "@/services/projectService";

export default {
  components: {
    showProjectList,
  },
  data() {
    return {
      listId: this.$route.params.id,
      listTitle: "项目列表",
    };
  },
  async mounted() {
    try {
      const listData = await getProjectListById(this.listId);
      if (listData && listData.title) {
        this.listTitle = listData.title;
        this.updatePageTitle();
      }
    } catch (error) {
      console.error("获取列表信息失败:", error);
    }
  },
  methods: {
    updatePageTitle() {
      useHead({
        title: this.listTitle,
      });
    },
  },
  setup() {
    useHead({
      title: "项目列表",
    });
  },
};
</script>

