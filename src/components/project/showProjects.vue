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
        :project-data="project"
        :author-data="project.author"
        :show-author="showAuthor"
      />
    </v-col>
  </v-row>
</template>

<script>
import { getProjectInfo } from "@/services/projectService";
import ProjectCard from "./ProjectCard.vue";

export default {
  components: {
    ProjectCard
  },
  props: {
    projectIds: {
      type: Array,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projects: [],
      loading: false,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    };
  },
  watch: {
    projectIds: {
      handler() {
        this.loadData();
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    async loadData() {
      this.loading = true;

      try {
        // 加载项目数据（作者信息包含在项目数据中）
        await this.fetchProjects();
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProjects() {
      try {
        this.projects = await getProjectInfo(this.projectIds);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        this.projects = [];
      }
    }
  }
};
</script>
