<template>
  <div>
    <PageAnalytics :target-id="user.id" target-type="user"/>

    <v-container>
      <!-- 用户信息区域 -->
      <v-responsive class="mt-8">
        <v-row class="d-flex align-center">
          <v-col>
            <p class="font-weight-medium text-primary">
              {{ user.type === "administrator" ? "ZeroCat 管理员" : "开发者" }}
            </p>
            <p class="font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username">
              {{ user.display_name }}
              <v-avatar class="ma-2" size="52">
                <v-img :src="localuser.getUserAvatar(user.avatar)"/>
              </v-avatar>
            </p>
            <p class="mt-2 text-body-1 text-medium-emphasis user-motto">
              {{ user.motto }}
            </p>
            <p class="mt-2 text-medium-emphasis">
              <v-chip class="mr-2">
                <v-icon icon="mdi-account-circle" start></v-icon>
                #{{ user.id }}
              </v-chip>
              <v-chip class="mr-2">
                <v-icon icon="mdi-clock" start></v-icon>
                <TimeAgo :date="user.regTime"></TimeAgo>
                注册
              </v-chip>
              <v-chip v-if="user.location" class="mr-2">
                <v-icon icon="mdi-map-marker" start></v-icon>
                {{ user.location }}
              </v-chip>
              <v-chip v-if="user.birthday" class="mr-2">
                <v-icon icon="mdi-cake-variant" start></v-icon>
                {{ new Date(user.birthday).toLocaleDateString() }}
              </v-chip>
              <v-chip v-if="user.url" append-icon="mdi-open-in-new" class="mr-2">
                <v-icon icon="mdi-web" start></v-icon>
                <a :href="user.url" class="text-decoration-none" target="_blank">{{ user.url }}</a>
              </v-chip>
              <v-chip v-if="!user.isActive" color="error">
                <v-icon icon="mdi-alert-circle" start></v-icon>
                异常
              </v-chip>
            </p>
            <user-relation-controls
              :display-name="user.display_name"
              :user-id="user.id"
              :username="username"
            />
            <follow-stats :user-id="user.id" :username="username" class="mt-3"/>
          </v-col>
        </v-row>
      </v-responsive>

      <!-- 主标签页导航 -->
      <v-tabs v-model="tab" class="mt-4" color="primary">
        <v-tab value="home">
          <v-icon start>mdi-home</v-icon>
          首页
        </v-tab>
        <v-tab value="posts">
          <v-icon start>mdi-post</v-icon>
          帖子
        </v-tab>
        <v-tab value="timeline">
          <v-icon start>mdi-timeline-clock</v-icon>
          动态
        </v-tab>
        <v-tab value="followers">
          <v-icon start>mdi-account-multiple</v-icon>
          关注者
        </v-tab>
        <v-tab value="following">
          <v-icon start>mdi-account-heart</v-icon>
          正在关注
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <!-- 首页 -->
        <v-tabs-window-item value="home">
          <v-card subtitle="README.md" title="关于我" class="mt-4">
            <v-card-text class="markdown-body">
              <Markdown>{{ user.bio }}</Markdown>
            </v-card-text>
          </v-card>
          <Projects :url="url" :showAuthor="false"></Projects>
          <v-row>
            <v-col
              v-for="item in lists"
              :key="item.id"
              cols="12"
              lg="3"
              md="4"
              sm="6"
              xl="2"
              xs="12"
              xxl="2"
            >
              <v-card rounded="lg">
                <v-card
                  :subtitle="item.description"
                  :title="item.title"
                  :to="'/app/projectlist/' + item.id"
                  color="primary"
                  rounded="lg"
                  variant="tonal"
                >
                </v-card>
              </v-card>
            </v-col>
          </v-row>
          <user-project-lists :project-lists="lists" :user-id="user.id" class="mt-4"/>
          <Comment :url="'user-' + user.id" name="用户" class="mt-4"></Comment>
        </v-tabs-window-item>

        <!-- 帖子 -->
        <v-tabs-window-item value="posts">
          <div class="posts-section">
            <!-- 帖子子标签页 -->
            <div class="posts-tabs">
              <button
                v-for="postTab in availablePostTabs"
                :key="postTab.value"
                class="posts-tab"
                :class="{ 'posts-tab--active': activePostTab === postTab.value }"
                @click="switchPostTab(postTab.value)"
              >
                {{ postTab.label }}
              </button>
            </div>

            <!-- 帖子列表 -->
            <PostList
              :items="posts"
              :includes="postsIncludes"
              :loading="postsLoading"
              :loading-more="postsLoadingMore"
              :has-more="postsHasMore"
              :empty-title="postsEmptyTitle"
              :empty-text="postsEmptyText"
              @deleted="removePostFromList"
              @load-more="loadMorePosts"
            />
          </div>
        </v-tabs-window-item>

        <!-- 动态 -->
        <v-tabs-window-item value="timeline">
          <v-card class="mt-4" variant="flat">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2" color="primary" icon="mdi-timeline-clock"/>
              {{ user.display_name }} 的动态
            </v-card-title>
            <v-card-text>
              <Timeline
                :is-loading-more="isLoadingMore"
                :timeline="timeline"
                @load-more="loadMoreEvents"
              />
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <!-- 关注者 -->
        <v-tabs-window-item value="followers">
          <v-container>
            <h2 class="text-h5 mb-4">关注者</h2>
            <user-followers :show-all="false" :user-id="user.id"/>
          </v-container>
        </v-tabs-window-item>

        <!-- 正在关注 -->
        <v-tabs-window-item value="following">
          <v-container>
            <h2 class="text-h5 mb-4">正在关注</h2>
            <user-following :show-all="false" :user-id="user.id"/>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>
  </div>
