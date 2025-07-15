<template>
  <div>
    <template v-if="projectType === 'scratch'">
      <v-card hover border style="aspect-ratio: 4 / 3" v-if="showplayer">
        <iframe
          :src="embedurl"
          scrolling="no"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
      </v-card>
    </template>

    <template v-else-if="projectType === 'text'">
      <v-card hover border v-if="showplayer">
        <v-card-text>
          <v-textarea
            v-model="projectContent"
            readonly
            auto-grow
            rows="10"
            hide-details
          ></v-textarea>
        </v-card-text>
      </v-card>
    </template>

    <template v-else>
      <CodeRunner
        v-if="showplayer"
        ref="codeRunner"
        :project-type="projectType"
        :initial-code="projectCode"
        :initial-language="projectLanguage"
      ></CodeRunner>
    </template>

    <v-card v-if="!showplayer" hover border title="项目尚未初始化">
      <v-card-actions>
        <v-btn @click="initProject(projectId, 'scratch')">以Scratch模板初始化项目</v-btn>
        <v-btn @click="initProject(projectId, 'code')">以代码模板初始化项目</v-btn>
        <v-btn @click="initProject(projectId, 'text')">以文本模板初始化项目</v-btn>
        <v-btn @click="initProject(projectId, 'none')">以空白模板初始化项目</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { initProject, getProjectContent } from "@/services/projectService";
import CodeRunner from './CodeRunner.vue';

export default {
  name: 'ProjectPlayer',
  components: {
    CodeRunner
  },
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
    },
    type: {
      type: String,
      default: 'scratch'
    }
  },
  data() {
    return {
      initProject,
      projectType: this.type,
      projectCode: '',
      projectContent: '',
      projectLanguage: 'python'
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
  methods: {
    async loadProjectContent() {
      if (!this.showplayer || this.projectType === 'scratch') {
        return;
      }

      try {
        const content = await getProjectContent(this.projectId, this.branch, this.commitId);
        if (this.projectType === 'text') {
          this.projectContent = content.code || '';
        } else {
          this.projectCode = content.code || '';
          this.projectLanguage = content.language || 'python';
        }
      } catch (error) {
        console.error('Failed to load project content:', error);
      }
    }
  },
  async mounted() {
    await this.loadProjectContent();
  },
  watch: {
    projectId: {
      handler: 'loadProjectContent',
      immediate: true
    },
    branch: 'loadProjectContent',
    commitId: 'loadProjectContent',
    type: {
      handler(newType) {
        this.projectType = newType;
        this.loadProjectContent();
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.v-textarea {
  font-family: monospace;
}
</style>