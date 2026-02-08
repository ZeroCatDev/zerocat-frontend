<template>
  <!-- 悬浮模式：使用 Teleport 渲染到 body -->
  <Teleport v-if="floating" to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="floatingVisible && floatingExpanded"
        class="composer-overlay"
        @click="collapseFloating"
      />
    </Transition>

    <!-- 悬浮容器 -->
    <div
      v-if="floatingVisible"
      class="composer-floating"
      :class="{ 'composer-floating--hidden': !isLogin }"
    >
      <!-- 收起状态 -->
      <Transition name="slide-up">
        <div
          v-if="!floatingExpanded"
          class="composer-floating-collapsed"
          @click="expandFloating"
        >
          <v-avatar size="28">
            <v-img :src="avatarUrl" alt="avatar" />
          </v-avatar>
          <span class="composer-floating-prompt">发布动态...</span>
          <v-icon size="18" color="primary">mdi-pencil</v-icon>
        </div>
      </Transition>

      <!-- 展开状态 -->
      <Transition name="expand">
        <div v-if="floatingExpanded" class="composer-floating-expanded">
          <!-- 头部 -->
          <div class="composer-floating-header">
            <v-btn icon size="small" variant="text" @click="collapseFloating">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <span class="composer-floating-title">发布动态</span>
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              :disabled="!canSubmit"
              :loading="submitting"
              class="composer-floating-submit"
              @click="handleSubmit"
            >
              发布
            </v-btn>
          </div>

          <!-- 编辑区 -->
          <div class="composer-floating-body">
            <div
              class="composer-editor composer-editor--compact"
              :class="{ 'composer-editor--dragging': isDragging }"
              @dragenter="onDragEnter"
              @dragleave="onDragLeave"
              @dragover="onDragOver"
              @drop="onDrop"
            >
              <v-avatar size="36">
                <v-img :src="avatarUrl" alt="avatar" />
              </v-avatar>
              <div class="composer-editor-content">
                <textarea
                  ref="textareaRef"
                  v-model="content"
                  class="composer-textarea composer-textarea--compact"
                  placeholder="有什么新鲜事？"
                  :disabled="submitting"
                  rows="2"
                  @input="autoResize"
                  @keydown="onKeydown"
                />
                <slot name="append" />
                <ComposerPreviews
                  :embed="embedPreview"
                  :assets="uploadedAssets"
                  :uploading="uploading"
                  @remove-embed="removeEmbed"
                  @remove-asset="removeAsset"
                />
                <ComposerToolbar
                  :disabled="submitting"
                  :assets-count="uploadedAssets.length"
                  :has-embed="!!embedPreview"
                  :char-count="charCount"
                  :char-limit="charLimit"
                  :compact="true"
                  :hide-submit="true"
                  @upload="triggerUpload"
                  @add-embed="setEmbed"
                >
                  <template #embed-quick>
                    <slot name="embed-quick" />
                  </template>
                </ComposerToolbar>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>

  <!-- 普通/内联模式 -->
  <div v-if="!floating" class="composer-inline" :class="inlineClass">
    <div
      class="composer-editor"
      :class="[editorClass, { 'composer-editor--dragging': isDragging }]"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <v-avatar :size="compact ? 32 : 40">
        <v-img :src="avatarUrl" alt="avatar" />
      </v-avatar>

      <div class="composer-editor-content">
        <textarea
          ref="textareaRef"
          v-model="content"
          class="composer-textarea"
          :class="{ 'composer-textarea--compact': compact }"
          :placeholder="placeholder"
          :disabled="disabled || submitting"
          rows="1"
          @focus="isFocused = true"
          @blur="onBlur"
          @input="autoResize"
          @keydown="onKeydown"
        />

        <slot name="append" />

        <ComposerPreviews
          :embed="embedPreview"
          :assets="uploadedAssets"
          :uploading="uploading"
          @remove-embed="removeEmbed"
          @remove-asset="removeAsset"
        />

        <ComposerToolbar
          :disabled="disabled || submitting"
          :assets-count="uploadedAssets.length"
          :has-embed="!!embedPreview"
          :char-count="charCount"
          :char-limit="charLimit"
          :compact="compact"
          :hide-submit="false"
          :can-submit="canSubmit"
          :submitting="submitting"
          :submit-label="submitLabel"
          @upload="triggerUpload"
          @add-embed="setEmbed"
          @submit="handleSubmit"
        >
          <template #embed-quick>
            <slot name="embed-quick" />
          </template>
        </ComposerToolbar>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!isLogin && showLoginHint" class="composer-login-hint">
      <v-icon size="16" class="mr-1">mdi-information-outline</v-icon>
      <router-link to="/app/account/login" class="composer-login-link">登录</router-link>
      后即可发布内容
    </div>
  </div>

  <!-- 文件上传 input -->
  <input
    ref="fileInputRef"
    type="file"
    accept="image/*"
    multiple
    style="display: none"
    @change="onFilesSelected"
  />
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { localuser } from '@/services/localAccount';
import { getS3staticurl } from '@/services/projectService';
import PostsService from '@/services/postsService';
import { getLocalCountInfo, getPostContentLimit } from '@/utils/postCount';
import { showSnackbar } from '@/composables/useNotifications';
import ComposerPreviews from './ComposerPreviews.vue';
import ComposerToolbar from './ComposerToolbar.vue';

