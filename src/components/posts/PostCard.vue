<template>
  <article
    class="post-card"
    :class="{
      'post-card--deleted': isDeleted,
      'post-card--retweet': isRetweet,
      'post-card--highlight': highlight
    }"
  >
    <!-- 转推提示 -->
    <div v-if="retweetAuthor" class="post-retweet-indicator">
      <v-icon size="14" class="mr-2">mdi-repeat</v-icon>
      <router-link
        :to="`/user/${retweetAuthor.id}`"
        class="post-retweet-link"
        @click.stop
      >
        {{ retweetAuthor.display_name || retweetAuthor.username }} 转推了
      </router-link>
    </div>

    <!-- 回复提示 -->
    <div v-if="replyToPost && !hideReplyIndicator" class="post-reply-indicator">
      <v-icon size="14" class="mr-2">mdi-reply</v-icon>
      <span class="text-medium-emphasis">
        回复
        <router-link
          :to="`/user/${replyToPost.author?.id}`"
          class="post-reply-link"
          @click.stop
        >
          @{{ replyToPost.author?.username || '用户' }}
        </router-link>
      </span>
    </div>

    <div v-ripple class="post-main" @click="openDetail">
      <!-- 头像 -->
      <div class="post-avatar-col">
        <v-avatar
          size="48"
          class="post-avatar"
          @click.stop="goUser"
        >
          <v-img :src="authorAvatar" :alt="authorUsername" />
        </v-avatar>
        <!-- 线程连接线 -->
        <div v-if="showThreadLine" class="post-thread-line" />
      </div>

      <!-- 内容区 -->
      <div class="post-content-col">
        <!-- 作者信息行 -->
        <div class="post-header">
          <div class="post-author-info" @click.stop="goUser">
            <span class="post-display-name">{{ authorDisplayName }}</span>
            <span class="post-username">@{{ authorUsername }}</span>
          </div>
          <span class="post-separator">·</span>
          <time class="post-time" :datetime="createdAt" :title="fullDateTime">
            {{ timeAgo }}
          </time>
          <v-spacer />
          <v-menu v-if="!isDeleted" location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon
                size="small"
                variant="text"
                class="post-menu-btn"
                @click.stop
              >
                <v-icon size="18">mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list density="compact" class="post-menu-list">
              <v-list-item
                v-if="canDelete"
                class="text-error"
                @click="confirmDelete = true"
              >
                <template #prepend>
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </template>
                <v-list-item-title>删除</v-list-item-title>
              </v-list-item>
              <v-list-item @click="copyLink">
                <template #prepend>
                  <v-icon size="18">mdi-link-variant</v-icon>
                </template>
                <v-list-item-title>复制链接</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- 已删除提示 -->
        <div v-if="isDeleted" class="post-deleted-notice">
          <v-icon size="16" class="mr-1">mdi-alert-circle-outline</v-icon>
          此推文已被删除
        </div>

        <!-- 正文内容 -->
        <div v-else class="post-body">
          <div
            v-if="displayContent"
            class="post-text"
            v-html="formattedContent"
          />

          <!-- 媒体展示 -->
          <div v-if="mediaItems.length" class="post-media" :class="mediaGridClass">
            <div
              v-for="(media, idx) in mediaItems.slice(0, 4)"
              :key="media.id || idx"
              v-ripple
              class="post-media-item"
              @click.stop="openMediaViewer(idx)"
            >
              <v-img
                :src="getMediaUrl(media)"
                :cover="mediaItems.length > 1"
                :max-height="mediaItems.length === 1 ? 500 : undefined"
                class="post-media-img"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="24" width="2" />
                  </div>
                </template>
              </v-img>
              <div v-if="idx === 3 && mediaItems.length > 4" class="post-media-more">
                +{{ mediaItems.length - 4 }}
              </div>
            </div>
          </div>

          <!-- 嵌入内容 -->
          <PostEmbed
            v-if="embedData"
            :embed="embedData"
            class="mt-3"
            @click.stop
          />

          <!-- 引用的帖子 -->
          <QuotedPost
            v-if="quotedPost"
            :post="quotedPost"
            :is-deleted="quotedPost.is_deleted"
            class="mt-3"
            @click.stop="goToQuotedPost"
          />
        </div>

        <!-- 操作栏 -->
        <div v-if="!isDeleted" class="post-actions">
          <button
            v-ripple
            class="post-action post-action--reply"
            :disabled="actionLoading"
            @click.stop="openReplyDialog"
          >
            <v-icon size="18">mdi-chat-outline</v-icon>
            <span v-if="stats.replies > 0" class="post-action-count">
              {{ formatCount(stats.replies) }}
            </span>
          </button>

          <button
            v-ripple
            class="post-action post-action--retweet"
            :class="{ 'post-action--active': isRetweeted }"
            :disabled="actionLoading"
            @click.stop="toggleRetweet"
          >
            <v-icon size="18">mdi-repeat-variant</v-icon>
            <span v-if="stats.retweets > 0" class="post-action-count">
              {{ formatCount(stats.retweets) }}
            </span>
          </button>

          <button
            v-ripple
            class="post-action post-action--quote"
            :disabled="actionLoading"
            @click.stop="openQuoteDialog"
          >
            <v-icon size="18">mdi-format-quote-close</v-icon>
          </button>

          <button
            v-ripple
            class="post-action post-action--like"
            :class="{ 'post-action--active': isLiked }"
            :disabled="actionLoading"
            @click.stop="toggleLike"
          >
            <v-icon size="18">
              {{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
            <span v-if="stats.likes > 0" class="post-action-count">
              {{ formatCount(stats.likes) }}
            </span>
          </button>

          <button
            v-ripple
            class="post-action post-action--bookmark"
            :class="{ 'post-action--active': isBookmarked }"
            :disabled="actionLoading"
            @click.stop="toggleBookmark"
          >
            <v-icon size="18">
              {{ isBookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}
            </v-icon>
          </button>

          <button
            v-ripple
            class="post-action post-action--share"
            @click.stop="sharePost"
          >
            <v-icon size="18">mdi-share-variant-outline</v-icon>
          </button>
        </div>
      </div>
    </div>
  </article>

  <!-- 回复对话框 -->
  <v-dialog v-model="replyDialog" max-width="600" class="post-dialog">
    <v-card class="post-dialog-card">
      <v-card-title class="post-dialog-header">
        <v-btn icon variant="text" size="small" @click="replyDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="post-dialog-content">
        <!-- 被回复的帖子预览 -->
        <div class="reply-preview">
          <div class="reply-preview-avatar">
            <v-avatar size="40">
              <v-img :src="authorAvatar" />
            </v-avatar>
            <div class="reply-preview-line" />
          </div>
          <div class="reply-preview-content">
            <div class="reply-preview-header">
              <span class="post-display-name">{{ authorDisplayName }}</span>
              <span class="post-username">@{{ authorUsername }}</span>
            </div>
            <div class="reply-preview-text">{{ displayContent }}</div>
            <div class="reply-preview-to">
              回复 <span class="text-primary">@{{ authorUsername }}</span>
            </div>
          </div>
        </div>
        <PostComposer
          ref="replyComposerRef"
          :submit="submitReply"
          placeholder="发布你的回复"
          submit-label="回复"
          :disabled="!isLogin"
          :auto-focus="true"
        />
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- 引用对话框 -->
  <v-dialog v-model="quoteDialog" max-width="600" class="post-dialog">
    <v-card class="post-dialog-card">
      <v-card-title class="post-dialog-header">
        <v-btn icon variant="text" size="small" @click="quoteDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <span class="ml-4 text-subtitle-1">引用推文</span>
      </v-card-title>
      <v-card-text class="post-dialog-content">
        <PostComposer
          ref="quoteComposerRef"
          :submit="submitQuote"
          placeholder="添加评论"
          submit-label="引用"
          :disabled="!isLogin"
          :auto-focus="true"
        >
          <template #append>
            <QuotedPost
              :post="post"
              compact
              class="mt-3"
            />
          </template>
        </PostComposer>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- 删除确认对话框 -->
  <v-dialog v-model="confirmDelete" max-width="320">
    <v-card class="post-confirm-dialog">
      <v-card-title class="text-h6">删除推文？</v-card-title>
      <v-card-text class="text-body-2 text-medium-emphasis">
        此操作无法撤消。该推文将从你的个人资料、任何关注你的用户的时间线以及搜索结果中删除。
      </v-card-text>
      <v-card-actions class="flex-column pa-4 pt-0">
        <v-btn
          block
          color="error"
          variant="flat"
          :loading="deleting"
          class="mb-2"
          @click="doDelete"
        >
          删除
        </v-btn>
        <v-btn
          block
          variant="outlined"
          @click="confirmDelete = false"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
        :show-arrows="mediaItems.length > 1"
        height="100%"
        @click.stop
      >
        <v-carousel-item
          v-for="(media, idx) in mediaItems"
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
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { localuser } from '@/services/localAccount';
import { getS3staticurl } from '@/services/projectService';
import PostsService from '@/services/postsService';
import { showSnackbar } from '@/composables/useNotifications';
import PostComposer from './PostComposer.vue';
import PostEmbed from './PostEmbed.vue';
import QuotedPost from './QuotedPost.vue';

const props = defineProps({
  post: { type: Object, required: true },
  includes: { type: Object, default: () => ({ posts: {} }) },
  highlight: { type: Boolean, default: false },
  showThreadLine: { type: Boolean, default: false },
  hideReplyIndicator: { type: Boolean, default: false },
  retweetAuthor: { type: Object, default: null }
});

const emit = defineEmits(['deleted', 'created', 'updated']);

const router = useRouter();

// Dialog states
const replyDialog = ref(false);
const quoteDialog = ref(false);
const confirmDelete = ref(false);
const deleting = ref(false);
const actionLoading = ref(false);
const mediaViewerOpen = ref(false);
const mediaViewerIndex = ref(0);

const replyComposerRef = ref(null);
const quoteComposerRef = ref(null);

// Auth
const isLogin = computed(() => localuser.isLogin.value);
const currentUserId = computed(() => localuser.user.value?.id);

// Post data
const postId = computed(() => props.post?.id ?? props.post?.postId);
const postType = computed(() => props.post?.type || 'normal');
const isDeleted = computed(() => props.post?.is_deleted === true);
const isRetweet = computed(() => postType.value === 'retweet');

// Author data
const author = computed(() => props.post?.author || props.post?.user || {});
const authorId = computed(() => author.value?.id ?? props.post?.userId ?? props.post?.authorId);
const authorUsername = computed(() => author.value?.username ?? props.post?.username ?? 'unknown');
const authorDisplayName = computed(() =>
  author.value?.display_name ?? author.value?.displayName ?? authorUsername.value
);
const authorAvatar = computed(() => {
  const avatar = author.value?.avatar;
  if (!avatar) return '/default-avatar.png';
  return localuser.getUserAvatar(avatar);
});

// Time
const createdAt = computed(() =>
  props.post?.created_at ?? props.post?.createdAt ?? props.post?.time ?? props.post?.created
);

const timeAgo = computed(() => {
  if (!createdAt.value) return '';
  const date = new Date(createdAt.value);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟`;
  if (hours < 24) return `${hours}小时`;
  if (days < 7) return `${days}天`;

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
});

const fullDateTime = computed(() => {
  if (!createdAt.value) return '';
  return new Date(createdAt.value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Content
const displayContent = computed(() => {
  if (isDeleted.value) return null;
  return props.post?.content ?? '';
});

const formattedContent = computed(() => {
  if (!displayContent.value) return '';
  let text = displayContent.value;

  // 转义HTML
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // @提及
  text = text.replace(
    /@(\w+)/g,
    '<a href="/user/$1" class="post-mention" onclick="event.stopPropagation()">@$1</a>'
  );

  // URL链接
  text = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" class="post-link" target="_blank" rel="noopener" onclick="event.stopPropagation()">$1</a>'
  );

  // 换行
  text = text.replace(/\n/g, '<br>');

  return text;
});

// Stats
const stats = computed(() => {
  const s = props.post?.stats || {};
  return {
    replies: s.replies || 0,
    retweets: s.retweets || 0,
    likes: s.likes || 0,
    bookmarks: s.bookmarks || 0
  };
});

// Viewer context
const viewerContext = computed(() => props.post?.viewer_context || {});
const isLiked = computed(() =>
  viewerContext.value.liked ?? props.post?.liked ?? props.post?.isLiked ?? false
);
const isRetweeted = computed(() =>
  viewerContext.value.retweeted ?? props.post?.retweeted ?? props.post?.isRetweeted ?? false
);
const isBookmarked = computed(() =>
  viewerContext.value.bookmarked ?? props.post?.bookmarked ?? props.post?.isBookmarked ?? false
);

// Media
const mediaItems = computed(() => {
  const media = props.post?.media || props.post?.mediaAssets || props.post?.assets || [];
  return Array.isArray(media) ? media : [];
});

const mediaGridClass = computed(() => {
  const count = Math.min(mediaItems.value.length, 4);
  return `post-media--${count}`;
});

const getMediaUrl = (media) => {
  if (media.url) return media.url;
  if (media.md5) {
    // 使用 md5 和 extension 构建正确的 URL
    const ext = media.extension || 'webp';
    return `${getS3staticurl(media.md5)}.${ext}`;
  }
  return media.src || media.href || '';
};

// Embed
const embedData = computed(() => props.post?.embed || null);

// Quoted post
const quotedPostId = computed(() => props.post?.quote_of_id || props.post?.quoteOfId);
const quotedPost = computed(() => {
  if (!quotedPostId.value) return null;
  // 处理ID可能是数字或字符串的情况
  const posts = props.includes?.posts || {};
  return posts[quotedPostId.value] || posts[String(quotedPostId.value)] || null;
});

// Reply to post
const replyToId = computed(() => props.post?.reply_to_id || props.post?.replyToId);
const replyToPost = computed(() => {
  if (!replyToId.value) return null;
  // 处理ID可能是数字或字符串的情况
  const posts = props.includes?.posts || {};
  return posts[replyToId.value] || posts[String(replyToId.value)] || null;
});

// Permissions
const canDelete = computed(() => {
  if (!currentUserId.value) return false;
  return Number(currentUserId.value) === Number(authorId.value);
});

// Utility
const formatCount = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Navigation
const openDetail = () => {
  if (!postId.value || isDeleted.value) return;
  router.push(`/app/posts/${postId.value}`);
};

const goUser = () => {
  if (!authorId.value) return;
  router.push(`/app/posts/user/${authorId.value}`);
};

const goToQuotedPost = () => {
  if (!quotedPostId.value) return;
  router.push(`/app/posts/${quotedPostId.value}`);
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
  actionLoading.value = true;
  try {
    if (isLiked.value) {
      await PostsService.unlike(postId.value);
      if (props.post.viewer_context) props.post.viewer_context.liked = false;
      else props.post.liked = false;
      if (props.post.stats) props.post.stats.likes = Math.max(0, stats.value.likes - 1);
    } else {
      await PostsService.like(postId.value);
      if (props.post.viewer_context) props.post.viewer_context.liked = true;
      else props.post.liked = true;
      if (props.post.stats) props.post.stats.likes = stats.value.likes + 1;
    }
    emit('updated', props.post);
  } catch (e) {
    showSnackbar(e?.message || '操作失败', 'error');
  } finally {
    actionLoading.value = false;
  }
};

const toggleRetweet = async () => {
  if (!requireLogin('转推')) return;
  actionLoading.value = true;
  try {
    if (isRetweeted.value) {
      await PostsService.unretweet(postId.value);
      if (props.post.viewer_context) props.post.viewer_context.retweeted = false;
      else props.post.retweeted = false;
      if (props.post.stats) props.post.stats.retweets = Math.max(0, stats.value.retweets - 1);
    } else {
      await PostsService.retweet(postId.value);
      if (props.post.viewer_context) props.post.viewer_context.retweeted = true;
      else props.post.retweeted = true;
      if (props.post.stats) props.post.stats.retweets = stats.value.retweets + 1;
    }
    emit('updated', props.post);
  } catch (e) {
    showSnackbar(e?.message || '操作失败', 'error');
  } finally {
    actionLoading.value = false;
  }
};

const toggleBookmark = async () => {
  if (!requireLogin('收藏')) return;
  actionLoading.value = true;
  try {
    if (isBookmarked.value) {
      await PostsService.unbookmark(postId.value);
      if (props.post.viewer_context) props.post.viewer_context.bookmarked = false;
      else props.post.bookmarked = false;
      showSnackbar('已取消收藏', 'success');
    } else {
      await PostsService.bookmark(postId.value);
      if (props.post.viewer_context) props.post.viewer_context.bookmarked = true;
      else props.post.bookmarked = true;
      showSnackbar('已添加到书签', 'success');
    }
    emit('updated', props.post);
  } catch (e) {
    showSnackbar(e?.message || '操作失败', 'error');
  } finally {
    actionLoading.value = false;
  }
};

// Dialogs
const openReplyDialog = () => {
  if (!requireLogin('回复')) return;
  replyDialog.value = true;
};

const openQuoteDialog = () => {
  if (!requireLogin('引用')) return;
  quoteDialog.value = true;
};

const submitReply = async ({ content, mediaIds, embed }) => {
  const res = await PostsService.reply(postId.value, { content, mediaIds, embed });
  replyDialog.value = false;
  showSnackbar('回复已发布', 'success');
  if (props.post.stats) props.post.stats.replies++;
  // 传递完整响应（包含post和includes）
  emit('created', res);
};

const submitQuote = async ({ content, mediaIds, embed }) => {
  const res = await PostsService.quote(postId.value, { content, mediaIds, embed });
  quoteDialog.value = false;
  showSnackbar('引用已发布', 'success');
  // 传递完整响应（包含post和includes）
  emit('created', res);
};

const doDelete = async () => {
  deleting.value = true;
  try {
    await PostsService.remove(postId.value);
    confirmDelete.value = false;
    showSnackbar('推文已删除', 'success');
    emit('deleted', postId.value);
  } catch (e) {
    showSnackbar(e?.message || '删除失败', 'error');
  } finally {
    deleting.value = false;
  }
};

// Utilities
const copyLink = async () => {
  const url = `${window.location.origin}/app/posts/${postId.value}`;
  try {
    await navigator.clipboard.writeText(url);
    showSnackbar('链接已复制', 'success');
  } catch {
    showSnackbar('复制失败', 'error');
  }
};

const sharePost = async () => {
  const url = `${window.location.origin}/app/posts/${postId.value}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${authorDisplayName.value}的推文`,
        text: displayContent.value?.slice(0, 100),
        url
      });
    } catch {
      // User cancelled
    }
  } else {
    copyLink();
  }
};

const openMediaViewer = (index) => {
  mediaViewerIndex.value = index;
  mediaViewerOpen.value = true;
};
</script>

<style scoped>
.post-card {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: background-color 0.15s ease;
}

.post-card:hover {
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.post-card--highlight {
  background: rgba(var(--v-theme-primary), 0.05);
}

.post-card--deleted {
  opacity: 0.6;
}

.post-retweet-indicator,
.post-reply-indicator {
  display: flex;
  align-items: center;
  padding: 8px 16px 0 64px;
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.post-retweet-link,
.post-reply-link {
  color: inherit;
  text-decoration: none;
}

.post-retweet-link:hover,
.post-reply-link:hover {
  text-decoration: underline;
}

.post-main {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  position: relative;
}

.post-avatar-col {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
}

.post-avatar {
  cursor: pointer;
  transition: opacity 0.15s;
}

.post-avatar:hover {
  opacity: 0.85;
}

.post-thread-line {
  flex: 1;
  width: 2px;
  min-height: 24px;
  margin-top: 8px;
  background: rgba(var(--v-theme-on-surface), 0.15);
  border-radius: 1px;
}

.post-content-col {
  flex: 1;
  min-width: 0;
}

.post-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}

.post-author-info {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  min-width: 0;
}

.post-display-name {
  font-weight: 700;
  font-size: 15px;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-author-info:hover .post-display-name {
  text-decoration: underline;
}

.post-username {
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-separator {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.post-time {
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
}

.post-time:hover {
  text-decoration: underline;
}

.post-menu-btn {
  opacity: 0;
  transition: opacity 0.15s;
}

.post-card:hover .post-menu-btn {
  opacity: 1;
}

.post-menu-list {
  min-width: 200px;
}

.post-deleted-notice {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 0;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  background: rgba(var(--v-theme-on-surface), 0.05);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 12px;
}

.post-body {
  margin-bottom: 8px;
}

.post-text {
  font-size: 15px;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
  word-break: break-word;
  white-space: pre-wrap;
}

.post-text :deep(.post-mention) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.post-text :deep(.post-mention:hover) {
  text-decoration: underline;
}

.post-text :deep(.post-link) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.post-text :deep(.post-link:hover) {
  text-decoration: underline;
}

/* Media Grid */
.post-media {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 12px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.post-media--1 {
  display: block;
}

.post-media--1 .post-media-item {
  width: 100%;
}

.post-media--2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.post-media--2 .post-media-item {
  aspect-ratio: 1;
}

.post-media--3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.post-media--3 .post-media-item:first-child {
  grid-row: span 2;
  aspect-ratio: auto;
}

.post-media--3 .post-media-item:not(:first-child) {
  aspect-ratio: 1;
}

.post-media--4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.post-media--4 .post-media-item {
  aspect-ratio: 1;
}

.post-media-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.post-media-img {
  width: 100%;
  height: 100%;
  transition: transform 0.2s ease;
}

.post-media-item:hover .post-media-img {
  transform: scale(1.02);
}

.post-media-more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  font-weight: 700;
}

/* Actions */
.post-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 425px;
  margin-top: 4px;
}

.post-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  margin: -8px;
  border: none;
  background: none;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 13px;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
}

.post-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.post-action--reply:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.post-action--retweet:hover {
  color: #00ba7c;
  background: rgba(0, 186, 124, 0.1);
}

.post-action--retweet.post-action--active {
  color: #00ba7c;
}

.post-action--quote:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.post-action--like:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.1);
}

.post-action--like.post-action--active {
  color: #f91880;
}

.post-action--bookmark:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.post-action--bookmark.post-action--active {
  color: rgb(var(--v-theme-primary));
}

.post-action--share:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.post-action-count {
  min-width: 1ch;
}

/* Dialog */
.post-dialog-card {
  border-radius: 16px !important;
}

.post-dialog-header {
  display: flex;
  align-items: center;
  padding: 8px 16px !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.post-dialog-content {
  padding: 0 !important;
}

.post-confirm-dialog {
  border-radius: 16px !important;
}

/* Reply Preview */
.reply-preview {
  display: flex;
  padding: 16px;
  padding-bottom: 0;
}

.reply-preview-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
}

.reply-preview-line {
  flex: 1;
  width: 2px;
  min-height: 16px;
  margin-top: 8px;
  background: rgba(var(--v-theme-on-surface), 0.15);
}

.reply-preview-content {
  flex: 1;
  min-width: 0;
}

.reply-preview-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.reply-preview-text {
  font-size: 15px;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reply-preview-to {
  margin-top: 12px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.6);
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
