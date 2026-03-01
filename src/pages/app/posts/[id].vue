<template>
  <div class="posts-layout">
    <div class="posts-container">
      <UnifiedSidebar
        mode="twitter"
        class="posts-left-sidebar"
      />
      <main class="posts-main">
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
    <template v-else-if="post">
      <!-- 祖先链（使用 PostCard 渲染，带连接线） -->
      <div v-if="ancestors.length > 0" class="thread-ancestors">
        <PostCard
          v-for="(ancestor, index) in ancestors"
          :key="ancestor.id"
          :post="ancestor"
          :includes="mergedIncludes"
          :show-thread-line="true"
          hide-reply-indicator
          class="ancestor-card"
        />
      </div>

      <!-- 主帖（大号展示） -->
      <article class="thread-root" :class="{ 'has-ancestors': ancestors.length > 0 }">
        <div class="root-header">
          <v-avatar
            size="48"
            class="root-avatar"
            @click="goToUser(post.author?.username)"
          >
            <v-img :src="getAuthorAvatar(post)" :alt="getAuthorUsername(post)" />
          </v-avatar>
          <router-link
            :to="`/${getAuthorUsername(post)}`"
            class="root-author-link"
            @click.stop
          >
            <div class="root-display-name">{{ getAuthorDisplayName(post) }}</div>
            <div class="root-username">@{{ getAuthorUsername(post) }}</div>
          </router-link>
          <v-spacer />
          <v-menu v-if="canDelete(post)" location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn v-bind="menuProps" icon size="small" variant="text">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item @click="openFederationDialog">
                <template #prepend>
                  <v-icon size="18">mdi-earth</v-icon>
                </template>
                <v-list-item-title>联邦社交数据</v-list-item-title>
              </v-list-item>

              <v-list-item class="text-error" @click="deletePost(post)">
                <template #prepend>
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </template>
                <v-list-item-title>删除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- 内容 -->
        <div ref="rootContentRef" class="root-content" v-html="formatContent(post.content)" />

        <!-- 媒体 -->
        <div v-if="postMedia.length" class="root-media" :class="`root-media--${Math.min(postMedia.length, 4)}`">
          <div
            v-for="(media, idx) in postMedia.slice(0, 4)"
            :key="media.id || idx"
            v-ripple
            class="root-media-item"
            @click="openMediaViewer(idx)"
          >
            <v-img
              :src="getMediaUrl(media)"
              :cover="postMedia.length > 1"
              :max-height="postMedia.length === 1 ? 600 : undefined"
              class="root-media-img"
            />
          </div>
        </div>

        <!-- 嵌入内容 -->
        <PostEmbed v-if="post.embed" :embed="post.embed" class="mt-4" />

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
          <time :datetime="post.created_at">
            {{ formatFullTime(post.created_at) }}
          </time>
        </div>

        <!-- 统计数据 -->
        <div v-if="hasStats" class="root-stats">
          <div v-if="post.stats?.retweets > 0" class="root-stat">
            <span class="root-stat-value">{{ formatCount(post.stats.retweets) }}</span>
            <span class="root-stat-label">转推</span>
          </div>
          <div v-if="post.stats?.likes > 0" class="root-stat">
            <span class="root-stat-value">{{ formatCount(post.stats.likes) }}</span>
            <span class="root-stat-label">喜欢</span>
          </div>
          <div v-if="post.stats?.bookmarks > 0" class="root-stat">
            <span class="root-stat-value">{{ formatCount(post.stats.bookmarks) }}</span>
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

        <!-- Federation Data Dialog -->
        <v-dialog v-model="federationDialog" max-width="500px">
          <v-card class="post-dialog-card">
              <div class="post-dialog-header">
                  <span class="text-h6">联邦社交数据</span>
                  <v-spacer></v-spacer>
                  <v-btn icon="mdi-close" variant="text" size="small" @click="federationDialog = false"></v-btn>
              </div>
              <v-card-text class="pa-4">
                  <v-list density="compact" v-if="post && post.platform_refs">
                      <v-list-item v-if="post.platform_refs.twitter">
                          <template v-slot:prepend><v-icon color="blue">mdi-twitter</v-icon></template>
                          <v-list-item-title>Twitter</v-list-item-title>
                          <v-list-item-subtitle>
                              <a v-if="post.platform_refs.twitter.url" :href="post.platform_refs.twitter.url" target="_blank">
                                  {{ post.platform_refs.twitter.id || 'Link' }}
                              </a>
                              <span v-else>{{ post.platform_refs.twitter.id }}</span>
                              <span v-if="post.platform_refs.twitter.kind" class="ml-2 text-caption">({{ post.platform_refs.twitter.kind }})</span>
                          </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item v-if="post.platform_refs.bluesky">
                          <template v-slot:prepend><v-icon color="light-blue">mdi-weather-cloudy</v-icon></template>
                          <v-list-item-title>Bluesky</v-list-item-title>
                          <v-list-item-subtitle>
                              <a v-if="getBskyUrl(post.platform_refs.bluesky)" :href="getBskyUrl(post.platform_refs.bluesky)" target="_blank" rel="noopener">
                                  在 Bluesky 上查看
                              </a>
                              <div v-if="post.platform_refs.bluesky.uri" class="text-caption text-truncate" style="max-width: 300px;">URI: {{ post.platform_refs.bluesky.uri }}</div>
                              <div v-if="post.platform_refs.bluesky.cid" class="text-caption text-truncate" style="max-width: 300px;">CID: {{ post.platform_refs.bluesky.cid }}</div>
                          </v-list-item-subtitle>
                      </v-list-item>

                      <v-list-item v-if="post.platform_refs.activitypub">
                          <template v-slot:prepend><v-icon color="purple">mdi-earth</v-icon></template>
                          <v-list-item-title>ActivityPub</v-list-item-title>
                          <v-list-item-subtitle>
                              <a v-if="post.platform_refs.activitypub.url" :href="post.platform_refs.activitypub.url" target="_blank">
                                  {{ post.platform_refs.activitypub.id || 'View Note' }}
                              </a>
                              <span v-else>{{ post.platform_refs.activitypub.id }}</span>
                          </v-list-item-subtitle>
                      </v-list-item>
                  </v-list>
                  <div v-else class="text-center pa-4 text-medium-emphasis">
                      无同步数据
                  </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions v-if="canDelete(post)">
                  <v-btn
                      variant="text"
                      color="primary"
                      :loading="actionLoading"
                      prepend-icon="mdi-share-all-outline"
                      @click="manualSyncPost"
                  >
                      全平台同步
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      variant="text"
                      color="secondary"
                      :loading="actionLoading"
                      prepend-icon="mdi-earth"
                      @click="pushToFederation"
                  >
                      推送到联邦
                  </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
      </article>

      <!-- 回复输入框 -->
      <div class="thread-reply-composer">
        <PostComposer
          ref="replyComposerRef"
          :submit="submitReply"
          :placeholder="`回复 @${getAuthorUsername(post)}`"
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
          :show-arrows="postMedia.length > 1"
          height="100%"
          @click.stop
        >
          <v-carousel-item
            v-for="(media, idx) in postMedia"
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
      </main>
      <HomeRightSidebar class="posts-right-sidebar" />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { localuser } from '@/services/localAccount';
