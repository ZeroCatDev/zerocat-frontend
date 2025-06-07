<template>
  <v-card hover border>
    <v-card-item>
      <v-card-title>{{ project.title }}</v-card-title>
      <v-card-subtitle>{{ project.description }}</v-card-subtitle>
    </v-card-item>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill>
        <v-avatar start>
          <v-img :src="VITE_APP_S3_BUCKET + '/user/' + author.images"></v-img>
        </v-avatar>{{ author.display_name }}
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill prepend-icon="mdi-eye">{{ project.view_count }}浏览</v-chip>
      <v-chip pill prepend-icon="mdi-clock">
        <TimeAgo :date="project.time" />
      </v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-chip pill prepend-icon="mdi-xml" v-if="project.state == 'public'">开源作品</v-chip>
      <v-chip pill prepend-icon="mdi-xml" v-if="project.state == 'private'">私密作品</v-chip>
      <v-chip pill prepend-icon="mdi-application">{{ project.type }}</v-chip>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <div v-for="tag in project.tags">
        <v-chip>{{ tag.name }}</v-chip>
      </div>
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <ProjectStar :projectId="project.id" :starcount="project.star_count" />
    </div>
    <div class="px-4 d-flex ga-2 mb-2">
      <v-btn @click="openEditor(project.id, project.type)" variant="text">打开创造页</v-btn>
      <v-btn :to="`/${username}/${projectname}/edit`" variant="text">编辑源文件</v-btn>
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

export default {
  name: 'ProjectInfoCard',
  components: {
    TimeAgo,
    ProjectStar,
    ProjectAuthorCard
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    author: {
      type: Object,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    projectname: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      openEditor,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    }
  }
}
</script>