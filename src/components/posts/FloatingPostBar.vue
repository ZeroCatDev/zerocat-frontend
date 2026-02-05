<template>
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="isExpanded"
        class="floating-overlay"
        @click="collapse"
      />
    </Transition>

    <!-- 悬浮发帖栏 -->
    <div
      class="floating-post-bar"
      :class="{
        'floating-post-bar--expanded': isExpanded,
        'floating-post-bar--hidden': !isLogin || shouldHide
      }"
    >
      <!-- 收起状态 - 简洁小巧 -->
      <Transition name="slide-fade">
        <div
          v-if="!isExpanded"
          class="floating-collapsed"
          @click="expand"
        >
          <v-avatar size="28" class="floating-avatar">
            <v-img :src="avatarUrl" alt="avatar" />
          </v-avatar>
          <span class="floating-prompt-text">发布动态...</span>
          <v-icon size="18" class="floating-edit-icon">mdi-pencil</v-icon>
        </div>
      </Transition>

      <!-- 展开状态 -->
      <Transition name="expand">
        <div v-if="isExpanded" class="floating-expanded">
          <!-- 头部 -->
          <div class="floating-header">
            <v-btn
              icon
              size="small"
              variant="text"
              @click="collapse"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <span class="floating-header-title">发布动态</span>
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              :disabled="submitting || !canSubmit"
              :loading="submitting"
              class="floating-submit"
              @click="submitPost"
            >
              发布
            </v-btn>
          </div>

          <!-- 编辑区域 -->
          <div class="floating-body">
            <div class="floating-composer">
              <v-avatar size="36" class="floating-composer-avatar">
                <v-img :src="avatarUrl" alt="avatar" />
              </v-avatar>

              <div class="floating-composer-content">
                <!-- 文本输入 -->
                <textarea
                  ref="textareaRef"
                  v-model="content"
                  class="floating-textarea"
                  placeholder="有什么新鲜事？"
                  :disabled="submitting"
                  rows="2"
                  @input="autoResize"
                />

                <!-- 嵌入预览 -->
                <div v-if="embedPreview" class="floating-embed-preview">
                  <PostEmbed :embed="embedPreview" compact />
                  <v-btn
                    icon
                    size="x-small"
                    variant="flat"
                    class="floating-embed-remove"
                    @click="removeEmbed"
                  >
                    <v-icon size="16">mdi-close</v-icon>
                  </v-btn>
                </div>

                <!-- 已上传图片预览 -->
                <div v-if="uploadedAssets.length" class="floating-media-preview">
                  <div
                    v-for="asset in uploadedAssets"
                    :key="assetKey(asset)"
                    class="floating-media-item"
                  >
                    <v-img
                      :src="getAssetUrl(asset)"
                      cover
                      class="floating-media-img"
                    />
                    <v-btn
                      icon
                      size="x-small"
                      variant="flat"
                      class="floating-media-remove"
                      @click="removeAsset(asset)"
                    >
                      <v-icon size="16">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- 上传进度 -->
                <v-progress-linear
                  v-if="uploading"
                  color="primary"
                  height="2"
                  indeterminate
                  class="mt-2"
                />
              </div>
            </div>
          </div>

          <!-- 底部工具栏 -->
          <div class="floating-toolbar">
            <div class="floating-actions">
              <!-- 图片上传 -->
              <v-btn
                icon
                size="small"
                variant="text"
                color="primary"
                :disabled="submitting || uploadedAssets.length >= 4"
                @click="fileInputRef?.click()"
              >
                <v-icon size="20">mdi-image-outline</v-icon>
              </v-btn>

              <!-- 嵌入内容 -->
              <v-menu v-model="embedMenuOpen" :close-on-content-click="false" location="top start">
                <template #activator="{ props: menuProps }">
                  <v-btn
                    v-bind="menuProps"
                    icon
                    size="small"
                    variant="text"
                    :color="embedPreview ? 'primary' : 'default'"
                    :disabled="submitting"
                  >
                    <v-icon size="20">mdi-link-plus</v-icon>
                  </v-btn>
                </template>
                <v-card class="floating-embed-menu" min-width="280">
                  <v-card-text class="pa-3">
                    <!-- 快捷嵌入当前页面 -->
                    <div v-if="detectedContext" class="embed-quick-section">
                      <div class="embed-quick-label">当前页面</div>
                      <v-btn
                        block
                        variant="tonal"
                        :color="isCurrentContextEmbedded ? 'success' : 'primary'"
                        class="embed-quick-btn"
                        :loading="contextLoading"
                        @click="toggleContextEmbed"
                      >
                        <v-icon start size="18">{{ contextIcon }}</v-icon>
                        <span class="embed-quick-text">{{ contextDescription }}</span>
                        <v-icon v-if="isCurrentContextEmbedded" end size="18">mdi-check</v-icon>
                      </v-btn>
                    </div>

                    <!-- 嵌入当前 URL -->
                    <v-btn
                      block
                      variant="outlined"
                      class="mb-3"
                      @click="embedCurrentUrl"
                    >
                      <v-icon start size="18">mdi-link</v-icon>
                      嵌入当前 URL
                    </v-btn>

                    <v-divider class="mb-3" />

                    <!-- 手动嵌入 -->
                    <div class="embed-manual-label">手动添加</div>
                    <v-select
                      v-model="embedType"
                      :items="embedTypes"
                      item-title="label"
                      item-value="value"
                      density="compact"
                      variant="outlined"
                      hide-details
                      class="mb-2"
                    />
                    <v-text-field
                      v-model="embedId"
                      :label="embedIdLabel"
                      density="compact"
                      variant="outlined"
                      hide-details
                      type="number"
                      class="mb-2"
                    />
                    <template v-if="embedType === 'project'">
                      <v-text-field
                        v-model="embedBranch"
                        label="分支"
                        density="compact"
                        variant="outlined"
                        hide-details
                        placeholder="main"
                        class="mb-2"
                      />
                      <v-text-field
                        v-model="embedCommit"
                        label="提交 ID"
                        density="compact"
                        variant="outlined"
                        hide-details
                        placeholder="latest"
                        class="mb-2"
                      />
                    </template>
                    <v-btn
                      block
                      color="primary"
                      variant="flat"
                      size="small"
                      :disabled="!embedId"
                      @click="addEmbed"
                    >
                      添加
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-menu>

              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                multiple
                style="display: none"
                @change="onFilesSelected"
              />
            </div>

            <div class="floating-right">
              <!-- 字数统计 -->
              <div v-if="countInfo" class="floating-counter">
                <v-progress-circular
                  :model-value="countProgress"
                  :size="18"
                  :width="2"
                  :color="countColor"
                />
                <span
                  v-if="countInfo.remaining <= 20"
                  class="floating-counter-text"
                  :class="{ 'text-error': countInfo.remaining < 0 }"
                >
                  {{ countInfo.remaining }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { localuser } from '@/services/localAccount';
import { getS3staticurl, getProjectInfoByNamespace } from '@/services/projectService';
import PostsService from '@/services/postsService';
import { showSnackbar } from '@/composables/useNotifications';
import { floatingPostBarExpanded } from '@/composables/useFloatingPostBar';
import PostEmbed from './PostEmbed.vue';
import axios from '@/axios/axios';

const route = useRoute();
const router = useRouter();

// Refs
const textareaRef = ref(null);
const fileInputRef = ref(null);

// State
const isExpanded = floatingPostBarExpanded;
const content = ref('');
const countInfo = ref(null);
const uploading = ref(false);
const submitting = ref(false);
const uploadedAssets = ref([]);
const shouldHide = ref(false);

// Embed state
const embedMenuOpen = ref(false);
const embedType = ref('project');
const embedId = ref('');
const embedBranch = ref('');
const embedCommit = ref('');
const embedPreview = ref(null);

// Context detection
const detectedContext = ref(null);
const contextLoading = ref(false);
const autoEmbeddedContextKey = ref(null); // Track what was auto-embedded

const embedTypes = [
  { label: '项目', value: 'project' },
  { label: '列表', value: 'list' },
  { label: '用户', value: 'user' }
];

const embedIdLabel = computed(() => {
  const labels = {
    project: '项目 ID',
    list: '列表 ID',
    user: '用户 ID'
  };
  return labels[embedType.value] || 'ID';
});

// Auth
const isLogin = computed(() => localuser.isLogin.value);

const avatarUrl = computed(() => {
  try {
    if (!isLogin.value) return '/default-avatar.png';
    return localuser.getUserAvatar(localuser.user.value.avatar);
  } catch {
    return '/default-avatar.png';
  }
});

// Context detection computed
const contextIcon = computed(() => {
  if (!detectedContext.value) return 'mdi-link';
  switch (detectedContext.value.type) {
    case 'project': return 'mdi-cube-outline';
    case 'user': return 'mdi-account';
    default: return 'mdi-link';
  }
});

const contextDescription = computed(() => {
  if (!detectedContext.value) return '';
  switch (detectedContext.value.type) {
    case 'project': {
      let desc = `${detectedContext.value.username}/${detectedContext.value.projectname}`;
      if (detectedContext.value.commit) {
        desc += ` @ ${detectedContext.value.commit.slice(0, 7)}`;
      } else if (detectedContext.value.branch && detectedContext.value.branch !== 'main') {
        desc += ` (${detectedContext.value.branch})`;
      }
      return desc;
    }
    case 'user':
      return `@${detectedContext.value.username}`;
    default:
      return '';
  }
});

const contextKey = computed(() => {
  if (!detectedContext.value) return null;
  const ctx = detectedContext.value;
  if (ctx.type === 'project') {
    return `project:${ctx.username}/${ctx.projectname}:${ctx.branch || ''}:${ctx.commit || ''}`;
  }
  if (ctx.type === 'user') {
    return `user:${ctx.username}`;
  }
  return null;
});

const isCurrentContextEmbedded = computed(() => {
  if (!embedPreview.value || !contextKey.value) return false;
  return autoEmbeddedContextKey.value === contextKey.value;
});

// Media IDs
const mediaIds = computed(() => {
  return uploadedAssets.value
    .map((a) => {
      const rawId = a?.id ?? a?.assetId ?? a?.data?.id ?? a?.data?.assetId;
      if (rawId == null) return null;
      const numId = typeof rawId === 'number' ? rawId : Number(rawId);
      return Number.isFinite(numId) ? numId : null;
    })
    .filter((id) => id !== null);
});

// Can submit
const canSubmit = computed(() => {
  const hasContent = content.value.trim().length > 0;
  const hasMedia = mediaIds.value.length > 0;
  const hasEmbed = !!embedPreview.value;
  const withinLimit = !countInfo.value || countInfo.value.remaining >= 0;
  return (hasContent || hasMedia || hasEmbed) && withinLimit;
});

// Counter
const countProgress = computed(() => {
  if (!countInfo.value) return 0;
  return ((countInfo.value.limit - countInfo.value.remaining) / countInfo.value.limit) * 100;
});

const countColor = computed(() => {
  if (!countInfo.value) return 'primary';
  if (countInfo.value.remaining < 0) return 'error';
  if (countInfo.value.remaining <= 20) return 'warning';
  return 'primary';
});

// Auto embed context
const autoEmbedContext = async () => {
  if (!detectedContext.value || !contextKey.value) return;

  // Don't auto-embed if there's already an embed from different context
  if (embedPreview.value && autoEmbeddedContextKey.value !== contextKey.value) {
    return;
  }

  contextLoading.value = true;
  try {
    await embedContextInternal();
    autoEmbeddedContextKey.value = contextKey.value;
  } finally {
    contextLoading.value = false;
  }
};
const parseRouteContext = () => {
  const path = route.path;
  const segments = path.split('/').filter(Boolean);

  // Skip certain paths
  const skipPaths = ['app', 'login', 'register', 'settings', 'admin', 'api'];
  if (segments.length === 0 || skipPaths.includes(segments[0])) {
    detectedContext.value = null;
    return;
  }

  // Pattern: /username/projectname/commit/hash
  if (segments.length >= 4 && segments[2] === 'commit') {
    detectedContext.value = {
      type: 'project',
      username: segments[0],
      projectname: segments[1],
      commit: segments[3],
      branch: null
    };
    return;
  }

  // Pattern: /username/projectname/tree/branch
  if (segments.length >= 4 && segments[2] === 'tree') {
    detectedContext.value = {
      type: 'project',
      username: segments[0],
      projectname: segments[1],
      branch: segments[3],
      commit: null
    };
    return;
  }

  // Pattern: /username/projectname (project page)
  if (segments.length === 2) {
    detectedContext.value = {
      type: 'project',
      username: segments[0],
      projectname: segments[1],
      branch: null,
      commit: null
    };
    return;
  }

  // Pattern: /username (user profile)
  if (segments.length === 1 && !skipPaths.includes(segments[0])) {
    detectedContext.value = {
      type: 'user',
      username: segments[0]
    };
    return;
  }

  detectedContext.value = null;
};

// Toggle context embed (for button in menu)
const toggleContextEmbed = async () => {
  if (isCurrentContextEmbedded.value) {
    removeEmbed();
  } else {
    contextLoading.value = true;
    try {
      await embedContextInternal();
      autoEmbeddedContextKey.value = contextKey.value;
    } finally {
      contextLoading.value = false;
    }
  }
  embedMenuOpen.value = false;
};

// Embed context internal
const embedContextInternal = async () => {
  if (!detectedContext.value) return;

  switch (detectedContext.value.type) {
    case 'project': {
      const projectRes = await getProjectInfoByNamespace(
        detectedContext.value.username,
        detectedContext.value.projectname
      );
      const projectId = projectRes?.data?.id || projectRes?.id;
      if (projectId) {
        const embed = {
          type: 'project',
          id: projectId
        };
        if (detectedContext.value.branch && detectedContext.value.branch !== 'main') {
          embed.branch = detectedContext.value.branch;
        }
        if (detectedContext.value.commit) {
          embed.commit = detectedContext.value.commit;
        }
        embedPreview.value = embed;
      }
      break;
    }
    case 'user': {
      try {
        const res = await axios.get(`/user/name/${detectedContext.value.username}`);
        const userData = res.data?.data;
        if (userData?.id) {
          embedPreview.value = {
            type: 'user',
            id: userData.id,
            username: userData.username
          };
        }
      } catch {
        // Silent fail
      }
      break;
    }
  }
};

// Embed current URL
const embedCurrentUrl = () => {
  embedPreview.value = {
    type: 'url',
    url: window.location.href
  };
  autoEmbeddedContextKey.value = null;
  embedMenuOpen.value = false;
};

// Expand/collapse
const expand = () => {
  isExpanded.value = true;
  nextTick(() => {
    textareaRef.value?.focus();
    autoResize();
  });
};

const collapse = () => {
  isExpanded.value = false;
};

// Auto-resize textarea
const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
};