import { getS3staticurl } from '@/services/projectService';
import PostsService from '@/services/postsService';
import { showSnackbar } from '@/composables/useNotifications';
import { useDeleteConfirm } from '@/composables/useDeleteConfirm';
import PostComposer from '@/components/posts/PostComposer.vue';
import PostCard from '@/components/posts/PostCard.vue';
import PostList from '@/components/posts/PostList.vue';
import PostEmbed from '@/components/posts/PostEmbed.vue';
import QuotedPost from '@/components/posts/QuotedPost.vue';
import federationService from '@/services/federationService';
import UnifiedSidebar from '@/components/sidebar/UnifiedSidebar.vue';
import HomeRightSidebar from '@/components/home/HomeRightSidebar.vue';

const route = useRoute();
const router = useRouter();

const postId = computed(() => route.params.id);

// State
const post = ref(null);
const ancestors = ref([]); // 祖先链（从根帖到直接父帖）
const repliesByParent = ref({}); // 按父帖ID分组的回复
const includes = ref({ posts: {} });
const loading = ref(false);
const loadingMore = ref(false);
const notFound = ref(false);
const cursor = ref(null);
const hasMoreReplies = ref(true);
const mediaViewerOpen = ref(false);
const mediaViewerIndex = ref(0);
const rootContentRef = ref(null);

const replyComposerRef = ref(null);

const federationDialog = ref(false);
const actionLoading = ref(false);

// Delete confirmation
const { showDeleteConfirm } = useDeleteConfirm();

// Auth
const isLogin = computed(() => localuser.isLogin.value);
const currentUserId = computed(() => localuser.user.value?.id);

