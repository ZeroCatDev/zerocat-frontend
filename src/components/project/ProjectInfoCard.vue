<template>
  <v-card border hover>
    <v-card-item>
      <v-card-title>{{ project.title }}</v-card-title>
      <v-card-subtitle>{{ project.description }}</v-card-subtitle>
    </v-card-item>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill>
        <v-avatar start>
          <v-img :src="localuser.getUserAvatar(author.avatar)"></v-img>
        </v-avatar>
        {{ author.display_name }}
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill prepend-icon="mdi-chart-line"
        >{{ stats.pageviews }}浏览</v-chip
      >
      <v-chip pill prepend-icon="mdi-account-multiple"
        >{{ stats.visitors }}访客</v-chip
      >
      <v-chip pill prepend-icon="mdi-clock">
        <TimeAgo :date="project.time" />
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip v-if="project.state == 'public'" pill prepend-icon="mdi-xml"
        >开源作品
      </v-chip>
      <v-chip
        v-if="project.state == 'private'"
        color="red"
        pill
        prepend-icon="mdi-xml"
        variant="outlined"
        >私密作品
      </v-chip>
      <v-chip pill prepend-icon="mdi-application">{{ project.type }}</v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <div v-for="tag in project.tags">
        <v-chip :to="`/app/projects/tag/${tag.name}`">{{ tag.name }}</v-chip>
      </div>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <ProjectStar :projectId="project.id" :starcount="project.star_count" />
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-btn-group border density="compact" rounded="lg" size="x-small">
        <v-btn
          :to="`/${username}/${projectname}/fork`"
          class="text-none"
          variant="tonal"
        >
          复刻
        </v-btn>
        <v-btn :to="`/app/projects/fork/${project.id}`" text>{{
          stats.forks
        }}</v-btn>
      </v-btn-group>
      <v-btn
        variant="tonal"

        rounded="lg"

        class="text-none"
        prepend-icon="mdi-share-variant"
        @click="handleShare"
      >
        分享
      </v-btn>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-btn
        variant="text"
        v-if="project.type == 'scratch'"
        @click="openEditor(project.id, project.type)"
        border
        hover
        append-icon="mdi-open-in-new"
        class="text-none"
        >Scratch编辑器
      </v-btn>
      <v-btn
        :to="`/${username}/${projectname}/edit`"
        variant="text"
        border
        hover
        class="text-none"
        >编辑
      </v-btn>
    </div>
    <div class="px-4">
      <ProjectAuthorCard :author="author" />
    </div>
    <br />
  </v-card>
</template>

<script>
import TimeAgo from "@/components/TimeAgo.vue";
import ProjectStar from "@/components/project/ProjectStar.vue";
import ProjectAuthorCard from "@/components/project/ProjectAuthorCard.vue";
import openEditor from "@/stores/openEdit";
import { getProjectStats } from "@/services/projectService";
import { openFloatingPostBar } from "@/composables/useFloatingPostBar";
import { ref, onMounted } from "vue";
import { localuser } from "@/services/localAccount";
export default {
  name: "ProjectInfoCard",
  components: {
    TimeAgo,
    ProjectStar,
    ProjectAuthorCard,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    projectname: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      default: null,
    },
    commit: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      openEditor,
      loading: false,
      error: null,
      stats: {
        pageviews: 0,
        visitors: 0,
      },
      localuser,
    };
  },
  async mounted() {},
  watch: {
    "project.id": {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadProjectStats();
        }
      },
    },
  },
  methods: {
    async loadProjectStats() {
      try {
        this.stats = await getProjectStats(this.project.id);
      } catch (error) {
        console.error("Error fetching project stats:", error);
        this.stats = {
          pageviews: 0,
          visitors: 0,
        };
      }
    },
    handleShare() {
      const embed = { type: 'project', id: this.project.id };
      let text = `@${this.author.username} 的项目 ${this.project.title || ''}`;

      if (this.commit) {
        embed.commit = this.commit;
        text = `@${this.author.username} 的项目 ${this.project.title || ''} (提交：${this.commit.slice(0, 7)})`;
      } else if (this.branch && this.branch !== 'main') {
        embed.branch = this.branch;
        text = `@${this.author.username} 的项目 ${this.project.title || ''} (分支：${this.branch})`;
      }

      openFloatingPostBar({
        text,
        embed,
        placeholder: `分享关于 ${this.project.title} 的内容...`
      });
    },
  },
};
</script>
