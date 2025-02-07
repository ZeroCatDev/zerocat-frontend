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
      <v-card rounded="lg" border>
        <v-card
          :to="`/${project.author.username}/${project.name}`"
          style="aspect-ratio: 4/3"
          rounded="lg"
        >
          <v-img
            :src="VITE_APP_S3_BUCKET + '/scratch_slt/' + project.id"
            class="align-end"
            lazy-src="../../assets/43-lazyload.png"
            height="100%"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            cover
          >
            <v-card-item>
              <v-card-title>{{ project.title || "未缓存" }}</v-card-title>
              <v-card-subtitle>{{ project.description || "" }}</v-card-subtitle>
            </v-card-item>
          </v-img>
        </v-card>
        <!-- <v-card-title>{{ project.author.display_name || "未知用户" }}</v-card-title>
        <v-card-subtitle>{{ project.created_at || "未知时间" }}</v-card-subtitle>-->

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { getProjectInfo } from "@/services/projectService";
import { getUserById } from "@/stores/user.js";

export default {
  props: {
    projectIds: {
      type: Array,
      required: true,
    },

  },
  data() {
    return {
      projects: [],
      authorIds: [],
      authors: {},
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    };
  },
  watch: {
    projectIds: {
      handler() {
        this.fetchProjects();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async fetchProjects() {
      const projects = await getProjectInfo(this.projectIds);
      this.projects = projects.map(project => ({
        ...project,
        author: { display_name: "加载中..." },
      }));
      this.updateAuthorIds();
    },
    updateAuthorIds() {
      this.authorIds = [
        ...new Set(this.projects.map((project) => project.authorid)),
      ];
      this.fetchAuthors();
    },
    async fetchAuthors() {
      const authors = await getUserById(this.authorIds);
      const authorsMap = {};
      authors.forEach((user) => {
        authorsMap[user.id] = user;
      });
      this.authors = authorsMap;
      this.updateProjectAuthors();
    },
    updateProjectAuthors() {
      this.projects = this.projects.map((project) => ({
        ...project,
        author: this.authors[project.authorid] || { display_name: "未知用户" },
      }));
    },
  },
};
</script>
