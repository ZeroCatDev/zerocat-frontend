<template>
  <v-dialog v-model="dialog" max-width="1000" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-folder-multiple</v-icon>
          选择项目
        </div>
        <div class="d-flex align-center">
          <v-checkbox
            v-model="selectAll"
            :indeterminate="isIndeterminate"
            @change="toggleSelectAll"
            hide-details
            class="mr-2"
          ></v-checkbox>
          <span class="text-caption">{{ selectedCount }}/{{ filteredProjects.length }} 已选择</span>
          <v-btn
            v-if="selectedProjects.length > 0"
            variant="text"
            size="small"
            color="error"
            class="ml-2"
            @click="clearSelection"
          >
            取消选择
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text style="height: 600px;">
        <!-- 搜索框 -->
        <v-text-field
          v-model="searchQuery"
          label="项目名"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          class="mb-4"
          @update:model-value="handleSearchUpdate"
        ></v-text-field>

        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="text-body-2 text-grey mt-3">正在加载项目...</p>
        </div>

        <!-- 项目列表 -->
        <v-list v-else class="project-list">
          <v-list-item
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-item mb-2"
            variant="outlined"
            rounded
            :class="{ 'selected-item': selectedProjects.includes(project.id) }"
            @click="toggleProjectSelection(project.id)"
            :density="'compact'"
          >
            <template v-slot:prepend>
              <v-checkbox
                :model-value="selectedProjects.includes(project.id)"
                @update:model-value="toggleProjectSelection(project.id)"
                hide-details
                @click.stop
              ></v-checkbox>
            </template>

            <v-list-item-title>
              <div class="d-flex align-center">
                <v-avatar size="32" class="mr-3">
                  <v-img
                    v-if="project.thumbnail"
                    :src="`${s3BucketUrl}/${project.thumbnail}`"
                    :alt="project.title"
                  ></v-img>
                  <v-icon v-else>mdi-folder</v-icon>
                </v-avatar>
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
                <v-chip size="x-small" variant="tonal" prepend-icon="mdi-eye">
                  {{ project.view_count || 0 }}
                </v-chip>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- 空状态 -->
        <div v-if="filteredProjects.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-folder-outline</v-icon>
          <p class="text-h6 mt-4 text-grey-darken-1">
            {{ searchQuery ? '未找到匹配的项目' : '暂无项目' }}
          </p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog">取消</v-btn>
        <v-btn
          color="primary"
          :disabled="selectedProjects.length === 0"
          @click="confirmSelection"
        >
          确认选择 ({{ selectedProjects.length }})
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { get } from "@/services/serverConfig";
import request from "@/axios/axios";
import { localuser } from "@/services/localAccount";

export default {
  name: "ProjectSelector",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    projects: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'select', 'multiSelect'],
  data() {
    return {
      searchQuery: '',
      s3BucketUrl: '',
      selectedProjects: [],
      allProjects: [],
      searchTimeout: null,
      loading: false
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

    filteredProjects() {
      const projects = this.allProjects.length > 0 ? this.allProjects : this.projects;
      let filtered = projects;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = projects.filter(project =>
          project.title?.toLowerCase().includes(query)
        );
      }

      // 限制显示数量，避免渲染过多项目导致卡顿
      return filtered.slice(0, 100);
    },

    selectedCount() {
      return this.selectedProjects.length;
    },

    selectAll: {
      get() {
        return this.filteredProjects.length > 0 && this.selectedProjects.length === this.filteredProjects.length;
      },
      set(value) {
        // 这个setter不会被直接调用，通过toggleSelectAll方法处理
      }
    },

    isIndeterminate() {
      return this.selectedProjects.length > 0 && this.selectedProjects.length < this.filteredProjects.length;
    }
  },
  async created() {
    try {
      this.s3BucketUrl = await get('s3.staticurl');
      await this.fetchProjects();
    } catch (error) {
      console.warn('Failed to get s3.staticurl:', error);
      this.s3BucketUrl = '';
    }
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        const response = await request.get('/searchapi', {
          params: {
            search_userid: localuser.user.value.id,
            limit: 200
          }
        });
        if (response.data && response.data.projects) {
          this.allProjects = response.data.projects;
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        this.loading = false;
      }
    },

    selectProject(project) {
      // 保持向后兼容的单选功能
      this.$emit('select', project);
    },

    confirmSelection() {
      // 获取选中的项目对象
      const projects = this.allProjects.length > 0 ? this.allProjects : this.projects;
      const selectedProjectObjects = projects.filter(project =>
        this.selectedProjects.includes(project.id)
      );
      this.$emit('multiSelect', selectedProjectObjects);
      this.closeDialog();
    },

    toggleSelectAll() {
      if (this.selectedProjects.length === this.filteredProjects.length) {
        // 当前是全选状态，取消全选
        this.selectedProjects = [];
      } else {
        // 当前不是全选状态，全选
        this.selectedProjects = this.filteredProjects.map(p => p.id);
      }
    },

    toggleProjectSelection(projectId) {
      const index = this.selectedProjects.indexOf(projectId);
      if (index > -1) {
        this.selectedProjects.splice(index, 1);
      } else {
        this.selectedProjects.push(projectId);
      }
    },

    clearSelection() {
      this.selectedProjects = [];
    },

    closeDialog() {
      this.dialog = false;
      this.searchQuery = '';
      this.selectedProjects = [];
    },

    handleSearchUpdate(value) {
      // 使用防抖来优化搜索性能
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.searchQuery = value || '';
      }, 300);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    }
  }
};
</script>

<style scoped>
.project-list {
  max-height: 500px;
  overflow-y: auto;
}

.project-item {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: all 0.2s ease;
  cursor: pointer;
}

.project-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selected-item {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>