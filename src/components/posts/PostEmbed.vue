<template>
  <div class="post-embed-wrapper">
    <!-- 项目嵌入 - Scratch 作品直接显示播放器 -->
    <template v-if="embed.type === 'project'">
      <div
        class="post-embed post-embed--project"
        :class="{ 'post-embed--compact': compact }"
      >
        <!-- Scratch 项目：直接显示 ProjectPlayer -->
        <template v-if="isScratchProject && !compact">
          <div class="embed-player-wrapper">
            <ProjectPlayer
              :project-id="embed.id"
              :branch="embed.branch || 'main'"
              :commit-id="embed.commit || 'latest'"
              :showplayer="true"
              :type="projectData?.type || 'scratch'"
            />
          </div>
        </template>

        <!-- 非 Scratch 项目或 compact 模式：显示缩略图 -->
        <template v-else>
          <div class="embed-thumbnail-area" @click="handleClick">
            <div v-if="projectData?.thumbnail" class="embed-thumbnail-large">
              <v-img
                :src="getThumbnailUrl(projectData.thumbnail)"
                cover
                class="embed-thumbnail-img"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="24" width="2" />
                  </div>
                </template>
              </v-img>
            </div>
            <div v-else class="embed-thumbnail-placeholder">
              <v-icon size="48" color="primary">mdi-cube-outline</v-icon>
            </div>
          </div>
        </template>

        <!-- 项目信息栏 -->
        <div class="embed-info" @click="handleClick">
          <div class="embed-info-row">
            <div class="embed-info-left">
              <div class="embed-type-badge">
                <v-icon size="14">mdi-cube-outline</v-icon>
                <span>{{ projectTypeLabel }}</span>
              </div>
              <div class="embed-title">
                {{ projectData?.title || `项目 #${embed.id}` }}
              </div>
              <!-- 作者信息 -->
              <div v-if="projectData?.author" class="embed-author">
                <v-avatar size="18">
                  <v-img
                    v-if="projectData.author.avatar"
                    :src="getAvatarUrl(projectData.author.avatar)"
                  />
                  <v-icon v-else size="10">mdi-account</v-icon>
                </v-avatar>
                <span class="embed-author-name">{{ projectData.author.display_name || projectData.author.username }}</span>
              </div>
            </div>
            <div class="embed-info-right">
              <!-- 分支/提交信息 -->
              <div v-if="(embed.branch && embed.branch !== 'main') || embed.commit" class="embed-version-info">
                <span v-if="embed.branch && embed.branch !== 'main'" class="embed-version-item">
                  <v-icon size="12">mdi-source-branch</v-icon>
                  {{ embed.branch }}
                </span>
                <span v-if="embed.commit" class="embed-version-item">
                  <v-icon size="12">mdi-source-commit</v-icon>
                  {{ embed.commit.slice(0, 7) }}
                </span>
              </div>
              <v-icon class="embed-arrow" size="16">mdi-arrow-top-right</v-icon>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 列表嵌入 -->
    <template v-else-if="embed.type === 'list'">
      <div
        class="post-embed"
        :class="{ 'post-embed--compact': compact }"
        @click="handleClick"
      >
        <div class="embed-icon embed-icon--list">
          <v-icon size="20">mdi-format-list-bulleted</v-icon>
        </div>
        <div class="embed-content">
          <div class="embed-label">列表</div>
          <div class="embed-title">
            {{ listData?.name || `列表 #${embed.id}` }}
          </div>
          <div v-if="listData?.description" class="embed-description">
            {{ listData.description }}
          </div>
          <div v-if="listData?.itemCount" class="embed-meta">
            <span class="embed-meta-item">
              <v-icon size="14">mdi-file-document-outline</v-icon>
              {{ listData.itemCount }} 个项目
            </span>
          </div>
        </div>
        <v-icon class="embed-arrow" size="16">mdi-arrow-top-right</v-icon>
      </div>
    </template>

    <!-- 用户嵌入 -->
    <template v-else-if="embed.type === 'user'">
      <div
        class="post-embed post-embed--user"
        :class="{ 'post-embed--compact': compact }"
        @click="handleClick"
      >
        <v-avatar size="56" class="embed-user-avatar">
          <v-img
            v-if="userData?.avatar"
            :src="getAvatarUrl(userData.avatar)"
          />
          <v-icon v-else size="28">mdi-account</v-icon>
        </v-avatar>
        <div class="embed-content">
          <div class="embed-label">用户</div>
          <div class="embed-title">
            {{ userData?.display_name || userData?.username || embed.username || `用户 #${embed.id}` }}
          </div>
          <div v-if="userData?.username" class="embed-username">
            @{{ userData.username }}
          </div>
          <div v-if="userData?.bio && !compact" class="embed-description">
            {{ userData.bio }}
          </div>
        </div>
        <v-icon class="embed-arrow" size="16">mdi-arrow-top-right</v-icon>
      </div>
    </template>

    <!-- 未知类型 -->
    <template v-else>
      <div
        class="post-embed"
        :class="{ 'post-embed--compact': compact }"
        @click="handleClick"
      >
        <div class="embed-icon">
          <v-icon size="20">mdi-link-variant</v-icon>
        </div>
        <div class="embed-content">
          <div class="embed-label">链接</div>
          <div class="embed-title">{{ embed.type }} #{{ embed.id }}</div>
        </div>
        <v-icon class="embed-arrow" size="16">mdi-arrow-top-right</v-icon>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { localuser } from '@/services/localAccount';
