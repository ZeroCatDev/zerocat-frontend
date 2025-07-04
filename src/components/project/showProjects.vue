<template>
  <v-row>
    <v-col
      v-for="project in projects"
      :key="project.id"
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
      xxl="2"
    >
      <project-card
        :project="project"
        :author="project.author"
        :show-author="showAuthor"
      />
    </v-col>
  </v-row>
</template>

<script>
import ProjectCard from "./ProjectCard.vue";

export default {
  components: {
    ProjectCard
  },
  props: {
    projects: {
      type: Array,
      required: true,
      default: () => []
    },
    showAuthor: {
      type: Boolean,
      default: false
    }
  }
};
</script>