// 当前帖子的回复（featured + regular）
const replies = computed(() => {
  const parentId = post.value?.id;
  if (!parentId) return [];
  const group = repliesByParent.value[parentId] || repliesByParent.value[String(parentId)];
  if (!group) return [];
  // 精选回复在前，普通回复在后
  return [...(group.featured || []), ...(group.regular || [])];
});

// Post computed
const postMedia = computed(() => {
  const media = post.value?.media || post.value?.mediaAssets || [];
  return Array.isArray(media) ? media : [];
});

const quotedPost = computed(() => {
  const quotedId = post.value?.quote_of_id;
  if (!quotedId) return null;
  const posts = includes.value?.posts || {};
  let found = posts[quotedId] || posts[String(quotedId)];
  if (found) return found;
  return replies.value.find(p => p.id === quotedId || p.id === Number(quotedId)) || null;
});

// 合并includes，将所有帖子加入供PostList使用
const mergedIncludes = computed(() => {
  const result = { posts: { ...includes.value?.posts } };
  // 添加当前帖子
  if (post.value?.id) {
    result.posts[post.value.id] = post.value;
    result.posts[String(post.value.id)] = post.value;
  }
  // 添加所有祖先
  for (const ancestor of ancestors.value) {
    if (ancestor?.id) {
      result.posts[ancestor.id] = ancestor;
      result.posts[String(ancestor.id)] = ancestor;
    }
  }
  // 添加所有回复
  for (const [, group] of Object.entries(repliesByParent.value)) {
    for (const reply of [...(group.featured || []), ...(group.regular || [])]) {
      if (reply?.id) {
        result.posts[reply.id] = reply;
        result.posts[String(reply.id)] = reply;
      }
    }
  }
  return result;
});

const hasStats = computed(() => {
  const stats = post.value?.stats;
  return stats && (stats.retweets > 0 || stats.likes > 0 || stats.bookmarks > 0);
});

const viewerContext = computed(() => post.value?.viewer_context || {});
const isLiked = computed(() => viewerContext.value.liked ?? post.value?.liked ?? false);
const isRetweeted = computed(() => viewerContext.value.retweeted ?? post.value?.retweeted ?? false);
const isBookmarked = computed(() => viewerContext.value.bookmarked ?? post.value?.bookmarked ?? false);

