<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-plus</v-icon>
        创建扩展
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <!-- 项目选择 -->
          <v-card variant="tonal" border hover class="mb-4">
            <v-card-title class="text-subtitle-1">选择项目</v-card-title>
            <v-card-text>
              <div class="d-flex align-center mb-3">

                <v-btn
                  class="ml-2"
                  variant="tonal"
                  @click="showProjectSelector = true"
                >
                  选择
                </v-btn>
              </div>

              <!-- 已选择的项目 -->
              <div v-if="selectedProject" class="selected-project">
                <ProjectCard
                  :project="selectedProject"
                  :show-author="true"
                  :author="selectedProject.author"
                />
              </div>

              <div v-else class="text-center py-4 text-grey">
                <v-icon size="48">mdi-folder-outline</v-icon>
                <p class="mt-2">请选择要创建扩展的项目</p>
                <p class="text-caption text-grey">扩展将使用项目的默认分支和最新提交</p>
              </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog">取消</v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!selectedProject"
          @click="createExtension"
        >
          创建扩展
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- 项目选择对话框 -->
    <ProjectSelector
      v-model="showProjectSelector"
      :projects="myProjects"
      @select="selectProject"
    />
  </v-dialog>
</template>

<script>
import request from "@/axios/axios";
import { localuser } from "@/services/localAccount";
import { get } from "@/services/serverConfig";
import ProjectCard from "@/components/project/ProjectCard.vue";
import ProjectSelector from "./ProjectSelector.vue";

export default {
  name: "ExtensionCreateDialog",
  components: {
    ProjectCard,
    ProjectSelector
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'created'],
  data() {
    return {
      formValid: false,
      loading: false,
      s3BucketUrl: '',

      myProjects: [],
      selectedProject: null,
      scratchCompatible: false,

      showProjectSelector: false
    };
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },
  async created() {
    this.s3BucketUrl = await get('s3.staticurl');
    await this.fetchMyProjects();
  },
  methods: {
    async fetchMyProjects() {
      try {
        const response = await request.get('/searchapi', {
          params: {
            search_userid: localuser.user.value.id,
            search_state: 'public',
            limit: 100
          }
        });
        if (response.data && response.data.projects) {
          this.myProjects = response.data.projects;
        }
      } catch (error) {
        console.error('Failed to fetch my projects:', error);
      }
    },

    selectProject(project) {
      this.selectedProject = project;
      this.showProjectSelector = false;
    },

    async createExtension() {
      if (!this.selectedProject) return;

      this.loading = true;
      try {
        const payload = {
          projectid: this.selectedProject.id,
          scratchCompatible: this.scratchCompatible
        };

        const response = await request.post('/extensions/manager/create', payload);

        if (response.data.status === 'success') {
          this.$emit('created');
          this.closeDialog();
          this.showMessage('扩展创建成功', 'success');
        } else {
          this.showMessage(response.data.message || '创建失败', 'error');
        }
      } catch (error) {
        console.error('Failed to create extension:', error);
        this.showMessage('创建扩展失败', 'error');
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.selectedProject = null;
      this.scratchCompatible = false;
      this.projectSearch = '';
    },

    closeDialog() {
      this.dialog = false;
    },

    showMessage(message, color) {
      // 这里可以触发全局消息显示
      console.log(message);
    }
  }
};
</script>

<style scoped>
.selected-project {
  max-width: 100%;
}
</style>