const props = defineProps({
  // 模式控制
  floating: { type: Boolean, default: false },
  floatingVisible: { type: Boolean, default: true },
  floatingExpanded: { type: Boolean, default: false },

  // 通用配置
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '有什么新鲜事？' },
  submitLabel: { type: String, default: '发布' },
  submit: { type: Function, required: true },
  autoFocus: { type: Boolean, default: false },
  showLoginHint: { type: Boolean, default: true },
  initialEmbed: { type: Object, default: null },
  compact: { type: Boolean, default: false },
  noBorder: { type: Boolean, default: false }
});

const emit = defineEmits(['submitted', 'focus', 'blur', 'update:floatingExpanded']);

// Refs
const textareaRef = ref(null);
const fileInputRef = ref(null);

// State
const content = ref('');
const isFocused = ref(false);
const uploading = ref(false);
const submitting = ref(false);
const isDragging = ref(false);
const uploadedAssets = ref([]);
const embedPreview = ref(props.initialEmbed || null);

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

// 字数统计
const charLimit = getPostContentLimit();

const charCount = computed(() => {
  if (!content.value) return 0;
  try {
    const info = getLocalCountInfo(content.value);
    return info.count || 0;
  } catch {
    return content.value.length;
  }
});

const countRemaining = computed(() => charLimit - charCount.value);

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
  const withinLimit = countRemaining.value >= 0;
  return (hasContent || hasMedia || hasEmbed) && withinLimit;
});

// Classes
const inlineClass = computed(() => ({
  'composer-inline--focused': isFocused.value,
  'composer-inline--compact': props.compact,
  'composer-inline--no-border': props.noBorder
}));

const editorClass = computed(() => ({
  'composer-editor--compact': props.compact
}));

// Methods
const autoResize = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = 'auto';
  const maxHeight = props.compact || props.floating ? 150 : 300;
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
};

const onBlur = () => {
  setTimeout(() => {
    if (!content.value.trim() && !uploadedAssets.value.length && !embedPreview.value) {
      isFocused.value = false;
      emit('blur');
    }
  }, 150);
};

const onKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (canSubmit.value && !submitting.value) {
      handleSubmit();
    }
  }
  if (e.key === 'Escape' && props.floating && props.floatingExpanded) {
    collapseFloating();
  }
};

// Floating controls
const expandFloating = () => {
  emit('update:floatingExpanded', true);
  nextTick(() => textareaRef.value?.focus());
};

const collapseFloating = () => {
  emit('update:floatingExpanded', false);
};

// File upload
const triggerUpload = () => {
  fileInputRef.value?.click();
};