import { getProjectInfo, getS3staticurl } from '@/services/projectService';
import ProjectPlayer from '@/components/project/ProjectPlayer.vue';

const props = defineProps({
  embed: { type: Object, required: true },
  compact: { type: Boolean, default: false }
});

const router = useRouter();

// Loaded data
const projectData = ref(null);
const listData = ref(null);
const userData = ref(null);
const loading = ref(false);

// Computed properties
const isScratchProject = computed(() => {
  const type = projectData.value?.type || 'scratch';
  return type === 'scratch' || type === 'scratch3';
});

const projectTypeLabel = computed(() => {
  const type = projectData.value?.type || 'scratch';
  const labels = {
    'scratch': 'Scratch 作品',
    'scratch3': 'Scratch 作品',
    'scratch-extension': '扩展',
    'python': 'Python',
    'javascript': 'JavaScript',
    'text': '文本'
  };
  return labels[type] || '项目';
});

// Get URLs
const getAvatarUrl = (avatar) => localuser.getUserAvatar(avatar);
const getThumbnailUrl = (thumbnail) => getS3staticurl(thumbnail);

// Load embed data
const loadEmbedData = async () => {
  if (!props.embed?.id) return;

  loading.value = true;
  try {
    switch (props.embed.type) {
      case 'project':
        const projects = await getProjectInfo([props.embed.id]);
        if (projects?.length) {
          projectData.value = projects[0];
        }
        break;
      case 'list':
        // TODO: Implement list fetching
        listData.value = { id: props.embed.id };
        break;
      case 'user':
        // TODO: Implement user fetching
        userData.value = {
          id: props.embed.id,
          username: props.embed.username
        };
        break;
    }
  } catch (e) {
    console.error('Failed to load embed data:', e);
  } finally {
    loading.value = false;
  }
};

// Handle click - navigate to project page
const handleClick = () => {
  switch (props.embed.type) {
    case 'project':
      if (projectData.value?.author?.username && projectData.value?.name) {
        router.push(`/${projectData.value.author.username}/${projectData.value.name}`);
      } else {
        router.push(`/app/project/${props.embed.id}`);
      }
      break;
    case 'list':
      router.push(`/app/list/${props.embed.id}`);
      break;
    case 'user':
      if (userData.value?.username || props.embed.username) {
        router.push(`/${userData.value?.username || props.embed.username}`);
      } else {
        router.push(`/app/posts/user/${props.embed.id}`);
      }
      break;
  }
};

// Watch for embed changes
watch(() => props.embed, loadEmbedData, { immediate: true, deep: true });
</script>

<style scoped>
.post-embed-wrapper {
  width: 100%;
}

/* Base embed styles */
.post-embed {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.post-embed:hover {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-color: rgba(var(--v-theme-on-surface), 0.15);
}

.post-embed--compact {
  padding: 10px 12px;
}

/* Project embed - card style */
.post-embed--project {
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  cursor: default;
}

/* Player wrapper - direct display */
.embed-player-wrapper {
  width: 100%;
  background: rgb(var(--v-theme-surface));
}

.embed-player-wrapper :deep(.v-card) {
  border-radius: 0 !important;
  border: none !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.1) !important;
}

/* Thumbnail area for non-scratch or compact */
.embed-thumbnail-area {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: rgba(var(--v-theme-on-surface), 0.05);
  overflow: hidden;
  cursor: pointer;
}

.post-embed--compact .embed-thumbnail-area {
  aspect-ratio: 4 / 3;
  max-height: 120px;
}

.embed-thumbnail-large {
  width: 100%;
  height: 100%;
  position: relative;
}

.embed-thumbnail-large .embed-thumbnail-img {
  width: 100%;
  height: 100%;
}

.embed-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
}

/* Project info bar */
.embed-info {
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.embed-info:hover {
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.post-embed--compact .embed-info {
  padding: 8px 12px;
}

.embed-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.embed-info-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.embed-info-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.embed-type-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 4px;
}

.embed-info .embed-title {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-embed--compact .embed-info .embed-title {
  font-size: 13px;
}

.embed-author {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.embed-author-name {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
}

.embed-version-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.embed-version-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  padding: 2px 6px;
  background: rgba(var(--v-theme-on-surface), 0.05);
  border-radius: 4px;
}

/* Original embed styles for list/user/unknown */
.embed-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
}

.embed-icon .v-icon {
  color: rgb(var(--v-theme-primary));
}

.embed-icon--list {
  background: rgba(var(--v-theme-secondary), 0.1);
}

.embed-icon--list .v-icon {
  color: rgb(var(--v-theme-secondary));
}

.post-embed--compact .embed-icon {
  width: 32px;
  height: 32px;
}

.embed-user-avatar {
  flex-shrink: 0;
  border: 2px solid rgba(var(--v-theme-on-surface), 0.1);
}

.embed-content {
  flex: 1;
  min-width: 0;
}

.embed-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.post-embed--compact .embed-label {
  font-size: 11px;
}

.embed-title {
  font-size: 15px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-embed--compact .embed-title {
  font-size: 14px;
  -webkit-line-clamp: 1;
}

.embed-username {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-top: 2px;
}

.embed-description {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.7);
  line-height: 1.4;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-embed--compact .embed-description {
  display: none;
}

.embed-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.post-embed--compact .embed-meta {
  margin-top: 4px;
}

.embed-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.embed-arrow {
  flex-shrink: 0;
  color: rgba(var(--v-theme-on-surface), 0.4);
}

/* User embed specific */
.post-embed--user {
  align-items: center;
}
</style>
