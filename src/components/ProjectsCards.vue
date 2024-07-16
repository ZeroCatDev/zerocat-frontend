<template>
          <v-row>
        <v-col cols=" 12" md="3" v-for="info in projects.data" :key="info">
        <ProjectCard :info="info" :user="projects.user.find((u) => u.id === info.authorid)"></ProjectCard>
        </v-col></v-row>
  </template>

  <script>
  import ProjectCard from "./ProjectCard.vue";
  export default {
    components: { ProjectCard },


    props: {
        projects: {
            type: String,
            default: 'text',
        },


    },

  };
  </script>
