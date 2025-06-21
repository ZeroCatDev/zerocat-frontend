<template>
  <v-card hover border>
    <v-card-item>
      <v-card-title>{{ project.title }}</v-card-title>
      <v-card-subtitle>{{ project.description }}</v-card-subtitle>
    </v-card-item>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill>
        <v-avatar start>
          <v-img
            :src="VITE_APP_S3_BUCKET + '/user/' + author.avatar"
          ></v-img> </v-avatar
        >{{ author.display_name }}
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill prepend-icon="mdi-chart-line">{{ stats.pageviews }}浏览</v-chip>
      <v-chip pill prepend-icon="mdi-account-multiple">{{ stats.visitors }}访客</v-chip>
      <v-chip pill prepend-icon="mdi-clock">
        <TimeAgo :date="project.time" />
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill prepend-icon="mdi-xml" v-if="project.state == 'public'"
        >开源作品</v-chip
      >
      <v-chip
        pill
        prepend-icon="mdi-xml"
        v-if="project.state == 'private'"
        color="red"
        variant="outlined"
        >私密作品</v-chip
      >
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
      <v-btn-group  border density="compact" rounded="lg" size="x-small">
      <v-btn
        :to="`/${username}/${projectname}/fork`"
        variant="tonal"
        class="text-none"
      >
      分叉
      </v-btn><v-btn text :to="`/app/projects/fork/${project.id}`">{{stats.forks}}</v-btn></v-btn-group>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-btn @click="openEditor(project.id, project.type)" variant="text"
        >打开创造页</v-btn
      >
      <v-btn :to="`/${username}/${projectname}/edit`" variant="text"
        >编辑源文件</v-btn
      >
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
  },
  data() {
    return {
      openEditor,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
      stats: {
        pageviews: 0,
        visitors: 0
      }
    };
  },
  watch: {
    'project.id': {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadProjectStats();
        }
      }
    }
  },
  methods: {
    async loadProjectStats() {
      try {
        this.stats = await getProjectStats(this.project.id);
      } catch (error) {
        console.error('Error fetching project stats:', error);
        this.stats = {
          pageviews: 0,
          visitors: 0
        };
      }
    }
  }
};
</script>
