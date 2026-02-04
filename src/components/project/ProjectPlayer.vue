<template>
  <div>
    <template v-if="projectType === 'scratch'">
      <v-card v-if="showplayer" border hover style="aspect-ratio: 4 / 3">
        <iframe
          :src="embedurl"
          frameborder="0"
          scrolling="no"
          style="width: 100%; height: 100%"
        ></iframe>
      </v-card>
    </template>
    <template v-else-if="projectType === 'scratch-extension'">
      <ExtensionDisplayContent
        :project-id="projectId"
      />
    </template>
    <template v-else-if="projectType === 'text'">
      <v-card v-if="showplayer" border hover>
        <v-card-text>
          <v-textarea
            v-model="projectContent"
            auto-grow
            hide-details
            readonly
            max-rows="16"

          ></v-textarea>
        </v-card-text>
      </v-card>
    </template>

    <template v-else>
      <CodeRunner
        v-if="showplayer"
        ref="codeRunner"
        :initial-code="projectCode"
        :initial-language="projectLanguage"
        :project-type="projectType"
      ></CodeRunner>
    </template>

    <v-card v-if="!showplayer" border hover title="项目尚未初始化">
      <v-card-actions>
        <v-btn @click="initProject(projectId, 'scratch')">以Scratch模板初始化项目</v-btn>
        <v-btn @click="initProject(projectId, 'text')">以文本模板初始化项目</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {initProject, getProjectContent} from "@/services/projectService";
import CodeRunner from './CodeRunner.vue';
import ExtensionDisplayContent from "../extensions/ExtensionDisplayContent.vue";
export default {
  name: 'ProjectPlayer',
  components: {
    CodeRunner,
    ExtensionDisplayContent
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

         let baseUrl = import.meta.env.DEV ?`http://localhost:8601/embed.html?id=${this.projectId}&embed=true` : `/scratch/embed.html?id=${this.projectId}&embed=true`;

      if(localStorage.getItem('embedurl')){
        baseUrl = `${localStorage.getItem('embedurl')}/embed.html?id=${this.projectId}&embed=true`;
      }
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
