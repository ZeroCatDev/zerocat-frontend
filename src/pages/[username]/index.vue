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
            <v-card v-if="readmeContent" rounded="lg" border class="mb-4">
              <v-card-title class="d-flex align-center justify-space-between py-2 px-4 readme-card-header">
                <span class="text-body-2 font-weight-light">{{ username }} / README.md</span>
                <v-btn
                  v-if="isCurrentUser"
                  :to="`/${username}/articles/${username}/edit`"
                  icon="mdi-pencil-outline"
                  size="small"
                  variant="text"
                  aria-label="编辑 README"
                ></v-btn>
              </v-card-title>

              <v-card-text class="markdown-body readme-markdown-body">
                <Markdown>{{ readmeContent }}</Markdown>
              </v-card-text>
            </v-card>

            <v-card v-else-if="showReadmeLoadingCard" rounded="lg" border class="mb-4">

              <v-card-text>
                <v-skeleton-loader type="paragraph, paragraph" />
              </v-card-text>
            </v-card>

            <v-card v-else-if="showReadmePrompt" rounded="lg" border class="mb-4" variant="tonal">
              <v-card-title class="d-flex align-center py-3">
                <v-icon start size="20">mdi-file-document-plus-outline</v-icon>
                <span class="text-body-1 font-weight-bold">README.md</span>
              </v-card-title>
              <v-divider />
              <v-card-text>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  还没有个人简介，创建 README 项目后可在主页展示详细介绍。
                </div>
                <div class="d-flex flex-wrap ga-2">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    prepend-icon="mdi-book-open-page-variant-outline"
                    :loading="readmeLoading"
                    @click="openOrCreateReadmeProject"
                  >{{ readmeExists ? '打开 README 项目' : '创建并编辑 README 项目' }}</v-btn>

                  <v-btn
                    v-if="readmeExists"
                    variant="tonal"
                    prepend-icon="mdi-open-in-new"
                    :to="`/${username}/articles/${username}`"
                  >查看 README 页面</v-btn>
                </div>
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

          <!-- Projects & Lists Tab -->
          <template v-if="currentTab === 'projects' || currentTab === 'lists'">
            <UserContentSearch
              :key="currentTab"
              :user-id="user.id"
              :default-scope="currentTab === 'lists' ? 'lists' : 'projects'"
              :show-author="false"
            />
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
import { localuser } from "@/services/localAccount";
import { getUserByUsername } from "../../stores/user.js";
import { getProjectInfoByNamespace, initProject } from "@/services/projectService";
import request from "../../axios/axios.js";
import Markdown from "@/components/Markdown.vue";
import "github-markdown-css";
import UserFollowers from "@/components/user/UserFollowers.vue";
import UserFollowing from "@/components/user/UserFollowing.vue";
import Timeline from "@/components/timeline/Timeline.vue";
import PageAnalytics from "@/components/analytics/PageAnalytics.vue";
import UserProfileSidebar from "@/components/user/UserProfileSidebar.vue";
import UserTopProjects from "@/components/user/UserTopProjects.vue";
import UserRecentPosts from "@/components/user/UserRecentPosts.vue";
import UserContentSearch from "@/components/shared/UserContentSearch.vue";

export default {
  components: {
    Comment,
    Markdown,
    UserFollowers,
    UserFollowing,
    Timeline,
    PageAnalytics,
    UserProfileSidebar,
    UserTopProjects,
    UserRecentPosts,
    UserContentSearch,
  },
  data() {
    return {
      username: this.$route.params.username,
      user: {},
      timeline: {
        events: [],
        pagination: {
          current: 1,
          size: 20,
          total: 0,
        },
      },
      readmeContent: "",
      readmeExists: false,
      readmeLoading: false,
      readmeChecking: true,
      isLoadingMore: false,
    };
  },
  computed: {
    currentTab() {
      return this.$route.query.tab || "home";
    },
    isCurrentUser() {
      return Boolean(localuser.isLogin.value && localuser.user.value?.username === this.username);
    },
    showReadmeLoadingCard() {
      return this.isCurrentUser && this.readmeChecking;
    },
    showReadmePrompt() {
      return this.isCurrentUser && !this.readmeChecking && !this.readmeContent;
    }
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
    await this.fetchReadmeContent();
    await this.fetchTimeline();
  },
  methods: {
    async fetchUser() {
      this.user = await getUserByUsername(this.username);
      this.pageTitle = "" + this.user.display_name;
      this.pageDescription = `${this.user.display_name} 的 ZeroCat 个人主页`;
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
    async fetchReadmeContent() {
      this.readmeChecking = true;
      this.readmeContent = "";
      this.readmeExists = false;
      try {
        const readmeProject = await getProjectInfoByNamespace(this.username, this.username);
        if (!readmeProject?.id || readmeProject.id === 0 || readmeProject.type !== "article") {
          return;
        }

        this.readmeExists = true;

        const commitRes = await request.get(`/project/${readmeProject.id}/main/latest`);
        if (commitRes.data?.status !== "success") return;

        const token = commitRes.data.accessFileToken;
        const commitFile = commitRes.data.commit?.commit_file;
        if (!token || !commitFile) return;

        const fileRes = await request.get(
          `/project/files/${commitFile}?accessFileToken=${token}&content=true`
        );
        let raw = fileRes.data;
        if (typeof raw === "object") {
          raw = raw.index ?? "";
        }
        this.readmeContent = typeof raw === "string" ? raw : "";
      } catch (error) {
        console.error("Failed to fetch user README content:", error);
        this.readmeContent = "";
        this.readmeExists = false;
      } finally {
        this.readmeChecking = false;
      }
    },
    async openOrCreateReadmeProject() {
      if (!this.isCurrentUser) return;

      this.readmeLoading = true;
      try {
        const readmeProject = await getProjectInfoByNamespace(this.username, this.username);
        if (readmeProject?.id && readmeProject.id !== 0 && readmeProject.type === "article") {
          this.readmeExists = true;
          this.$router.push(`/${this.username}/articles/${this.username}/edit`);
          return;
        }

        const createRes = await request.post('/project/', {
          name: this.username,
          title: 'README.md',
          description: '',
          state: 'public',
          type: 'article',
          license: 'None'
        });

        if (createRes?.data?.status === 'error') {
          throw new Error(createRes?.data?.message || '创建 README 项目失败');
        }

        const projectId = createRes?.data?.data?.id ?? createRes?.data?.id;
        if (projectId) {
          await initProject(projectId, 'text');
        }

        this.readmeExists = true;
        this.$router.push(`/${this.username}/articles/${this.username}/edit`);
      } catch (error) {
        console.error('Failed to open/create README project:', error);
      } finally {
        this.readmeLoading = false;
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

.readme-card-header {
  min-height: 44px;
}

.readme-markdown-body {
  background: transparent;
}

:deep(.readme-markdown-body.markdown-body) {
  background-color: transparent;
}

@media (max-width: 959px) {
  .profile-sidebar {
    position: static;
  }
}
</style>
