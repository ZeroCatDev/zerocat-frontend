<template>
  <div class="post-composer" :class="{ 'post-composer--focused': isFocused }">
    <div class="composer-main">
      <!-- 头像 -->
      <v-avatar size="40" class="composer-avatar">
        <v-img :src="avatarUrl" alt="avatar" />
      </v-avatar>

      <div class="composer-content">
        <!-- 文本输入区 -->
        <div class="composer-input-wrapper">
          <textarea
            ref="textareaRef"
            v-model="content"
            class="composer-textarea"
            :placeholder="placeholder"
            :disabled="disabled || submitting"
            rows="1"
            @focus="isFocused = true"
            @blur="onBlur"
            @input="autoResize"
            @keydown="onKeydown"
          />
        </div>

        <!-- 嵌入内容预览 -->
        <div v-if="embedPreview" class="composer-embed-preview">
          <PostEmbed :embed="embedPreview" compact />
          <v-btn
            icon
            size="x-small"
            variant="flat"
            class="composer-embed-remove"
            @click="removeEmbed"
          >
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- 引用帖子预览（通过插槽传入） -->
        <slot name="append" />

        <!-- 已上传图片预览 -->
        <div v-if="uploadedAssets.length" class="composer-media-preview">
          <div
            v-for="asset in uploadedAssets"
            :key="assetKey(asset)"
            class="composer-media-item"
          >
            <v-img
              :src="getAssetUrl(asset)"
              cover
              class="composer-media-img"
            />
            <v-btn
              icon
              size="x-small"
              variant="flat"
              class="composer-media-remove"
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

        <!-- 操作栏 -->
        <div class="composer-toolbar">
          <div class="composer-actions">
            <!-- 图片上传 -->
            <v-tooltip text="图片" location="bottom">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="tooltipProps"
                  icon
                  size="small"
                  variant="text"
                  color="primary"
                  :disabled="disabled || submitting || uploadedAssets.length >= 4"
                  @click="fileInputRef?.click()"
                >
                  <v-icon size="20">mdi-image-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <!-- 嵌入内容 -->
            <v-menu v-model="embedMenuOpen" :close-on-content-click="false" location="bottom start">
              <template #activator="{ props: menuProps }">
                <v-tooltip text="嵌入" location="bottom">
                  <template #activator="{ props: tooltipProps }">
                    <v-btn
                      v-bind="{ ...menuProps, ...tooltipProps }"
                      icon
                      size="small"
                      variant="text"
                      color="primary"
                      :disabled="disabled || submitting"
                    >
                      <v-icon size="20">mdi-link-plus</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
              <v-card class="composer-embed-menu" min-width="320">
                <v-card-title class="text-subtitle-2 pb-0">嵌入内容</v-card-title>
                <v-card-text>
                  <v-select
                    v-model="embedType"
                    :items="embedTypes"
                    item-title="label"
                    item-value="value"
                    label="类型"
                    density="compact"
                    variant="outlined"
                    hide-details
                    class="mb-3"
                  />
                  <v-text-field
                    v-model="embedId"
                    :label="embedIdLabel"
                    density="compact"
                    variant="outlined"
                    hide-details
                    type="number"
                    class="mb-3"
                  />
                  <!-- 项目特有选项：分支和提交 -->
                  <template v-if="embedType === 'project'">
                    <v-text-field
                      v-model="embedBranch"
                      label="分支（可选，默认 main）"
                      density="compact"
                      variant="outlined"
                      hide-details
                      placeholder="main"
                      class="mb-3"
                    />
                    <v-text-field
                      v-model="embedCommit"
                      label="提交 ID（可选，默认最新）"
                      density="compact"
                      variant="outlined"
                      hide-details
                      placeholder="latest"
                    />
                  </template>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn variant="text" size="small" @click="embedMenuOpen = false">
                    取消
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="small"
                    :disabled="!embedId"
                    @click="addEmbed"
                  >
                    添加
                  </v-btn>
                </v-card-actions>
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

          <div class="composer-right">
            <!-- 字数统计 -->
            <div v-if="countInfo" class="composer-counter">
              <v-progress-circular
                :model-value="countProgress"
                :size="20"
                :width="2"
                :color="countColor"
              />
              <span
                v-if="countInfo.remaining <= 20"
                class="composer-counter-text"
                :class="{ 'text-error': countInfo.remaining < 0 }"
              >
                {{ countInfo.remaining }}
              </span>
            </div>

            <v-divider v-if="countInfo" vertical class="mx-2" />

            <!-- 发布按钮 -->
            <v-btn
              color="primary"
              variant="flat"
              :disabled="disabled || submitting || !canSubmit"
              :loading="submitting"
              class="composer-submit"
              @click="submitInternal"
            >
              {{ submitLabel }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!isLogin && showLoginHint" class="composer-login-hint">
      <v-icon size="16" class="mr-1">mdi-information-outline</v-icon>
      <router-link to="/app/account/login" class="composer-login-link">
        登录
      </router-link>
      后即可发布内容
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { localuser } from '@/services/localAccount';
import { getS3staticurl } from '@/services/projectService';
import PostsService from '@/services/postsService';
import { showSnackbar } from '@/composables/useNotifications';
import PostEmbed from './PostEmbed.vue';

const props = defineProps({
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '有什么新鲜事？' },
  submitLabel: { type: String, default: '发布' },
  submit: { type: Function, required: true },
  autoFocus: { type: Boolean, default: false },
  showLoginHint: { type: Boolean, default: true },
  initialEmbed: { type: Object, default: null }
});

const emit = defineEmits(['submitted']);

// Refs
const textareaRef = ref(null);
const fileInputRef = ref(null);