// Debounced character count
let countTimer = null;
const updateCount = () => {
  if (countTimer) clearTimeout(countTimer);
  countTimer = setTimeout(async () => {
    if (!content.value.trim()) {
      countInfo.value = null;
      return;
    }
    try {
      const res = await PostsService.count(content.value);
      countInfo.value = res?.data ?? res;
    } catch {
      // Silent fail
    }
  }, 300);
};

// Watch content
watch(content, () => {
  updateCount();
  nextTick(autoResize);
});

// File upload
const normalizeUploadResult = (res) => {
  if (!res) return null;
  if (res.data?.asset && typeof res.data.asset === 'object') {
    return res.data.asset;
  }
  if (res.asset && typeof res.asset === 'object') {
    return res.asset;
  }
  if (res.data && typeof res.data === 'object' && 'id' in res.data) {
    return res.data;
  }
  if ('id' in res || 'assetId' in res) {
    return res;
  }
  return res.data || res;
};

const onFilesSelected = async (event) => {
  const files = Array.from(event.target?.files || []);
  if (!files.length) return;

  const remaining = 4 - uploadedAssets.value.length;
  const filesToUpload = files.slice(0, remaining);

  uploading.value = true;
  try {
    for (const file of filesToUpload) {
      const res = await PostsService.uploadImage(file);
      const asset = normalizeUploadResult(res);
      if (asset) uploadedAssets.value.push(asset);
    }
  } catch (e) {
    showSnackbar(e?.message || '上传失败', 'error');
  } finally {
    uploading.value = false;
    if (event?.target) event.target.value = '';
  }
};

