<template>
  <div>
    <PageAnalytics :target-id="user.id" target-type="user" />

    <v-container fluid class="profile-container pa-md-6 pa-4">
      <v-row>
        <!-- Left Sidebar -->
        <v-col cols="12" md="4" lg="3">
          <div class="profile-sidebar">
            <UserProfileSidebar
              v-if="user.id"
              :user="user"
              :username="username"
            />
          </div>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="8" lg="9">
          <!-- Home Tab -->
          <template v-if="currentTab === 'home'">
            <!-- README -->
            <v-card v-if="user.bio" rounded="lg" border class="mb-4">
              <v-card-title class="d-flex align-center py-3">
                <v-icon start size="20">mdi-file-document-outline</v-icon>
                <span class="text-body-1 font-weight-bold">README.md</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="markdown-body">
                <Markdown>{{ user.bio }}</Markdown>
              </v-card-text>
            </v-card>

            <!-- Top Projects -->
            <UserTopProjects
              v-if="user.id"
              :user-id="user.id"
              :username="username"
            />

            <!-- Posts with Twitter-style tabs -->
            <UserRecentPosts
              v-if="user.id"
              :user-id="user.id"
              :username="username"
              :display-name="user.display_name"
            />
          </template>

          <!-- Projects Tab -->
          <template v-if="currentTab === 'projects'">
            <Projects :url="url" :showAuthor="false" />
          </template>

          <!-- Lists Tab -->
          <template v-if="currentTab === 'lists'">
            <user-project-lists :project-lists="lists" :user-id="user.id" />
          </template>

          <!-- Followers Tab -->
          <template v-if="currentTab === 'followers'">
            <v-card rounded="lg" border>
              <v-card-title class="py-3">
                <v-icon start>mdi-account-multiple</v-icon>
                <span class="font-weight-bold">关注者</span>
              </v-card-title>
              <v-divider />
              <user-followers :show-all="false" :user-id="user.id" :username="username" />
            </v-card>
          </template>

          <!-- Following Tab -->
          <template v-if="currentTab === 'following'">
            <v-card rounded="lg" border>
              <v-card-title class="py-3">
                <v-icon start>mdi-account-heart</v-icon>
                <span class="font-weight-bold">关注的人</span>
              </v-card-title>
              <v-divider />
              <user-following :show-all="false" :user-id="user.id" :username="username" />
            </v-card>
          </template>

          <!-- Timeline Tab -->
          <template v-if="currentTab === 'timeline'">
            <v-card rounded="lg" border>
              <v-card-title class="py-3">
                <v-icon start>mdi-timeline-clock</v-icon>
                <span class="font-weight-bold">{{ user.display_name }} 的动态</span>
              </v-card-title>
              <v-divider />
              <v-card-text>
                <Timeline
                  :is-loading-more="isLoadingMore"
                  :timeline="timeline"
                  @load-more="loadMoreEvents"
                />
              </v-card-text>
            </v-card>
          </template>

          <!-- Comment Tab -->
          <template v-if="currentTab === 'comment'">

                <Comment :url="'user-' + user.id" name="用户" />

          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Comment from "../../components/Comment.vue";
import { useSeo } from "@/composables/useSeo";
import { ref } from "vue";
import { getUserByUsername } from "../../stores/user.js";
import request from "../../axios/axios.js";
import Markdown from "@/components/Markdown.vue";
import "github-markdown-css";
import UserProjectLists from "@/components/projectlist/UserProjectLists.vue";
import UserFollowers from "@/components/user/UserFollowers.vue";
import UserFollowing from "@/components/user/UserFollowing.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import PageAnalytics from "@/components/analytics/PageAnalytics.vue";
import Projects from "@/components/project/Projects.vue";
import UserProfileSidebar from "@/components/user/UserProfileSidebar.vue";
import UserTopProjects from "@/components/user/UserTopProjects.vue";
import UserRecentPosts from "@/components/user/UserRecentPosts.vue";

export default {
  components: {
    Comment,
    Markdown,
    UserProjectLists,
    UserFollowers,
    UserFollowing,
    Timeline,
    PageAnalytics,
    Projects,
    UserProfileSidebar,
    UserTopProjects,
    UserRecentPosts,
  },
  data() {
    return {
      username: this.$route.params.username,
      user: {},
      lists: [],
      url: "",
      timeline: {
        events: [],
        pagination: {
          current: 1,
          size: 20,
          total: 0,
        },
      },
      isLoadingMore: false,
    };
  },
  computed: {
    currentTab() {
      return this.$route.query.tab || "home";
    },
  },
  setup() {
    const pageTitle = ref("用户主页");
    const pageDescription = ref("");
    useSeo({
      title: pageTitle,
      description: pageDescription,
    });
    return {
      pageTitle,
      pageDescription,
    };
  },
  async created() {
    await this.fetchUser();
    await this.getProjectList();
    await this.fetchTimeline();
  },
  methods: {
    async fetchUser() {
      this.user = await getUserByUsername(this.username);
      this.pageTitle = "" + this.user.display_name;
      this.pageDescription = `${this.user.display_name} 的 ZeroCat 个人主页`;
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
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 1400px;
  margin: 0 auto;
}

.profile-sidebar {
  position: sticky;
  top: 80px;
}

@media (max-width: 959px) {
  .profile-sidebar {
    position: static;
  }
}
</style>
