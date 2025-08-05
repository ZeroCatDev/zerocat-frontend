<template>
  <div>
    <!-- 加载状态 -->
    <v-container
      v-if="loading"
      class="d-flex justify-center align-center"
      style="min-height: 400px"
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-container>

    <!-- 扩展头部信息卡片 -->
    <v-container v-else-if="extension">
      <v-card variant="elevated" border>
        <v-card-item>
          <v-card-title>
            {{ extension?.project?.title || "扩展" }}
          </v-card-title>
          <v-card-subtitle>
            {{ extension?.description || "暂无描述" }}
          </v-card-subtitle>

          <v-row>
            <v-col cols="auto">
              <v-chip
                v-if="isOwner"
                :color="getStatusColor(extension.status)"
                variant="tonal"
                size="default"
                class="mr-2"
              >
                {{ getStatusText(extension.status) }}
              </v-chip>
              <v-chip
                :color="extension?.scratchCompatible ? 'orange' : 'grey'"
                variant="tonal"
                prepend-icon="mdi-puzzle"
              >
                {{ extension?.scratchCompatible ? "兼容Scratch" : "独立扩展" }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-container>

    <!-- 主要内容区域 -->
    <v-container>
      <v-row>
        <v-col cols="12" lg="8">
          <!-- 扩展详细信息卡片 -->
          <v-card border class="mb-6" v-if="extension">
            <v-card-title> 扩展详细信息 </v-card-title>

            <v-card-text class="pa-0">
              <v-list>
                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >扩展ID</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ extension?.id || "N/A" }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >项目ID</v-list-item-title
                  >
                  <v-list-item-subtitle class="text-body-2 font-weight-medium">
                    {{ extension?.project?.id || "N/A" }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >分支信息</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <v-chip
                      color="primary"
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-source-branch"
                    >
                      {{ extension?.branch || "main" }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >提交信息</v-list-item-title
                  >
                  <v-list-item-subtitle class="d-flex align-center">
                    <v-chip
                      color="success"
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-source-commit"
                    >
                      {{ extension?.commit?.substring(0, 8) || "latest" }}
                    </v-chip>
                    <v-btn
                      v-if="
                        isOwner &&
                        extension?.commit &&
                        extension.commit !== 'latest'
                      "
                      size="small"
                      variant="text"
                      prepend-icon="mdi-refresh"
                      :loading="updateLoading"
                      @click="updateToLatestCommit"
                      class="ml-2"
                    >
                      更新到最新
                    </v-btn>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >创建时间</v-list-item-title
                  >
                  <v-list-item-subtitle class="d-flex align-center">
                    <v-icon class="mr-2" size="small" color="primary"
                      >mdi-clock-outline</v-icon
                    >
                    <TimeAgo :date="extension?.created_at" />
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >更新时间</v-list-item-title
                  >
                  <v-list-item-subtitle class="d-flex align-center">
                    <v-icon class="mr-2" size="small" color="primary"
                      >mdi-clock-outline</v-icon
                    >
                    <TimeAgo :date="extension?.updated_at" />
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider
                  v-if="extension?.has_docs && extension?.docs_url"
                ></v-divider>

                <v-list-item v-if="extension?.has_docs && extension?.docs_url">
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >扩展文档</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <v-btn
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-book-open-variant"
                      :href="extension.docs_url"
                      target="_blank"
                    >
                      查看文档
                    </v-btn>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >兼容性信息</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <v-chip
                      :color="extension?.scratchCompatible ? 'orange' : 'grey'"
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-puzzle"
                      class="mb-2"
                    >
                      {{
                        extension?.scratchCompatible
                          ? "兼容原版Scratch"
                          : "不兼容原版Scratch"
                      }}
                    </v-chip>

                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider
                  v-if="
                    extension?.project?.tags &&
                    extension.project.tags.length > 0
                  "
                ></v-divider>

                <v-list-item
                  v-if="
                    extension?.project?.tags &&
                    extension.project.tags.length > 0
                  "
                >
                  <v-list-item-title class="text-caption text-medium-emphasis"
                    >项目标签</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <v-chip
                      v-for="tag in extension.project.tags"
                      :key="tag"
                      size="small"
                      variant="outlined"
                      class="mr-1 mb-1"
                    >
                      {{ tag }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 侧边栏 -->
        <v-col cols="12" lg="4">
          <!-- 项目信息卡片 -->
          <v-card
            v-if="extension?.project"
            border
            class="mb-6"
            :href="extension.project.url"
          >
            <v-card-title> 关联项目 </v-card-title>
            <v-card-item>
              <v-card-title>{{ extension.project.title }}</v-card-title>
              <v-card-subtitle>{{
                extension.project.description || "ZeroCat 上的项目"
              }}</v-card-subtitle>
            </v-card-item>
          </v-card>

          <!-- 示例项目卡片 -->
          <v-card
            v-if="extension?.has_samples && extension?.sample_project"
            border
            class="mb-6"
            :to="`/${extension?.sample_project?.author?.username}/${extension?.sample_project?.name}`"
          >
            <v-card-title> 示例项目 </v-card-title>
            <v-card-item>
              <v-card-title>{{ extension.sample_project.title }}</v-card-title>
              <v-card-subtitle
                >by
                {{
                  extension.sample_project.description || "ZeroCat 上的项目"
                }}</v-card-subtitle
              >
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 扩展管理卡片 (仅扩展所有者可见) -->
    <v-container v-if="isOwner && extension">
      <v-card border>
        <v-card-title> 扩展管理 </v-card-title>

        <v-card-text>
          <!-- 管理操作按钮 -->
          <v-row class="mb-6">
            <v-col cols="12" md="auto">
              <v-btn
                color="primary"
                prepend-icon="mdi-pencil"
                variant="elevated"
                @click="showEditDialog = true"
              >
                编辑扩展
              </v-btn>
            </v-col>
            <v-col cols="12" md="auto">
              <v-btn
                v-if="extension.status === 'developing'"
                color="success"
                prepend-icon="mdi-upload"
                variant="elevated"
                :loading="submitLoading"
                @click="submitExtension"
              >
                提交审核
              </v-btn>
            </v-col>
            <v-col cols="12" md="auto" class="ml-auto">
              <v-btn
                color="error"
                prepend-icon="mdi-delete"
                variant="outlined"
                @click="showDeleteDialog = true"
              >
                删除扩展
              </v-btn>
            </v-col>
          </v-row>

          <!-- 状态时间线 -->
          <v-card variant="tonal">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-history</v-icon>
              开发历史
            </v-card-title>
            <v-card-text>
              <v-timeline density="compact" side="end">
                <v-timeline-item dot-color="primary" size="small">
                  <div class="mb-1">
                    <strong>扩展创建</strong>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    <TimeAgo :date="extension.created_at" />
                  </div>
                </v-timeline-item>

                <v-timeline-item
                  v-if="extension.updated_at !== extension.created_at"
                  dot-color="warning"
                  size="small"
                >
                  <div class="mb-1">
                    <strong>最后更新</strong>
                  </div>
                  <div class="text-caption text-medium-emphasis">
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
                  <div class="text-caption text-medium-emphasis">当前状态</div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- 扩展不存在 -->
    <v-container v-else-if="!extension" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1">mdi-puzzle-remove</v-icon>
      <p class="text-h6 mt-4 text-grey-darken-1">扩展不存在</p>
      <p class="text-body-2 text-grey">找不到指定的扩展信息</p>
      <v-btn class="mt-4" to="/app/extensions" color="primary"
        >返回扩展列表</v-btn
      >
    </v-container>

    <!-- 编辑扩展对话框 -->
    <ExtensionEditDialog
      v-if="isOwner"
      v-model="showEditDialog"
      :extension="extension"
      @updated="fetchExtensionDetail"
    />

    <!-- 删除扩展对话框 -->
    <v-dialog v-if="isOwner" v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>删除扩展</v-card-title>
        <v-card-text>
          确定要删除扩展"{{ extension?.name }}"吗？此操作不可撤销。
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
import { get } from "@/services/serverConfig";
import { localuser } from "@/services/localAccount";
import TimeAgo from "@/components/TimeAgo.vue";
import ExtensionEditDialog from "@/components/extensions/ExtensionEditDialog.vue";

export default {
  name: "ExtensionDetail",
  components: {
    TimeAgo,
    ExtensionEditDialog,
  },
  setup() {
    useHead({
      title: "扩展详情 - ZeroCat",
    });
  },
  data() {
    return {
      loading: true,
      extension: null,
      s3BucketUrl: "",
      localuser,

      // 管理功能相关
      showEditDialog: false,
      showDeleteDialog: false,
      deleteLoading: false,
      submitLoading: false,
      updateLoading: false,

      snackbar: {
        show: false,
        message: "",
        color: "success",
      },
    };
  },
  computed: {
    isOwner() {
      if (!this.extension || !localuser.isLogin.value) return false;
      return localuser.user.value?.id === this.extension?.author?.id;
    },
  },
  async created() {
    this.s3BucketUrl = get("s3.staticurl");
    await this.fetchExtensionDetail();
  },
  methods: {
    async fetchExtensionDetail() {
      this.loading = true;
      try {
        const extensionId = this.$route.params.id;

        // 先尝试以用户身份获取详情（可能包含管理权限）
        let response;
        try {
          response = await request.get(
            `/extensions/detail/${extensionId}?scope=my`
          );
        } catch (error) {
          // 如果用户端失败，尝试公开端点
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            response = await request.get(
              `/extensions/detail/${extensionId}?scope=public`
            );
          } else {
            throw error;
          }
        }

        if (response.data?.status === "success") {
          this.extension = response.data.data;

          // 更新页面标题
          useHead({
            title: `${this.extension.project?.title || "扩展"} - ZeroCat`,
          });
        } else {
          this.extension = null;
        }
      } catch (error) {
        console.error("Failed to fetch extension detail:", error);
        this.extension = null;
      } finally {
        this.loading = false;
      }
    },

    async deleteExtension() {
      if (!this.extension || !this.isOwner) return;

      this.deleteLoading = true;
      try {
        const response = await request.delete(
          `/extensions/manager/${this.extension.id}`
        );
        if (response.data.status === "success") {
          this.showMessage("删除扩展成功", "success");
          this.$router.push("/app/extensions");
        } else {
          this.showMessage(response.data.message || "删除扩展失败", "error");
        }
      } catch (error) {
        console.error("Failed to delete extension:", error);
        this.showMessage("删除扩展失败", "error");
      } finally {
        this.deleteLoading = false;
        this.showDeleteDialog = false;
      }
    },

    async submitExtension() {
      if (!this.extension || !this.isOwner) return;
      this.submitLoading = true;
      try {
        const response = await request.post(
          `/extensions/manager/submit/${this.extension.id}`
        );
        if (response.data.status === "success") {
          this.showMessage("提交审核成功", "success");
          await this.fetchExtensionDetail();
        } else {
          this.showMessage(response.data.message || "提交失败", "error");
        }
      } catch (error) {
        console.error("Failed to submit extension:", error);
        this.showMessage("提交失败", "error");
      } finally {
        this.submitLoading = false;
      }
    },

    async updateToLatestCommit() {
      if (!this.extension || !this.isOwner) return;
      this.updateLoading = true;
      try {
        const response = await request.post(
          `/extensions/manager/update/${this.extension.id}`
        );
        if (response.data.status === "success") {
          this.showMessage("更新到最新提交成功", "success");
          await this.fetchExtensionDetail();
        } else {
          this.showMessage(response.data.message || "更新失败", "error");
        }
      } catch (error) {
        console.error("Failed to update commit:", error);
        this.showMessage("更新失败", "error");
      } finally {
        this.updateLoading = false;
      }
    },

    getStatusColor(status) {
      const colorMap = {
        developing: "primary",
        pending: "warning",
        verified: "success",
        rejected: "error",
      };
      return colorMap[status] || "grey";
    },

    getStatusText(status) {
      const textMap = {
        developing: "开发中",
        pending: "待审核",
        verified: "上架",
        rejected: "已拒绝",
      };
      return textMap[status] || "未知";
    },

    showMessage(message, color = "success") {
      this.snackbar = {
        show: true,
        message,
        color,
      };
    },
  },
};
</script>