const assetKey = (asset) => asset?.id ?? asset?.assetId ?? JSON.stringify(asset);

const getAssetUrl = (asset) => {
  if (asset.url) return asset.url;
  if (asset.md5) {
    const ext = asset.extension || 'webp';
    const md5 = asset.md5;
    return `${getS3staticurl(md5)}.${ext}`;
  }
  return asset.src || '';
};

const removeAsset = (asset) => {
  const key = assetKey(asset);
  uploadedAssets.value = uploadedAssets.value.filter((a) => assetKey(a) !== key);
};

// Embed
const addEmbed = () => {
  if (!embedId.value) return;

  const embed = {
    type: embedType.value,
    id: Number(embedId.value)
  };

  if (embedType.value === 'project') {
    if (embedBranch.value && embedBranch.value.trim()) {
      embed.branch = embedBranch.value.trim();
    }
    if (embedCommit.value && embedCommit.value.trim()) {
      embed.commit = embedCommit.value.trim();
    }
  }

  embedPreview.value = embed;
  autoEmbeddedContextKey.value = null;
  embedMenuOpen.value = false;

  embedId.value = '';
  embedBranch.value = '';
  embedCommit.value = '';
};

const removeEmbed = () => {
  embedPreview.value = null;
  autoEmbeddedContextKey.value = null;
};

