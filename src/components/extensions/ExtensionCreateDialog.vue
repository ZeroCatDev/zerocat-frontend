<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-plus</v-icon>
        创建扩展
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid">
          <!-- 项目选择 -->
          <v-card variant="tonal" border hover class="mb-4">
            <v-card-title class="text-subtitle-1 d-flex align-center justify-space-between">
              <span>选择项目</span>
              <div class="d-flex align-center">
                <v-chip
                  v-if="selectedProjects.length > 0"
                  color="primary"
                  size="small"
                  variant="tonal"
                >
                  {{ selectedProjects.length }} 个项目
                </v-chip>
              </div>
            </v-card-title>
            <v-card-text>
              <!-- 已选择的项目列表 -->
              <div v-if="selectedProjects.length > 0" class="selected-projects">
                <div class="text-caption text-grey mb-3">
                  已选择 {{ selectedProjects.length }} 个项目
                </div>
                <v-list class="project-list">
                  <v-list-item
                    v-for="project in selectedProjects"
                    :key="project.id"
                    class="project-item mb-2"
                    variant="outlined"
                    rounded
                  >
                    <template v-slot:prepend>
                      <v-avatar size="32" class="mr-3">
                        <v-img
                          v-if="project.thumbnail"
                          :src="`${s3BucketUrl}/${project.thumbnail}`"
                          :alt="project.title"
                        ></v-img>
                        <v-icon v-else>mdi-folder</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title>
                      <div class="d-flex align-center">
                        <div class="flex-grow-1">
                          <div class="font-weight-medium">{{ project.title }}</div>
                          <div class="text-caption text-grey">
                            {{ project.author?.username || '未知用户' }} •
                            {{ formatDate(project.updated_at) }}
                          </div>
                        </div>
                      </div>
                    </v-list-item-title>

                    <template v-slot:append>
                      <div class="d-flex align-center">
                        <v-chip
                          v-if="project.state === 'public'"
                          color="success"
                          size="small"
                          variant="tonal"
                          class="mr-2"
                        >
                          公开
                        </v-chip>
                        <v-chip
                          v-else-if="project.state === 'private'"
                          color="error"
                          size="small"
                          variant="tonal"
                          class="mr-2"
                        >
                          私密
                        </v-chip>
                        <v-btn
                          icon="mdi-close"
                          size="small"
                          variant="text"
                          color="error"
                          @click.stop="removeProject(project)"
                        ></v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </div>

              <!-- 选择项目按钮 -->
              <div class="text-center py-4">
                <v-btn
                  color="primary"
                  size="large"
                  @click="showProjectSelector = true"
                >
                  <v-icon class="mr-2">mdi-folder-multiple</v-icon>
                  {{ selectedProjects.length > 0 ? '重新选择项目' : '选择项目' }}
                </v-btn>
                <v-btn
                  v-if="selectedProjects.length > 0"
                  variant="outlined"
                  color="error"
                  class="ml-2"
                  @click="clearAllProjects"
                >
                  清空所有
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- 批量设置 -->
          <v-card variant="tonal" border class="mb-4">
            <v-card-title class="text-subtitle-1">批量设置</v-card-title>
            <v-card-text>
              <v-checkbox
                v-model="scratchCompatible"
                label="兼容 Scratch"
                hide-details
              ></v-checkbox>
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
          :disabled="selectedProjects.length === 0"
          @click="createExtensions"
        >
          创建扩展 ({{ selectedProjects.length }})
        </v-btn>
      </v-card-actions>

      <!-- 进度对话框 -->
      <v-dialog v-model="createProgress.isVisible" persistent max-width="400">
        <v-card>
          <v-card-title class="text-center">
            正在创建扩展...
          </v-card-title>
          <v-card-text>
            <v-progress-linear
              :model-value="(createProgress.current / createProgress.total) * 100"
              color="primary"
              height="8"
              rounded
            ></v-progress-linear>
            <div class="text-center mt-3">
              <p class="text-body-2">
                {{ createProgress.current }} / {{ createProgress.total }}
              </p>
              <p class="text-caption text-grey">
                正在处理第 {{ createProgress.current }} 个项目...
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>

    <!-- 项目选择对话框 -->
    <ProjectSelector
      v-model="showProjectSelector"
      :projects="[]"
      @multiSelect="addMultipleProjects"
    />
  </v-dialog>
</template>

<script>
import request from "@/axios/axios";
import { localuser } from "@/services/localAccount";
import { get } from "@/services/serverConfig";
import ProjectSelector from "./ProjectSelector.vue";

export default {
  name: "ExtensionCreateDialog",
  components: {
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

      selectedProjects: [],
      scratchCompatible: false,

      showProjectSelector: false,
      createProgress: {
        current: 0,
        total: 0,
        isVisible: false
      }
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
    },
    selectedCount() {
      return this.selectedProjects.length;
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
  },
  methods: {
    addMultipleProjects(projects) {
      // 直接设置选中的项目
      this.selectedProjects = projects;
      this.showProjectSelector = false;
    },

    removeProject(project) {
      // 从列表中移除项目
      const index = this.selectedProjects.findIndex(p => p.id === project.id);
      if (index > -1) {
        this.selectedProjects.splice(index, 1);
      }
    },

    clearAllProjects() {
      this.selectedProjects = [];
    },

    async createExtensions() {
      if (this.selectedProjects.length === 0) return;

      this.loading = true;
      this.createProgress = {
        current: 0,
        total: this.selectedProjects.length,
        isVisible: true
      };

      try {
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < this.selectedProjects.length; i++) {
          const project = this.selectedProjects[i];
          this.createProgress.current = i + 1;

          try {
            const payload = {
              projectid: project.id,
              scratchCompatible: this.scratchCompatible
            };
            const response = await request.post('/extensions/manager/create', payload);

            if (response.data.status === 'success') {
              successCount++;
            } else {
              failCount++;
              console.error(`Failed to create extension for project ${project.id}:`, response.data);
            }
          } catch (error) {
            failCount++;
            console.error(`Failed to create extension for project ${project.id}:`, error);
          }
        }

        if (successCount > 0) {
          this.$emit('created');
          this.closeDialog();

          if (failCount > 0) {
            this.showMessage(`成功创建 ${successCount} 个扩展，${failCount} 个失败`, 'warning');
          } else {
            this.showMessage(`成功创建 ${successCount} 个扩展`, 'success');
          }
        } else {
          this.showMessage('所有扩展创建失败', 'error');
        }
      } catch (error) {
        console.error('Failed to create extensions:', error);
        this.showMessage('创建扩展失败', 'error');
      } finally {
        this.loading = false;
        this.createProgress.isVisible = false;
      }
    },

    resetForm() {
      this.selectedProjects = [];
      this.scratchCompatible = false;
    },

    closeDialog() {
      this.dialog = false;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },

    showMessage(message, color) {
      // 这里可以触发全局消息显示
      console.log(message);
    }
  }
};
</script>

<style scoped>
.selected-projects {
  max-height: 300px;
  overflow-y: auto;
}

.project-list {
  max-height: 250px;
  overflow-y: auto;
}

.project-item {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: all 0.2s ease;
}

.project-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>