<template>
  <div class="thread-page">
    <!-- 页面头部 -->
    <header class="thread-header">
      <v-btn
        icon
        variant="text"
        size="small"
        class="header-back"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="header-title">帖子</h1>
    </header>

    <!-- 加载状态 -->
    <div v-if="loading" class="thread-loading">
      <v-progress-circular indeterminate color="primary" size="32" width="3" />
    </div>

    <!-- 404 状态 -->
    <div v-else-if="notFound" class="thread-not-found">
      <div class="not-found-icon">
        <v-icon size="48">mdi-message-off-outline</v-icon>
      </div>
      <h2 class="not-found-title">此页面不存在</h2>
      <p class="not-found-text">你要找的帖子可能已被删除或不可用。</p>
      <v-btn color="primary" variant="flat" @click="$router.push('/app/posts')">
        返回首页
      </v-btn>
    </div>

    <!-- 线程内容 -->
    <template v-else-if="rootPost">
      <!-- 主帖（大号展示） -->
      <article class="thread-root">
        <div class="root-header">
          <v-avatar
            size="48"
            class="root-avatar"
            @click="goToUser(rootPost.author?.id)"
          >
            <v-img :src="getAuthorAvatar(rootPost)" :alt="getAuthorUsername(rootPost)" />
          </v-avatar>
          <div class="root-author" @click="goToUser(rootPost.author?.id)">
            <div class="root-display-name">{{ getAuthorDisplayName(rootPost) }}</div>
            <div class="root-username">@{{ getAuthorUsername(rootPost) }}</div>
          </div>
          <v-spacer />
          <v-menu v-if="canDelete(rootPost)" location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn v-bind="menuProps" icon size="small" variant="text">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item class="text-error" @click="deletePost(rootPost)">
                <template #prepend>
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </template>
                <v-list-item-title>删除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- 内容 -->
        <div class="root-content" v-html="formatContent(rootPost.content)" />

        <!-- 媒体 -->
        <div v-if="rootMedia.length" class="root-media" :class="`root-media--${Math.min(rootMedia.length, 4)}`">
          <div
            v-for="(media, idx) in rootMedia.slice(0, 4)"
            :key="media.id || idx"
            v-ripple
            class="root-media-item"
            @click="openMediaViewer(idx)"
          >
            <v-img
              :src="getMediaUrl(media)"
              :cover="rootMedia.length > 1"
              :max-height="rootMedia.length === 1 ? 600 : undefined"
              class="root-media-img"
            />
          </div>
        </div>

        <!-- 嵌入内容 -->
        <PostEmbed v-if="rootPost.embed" :embed="rootPost.embed" class="mt-4" />

        <!-- 引用的帖子 -->
        <QuotedPost
          v-if="quotedPost"
          :post="quotedPost"
          :is-deleted="quotedPost.is_deleted"
          class="mt-4"
          @click="goToPost(quotedPost.id)"
        />

        <!-- 时间 -->
        <div class="root-time">
          <time :datetime="rootPost.created_at">
            {{ formatFullTime(rootPost.created_at) }}
          </time>
        </div>

        <!-- 统计数据 -->
        <div v-if="hasStats" class="root-stats">
          <div v-if="rootPost.stats?.retweets > 0" class="root-stat">
            <span class="root-stat-value">{{ formatCount(rootPost.stats.retweets) }}</span>
            <span class="root-stat-label">转推</span>
          </div>
          <div v-if="rootPost.stats?.likes > 0" class="root-stat">
            <span class="root-stat-value">{{ formatCount(rootPost.stats.likes) }}</span>
            <span class="root-stat-label">喜欢</span>
          </div>
          <div v-if="rootPost.stats?.bookmarks > 0" class="root-stat">
            <span class="root-stat-value">{{ formatCount(rootPost.stats.bookmarks) }}</span>
            <span class="root-stat-label">书签</span>
          </div>
        </div>

        <!-- 操作栏 -->
        <div class="root-actions">
          <button
            v-ripple
            class="root-action root-action--reply"
            @click="focusReply"
          >
            <v-icon size="22">mdi-chat-outline</v-icon>
          </button>
          <button
            v-ripple
            class="root-action root-action--retweet"
            :class="{ 'root-action--active': isRetweeted }"
            @click="toggleRetweet"
          >
            <v-icon size="22">mdi-repeat-variant</v-icon>
          </button>
          <button
            v-ripple
            class="root-action root-action--like"
            :class="{ 'root-action--active': isLiked }"
            @click="toggleLike"
          >
            <v-icon size="22">{{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
          </button>
          <button
            v-ripple
            class="root-action root-action--bookmark"
            :class="{ 'root-action--active': isBookmarked }"
            @click="toggleBookmark"
          >
            <v-icon size="22">{{ isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}</v-icon>
          </button>
          <button v-ripple class="root-action root-action--share" @click="sharePost">
            <v-icon size="22">mdi-share-variant-outline</v-icon>
          </button>
        </div>
      </article>

      <!-- 回复输入框 -->
      <div class="thread-reply-composer">
        <PostComposer
          ref="replyComposerRef"
          :submit="submitReply"
          :placeholder="`回复 @${getAuthorUsername(rootPost)}`"
          submit-label="回复"
          :disabled="!isLogin"
          :show-login-hint="!isLogin"
        />
      </div>

      <!-- 回复列表 -->
      <div class="thread-replies">
        <PostList
          :items="replies"
          :includes="mergedIncludes"
          :loading="false"
          :loading-more="loadingMore"
          :has-more="hasMoreReplies"
          :show-end-message="replies.length > 0"
          empty-title="暂无回复"
          empty-text="成为第一个回复的人吧"
          thread-mode
          @deleted="removeReply"
          @created="addReply"
          @load-more="loadMoreReplies"
        />
      </div>
    </template>

    <!-- 媒体查看器 -->
    <v-dialog v-model="mediaViewerOpen" fullscreen>
      <div class="media-viewer" @click="mediaViewerOpen = false">
        <v-btn
          icon
          variant="text"
          class="media-viewer-close"
          @click="mediaViewerOpen = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-carousel
          v-model="mediaViewerIndex"
          hide-delimiters
          :show-arrows="rootMedia.length > 1"
          height="100%"
          @click.stop
        >
          <v-carousel-item
            v-for="(media, idx) in rootMedia"
            :key="media.id || idx"
          >
            <div class="media-viewer-item">
              <v-img
                :src="getMediaUrl(media)"
                contain
                max-height="90vh"
                max-width="90vw"
              />
            </div>
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { localuser } from '@/services/localAccount';
import { getS3staticurl } from '@/services/projectService';
import PostsService from '@/services/postsService';
import { showSnackbar } from '@/composables/useNotifications';
import PostComposer from '@/components/posts/PostComposer.vue';
import PostList from '@/components/posts/PostList.vue';
import PostEmbed from '@/components/posts/PostEmbed.vue';
import QuotedPost from '@/components/posts/QuotedPost.vue';

const route = useRoute();
const router = useRouter();

const postId = computed(() => route.params.id);

// State
const rootPost = ref(null);
const replies = ref([]);
const includes = ref({ posts: {} });
const loading = ref(false);
const loadingMore = ref(false);
const notFound = ref(false);
const cursor = ref(null);
const hasMoreReplies = ref(true);
const mediaViewerOpen = ref(false);
const mediaViewerIndex = ref(0);

const replyComposerRef = ref(null);

// Auth
const isLogin = computed(() => localuser.isLogin.value);
const currentUserId = computed(() => localuser.user.value?.id);

// Root post computed
const rootMedia = computed(() => {
  const media = rootPost.value?.media || rootPost.value?.mediaAssets || [];
  return Array.isArray(media) ? media : [];
});

const quotedPost = computed(() => {
  const quotedId = rootPost.value?.quote_of_id;
  if (!quotedId) return null;
  // 先在includes中查找
  const posts = includes.value?.posts || {};
  let found = posts[quotedId] || posts[String(quotedId)];
  if (found) return found;
  // 再在replies中查找（如果引用的帖子也是回复之一）
  return replies.value.find(p => p.id === quotedId || p.id === Number(quotedId)) || null;
});

// 合并includes，将replies中的帖子也加入，供PostList使用
const mergedIncludes = computed(() => {
  const result = { posts: { ...includes.value?.posts } };
  // 添加rootPost
  if (rootPost.value?.id) {
    result.posts[rootPost.value.id] = rootPost.value;
    result.posts[String(rootPost.value.id)] = rootPost.value;
  }
  // 添加所有replies
  for (const reply of replies.value) {
    if (reply?.id) {
      result.posts[reply.id] = reply;
      result.posts[String(reply.id)] = reply;
    }
  }
  return result;
});

const hasStats = computed(() => {
  const stats = rootPost.value?.stats;
  return stats && (stats.retweets > 0 || stats.likes > 0 || stats.bookmarks > 0);
});

const viewerContext = computed(() => rootPost.value?.viewer_context || {});
const isLiked = computed(() => viewerContext.value.liked ?? rootPost.value?.liked ?? false);
const isRetweeted = computed(() => viewerContext.value.retweeted ?? rootPost.value?.retweeted ?? false);
const isBookmarked = computed(() => viewerContext.value.bookmarked ?? rootPost.value?.bookmarked ?? false);

// Load thread
const loadThread = async () => {
  if (!postId.value) return;

  loading.value = true;
  notFound.value = false;

  try {
    const res = await PostsService.getThread(postId.value, { limit: 50 });

    if (res.root) {
      rootPost.value = res.root;
      replies.value = res.replies;
      includes.value = res.includes;
      cursor.value = res.nextCursor;
      hasMoreReplies.value = res.hasMore;
    } else {
      // 兼容旧API，尝试单独获取帖子
      const singleRes = await PostsService.getPost(postId.value);
      if (singleRes.post) {
        rootPost.value = singleRes.post;
        includes.value = singleRes.includes;
        replies.value = [];
        hasMoreReplies.value = false;
      } else {
        notFound.value = true;
      }
    }
  } catch (e) {
    if (e.message?.includes('404') || e.message?.includes('不存在')) {
      notFound.value = true;
    } else {
      showSnackbar(e?.message || '加载失败', 'error');
    }
  } finally {
    loading.value = false;
  }
};

const loadMoreReplies = async () => {
  if (!hasMoreReplies.value || loadingMore.value || !cursor.value) return;

  loadingMore.value = true;
  try {
    const res = await PostsService.getThread(postId.value, {
      cursor: cursor.value,
      limit: 50
    });

    replies.value.push(...res.replies);
    Object.assign(includes.value.posts, res.includes.posts);
    cursor.value = res.nextCursor;
    hasMoreReplies.value = res.hasMore;
  } catch (e) {
    showSnackbar(e?.message || '加载失败', 'error');
  } finally {
    loadingMore.value = false;
  }
};

// Helpers
const getAuthorAvatar = (post) => {
  const avatar = post?.author?.avatar;
  if (!avatar) return '/default-avatar.png';
  return localuser.getUserAvatar(avatar);
};

const getAuthorUsername = (post) => {
  return post?.author?.username ?? 'unknown';
};

const getAuthorDisplayName = (post) => {
  return post?.author?.display_name ?? post?.author?.displayName ?? getAuthorUsername(post);
};

const getMediaUrl = (media) => {
  if (media.url) return media.url;
  if (media.md5) {
    // 使用 md5 和 extension 构建正确的 URL
    const ext = media.extension || 'webp';
    return `${getS3staticurl(media.md5)}.${ext}`;
  }
  return media.src || media.href || '';
};

const formatContent = (content) => {
  if (!content) return '';
  let text = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  text = text.replace(/@(\w+)/g, '<a href="/user/$1" class="thread-mention">@$1</a>');
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="thread-link" target="_blank" rel="noopener">$1</a>');
  text = text.replace(/\n/g, '<br>');

  return text;
};

const formatFullTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatCount = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const canDelete = (post) => {
  if (!currentUserId.value) return false;
  return Number(currentUserId.value) === Number(post?.author?.id);
};

// Navigation
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/app/posts');
  }
};

const goToUser = (userId) => {
  if (userId) router.push(`/app/posts/user/${userId}`);
};

const goToPost = (id) => {
  if (id) router.push(`/app/posts/${id}`);
};

// Actions
const requireLogin = (action) => {
  if (!isLogin.value) {
    showSnackbar(`请先登录后再${action}`, 'warning');
    return false;
  }
  return true;
};

const toggleLike = async () => {
  if (!requireLogin('点赞')) return;
  try {
    if (isLiked.value) {
      await PostsService.unlike(postId.value);
      if (rootPost.value.viewer_context) rootPost.value.viewer_context.liked = false;
      else rootPost.value.liked = false;
      if (rootPost.value.stats) rootPost.value.stats.likes--;
    } else {
      await PostsService.like(postId.value);
      if (rootPost.value.viewer_context) rootPost.value.viewer_context.liked = true;
      else rootPost.value.liked = true;
      if (rootPost.value.stats) rootPost.value.stats.likes++;
    }
  } catch (e) {
    showSnackbar(e?.message || '操作失败', 'error');
  }
};

const toggleRetweet = async () => {
  if (!requireLogin('转推')) return;
  try {
    if (isRetweeted.value) {
      await PostsService.unretweet(postId.value);
      if (rootPost.value.viewer_context) rootPost.value.viewer_context.retweeted = false;
      else rootPost.value.retweeted = false;
      if (rootPost.value.stats) rootPost.value.stats.retweets--;
    } else {
      await PostsService.retweet(postId.value);
      if (rootPost.value.viewer_context) rootPost.value.viewer_context.retweeted = true;
      else rootPost.value.retweeted = true;
      if (rootPost.value.stats) rootPost.value.stats.retweets++;
    }
  } catch (e) {
    showSnackbar(e?.message || '操作失败', 'error');
  }
};

const toggleBookmark = async () => {
  if (!requireLogin('收藏')) return;
  try {
    if (isBookmarked.value) {
      await PostsService.unbookmark(postId.value);
      if (rootPost.value.viewer_context) rootPost.value.viewer_context.bookmarked = false;
      else rootPost.value.bookmarked = false;
      showSnackbar('已取消收藏', 'success');
    } else {
      await PostsService.bookmark(postId.value);
      if (rootPost.value.viewer_context) rootPost.value.viewer_context.bookmarked = true;
      else rootPost.value.bookmarked = true;
      showSnackbar('已添加到书签', 'success');
    }
  } catch (e) {
    showSnackbar(e?.message || '操作失败', 'error');
  }
};

const sharePost = async () => {
  const url = `${window.location.origin}/app/posts/${postId.value}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${getAuthorDisplayName(rootPost.value)}的推文`,
        text: rootPost.value?.content?.slice(0, 100),
        url
      });
    } catch {}
  } else {
    try {
      await navigator.clipboard.writeText(url);
      showSnackbar('链接已复制', 'success');
    } catch {
      showSnackbar('复制失败', 'error');
    }
  }
};