// Submit
const reset = () => {
  content.value = '';
  uploadedAssets.value = [];
  embedPreview.value = null;
  countInfo.value = null;
  autoEmbeddedContextKey.value = null;
  isExpanded.value = false;
};

const submitPost = async () => {
  if (!canSubmit.value || submitting.value) return;

  submitting.value = true;
  try {
    await PostsService.createPost({
      content: content.value,
      mediaIds: mediaIds.value,
      embed: embedPreview.value
    });
    showSnackbar('发布成功', 'success');
    reset();

    // Navigate to posts page if not already there
    if (!route.path.startsWith('/app/posts')) {
      router.push('/app/posts');
    }
  } catch (e) {
    showSnackbar(e?.message || '发布失败', 'error');
  } finally {
    submitting.value = false;
  }
};

// Hide on certain pages
const checkShouldHide = () => {
  const hidePaths = ['/app/account/login', '/app/account/register', '/app/posts'];
  shouldHide.value = hidePaths.some(p => route.path.startsWith(p));
};

// Watch route changes
watch(() => route.path, () => {
  parseRouteContext();
  checkShouldHide();
  // Auto embed on route change if no existing embed
  nextTick(() => {
    if (detectedContext.value && !embedPreview.value) {
      autoEmbedContext();
    }
  });
}, { immediate: true });

