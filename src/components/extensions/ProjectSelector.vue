<template>
  <v-dialog v-model="dialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-folder-multiple</v-icon>
        选择项目
      </v-card-title>

      <v-card-text style="height: 500px;">
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

        <!-- 项目列表 -->
        <v-row>
          <v-col
            v-for="project in filteredProjects"
            :key="project.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="project-selector-card"
              variant="tonal"
              border
              hover
              @click="selectProject(project)"
            >
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img
                      :src="s3BucketUrl + '/user/' + project.author?.avatar || ''"
                    ></v-img>
                  </v-avatar>
                </template>
                <v-card-title class="text-subtitle-1">
                  {{ project.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ project.description }}
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <div class="d-flex flex-wrap ga-1">
                  <v-chip size="x-small" variant="tonal">
                    {{ project.type }}
                  </v-chip>
                  <v-chip
                    v-if="project.state === 'private'"
                    size="x-small"
                    color="error"
                    variant="tonal"
                  >
                    私密
                  </v-chip>
                  <v-chip size="x-small" variant="tonal" prepend-icon="mdi-eye">
                    {{ project.view_count || 0 }}
                  </v-chip>
                  <v-chip size="x-small" variant="tonal" prepend-icon="mdi-star">
                    {{ project.star_count || 0 }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

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
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { get } from "@/services/serverConfig";

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
  emits: ['update:modelValue', 'select'],
  data() {
    return {
      searchQuery: '',
      s3BucketUrl: ''
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
      if (!this.searchQuery) {
        return this.projects;
      }

      const query = this.searchQuery.toLowerCase();
      return this.projects.filter(project =>
        project.title?.toLowerCase().includes(query)
      );
    }
  },
  async created() {
    try {
      this.s3BucketUrl = await get('s3.staticurl');
    } catch (error) {
      console.warn('Failed to get s3.staticurl:', error);
      this.s3BucketUrl = '';
    }
  },
  methods: {
    selectProject(project) {
      this.$emit('select', project);
    },

    closeDialog() {
      this.dialog = false;
      this.searchQuery = '';
    },

    handleSearchUpdate(value) {
      this.searchQuery = value || '';
    }
  }
};
</script>

<style scoped>
.project-selector-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.project-selector-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>