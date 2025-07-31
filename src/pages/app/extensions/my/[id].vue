<template>
  <div>
    <v-container v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-container>

    <v-container v-else-if="extension">
      <v-row>
        <!-- 左侧主要内容 -->
        <v-col cols="12" lg="8" md="8" sm="12">
          <!-- 扩展详情 -->
          <v-card class="mb-4" variant="flat">
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar size="64">
                  <v-img
                    v-if="extension.image"
                    :src="s3BucketUrl + '/extension/' + extension.image"
                  ></v-img>
                  <v-icon v-else size="32">mdi-puzzle</v-icon>
                </v-avatar>
              </template>
              <v-card-title class="text-h4">
                {{ extension.project?.title || '扩展' }}
              </v-card-title>
              <v-card-subtitle class="text-h6 mt-2">
                {{ extension.project?.description || '扩展' }}
              </v-card-subtitle>
              <template v-slot:append>
                <v-chip
                  :color="getStatusColor(extension.status)"
                  size="large"
                  variant="flat"
                >
                  {{ getStatusText(extension.status) }}
                </v-chip>
              </template>
            </v-card-item>
          </v-card>

          <!-- 操作按钮 -->
          <v-card class="mb-4" variant="tonal" border hover>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-pencil"
                  variant="elevated"
                  @click="showEditDialog = true"
                >
                  编辑
                </v-btn>
                <v-btn
                  v-if="extension.status === 'developing'"
                  color="success"
                  prepend-icon="mdi-upload"
                  variant="elevated"
                  :loading="submitLoading"
                  @click="submitExtension"
                >
                  推送
                </v-btn>
                <v-btn
                  prepend-icon="mdi-open-in-new"
                  variant="outlined"
                  :to="`/${extension.project?.author?.username}/${extension.project?.name}`"
                >
                  查看项目
                </v-btn>
                <v-btn
                  v-if="extension.sample_project"
                  prepend-icon="mdi-file-document"
                  variant="outlined"
                  :to="`/${extension.sample_project?.author?.username}/${extension.sample_project?.name}`"
                >
                  查看示例项目
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="error"
                  prepend-icon="mdi-delete"
                  variant="outlined"
                  @click="showDeleteDialog = true"
                >
                  删除
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- 扩展信息 -->
          <v-card variant="tonal" border hover>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-information</v-icon>
              扩展信息
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                            <div class="text-subtitle-2 text-grey-darken-1 mb-1">分支</div>
                    <v-chip prepend-icon="mdi-source-branch" variant="tonal">
                      {{ extension.branch || 'main' }}
                    </v-chip>
                  </div>

                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey-darken-1 mb-1">提交ID</div>
                    <div class="d-flex align-center">
                      <v-chip prepend-icon="mdi-source-commit" variant="tonal">
                        {{ extension.commit?.substring(0, 8) || 'latest' }}
                      </v-chip>
                      <v-btn
                        v-if="extension.commit && extension.commit !== 'latest'"
                        size="small"
                        variant="text"
                        prepend-icon="mdi-refresh"
                        :loading="updateLoading"
                        @click="updateToLatestCommit"
                        class="ml-2"
                      >
                        更新到最新
                      </v-btn>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey-darken-1 mb-1">创建时间</div>
                    <div class="d-flex align-center">
                      <v-icon class="mr-1" size="small">mdi-clock</v-icon>
                      <TimeAgo :date="extension.created_at" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey-darken-1 mb-1">更新时间</div>
                    <div class="d-flex align-center">
                      <v-icon class="mr-1" size="small">mdi-clock</v-icon>
                      <TimeAgo :date="extension.updated_at" />
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <div v-if="extension.docs" class="mb-4">
                <div class="text-subtitle-2 text-grey-darken-1 mb-2">文档</div>
                <v-chip prepend-icon="mdi-book-open-variant" variant="tonal">
                  {{ extension.docs }}
                </v-chip>
              </div>

              <div class="mb-4">
                <div class="text-subtitle-2 text-grey-darken-1 mb-2">Scratch兼容性</div>
                <v-chip
                  :color="extension.scratchCompatible ? 'orange' : 'grey'"
                  prepend-icon="mdi-puzzle"
                  variant="tonal"
                >
                  {{ extension.scratchCompatible ? '兼容原版Scratch' : '不兼容原版Scratch' }}
                </v-chip>
                <p class="text-caption text-grey mt-1">
                  {{ extension.scratchCompatible ? '此扩展可以在Scratch项目中使用' : '此扩展仅适用于其他平台' }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 项目 -->
        <v-col cols="12" lg="4" md="4" sm="12">
          <!-- 项目 -->
          <v-card v-if="extension.project" class="mb-4" variant="tonal" border hover>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-folder</v-icon>
              项目
            </v-card-title>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar>
                  <v-img
                    :src="localuser.getUserAvatar(extension.project.author?.avatar) || ''"
                  ></v-img>
                </v-avatar>
              </template>
              <v-card-title>{{ extension.project.title }}</v-card-title>
              <v-card-subtitle>by {{ extension.project.author?.display_name || extension.project.author?.username }}</v-card-subtitle>
            </v-card-item>
            <v-card-text>
              <p class="mb-3">{{ extension.project.description }}</p>
              <div class="d-flex flex-wrap ga-2">
                <v-chip size="small" variant="tonal">
                  {{ extension.project.type }}
                </v-chip>
                <v-chip size="small" variant="tonal" prepend-icon="mdi-eye">
                  {{ extension.project.view_count || 0 }}
                </v-chip>
                <v-chip size="small" variant="tonal" prepend-icon="mdi-star">
                  {{ extension.project.star_count || 0 }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- 示例项目 -->
          <v-card v-if="extension.sample_project" class="mb-4" variant="tonal" border hover>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-file-document</v-icon>
              示例项目
            </v-card-title>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar>
                  <v-img
                    :src="localuser.getUserAvatar(extension.sample_project.author?.avatar) || ''"
                  ></v-img>
                </v-avatar>
              </template>
              <v-card-title>{{ extension.sample_project.title }}</v-card-title>
              <v-card-subtitle>by {{ extension.sample_project.author?.display_name || extension.sample_project.author?.username }}</v-card-subtitle>
            </v-card-item>
          </v-card>

          <!-- 历史 -->
          <v-card variant="tonal" border hover>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-history</v-icon>
              历史
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" side="end">
                <v-timeline-item
                  dot-color="primary"
                  size="small"
                >
                  <div class="mb-1">
                    <strong>创建时间</strong>
                  </div>
                  <div class="text-caption text-grey">
                    <TimeAgo :date="extension.created_at" />
                  </div>
                </v-timeline-item>

                <v-timeline-item
                  v-if="extension.updated_at !== extension.created_at"
                  dot-color="warning"
                  size="small"
                >
                  <div class="mb-1">
                    <strong>更新时间</strong>
                  </div>
                  <div class="text-caption text-grey">
                    <TimeAgo :date="extension.updated_at" />
                  </div>
                </v-timeline-item>

                <v-timeline-item
                  :dot-color="getStatusColor(extension.status)"
                  size="small"
                >
                  <div class="mb-1">
                    <strong>{{ getStatusText(extension.status) }}</strong>
                  </div>
                  <div class="text-caption text-grey">
                    状态
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 扩展详情 -->
    <v-container v-else class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1">mdi-puzzle-remove</v-icon>
            <p class="text-h6 mt-4 text-grey-darken-1">扩展详情</p>
      <p class="text-body-2 text-grey">扩展详情</p>
      <v-btn class="mt-4" to="/app/extensions">返回扩展管理</v-btn>
    </v-container>

    <!-- 编辑扩展 -->
    <ExtensionEditDialog
      v-model="showEditDialog"
      :extension="extension"
      @updated="fetchExtension"
    />

    <!-- 删除扩展 -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>删除扩展</v-card-title>
        <v-card-text>
          确定删除扩展"{{ extension?.project?.title }}"
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">取消</v-btn>
          <v-btn
            color="error"
            :loading="deleteLoading"
            @click="deleteExtension"
          >
            删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 消息提示 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>
import { useHead } from "@unhead/vue";
import request from "@/axios/axios";
import { localuser } from "@/services/localAccount";
import { get } from "@/services/serverConfig";
import TimeAgo from "@/components/TimeAgo.vue";
import ExtensionEditDialog from "@/components/extensions/ExtensionEditDialog.vue";

export default {
  name: "ExtensionDetail",
  components: {
    TimeAgo,
    ExtensionEditDialog
  },
  data() {
    return {
      loading: true,
      extension: null,
      s3BucketUrl: '',

      showEditDialog: false,
      showDeleteDialog: false,
      deleteLoading: false,

      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      submitLoading: false,
      updateLoading: false,
      localuser,
    };
  },
  async created() {
    if (localuser.isLogin.value === false) {
      this.$router.push("/app/account/login");
      return;
    }

    this.s3BucketUrl = await get('s3.staticurl');
    await this.fetchExtension();
  },
  methods: {
    async fetchExtension() {
      this.loading = true;
      try {
        const extensionId = this.$route.params.id;
        const response = await request.get(`/extensions/manager/${extensionId}`);

        if (response.data.status === 'success') {
          this.extension = response.data.data;

          useHead({
            title: `${this.extension.project?.title || '扩展'} - ZeroCat`,
          });
        } else {
          this.extension = null;
        }
      } catch (error) {
        console.error('Failed to fetch extension:', error);
        this.extension = null;
      } finally {
        this.loading = false;
      }
    },

    async deleteExtension() {
      if (!this.extension) return;

      this.deleteLoading = true;
      try {
        const response = await request.delete(`/extensions/manager/${this.extension.id}`);
        if (response.data.status === 'success') {
          this.showMessage('删除扩展成功', 'success');
          this.$router.push('/app/extensions');
        } else {
          this.showMessage(response.data.message || '删除扩展失败', 'error');
        }
      } catch (error) {
        console.error('Failed to delete extension:', error);
        this.showMessage('删除扩展失败', 'error');
      } finally {
        this.deleteLoading = false;
        this.showDeleteDialog = false;
      }
    },

    async submitExtension() {
      if (!this.extension) return;
      this.submitLoading = true;
      try {
        const response = await request.post(`/extensions/manager/submit/${this.extension.id}`);
        if (response.data.status === 'success') {
          this.showMessage('推送成功', 'success');
          await this.fetchExtension();
        } else {
          this.showMessage(response.data.message || '推送失败', 'error');
        }
      } catch (error) {
        console.error('Failed to submit extension:', error);
        this.showMessage('推送失败', 'error');
      } finally {
        this.submitLoading = false;
      }
    },

    async updateToLatestCommit() {
      if (!this.extension) return;
      this.updateLoading = true;
      try {
        const response = await request.post(`/extensions/manager/update/${this.extension.id}`);
        if (response.data.status === 'success') {
          this.showMessage('更新成功', 'success');
          await this.fetchExtension();
        } else {
          this.showMessage(response.data.message || '更新失败', 'error');
        }
      } catch (error) {
        console.error('Failed to update commit:', error);
        this.showMessage('更新失败', 'error');
      } finally {
        this.updateLoading = false;
      }
    },

    getStatusColor(status) {
      const colorMap = {
        'developing': 'primary',
        'pending': 'warning',
        'verified': 'success',
        'rejected': 'error'
      };
      return colorMap[status] || 'grey';
    },

    getStatusText(status) {
      const textMap = {
        'developing': '开发中',
        'pending': '待审核',
        'verified': '已审核',
        'rejected': '已拒绝'
      };
      return textMap[status] || '未知';
    },

    showMessage(message, color = 'success') {
      this.snackbar = {
        show: true,
        message,
        color
      };
    }
  }
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>