const deletePost = async (post) => {
  try {
    await PostsService.remove(post.id);
    showSnackbar('推文已删除', 'success');
    router.push('/app/posts');
  } catch (e) {
    showSnackbar(e?.message || '删除失败', 'error');
  }
};

// Reply
const focusReply = () => {
  if (!requireLogin('回复')) return;
  replyComposerRef.value?.focus();
};

const submitReply = async ({ content, mediaIds, embed }) => {
  const res = await PostsService.reply(postId.value, { content, mediaIds, embed });
  if (res.post) {
    replies.value.unshift(res.post);
    if (rootPost.value.stats) rootPost.value.stats.replies++;
  }
  // 合并includes（被回复的帖子等）
  if (res.includes?.posts) {
    Object.assign(includes.value.posts, res.includes.posts);
  }
  showSnackbar('回复已发布', 'success');
};

const removeReply = (replyId) => {
  replies.value = replies.value.filter((r) => r.id !== replyId);
  if (rootPost.value.stats) rootPost.value.stats.replies--;
};

const addReply = (data) => {
  // 支持 { post, includes } 格式或直接传入 post
  const post = data?.post ?? data;
  const newIncludes = data?.includes?.posts;

  if (post) {
    replies.value.unshift(post);
  }
  if (newIncludes) {
    Object.assign(includes.value.posts, newIncludes);
  }
};

