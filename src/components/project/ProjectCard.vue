<template>
  <v-card rounded="lg"  class="box-shadow">
    <v-card
      :to="getProjectLink()"
      style="aspect-ratio: 4/3"
      rounded="lg"
    >
      <v-img
        :src="project ? VITE_APP_S3_BUCKET + '/scratch_slt/' + project.id : ''"
        class="align-end"
        lazy-src="../../assets/43-lazyload.png"
        height="100%"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        cover
      >
        <v-card-item>
          <v-card-title>{{ project?.title || "加载中..." }}</v-card-title>
          <v-card-subtitle>{{ project?.description || "" }}</v-card-subtitle>
        </v-card-item>
      </v-img>
    </v-card>
    <!-- 作者信息区域 -->
    <v-card-item v-if="showAuthor && author" :append-avatar="author.images ? VITE_APP_S3_BUCKET + '/user/' + author.images : ''">
      <v-card-title>{{ author.display_name || author.username || "未知用户" }}</v-card-title>
      <v-card-subtitle>{{ author.username || "" }}</v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script>
import { getProjectInfo } from "@/services/projectService";
import { getUserById } from "@/stores/user.js";

export default {
  props: {
    // 可以传入完整的项目数据
    projectData: {
      type: Object,
      default: null,
    },
    // 或者只传入项目ID
    projectId: {
      type: [Number, String],
      default: null,
    },
    // 可以单独传入作者数据
    authorData: {
      type: Object,
      default: null,
    },
    // 是否显示作者信息
    showAuthor: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      project: null,
      author: null,
      loading: false,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    };
  },
  created() {
    // 初始化数据
    this.initializeData();
  },
  watch: {
    projectData: {
      handler() {
        this.initializeData();
      },
      deep: true
    },
    authorData: {
      handler() {
        this.initializeData();
      },
      deep: true
    },
    projectId() {
      this.initializeData();
    },
    showAuthor() {
      this.loadAuthorIfNeeded();
    }
  },
  methods: {
    initializeData() {
      // 处理项目数据
      if (this.projectData) {
        this.project = this.projectData;
      } else if (this.projectId) {
        this.fetchProject(this.projectId);
      }
      
      // 处理作者数据
      if (this.authorData) {
        this.author = this.authorData;
      } else {
        this.loadAuthorIfNeeded();
      }
    },
    
    loadAuthorIfNeeded() {
      // 如果需要显示作者信息，但没有作者数据，则尝试加载
      if (this.showAuthor && !this.author && this.project?.authorid) {
        this.fetchAuthor(this.project.authorid);
      }
    },
    
    getProjectLink() {
      if (!this.project) return '';
      
      // 如果有项目名称和作者用户名，使用 /:username/:projectname 路由
      if (this.project.name && this.author?.username) {
        return `/${this.author.username}/${this.project.name}`;
      }
      
      return `/app/link/project?id=${this.project.id}`;
    },
    
    async fetchProject(id) {
      if (this.loading) return;
      this.loading = true;
      
      try {
        const projects = await getProjectInfo([id]);
        if (projects && projects.length > 0) {
          this.project = projects[0];
          this.loadAuthorIfNeeded();
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAuthor(authorId) {
      // 如果不需要显示作者或已有作者数据，则不加载
      if (!this.showAuthor || this.authorData) return;
      
      try {
        const authors = await getUserById([authorId]);
        if (authors && authors.length > 0) {
          this.author = authors[0];
        }
      } catch (error) {
        console.error("Failed to fetch author:", error);
      }
    }
  }
};
</script>
<style scoped>
.box-shadow {
  box-shadow: 
    0px 0px 0px 1px rgba(14, 63, 126, 0.04),
    0px 1px 1px -0.5px rgba(42, 51, 70, 0.04),
    0px 3px 3px -1.5px rgba(42, 51, 70, 0.04),
    0px 6px 6px -3px rgba(42, 51, 70, 0.04),
    0px 12px 12px -6px rgba(14, 63, 126, 0.04),
    0px 24px 24px -12px rgba(14, 63, 126, 0.04);}
</style>

