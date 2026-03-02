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

      <!-- 主帖（使用 PostCard featured 模式） -->
      <div :class="{ 'thread-root-wrapper': true, 'has-ancestors': ancestors.length > 0 }">
        <PostCard
          :post="post"
          :includes="mergedIncludes"
          :enable-translation="true"
          featured
          @focus-reply="focusReply"
          @deleted="handlePostDeleted"
        />
      </div>

      <!-- 回复输入框 -->
      <div class="thread-reply-composer">
        <PostComposer
          ref="replyComposerRef"
          :submit="submitReply"
          :placeholder="`回复 @${post.author?.username ?? 'unknown'}`"
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
        </div>
      </main>
      <HomeRightSidebar class="posts-right-sidebar" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { localuser } from '@/services/localAccount';
import PostsService from '@/services/postsService';
import { showSnackbar } from '@/composables/useNotifications';
import PostComposer from '@/components/posts/PostComposer.vue';
import PostCard from '@/components/posts/PostCard.vue';
import PostList from '@/components/posts/PostList.vue';
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

const replyComposerRef = ref(null);

// Auth
const isLogin = computed(() => localuser.isLogin.value);

// 当前帖子的回复（featured + regular）
const replies = computed(() => {
  const parentId = post.value?.id;
  if (!parentId) return [];
  const group = repliesByParent.value[parentId] || repliesByParent.value[String(parentId)];
  if (!group) return [];
  // 精选回复在前，普通回复在后
  return [...(group.featured || []), ...(group.regular || [])];
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

// Navigation
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/app/posts');
  }
};

// Reply
const focusReply = () => {
  if (!isLogin.value) {
    showSnackbar('请先登录后再回复', 'warning');
    return;
  }
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

// Handle post deleted from PostCard
const handlePostDeleted = () => {
  router.push('/app/posts');
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

/* Ancestors - 使用 PostCard 渲染 */
.thread-ancestors {
  /* PostCard 自带样式 */
  min-height: 0;
}

.thread-ancestors :deep(.post-card) {
  border-bottom: none;
}

/* 主帖与祖先链的连接线 */
.thread-root-wrapper.has-ancestors {
  position: relative;
}

.thread-root-wrapper.has-ancestors::before {
  content: '';
  position: absolute;
  left: 39px;
  top: 0;
  width: 2px;
  height: 16px;
  background: rgba(var(--v-theme-on-surface), 0.2);
}

/* Reply Composer */
.thread-reply-composer {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

/* Replies */
.thread-replies {
  /* PostList 自带样式 */
  min-height: 0;
}
</style>
