<template>
  <project-query-view type="fork" :target="$route.params.id" />
</template>

<script>
import ProjectQueryView from "@/components/project/ProjectQueryView.vue";

export default {
  components: {
    ProjectQueryView,
  },
};
</script>