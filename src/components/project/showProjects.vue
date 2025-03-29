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
        :author-data="authors[project.authorid]"
        :show-author="showAuthor"
      />
    </v-col>
  </v-row>
</template>

<script>
import { getProjectInfo } from "@/services/projectService";
import { getUserById } from "@/stores/user.js";
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
      authors: {},
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
    },
    showAuthor: {
      handler(newVal) {
        // 如果启用了显示作者，但还没有加载作者数据
        if (newVal && Object.keys(this.authors).length === 0 && this.projects.length > 0) {
          this.loadAuthors();
        }
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      
      try {
        // 加载项目数据
        await this.fetchProjects();
        
        // 如果需要显示作者信息，则加载作者数据
        if (this.projects.length > 0) {
          await this.loadAuthors();
        }
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
    },
    
    async loadAuthors() {
      try {
        // 获取所有不重复的作者ID
        const authorIds = [...new Set(this.projects.map(project => project.authorid))];
        
        // 过滤掉无效的作者ID
        const validAuthorIds = authorIds.filter(id => id);
        
        if (validAuthorIds.length === 0) return;
        
        // 获取作者数据
        const authors = await getUserById(validAuthorIds);
        
        // 将作者数据转换为以ID为键的对象
        const authorsMap = {};
        authors.forEach(author => {
          if (author && author.id) {
            authorsMap[author.id] = author;
          }
        });
        
        this.authors = authorsMap;
      } catch (error) {
        console.error("Failed to load authors:", error);
      }
    }
  }
};
</script>
