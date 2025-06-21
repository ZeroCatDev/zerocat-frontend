<template>
  <project-query-view type="tag" :target="$route.params.name" />
</template>

<script>
import ProjectQueryView from "@/components/project/ProjectQueryView.vue";

export default {
  components: {
    ProjectQueryView,
  },
};
</script>