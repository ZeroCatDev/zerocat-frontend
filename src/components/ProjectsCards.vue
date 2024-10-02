<template>
          <v-row>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="2" xxl="2" v-for="info in projects.projects" :key="info">
        <ProjectCard :info="info" :user="projects.users.find((u) => u.id === info.authorid)" :actions="actions"></ProjectCard>
        </v-col></v-row>
  </template>

  <script>
  import ProjectCard from "./ProjectCard.vue";
  export default {
    components: { ProjectCard },


    props: {
        projects: {
            type: Object,
            default: 'text',
        },
        actions:{
            type: Array,
            required: false,
        }

    },

  };
  </script>
