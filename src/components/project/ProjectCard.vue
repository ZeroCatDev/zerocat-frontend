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
    <v-card-item v-if="showAuthor && author" :append-avatar="author.avatar ? VITE_APP_S3_BUCKET + '/user/' + author.avatar : ''">
      <v-card-title>{{ author.display_name || author.username || "未知用户" }}</v-card-title>
      <v-card-subtitle>{{ author.username || "" }}</v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script>
import { getProjectInfo } from "@/services/projectService";

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
      if (this.showAuthor && !this.author && this.project?.author) {
        this.author = this.project.author;
      }
    },

    getProjectLink() {
      if (!this.project) return '';

      // 确保有作者信息和项目名称
      if (this.project.author?.username && this.project.name) {
        return `/${this.project.author.username}/${this.project.name}`;
      }

      // 如果没有作者信息或项目名称，则使用项目ID作为名称
      if (this.project.author?.username) {
        return `/${this.project.author.username}/${this.project.id}`;
      }

      // 如果连作者信息都没有，则返回空链接
      return '';
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
      // 不再需要单独获取作者信息，因为已经包含在项目数据中
      return;
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

