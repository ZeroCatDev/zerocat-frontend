<template>
  <div>
    <!-- 背景弥散光效果 -->
    <div class="extension-hero">
      <div class="hero-background">
        <div class="glow-effect glow-1"></div>
        <div class="glow-effect glow-2"></div>
        <div class="glow-effect glow-3"></div>
      </div>

      <v-container class="hero-content"
        >
        <v-img :src="s3BucketUrl + '/material/asset/' + extension?.image+'.png'"></v-img>
        <v-card
          class="info-card"
          :title="extension?.project?.title"
          :subtitle="extension?.project?.description"
          ><v-card-item
            :prepend-avatar="
              localuser.getUserAvatar(extension?.project?.author?.avatar) || ''
            "
          >
            <v-card-title>
              {{
                extension?.project?.author?.display_name ||
                extension?.project?.author?.username ||
                "未知开发者"
              }}
            </v-card-title>
            <v-card-subtitle>
              {{ extension?.project?.author?.username || "未知开发者" }}
            </v-card-subtitle>
          </v-card-item></v-card
        >
      </v-container>
    </div>

    <!-- 主要内容区域 -->
    <v-container class="main-content">
      <v-row>
        <v-col cols="12" lg="8">
          <!-- 详细信息卡片 -->
          <v-card class="info-card mb-6" elevation="8">
            <v-card-title class="text-h5 font-weight-bold pa-6">
              <v-icon class="mr-3" color="primary">mdi-information</v-icon>
              扩展信息
            </v-card-title>

            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">扩展ID</div>
                    <div class="info-value">{{ extension?.id || "N/A" }}</div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">项目ID</div>
                    <div class="info-value">
                      {{ extension?.project?.id || "N/A" }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">分支</div>
                    <div class="info-value">
                      <v-chip color="primary" variant="outlined" size="small">
                        {{ extension?.branch || "main" }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">提交</div>
                    <div class="info-value">
                      <v-chip color="success" variant="outlined" size="small">
                        {{ extension?.commit || "latest" }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">创建时间</div>
                    <div class="info-value">
                      {{ formatDate(extension?.created_at) }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">更新时间</div>
                    <div class="info-value">
                      {{ formatDate(extension?.updated_at) }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="info-label">Scratch兼容性</div>
                    <div class="info-value">
                      <v-chip
                        :color="extension?.scratchCompatible ? 'orange' : 'grey'"
                        variant="outlined"
                        size="small"
                        prepend-icon="mdi-puzzle"
                      >
                        {{ extension?.scratchCompatible ? '兼容原版Scratch' : '不兼容原版Scratch' }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 侧边栏 -->
        <v-col cols="12" lg="4">
          <!-- 操作卡片 -->
          <v-card class="action-card mb-6" elevation="8">
            <v-card-title class="text-h6 font-weight-bold pa-6">
              <v-icon class="mr-3" color="primary">mdi-cog</v-icon>
              操作
            </v-card-title>

            <v-card-text class="pa-6">
              <div class="action-buttons">
                <v-btn
                  color="primary"
                  size="large"
                  block
                  class="mb-4"
                  :to="`/${extension?.project?.author?.username}/${extension?.project?.name}`"
                >
                  <v-icon start>mdi-open-in-new</v-icon>
                  查看项目
                </v-btn>

                <v-btn
                  v-if="extension?.sample_project!=null"
                  color="success"
                  size="large"
                  block
                  variant="outlined"
                  :to="`/${extension?.sample_project?.author?.username}/${extension?.sample_project?.name}`"
                >
                  <v-icon start>mdi-eye</v-icon>
                  查看示例项目
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- 统计信息卡片 -->

        </v-col>
      </v-row>
    </v-container>

    <!-- 加载状态 -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { useHead } from "@unhead/vue";
import request from "@/axios/axios";
import { get } from "@/services/serverConfig";
import { localuser } from "@/services/localAccount";
export default {
  name: "ExtensionDetail",
  setup() {
    useHead({
      title: "扩展详情 - ZeroCat",
    });
  },
  data() {
    return {
      loading: false,
      extension: null,
      s3BucketUrl: "",
      localuser,
    };
  },
  async created() {
    this.s3BucketUrl = await get("s3.staticurl");
    await this.fetchExtensionDetail();
  },
  methods: {
    async fetchExtensionDetail() {
      this.loading = true;
      try {
        const extensionId = this.$route.params.id;
        const response = await request.get(
          `/extensions/marketplace/${extensionId}`
        );

        if (response.data?.status === "success") {
          this.extension = response.data.data;
        }
      } catch (error) {
        console.error("Failed to fetch extension detail:", error);
        // 可以添加错误处理，比如跳转到404页面
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
/* 英雄区域样式 */
.extension-hero {
  position: relative;
  min-height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.glow-effect {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.glow-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ff6b6b, transparent);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.glow-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #4ecdc4, transparent);
  top: 50%;
  right: -200px;
  animation-delay: 2s;
}

.glow-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #45b7d1, transparent);
  bottom: -100px;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-row {
  min-height: 400px;
}

.extension-icon-wrapper {
  display: flex;
  justify-content: center;
}

.extension-icon {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.extension-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.extension-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.author-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-name {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 主要内容区域 */
.main-content {
  margin-top: -50px;
  position: relative;
  z-index: 3;
}

/* 卡片样式 */
.info-card,
.docs-card,
.sample-card,
.action-card,
.stats-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover,
.docs-card:hover,
.sample-card:hover,
.action-card:hover,
.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* 信息项样式 */
.info-item {
  padding: 16px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-weight: 500;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1rem;
  color: rgba(var(--v-theme-on-surface), 0.87);
  font-weight: 600;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 统计网格样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 12px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* 响应式设计 */
@media (max-width: 960px) {
  .extension-title {
    font-size: 2.5rem;
  }

  .extension-description {
    font-size: 1.1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .extension-hero {
    min-height: 300px;
  }

  .hero-row {
    min-height: 300px;
  }

  .extension-title {
    font-size: 2rem;
  }

  .extension-description {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    margin-top: -30px;
  }
}
</style>