// Media viewer
const openMediaViewer = (index) => {
  mediaViewerIndex.value = index;
  mediaViewerOpen.value = true;
};

// Watch route changes
watch(() => postId.value, loadThread, { immediate: false });

onMounted(loadThread);
</script>

<style scoped>
.thread-page {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Header */
.thread-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 53px;
  background: rgba(var(--v-theme-surface), 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.header-back {
  margin-right: 16px;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

/* Loading & Not Found */
.thread-loading,
.thread-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.not-found-icon {
  margin-bottom: 16px;
  padding: 20px;
  background: rgba(var(--v-theme-on-surface), 0.05);
  border-radius: 50%;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.not-found-title {
  font-size: 20px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
}

.not-found-text {
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 20px;
}

/* Root Post */
.thread-root {
  padding: 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.root-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.root-avatar {
  cursor: pointer;
  margin-right: 12px;
}

.root-author {
  cursor: pointer;
}

.root-author:hover .root-display-name {
  text-decoration: underline;
}

.root-display-name {
  font-size: 15px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
}

.root-username {
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.root-content {
  font-size: 23px;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  word-break: break-word;
  white-space: pre-wrap;
}

.root-content :deep(.thread-mention),
.root-content :deep(.thread-link) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.root-content :deep(.thread-mention:hover),
.root-content :deep(.thread-link:hover) {
  text-decoration: underline;
}

/* Root Media */
.root-media {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.root-media--1 {
  display: block;
}

.root-media--1 .root-media-item {
  width: 100%;
}

.root-media--2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.root-media--3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.root-media--3 .root-media-item:first-child {
  grid-row: span 2;
  aspect-ratio: auto;
}

.root-media--4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.root-media-item {
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-on-surface), 0.03);
  transition: opacity 0.15s;
  position: relative;
}

.root-media-item:hover {
  opacity: 0.9;
}

.root-media--2 .root-media-item,
.root-media--4 .root-media-item {
  aspect-ratio: 1;
}

.root-media--3 .root-media-item:not(:first-child) {
  aspect-ratio: 1;
}

.root-media-img {
  width: 100%;
  height: 100%;
}

/* Time */
.root-time {
  padding: 16px 0;
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Stats */
.root-stats {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.root-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.root-stat-value {
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

.root-stat-label {
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* Actions */
.root-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.root-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  color: rgba(var(--v-theme-on-surface), 0.6);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
}

.root-action--reply:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.root-action--retweet:hover {
  color: #00ba7c;
  background: rgba(0, 186, 124, 0.1);
}

.root-action--retweet.root-action--active {
  color: #00ba7c;
}

.root-action--like:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.1);
}

.root-action--like.root-action--active {
  color: #f91880;
}

.root-action--bookmark:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.root-action--bookmark.root-action--active {
  color: rgb(var(--v-theme-primary));
}

.root-action--share:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

/* Reply Composer */
.thread-reply-composer {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Replies */
.thread-replies {
  /* Replies list has its own styles */
}

/* Media Viewer */
.media-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.media-viewer-close {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  color: white;
}

.media-viewer-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
