<template>
  <v-card class="box-shadow" rounded="lg">
    <v-card
      :to="getProjectLink()"
      rounded="lg"
      style="aspect-ratio: 4/3"
    >
      <v-img
        :src="project ? s3BucketUrl + '/scratch_slt/' + project.id : ''"
        class="align-end"
        cover
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="100%"
        lazy-src="../../assets/43-lazyload.png"
      >
        <v-card-item>
          <v-card-title>{{ project?.title || "加载中..." }}</v-card-title>
          <v-card-subtitle>{{ project?.description || "" }}</v-card-subtitle>
        </v-card-item>
      </v-img>
    </v-card>
    <!-- 作者信息区域 -->
    <v-card-item v-if="showAuthor && author"
                 :append-avatar="author.avatar ? s3BucketUrl + '/user/' + author.avatar : ''">
      <v-card-title>{{ author.display_name || author.username || "未知用户" }}</v-card-title>
      <v-card-subtitle>{{ author.username || "" }}</v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script>
import {getProjectInfo} from "@/services/projectService";
import {get} from "@/services/serverConfig";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    author: {
      type: Object,
      default: null,
    },
    showAuthor: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      s3BucketUrl: '',
    };
  },
  async mounted() {
    this.s3BucketUrl = await get('s3.staticurl');
  },
  created() {
    // 初始化数据
    this.initializeData();
  },
  watch: {
    project: {
      handler() {
        this.initializeData();
      },
      deep: true
    },
    author: {
      handler() {
        this.initializeData();
      },
      deep: true
    },
    showAuthor() {
      this.loadAuthorIfNeeded();
    }
  },
  methods: {
    initializeData() {
      // 处理项目数据
      if (this.project) {
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

    }
  }
};
</script>
<style scoped>
.box-shadow {
  box-shadow: 0 0 0 1px rgba(14, 63, 126, 0.04),
  0 1px 1px -0.5px rgba(42, 51, 70, 0.04),
  0 3px 3px -1.5px rgba(42, 51, 70, 0.04),
  0 6px 6px -3px rgba(42, 51, 70, 0.04),
  0 12px 12px -6px rgba(14, 63, 126, 0.04),
  0 24px 24px -12px rgba(14, 63, 126, 0.04);
}
</style>