const normalizeUploadResult = (res) => {
  if (!res) return null;
  if (res.data?.asset && typeof res.data.asset === 'object') return res.data.asset;
  if (res.asset && typeof res.asset === 'object') return res.asset;
  if (res.data && typeof res.data === 'object' && 'id' in res.data) return res.data;
  if ('id' in res || 'assetId' in res) return res;
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

const removeAsset = (asset) => {
  const key = asset?.id ?? asset?.assetId ?? JSON.stringify(asset);
  uploadedAssets.value = uploadedAssets.value.filter((a) =>
    (a?.id ?? a?.assetId ?? JSON.stringify(a)) !== key
  );
};

// Drag-and-drop
const onDragEnter = (e) => {
  e.preventDefault();
  if (e.dataTransfer?.types?.includes('Files')) {
    isDragging.value = true;
  }
};

const onDragLeave = (e) => {
  e.preventDefault();
  // Only set false if leaving the composer area
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragging.value = false;
  }
};

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = async (e) => {
  e.preventDefault();
  isDragging.value = false;

  const files = Array.from(e.dataTransfer?.files || []);
  const imageFiles = files.filter((f) => f.type.startsWith('image/'));

  if (!imageFiles.length) return;

  const remaining = 4 - uploadedAssets.value.length;
  if (remaining <= 0) {
    showSnackbar('最多只能上传4张图片', 'warning');
    return;
  }

  const filesToUpload = imageFiles.slice(0, remaining);

  uploading.value = true;
  try {
    for (const file of filesToUpload) {
      const res = await PostsService.uploadImage(file);
      const asset = normalizeUploadResult(res);
      if (asset) uploadedAssets.value.push(asset);
    }
  } catch (err) {
    showSnackbar(err?.message || '上传失败', 'error');
  } finally {
    uploading.value = false;
  }
};

// Embed
const removeEmbed = () => {
  embedPreview.value = null;
};

const setEmbed = (embed) => {
  embedPreview.value = embed;
};

// Reset
const reset = () => {
  content.value = '';
  uploadedAssets.value = [];
  embedPreview.value = null;
  isFocused.value = false;
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = 'auto';
  });
};

// Get post data
const getPostData = () => ({
  content: content.value,
  mediaIds: mediaIds.value,
  embed: embedPreview.value
});

// Submit
const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return;

  submitting.value = true;
  try {
    await props.submit(getPostData());
    emit('submitted');
    reset();
    if (props.floating) collapseFloating();
  } catch (e) {
    showSnackbar(e?.message || '发布失败', 'error');
  } finally {
    submitting.value = false;
  }
};

// Focus
const focus = () => {
  textareaRef.value?.focus();
  isFocused.value = true;
  emit('focus');
};

// Watch
watch(() => props.initialEmbed, (newEmbed) => {
  if (newEmbed) setEmbed(newEmbed);
});

// Mount
onMounted(() => {
  if (props.autoFocus && textareaRef.value) {
    nextTick(() => focus());
  }
});

// Expose
defineExpose({
  reset,
  focus,
  setEmbed,
  getPostData,
  canSubmit,
  submitting,
  content
});
</script>

<style scoped>
/* 内联模式 */
.composer-inline {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.composer-inline--no-border,
.composer-inline--compact {
  border-bottom: none;
}

.composer-inline--focused .composer-editor {
  border-color: rgba(var(--v-theme-primary), 0.3);
}

/* 编辑器通用 */
.composer-editor {
  display: flex;
  padding: 12px 16px;
  gap: 12px;
}

.composer-editor--compact {
  padding: 10px 12px;
  gap: 10px;
}

.composer-editor--dragging {
  background: rgba(var(--v-theme-primary), 0.08);
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 12px;
}

.composer-editor-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 文本框 */
.composer-textarea {
  width: 100%;
  min-height: 52px;
  padding: 8px 0;
  border: none;
  outline: none;
  resize: none;
  font-size: 18px;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  background: transparent;
  font-family: inherit;
}

.composer-textarea--compact {
  min-height: 40px;
  font-size: 15px;
  line-height: 1.5;
}

.composer-textarea::placeholder {
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.composer-textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 登录提示 */
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

/* 悬浮模式 */
.composer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1999;
}

.composer-floating {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.composer-floating--hidden {
  transform: translateY(100%);
  pointer-events: none;
}

.composer-floating-collapsed {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.composer-floating-collapsed:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background: rgba(var(--v-theme-primary), 0.04);
}

.composer-floating-prompt {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.composer-floating-expanded {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  max-height: 70vh;
}

@media (min-width: 600px) {
  .composer-floating-expanded {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 520px;
    border-radius: 16px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  }
}

.composer-floating-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.composer-floating-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
}

.composer-floating-submit {
  font-weight: 600;
  border-radius: 18px;
  min-width: 64px;
}

.composer-floating-body {
  flex: 1;
  overflow-y: auto;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

.expand-enter-active, .expand-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(100%); }

@media (min-width: 600px) {
  .expand-enter-from, .expand-leave-to { transform: translateX(-50%) translateY(20px) scale(0.95); }
}

/* 安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .composer-floating-collapsed { margin-bottom: calc(12px + env(safe-area-inset-bottom)); }
  .composer-floating-body { padding-bottom: env(safe-area-inset-bottom); }
}
</style>
