<template>
  <div>
    <v-card hover border style="aspect-ratio: 4 / 3" v-if="showplayer">
      <iframe
        :src="embedurl"
        scrolling="no"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
    </v-card>

    <v-card v-if="!showplayer" hover border title="项目尚未初始化">
      <v-card-actions>
        <v-btn @click="initProject(projectId)">以Scratch模板初始化项目</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { initProject } from "@/services/projectService";

export default {
  name: 'ProjectPlayer',
  props: {
    projectId: {
      type: [Number, String],
      required: true
    },
    branch: {
      type: String,
      default: 'main'
    },
    commitId: {
      type: String,
      default: 'latest'
    },
    showplayer: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    embedurl() {
      const baseUrl = `/scratch/embed.html?id=${this.projectId}&embed=true`;
      if (this.commitId !== 'latest') {
        return `${baseUrl}&ref=${this.commitId}`;
      }
      return `${baseUrl}&branch=${this.branch}&ref=${this.commitId}`;
    }
  },
  data() {
    return {
      initProject
    }
  }
}
</script>