// State
const content = ref('');
const countInfo = ref(null);
const uploading = ref(false);
const submitting = ref(false);
const uploadedAssets = ref([]);
const isFocused = ref(false);

// Embed
const embedMenuOpen = ref(false);
const embedType = ref('project');
const embedId = ref('');
const embedBranch = ref('');
const embedCommit = ref('');
const embedPreview = ref(props.initialEmbed || null);

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

// Media IDs
const mediaIds = computed(() => {
  return uploadedAssets.value
    .map((a) => {
      const rawId = a?.id ?? a?.assetId ?? a?.data?.id ?? a?.data?.assetId;
      // 兼容字符串和数字类型的 ID
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

// Auto-resize textarea
const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
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

watch(content, () => {
  updateCount();
  nextTick(autoResize);
});

// Blur handler
const onBlur = () => {
  setTimeout(() => {
    if (!content.value.trim() && !uploadedAssets.value.length && !embedPreview.value) {
      isFocused.value = false;
    }
  }, 150);
};

// Keyboard shortcuts
const onKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (canSubmit.value && !submitting.value) {
      submitInternal();
    }
  }
};

// File upload
const normalizeUploadResult = (res) => {
  if (!res) return null;

  // API 响应格式: { status: "success", data: { success: true, asset: { id, md5, ... }, ... } }
  // 提取 asset 对象
  if (res.data?.asset && typeof res.data.asset === 'object') {
    return res.data.asset;
  }
  // 兼容直接返回 asset 的情况
  if (res.asset && typeof res.asset === 'object') {
    return res.asset;
  }
  // 兼容 data 中直接有 id 的情况: { data: { id, md5, ... } }
  if (res.data && typeof res.data === 'object' && 'id' in res.data) {
    return res.data;
  }
  // 兼容直接返回资源对象的情况: { id, md5, ... }
  if ('id' in res || 'assetId' in res) {
    return res;
  }
  // 兜底
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
    // 使用 md5 和 extension 构建正确的 URL
    const ext = asset.extension || 'webp';
    const md5 = asset.md5;
    // getS3staticurl 返回不带扩展名的 URL，需要加上扩展名
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

  // 添加项目特有的分支和提交信息
  if (embedType.value === 'project') {
    if (embedBranch.value && embedBranch.value.trim()) {
      embed.branch = embedBranch.value.trim();
    }
    if (embedCommit.value && embedCommit.value.trim()) {
      embed.commit = embedCommit.value.trim();
    }
  }

  embedPreview.value = embed;
  embedMenuOpen.value = false;

  // 清空输入
  embedId.value = '';
  embedBranch.value = '';
  embedCommit.value = '';
};

const removeEmbed = () => {
  embedPreview.value = null;
};

// Submit
const reset = () => {
  content.value = '';
  uploadedAssets.value = [];
  embedPreview.value = null;
  countInfo.value = null;
  isFocused.value = false;
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto';
    }
  });
};

const submitInternal = async () => {
  if (!canSubmit.value || submitting.value) return;

  submitting.value = true;
  try {
    await props.submit({
      content: content.value,
      mediaIds: mediaIds.value,
      embed: embedPreview.value
    });
    emit('submitted');
    reset();
  } catch (e) {
    showSnackbar(e?.message || '发布失败', 'error');
  } finally {
    submitting.value = false;
  }
};

// Auto focus
onMounted(() => {
  if (props.autoFocus && textareaRef.value) {
    nextTick(() => {
      textareaRef.value.focus();
      isFocused.value = true;
    });
  }
});

// Expose for parent
defineExpose({
  reset,
  focus: () => textareaRef.value?.focus()
});
</script>

<style scoped>
.post-composer {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.composer-main {
  display: flex;
  padding: 12px 16px;
  gap: 12px;
}

.composer-avatar {
  flex-shrink: 0;
}

.composer-content {
  flex: 1;
  min-width: 0;
}

.composer-input-wrapper {
  min-height: 52px;
}

.composer-textarea {
  width: 100%;
  min-height: 52px;
  padding: 12px 0;
  border: none;
  outline: none;
  resize: none;
  font-size: 20px;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  background: transparent;
  font-family: inherit;
}

.composer-textarea::placeholder {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.composer-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Embed preview */
.composer-embed-preview {
  position: relative;
  margin-top: 12px;
}

.composer-embed-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75) !important;
  color: white !important;
}

/* Media preview */
.composer-media-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-top: 12px;
  border-radius: 16px;
  overflow: hidden;
}

.composer-media-preview:has(.composer-media-item:only-child) {
  grid-template-columns: 1fr;
}

.composer-media-item {
  position: relative;
  aspect-ratio: 16/9;
}

.composer-media-preview:has(.composer-media-item:nth-child(2)) .composer-media-item {
  aspect-ratio: 1;
}

.composer-media-img {
  width: 100%;
  height: 100%;
}

.composer-media-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.75) !important;
  color: white !important;
}

/* Toolbar */
.composer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.post-composer--focused .composer-toolbar {
  border-top-color: rgba(var(--v-theme-primary), 0.3);
}

.composer-actions {
  display: flex;
  gap: 4px;
  margin-left: -8px;
}

.composer-right {
  display: flex;
  align-items: center;
}

.composer-counter {
  display: flex;
  align-items: center;
  gap: 4px;
}

.composer-counter-text {
  font-size: 13px;
  font-weight: 500;
}

.composer-submit {
  min-width: 80px;
  font-weight: 700;
  border-radius: 20px;
}

/* Embed menu */
.composer-embed-menu {
  border-radius: 12px !important;
}

/* Login hint */
.composer-login-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  background: rgba(var(--v-theme-on-surface), 0.03);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.composer-login-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 500;
}

.composer-login-link:hover {
  text-decoration: underline;
}
</style>
