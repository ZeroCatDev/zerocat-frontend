<template>
  <project-query-view type="author" :target="$route.params.name" />
</template>

<script>
import ProjectQueryView from "@/components/project/ProjectQueryView.vue";

export default {
  components: {
    ProjectQueryView,
  },
};
</script>