// Load thread
const loadThread = async () => {
  if (!postId.value) return;

  loading.value = true;
  notFound.value = false;

  try {
    const res = await PostsService.getThread(postId.value, { limit: 50 });

    if (res.post) {
      post.value = res.post;
      ancestors.value = res.ancestors || [];
      repliesByParent.value = res.repliesByParent || {};
      includes.value = res.includes;
      cursor.value = res.nextCursor;
      hasMoreReplies.value = res.hasMore;
    } else {
      // 兼容：尝试单独获取帖子
      const singleRes = await PostsService.getPost(postId.value);
      if (singleRes.post) {
        post.value = singleRes.post;
        ancestors.value = singleRes.ancestors || [];
        includes.value = singleRes.includes;
        if (singleRes.replies) {
          repliesByParent.value = {
            [singleRes.post.id]: singleRes.replies
          };
        } else {
          repliesByParent.value = {};
        }
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

    // 合并新的 repliesByParent
    for (const [parentId, group] of Object.entries(res.repliesByParent || {})) {
      if (!repliesByParent.value[parentId]) {
        repliesByParent.value[parentId] = { featured: [], regular: [] };
      }
      repliesByParent.value[parentId].featured.push(...(group.featured || []));
      repliesByParent.value[parentId].regular.push(...(group.regular || []));
    }

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
const getAuthorAvatar = (p) => {
  const avatar = p?.author?.avatar;
  if (!avatar) return '/default-avatar.png';
  return localuser.getUserAvatar(avatar);
};

const getAuthorUsername = (p) => {
  return p?.author?.username ?? 'unknown';
};

const getAuthorDisplayName = (p) => {
  return p?.author?.display_name ?? p?.author?.displayName ?? getAuthorUsername(p);
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
  let text = content;

  // 提取 ```blocks...``` 代码块，用占位符替换
  const scratchBlocksSegments = [];
  text = text.replace(/```blocks\n([\s\S]*?)```/g, (_, code) => {
    const index = scratchBlocksSegments.length;
    scratchBlocksSegments.push(code);
    return `\x00SCRATCHBLOCK_${index}\x00`;
  });

  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  text = text.replace(/@(\w+)/g, '<a href="/user/$1" class="thread-mention">@$1</a>');
  text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="thread-link" target="_blank" rel="noopener">$1</a>');
  text = text.replace(/\n/g, '<br>');

  // 还原 scratchblocks 代码块
  text = text.replace(/\x00SCRATCHBLOCK_(\d+)\x00/g, (_, idx) => {
    const code = scratchBlocksSegments[Number(idx)]
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="blocks">${code}</pre>`;
  });

  return text;
};

// Scratchblocks: 懒加载并渲染
let scratchblocksModule = null;
async function renderScratchBlocks() {
  if (!rootContentRef.value) return;
  const preBlocks = rootContentRef.value.querySelectorAll('pre.blocks');
  if (!preBlocks.length) return;

  if (!scratchblocksModule) {
    const [sb, zhCn] = await Promise.all([
      import('scratchblocks').then((m) => m.default),
      import('scratchblocks/locales/zh-cn.json'),
    ]);
    sb.loadLanguages({ 'zh-cn': zhCn.default || zhCn });
    scratchblocksModule = sb;
  }

  const sb = scratchblocksModule;
  const options = { style: 'scratch3', inline: false, languages: ['en', 'zh-cn'], scale: 1 };

  preBlocks.forEach((el) => {
    if (el.querySelector('.scratchblocks')) return;
    const code = sb.read(el, options);
    const doc = sb.parse(code, options);
    const svg = sb.render(doc, options);
    sb.replace(el, svg, doc, options);
  });
}

watch(
  () => post.value?.content,
  (content) => {
    if (content && /```blocks\n[\s\S]*?```/.test(content)) {
      nextTick(() => renderScratchBlocks());
    }
  },
  { immediate: true },
);

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

const goToUser = (username) => {
  if (username) router.push(`/${username}`);
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
      if (post.value.viewer_context) post.value.viewer_context.liked = false;
      else post.value.liked = false;
      if (post.value.stats) post.value.stats.likes--;
    } else {
      await PostsService.like(postId.value);
      if (post.value.viewer_context) post.value.viewer_context.liked = true;
      else post.value.liked = true;
      if (post.value.stats) post.value.stats.likes++;
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
      if (post.value.viewer_context) post.value.viewer_context.retweeted = false;
      else post.value.retweeted = false;
      if (post.value.stats) post.value.stats.retweets--;
    } else {
      await PostsService.retweet(postId.value);
      if (post.value.viewer_context) post.value.viewer_context.retweeted = true;
      else post.value.retweeted = true;
      if (post.value.stats) post.value.stats.retweets++;
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
      if (post.value.viewer_context) post.value.viewer_context.bookmarked = false;
      else post.value.bookmarked = false;
      showSnackbar('已取消收藏', 'success');
    } else {
      await PostsService.bookmark(postId.value);
      if (post.value.viewer_context) post.value.viewer_context.bookmarked = true;
      else post.value.bookmarked = true;
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
        title: `${getAuthorDisplayName(post.value)}的帖文`,
        text: post.value?.content?.slice(0, 100),
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

const getBskyUrl = (bluesky) => {
  if (!bluesky) return null;
  if (bluesky.url) return bluesky.url;
  // Parse AT URI: at://did:plc:xxx/app.bsky.feed.post/rkey
  const uri = bluesky.uri;
  if (!uri) return null;
  const match = uri.match(/^at:\/\/([^/]+)\/[^/]+\/([^/]+)$/);
  if (match) {
    return `https://bsky.app/profile/${match[1]}/post/${match[2]}`;
  }
  return null;
};

const openFederationDialog = () => {
  if (!canDelete(post.value)) return;
  federationDialog.value = true;
};

const manualSyncPost = async () => {
  if (!canDelete(post.value)) return;
  if (!confirm("确定要重新同步此帖子到所有关联的社交平台吗？")) return;

  actionLoading.value = true;
  try {
    const res = await federationService.userResyncPost(post.value.id);
    if (res.data?.status === "success" || res.data?.status === "ok") {
      showSnackbar("同步任务已提交", "success");
    } else {
      showSnackbar(res.data?.message || "同步失败", "error");
    }
  } catch (e) {
    showSnackbar(e?.message || "同步失败", "error");
  } finally {
    actionLoading.value = false;
  }
};

const pushToFederation = async () => {
  if (!canDelete(post.value)) return;
  if (!confirm("确定要推送到 ActivityPub 联邦网络吗？")) return;

  actionLoading.value = true;
  try {
    const res = await federationService.userPushPostToFederation(post.value.id);
    if (res.data?.status === "success" || res.data?.status === "ok") {
        showSnackbar("推送任务已提交", "success");
    } else {
        showSnackbar(res.data?.message || "推送失败", "error");
    }
  } catch (e) {
    showSnackbar(e?.message || "推送失败", "error");
  } finally {
    actionLoading.value = false;
  }
};

const deletePost = async (p) => {
  showDeleteConfirm(
    async () => {
      await PostsService.remove(p.id);
      showSnackbar('帖文已删除', 'success');
      router.push('/app/posts');
    },
    {
      title: '删除帖文？',
      message: '此操作无法撤消。该帖文将从你的个人资料、任何关注你的用户的时间线以及搜索结果中删除。',
      confirmText: '删除',
      cancelText: '取消'
    }
  );
};

// Reply
const focusReply = () => {
  if (!requireLogin('回复')) return;
  replyComposerRef.value?.focus();
};

const submitReply = async ({ content, mediaIds, embed }) => {
  const res = await PostsService.reply(postId.value, { content, mediaIds, embed });
  if (res.post) {
    const parentId = post.value.id;
    if (!repliesByParent.value[parentId]) {
      repliesByParent.value[parentId] = { featured: [], regular: [] };
    }
    repliesByParent.value[parentId].regular.unshift(res.post);
    if (post.value.stats) post.value.stats.replies++;
  }
  if (res.includes?.posts) {
    Object.assign(includes.value.posts, res.includes.posts);
  }
  showSnackbar('回复已发布', 'success');
};

const removeReply = (replyId) => {
  const parentId = post.value?.id;
  if (parentId && repliesByParent.value[parentId]) {
    const group = repliesByParent.value[parentId];
    group.featured = group.featured.filter((r) => r.id !== replyId);
    group.regular = group.regular.filter((r) => r.id !== replyId);
  }
  if (post.value?.stats) post.value.stats.replies--;
};

const addReply = (data) => {
  const newPost = data?.post ?? data;
  const newIncludes = data?.includes?.posts;

  if (newPost) {
    const parentId = post.value?.id;
    if (parentId) {
      if (!repliesByParent.value[parentId]) {
        repliesByParent.value[parentId] = { featured: [], regular: [] };
      }
      repliesByParent.value[parentId].regular.unshift(newPost);
    }
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
  width: 100%;
  min-height: 100vh;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.posts-layout {
  min-height: 100vh;
}

.posts-container {
  display: flex;
  justify-content: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.posts-left-sidebar {
  width: 275px;
  flex-shrink: 0;
}

.posts-main {
  width: 100%;
  max-width: 600px;
  flex-shrink: 0;
}

.posts-right-sidebar {
  width: 350px;
  flex-shrink: 0;
}

/* Large screens (≥1280px) */
@media (min-width: 1280px) {
  .posts-left-sidebar { width: 275px; }
  .posts-main { max-width: 600px; }
  .posts-right-sidebar { width: 350px; }
}

/* Medium screens (1024-1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .posts-left-sidebar { width: 88px; }
  .posts-main { max-width: 600px; }
  .posts-right-sidebar { display: none; }
}

/* Tablet (768-1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .posts-container { padding: 0; }
  .posts-left-sidebar { display: none; }
  .posts-main { max-width: 100%; }
  .posts-right-sidebar { display: none; }
}

/* Mobile (<768px) */
@media (max-width: 767px) {
  .posts-container { padding: 0; }
  .posts-left-sidebar { display: none; }
  .posts-main { max-width: 100%; }
  .posts-right-sidebar { display: none; }
}

/* Header */
.thread-header {
  position: sticky;
  top: 64px;
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

/* Ancestors - 使用 PostCard 渲染 */
.thread-ancestors {
  /* 移除边框，让 PostCard 自带样式 */
}

.thread-ancestors :deep(.post-card) {
  border-bottom: none;
}

/* 主帖与祖先链的连接线 */
.thread-root.has-ancestors {
  position: relative;
}

.thread-root.has-ancestors::before {
  content: '';
  position: absolute;
  left: 39px;
  top: 0;
  width: 2px;
  height: 16px;
  background: rgba(var(--v-theme-on-surface), 0.2);
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

.root-author-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.root-author-link:hover .root-display-name {
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

.root-content :deep(.scratchblocks) {
  overflow-x: auto;
  margin: 8px 0;
}

.root-content :deep(pre.blocks) {
  white-space: pre;
  margin: 8px 0;
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
