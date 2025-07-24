<template>
  <v-card border hover>
    <v-card-item>
      <v-card-title>{{ project.title }}</v-card-title>
      <v-card-subtitle>{{ project.description }}</v-card-subtitle>
    </v-card-item>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill>
        <v-avatar start>
          <v-img
            :src="s3BucketUrl + '/user/' + author.avatar"
          ></v-img>
        </v-avatar
        >
        {{ author.display_name }}
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill prepend-icon="mdi-chart-line">{{ stats.pageviews }}浏览</v-chip>
      <v-chip pill prepend-icon="mdi-account-multiple">{{ stats.visitors }}访客</v-chip>
      <v-chip pill prepend-icon="mdi-clock">
        <TimeAgo :date="project.time"/>
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip v-if="project.state == 'public'" pill prepend-icon="mdi-xml"
      >开源作品
      </v-chip
      >
      <v-chip
        v-if="project.state == 'private'"
        color="red"
        pill
        prepend-icon="mdi-xml"
        variant="outlined"
      >私密作品
      </v-chip
      >
      <v-chip pill prepend-icon="mdi-application">{{ project.type }}</v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <div v-for="tag in project.tags">
        <v-chip :to="`/app/projects/tag/${tag.name}`">{{ tag.name }}</v-chip>
      </div>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <ProjectStar :projectId="project.id" :starcount="project.star_count"/>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-btn-group border density="compact" rounded="lg" size="x-small">
        <v-btn
          :to="`/${username}/${projectname}/fork`"
          class="text-none"
          variant="tonal"
        >
          分叉
        </v-btn>
        <v-btn :to="`/app/projects/fork/${project.id}`" text>{{stats.forks}}</v-btn>
      </v-btn-group>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-btn variant="text" @click="openEditor(project.id, project.type)"
      >打开创造页
      </v-btn
      >
      <v-btn :to="`/${username}/${projectname}/edit`" variant="text"
      >编辑源文件
      </v-btn
      >
    </div>
    <div class="px-4">
      <ProjectAuthorCard :author="author"/>
    </div>
    <br/>
  </v-card>
</template>

<script>
import TimeAgo from "@/components/TimeAgo.vue";
import ProjectStar from "@/components/project/ProjectStar.vue";
import ProjectAuthorCard from "@/components/project/ProjectAuthorCard.vue";
import openEditor from "@/stores/openEdit";
import {getProjectStats} from "@/services/projectService";
import {ref, onMounted} from "vue";
import {get} from "@/services/serverConfig";

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
      loading: false,
      error: null,
      stats: {
        pageviews: 0,
        visitors: 0
      },
      s3BucketUrl: '',
    };
  },
  async mounted() {
    this.s3BucketUrl = await get('s3.staticurl');
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