</template>

<script>
import Comment from "../../components/Comment.vue";
import { useHead } from "@unhead/vue";
import { ref, computed, watch } from "vue";
import { getUserByUsername } from "../../stores/user.js";
import request from "../../axios/axios.js";
import Markdown from "@/components/Markdown.vue";
import "github-markdown-css";
import TimeAgo from "@/components/TimeAgo.vue";
import UserProjectLists from "@/components/projectlist/UserProjectLists.vue";
import UserRelationControls from "@/components/user/UserRelationControls.vue";
import FollowStats from "@/components/user/FollowStats.vue";
import { localuser } from "@/services/localAccount";
import UserFollowers from "@/components/user/UserFollowers.vue";
import UserFollowing from "@/components/user/UserFollowing.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import PageAnalytics from "@/components/analytics/PageAnalytics.vue";
import PostList from "@/components/posts/PostList.vue";
import PostsService from "@/services/postsService";
import { showSnackbar } from "@/composables/useNotifications";
import Projects from "@/components/project/Projects.vue";

export default {
  components: {
    Comment,
    Markdown,
    TimeAgo,
    UserProjectLists,
    UserRelationControls,
    FollowStats,
    UserFollowers,
    UserFollowing,
    Timeline,
    PageAnalytics,
    PostList,
    Projects,
  },
  data() {
    return {
      username: this.$route.params.username,
      user: {},
      lists: [],
      url: "",
      tab: this.$route.query.tab || "home",
      timeline: {
        events: [],
        pagination: {
          current: 1,
          size: 20,
          total: 0,
        },
      },
      isLoadingMore: false,
      localuser,
      // Posts state
      activePostTab: "originals",
      posts: [],
      postsIncludes: { posts: {} },
      postsLoading: false,
      postsLoadingMore: false,
      postsCursor: null,
      postsHasMore: true,
    };
  },
  computed: {
    isCurrentUser() {
      return localuser.user.value?.id && Number(localuser.user.value.id) === Number(this.user.id);
    },
    availablePostTabs() {
      const tabs = [
        { value: "originals", label: "帖子" },
        { value: "replies", label: "回复" },
        { value: "media", label: "媒体" },
      ];
      // 喜欢和收藏仅自己可见
      if (this.isCurrentUser) {
        tabs.push({ value: "likes", label: "喜欢" });
        tabs.push({ value: "bookmarks", label: "收藏" });
      }
      return tabs;
    },
    postsEmptyTitle() {
      const titles = {
        originals: "暂无帖子",
        replies: "暂无回复",
        media: "暂无媒体",
        likes: "暂无喜欢",
        bookmarks: "暂无收藏",
      };
      return titles[this.activePostTab] || "暂无内容";
    },
    postsEmptyText() {
      const name = this.user.display_name || "该用户";
      const texts = {
        originals: `${name}还没有发布任何帖子。`,
        replies: `${name}还没有回复任何帖子。`,
        media: `${name}还没有发布任何包含媒体的帖子。`,
        likes: `${name}还没有喜欢任何帖子。`,
        bookmarks: `${name}还没有收藏任何帖子。`,
      };
      return texts[this.activePostTab] || "这里还没有任何内容。";
    },
    hasMoreEvents() {
      return this.timeline.events.length < this.timeline.pagination.total;
    },
  },
  watch: {
    "$route.query.tab"(newTab) {
      this.tab = newTab || "home";
    },
    "$route.query.postTab"(newPostTab) {
      if (newPostTab && this.tab === "posts") {
        this.switchPostTab(newPostTab);
      }
    },
    tab(newTab) {
      if (newTab === "posts" && this.posts.length === 0) {
        this.loadPosts(true);
      }
    },
  },
  setup() {
    const pageTitle = ref("用户主页");
    useHead({
      title: pageTitle,
    });
    return {
      pageTitle,
    };
  },
  async created() {
    await this.fetchUser();
    await this.getProjectList();
    await this.fetchTimeline();
    this.tab = this.$route.query.tab || "home";

    // 如果初始 tab 是 posts，加载帖子
    if (this.tab === "posts") {
      const postTab = this.$route.query.postTab;
      if (postTab) {
        this.activePostTab = postTab;
      }
      await this.loadPosts(true);
    }
  },
  methods: {
    async fetchUser() {
      this.user = await getUserByUsername(this.username);
      this.pageTitle = "" + this.user.display_name;
      this.url = `/searchapi?search_userid=${this.user.id}&search_orderby=view_up&search_state=public`;
    },
    async getProjectList() {
      try {
        const response = await request({
          url: `/projectlist/userid/${this.user.id}/public`,
          method: "get",
        });
        if (response.data && response.data.data) {
          this.lists = response.data.data;
        }
      } catch (error) {
        console.error("获取用户项目列表失败:", error);
        this.lists = [];
      }
    },
    async fetchTimeline(page = 1) {
      try {
        const response = await request.get(`/timeline/user/${this.user.id}`, {
          params: {
            page,
            limit: this.timeline.pagination.size,
          },
        });

        if (response.data.status === "success") {
          if (page === 1) {
            this.timeline = response.data.data;
          } else {
            this.timeline.events = [
              ...this.timeline.events,
              ...response.data.data.events,
            ];
            this.timeline.pagination = response.data.data.pagination;
          }
        }
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
      }
    },
    async loadMoreEvents() {
      if (this.isLoadingMore) return;

      try {
        this.isLoadingMore = true;
        await this.fetchTimeline(this.timeline.pagination.current + 1);
      } finally {
        this.isLoadingMore = false;
      }
    },
    // Posts methods
    switchPostTab(tabValue) {
      if (this.activePostTab === tabValue) return;
      this.activePostTab = tabValue;
      this.loadPosts(true);

      // Update URL without navigation
      const query = { ...this.$route.query, postTab: tabValue };
      this.$router.replace({ query });
    },
    async loadPosts(isInitial = false) {
      if (!this.user.id) return;

      if (isInitial) {
        this.postsLoading = true;
        this.postsCursor = null;
        this.posts = [];
        this.postsIncludes = { posts: {} };
      } else {
        this.postsLoadingMore = true;
      }

      try {
        let res;
        const params = {
          cursor: isInitial ? undefined : this.postsCursor,
          limit: 20,
        };

        switch (this.activePostTab) {
          case "originals":
            res = await PostsService.getUserOriginals(this.user.id, params);
            break;
          case "replies":
            res = await PostsService.getUserReplies(this.user.id, params);
            // getUserReplies 返回 { items, includes, ... } 格式
            if (res.items) {
              res = {
                posts: res.items.map(item => item.post || item),
                includes: res.includes,
                nextCursor: res.nextCursor,
                hasMore: res.hasMore,
              };
            }
            break;
          case "media":
            res = await PostsService.getUserMedia(this.user.id, params);
            break;
          case "likes":
            res = await PostsService.getUserLikes(this.user.id, params);
            break;
          case "bookmarks":
            res = await PostsService.getUserBookmarks(this.user.id, params);
            break;
          default:
            res = await PostsService.getUserOriginals(this.user.id, params);
        }

        if (isInitial) {
          this.posts = res.posts || [];
          this.postsIncludes = res.includes || { posts: {} };
        } else {
          this.posts.push(...(res.posts || []));
          Object.assign(this.postsIncludes.posts, res.includes?.posts || {});
        }

        this.postsCursor = res.nextCursor;
        this.postsHasMore = res.hasMore;
      } catch (e) {
        showSnackbar(e?.message || "加载帖子失败", "error");
      } finally {
        this.postsLoading = false;
        this.postsLoadingMore = false;
      }
    },
    loadMorePosts() {
      if (!this.postsHasMore || this.postsLoadingMore || this.postsLoading) return;
      this.loadPosts(false);
    },
    removePostFromList(postId) {
      this.posts = this.posts.filter((p) => (p?.id ?? p?.postId) !== postId);
    },
  },
};
</script>

<style scoped>
.username {
  color: #fff;
  font-weight: bold;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.911),
    rgba(255, 255, 255, 0.911)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.text-decoration-none {
  color: inherit;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }
}

.v-card {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }
}

.v-card[href] {
  cursor: pointer;
}

.user-motto {
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}

.v-chip {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      opacity: 0.8;
    }
  }
}

/* Posts section */
.posts-section {
  margin-top: 16px;
}

.posts-tabs {
  display: flex;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  margin-bottom: 0;
}

.posts-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.6);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.posts-tab:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.posts-tab--active {
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}

.posts-tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 3px;
  background: rgb(var(--v-theme-primary));
  border-radius: 2px;
}
</style>