// Keyboard shortcut
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isExpanded.value) {
    collapse();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isExpanded.value) {
    if (canSubmit.value && !submitting.value) {
      submitPost();
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  // Auto embed on mount
  if (detectedContext.value && !embedPreview.value) {
    autoEmbedContext();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Overlay */
.floating-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1999;
}

/* Main container */
.floating-post-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-post-bar--hidden {
  transform: translateY(100%);
  pointer-events: none;
}

/* Collapsed state - compact pill */
.floating-collapsed {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 8px 8px;
  margin: 0 auto 12px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.floating-collapsed:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background: rgba(var(--v-theme-primary), 0.04);
}

.floating-avatar {
  flex-shrink: 0;
}

.floating-prompt-text {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
}

.floating-edit-icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.8;
}

/* Expanded state */
.floating-expanded {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  max-height: 70vh;
}

@media (min-width: 600px) {
  .floating-expanded {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 520px;
    border-radius: 16px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }
}

.floating-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.floating-header-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
}

.floating-submit {
  font-weight: 600;
  border-radius: 18px;
  min-width: 64px;
}

.floating-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.floating-composer {
  display: flex;
  gap: 10px;
}

.floating-composer-avatar {
  flex-shrink: 0;
}

.floating-composer-content {
  flex: 1;
  min-width: 0;
}

.floating-textarea {
  width: 100%;
  min-height: 48px;
  padding: 6px 0;
  border: none;
  outline: none;
  resize: none;
  font-size: 15px;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
  background: transparent;
  font-family: inherit;
}

.floating-textarea::placeholder {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

/* Embed preview */
.floating-embed-preview {
  position: relative;
  margin-top: 10px;
}

.floating-embed-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.7) !important;
  color: white !important;
}

/* Media preview */
.floating-media-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
}

.floating-media-preview:has(.floating-media-item:only-child) {
  grid-template-columns: 1fr;
}

.floating-media-item {
  position: relative;
  aspect-ratio: 16/9;
}

.floating-media-preview:has(.floating-media-item:nth-child(2)) .floating-media-item {
  aspect-ratio: 1;
}

.floating-media-img {
  width: 100%;
  height: 100%;
}

.floating-media-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7) !important;
  color: white !important;
}

/* Toolbar */
.floating-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.floating-actions {
  display: flex;
  gap: 2px;
}

.floating-right {
  display: flex;
  align-items: center;
}

.floating-counter {
  display: flex;
  align-items: center;
  gap: 4px;
}

.floating-counter-text {
  font-size: 12px;
  font-weight: 500;
}

/* Embed menu */
.floating-embed-menu {
  border-radius: 12px !important;
}

.embed-quick-section {
  margin-bottom: 12px;
}

.embed-quick-label,
.embed-manual-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  margin-bottom: 6px;
}

.embed-quick-btn {
  justify-content: flex-start;
  text-transform: none;
  font-weight: 500;
}

.embed-quick-text {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (min-width: 600px) {
  .expand-enter-from,
  .expand-leave-to {
    transform: translateX(-50%) translateY(20px) scale(0.95);
  }
}

/* Safe area for mobile */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .floating-collapsed {
    margin-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .floating-toolbar {
    padding-bottom: calc(6px + env(safe-area-inset-bottom));
  }
}
</style>
