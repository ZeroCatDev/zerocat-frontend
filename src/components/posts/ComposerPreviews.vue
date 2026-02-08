<template>
  <div class="composer-previews">
    <!-- 嵌入内容预览 -->
    <div v-if="embed" class="preview-embed">
      <PostEmbed :embed="embed" compact />
      <v-btn
        icon
        size="x-small"
        variant="flat"
        class="preview-remove"
        @click="$emit('remove-embed')"
      >
        <v-icon size="16">mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- 已上传图片预览 -->
    <div v-if="assets.length" class="preview-media" :class="mediaGridClass">
      <div
        v-for="asset in assets"
        :key="assetKey(asset)"
        class="preview-media-item"
      >
        <v-img
          :src="getAssetUrl(asset)"
          cover
          class="preview-media-img"
        />
        <v-btn
          icon
          size="x-small"
          variant="flat"
          class="preview-remove"
          @click="$emit('remove-asset', asset)"
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
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getS3staticurl } from '@/services/projectService';
import PostEmbed from './PostEmbed.vue';

defineProps({
  embed: { type: Object, default: null },
  assets: { type: Array, default: () => [] },
  uploading: { type: Boolean, default: false }
});

defineEmits(['remove-embed', 'remove-asset']);

const mediaGridClass = computed(() => {
  return {}; // 可以根据图片数量动态调整
});

const assetKey = (asset) => asset?.id ?? asset?.assetId ?? JSON.stringify(asset);

const getAssetUrl = (asset) => {
  if (asset.url) return asset.url;
  if (asset.md5) {
    const ext = asset.extension || 'webp';
    return `${getS3staticurl(asset.md5)}.${ext}`;
  }
  return asset.src || '';
};
</script>

<style scoped>
.composer-previews {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 嵌入预览 */
.preview-embed {
  position: relative;
}

.preview-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.75) !important;
  color: white !important;
  z-index: 1;
}

/* 图片预览 */
.preview-media {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.preview-media:has(.preview-media-item:only-child) {
  grid-template-columns: 1fr;
}

.preview-media-item {
  position: relative;
  aspect-ratio: 16/9;
}

.preview-media:has(.preview-media-item:nth-child(2)) .preview-media-item {
  aspect-ratio: 1;
}

.preview-media-img {
  width: 100%;
  height: 100%;
}
</style>
