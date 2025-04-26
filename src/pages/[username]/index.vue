<template>
  <v-container>
   <!-- <v-tabs align="center" v-model="tab" bg-color="primary">
      <v-tab value="home">首页</v-tab>
      <v-tab value="comment">评论</v-tab>
      <v-tab value="followers">关注者</v-tab>
      <v-tab value="following">关注的人</v-tab>
      <v-tab value="timeline">时间线</v-tab>
    </v-tabs>-->

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="home">
        <v-responsive class="mt-8">
          <v-row class="d-flex align-center">
            <v-col>
              <p class="font-weight-medium text-primary">ZeroCat 用户</p>
              <p class="font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username">
                {{ user.display_name }}
                <v-avatar size="52" class="ma-2">
                  <v-img :src="VITE_APP_S3_BUCKET + '/user/' + user.images" />
                </v-avatar>
              </p>
              <p class="mt-2 text-body-1 text-medium-emphasis" style="word-break: break-word; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ user.motto }}</p>
              <p class="mt-2 text-medium-emphasis">
                <v-chip>
                  <v-icon icon="mdi-account-circle" start></v-icon>
                  #{{ user.id }}
                </v-chip>
                <v-chip>
                  <v-icon icon="mdi-clock" start></v-icon>
                  <TimeAgo :date="user.regTime"></TimeAgo> 注册
                </v-chip>
                <v-chip>
                  <v-icon icon="mdi-tag" start></v-icon>
                  {{ user.id===1?'社区管理员':'用户' }}
                </v-chip>

              </p>
              <user-relation-controls
                  :user-id="user.id"
                  :username="username"
                  :display-name="user.display_name"
                />
              <follow-stats :user-id="user.id" :username="username" class="mt-3" />
            </v-col>
          </v-row>
        </v-responsive>
        <br />
        <v-card title="关于我" subtitle="README.md">


          <v-card-text   class="markdown-body"> <br/>
            <Markdown>{{ user.motto }}</Markdown>
          </v-card-text>

        </v-card> <Projects :url="url"></Projects>
        <v-row>
          <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="2" xxl="2" v-for="item in lists" :key="item.id">
            <v-card rounded="lg">
              <v-card :to="'/app/projectlist/' + item.id" rounded="lg" :title="item.title" :subtitle="item.description"
                color="primary" variant="tonal">
              </v-card>
            </v-card>
          </v-col>
        </v-row><br/>
        <user-project-lists :user-id="user.id" :project-lists="lists" />
        <br />
        <Comment :url="'user-' + user.id" name="用户"></Comment>
      </v-tabs-window-item>
      <v-tabs-window-item value="comment">
        <Comment :url="'user-' + user.id" name="用户"></Comment>
      </v-tabs-window-item>
      <v-tabs-window-item value="followers">
        <v-container>
          <h2 class="text-h5 mb-4">关注者</h2>
          <user-followers :user-id="user.id" :show-all="false" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="following">
        <v-container>
          <h2 class="text-h5 mb-4">正在关注</h2>
          <user-following :user-id="user.id" :show-all="false" />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="timeline">
        <v-timeline side="end" align="start" class="mt-4">
          <v-timeline-item v-for="event in timeline.events" :key="event.id" size="small" dot-color="primary">
            <template v-slot:opposite>
              {{ new Date(event.created_at).toLocaleString() }}
            </template>
            <template v-slot:icon>
              <v-avatar :image="VITE_APP_S3_BUCKET + '/user/' + user.images"></v-avatar>
            </template>
            <div class="timeline-item-content">
              <!-- Event Header -->
              <div class="event-header">
                <h3 class="text-h6">
                  {{ event.actor.display_name }}
                  {{ eventTypes[event.type]?.text || '进行了操作' }}
                </h3>
                <v-chip size="x-small" :color="eventTypes[event.type]?.color || 'primary'" class="ml-2">
                  {{ eventTypes[event.type]?.label || event.type }}
                </v-chip>
              </div> <router-link :to="`/app/link/project?id=${event.target?.id}`" class="text-decoration-none"
                v-if="eventTypes[event.type]?.isProject">
                {{ event.event_data?.project_title }}
              </router-link>
              <div class=" mb-2"></div>
              <!-- Project Event Card -->
              <v-card
                v-if="eventTypes[event.type]?.isProject && !['project_rename', 'project_commit'].includes(event.type)"
                class="mb-3 project-event" :to="`/app/link/project?id=${event.target?.id}`">
                <v-card-text>
                  <div class="project-info">
                    <v-icon icon="mdi-source-repository" color="primary" class="mr-2" />
                    <span class="font-weight-medium">{{ event.event_data?.project_name || '未命名项目' }}</span>

                    <div class="mt-2 text-caption text-medium-emphasis">
                      {{ event.event_data?.project_description }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Special Project Events -->
              <template v-else-if="['project_rename', 'project_commit', 'project_info_update'].includes(event.type)">
                <!-- Rename Event -->
                <template v-if="event.type === 'project_rename'">
                  <v-card class="rename-card mb-3" :to="`/app/link/project?id=${event.target?.id}`">
                    <v-card-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon icon="mdi-rename-box" color="warning" class="mr-2" />
                        <span class="font-weight-medium">{{ event.event_data?.project_title }}</span>
                      </div>
                      <div class="rename-details text-body-2">
                        <div class="d-flex align-center">
                          <span class="text-medium-emphasis">从</span>
                          <v-chip size="small" class="mx-2" color="surface-variant">
                            {{ event.event_data?.old_name }}
                          </v-chip>
                        </div>
                        <div class="d-flex align-center mt-1">
                          <span class="text-medium-emphasis">到</span>
                          <v-chip size="small" class="mx-2" color="warning">
                            {{ event.event_data?.new_name }}
                          </v-chip>
                        </div>
                      </div>
                      <div class="project-meta text-caption text-medium-emphasis mt-2">
                        <v-chip size="x-small" class="mr-1">{{ event.event_data?.project_type }}</v-chip>
                        <v-chip size="x-small">{{ event.event_data?.project_state }}</v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </template>

                <!-- Commit Event -->
                <template v-else-if="event.type === 'project_commit'">
                  <v-card class="commit-card mb-3" :to="`/app/link/project?id=${event.target?.id}`">
                    <v-card-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon icon="mdi-source-commit" color="info" class="mr-2" />
                        <span class="font-weight-medium">分支: {{ event.event_data?.branch }}</span>
                      </div>
                      <div class="commit-message text-body-2">
                        {{ event.event_data?.commit_message }}
                      </div>
                      <div class="commit-hash text-caption text-medium-emphasis mt-1">
                        提交ID: {{ event.event_data?.commit_id.substring(0, 7) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </template>

                <!-- Project Info Update Event -->
                <template v-else-if="event.type === 'project_info_update'">
                  <v-card class="info-update-card mb-3" :to="`/app/link/project?id=${event.target?.id}`">
                    <v-card-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon icon="mdi-file-document-edit" color="info" class="mr-2" />
                        <span class="font-weight-medium">{{ event.event_data?.project_title }}</span>
                      </div>

                      <div class="info-updates text-body-2">
                        <template v-for="field in event.event_data?.updated_fields" :key="field">
                          <div class="update-item mb-2">
                            <div class="d-flex align-center">
                              <v-chip size="x-small" color="info" class="mr-2">{{ getFieldDisplayName(field) }}</v-chip>
                            </div>
                            <div class="d-flex flex-column mt-1 field-changes">
                              <div class="old-value">
                                <span class="text-medium-emphasis">从：</span>
                                <span class="ml-2">{{ event.event_data?.old_values[field] }}</span>
                              </div>
                              <div class="new-value">
                                <span class="text-medium-emphasis">到：</span>
                                <span class="ml-2 text-info">{{ event.event_data?.new_values[field] }}</span>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>

                      <div class="project-meta text-caption text-medium-emphasis mt-2">
                        <v-chip size="x-small" class="mr-1">{{ event.event_data?.project_type }}</v-chip>
                        <v-chip size="x-small">{{ event.event_data?.project_state }}</v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </template>
              </template>

              <!-- Simple Event Content -->
              <div v-else class="event-content pa-2">
                <!-- Profile Update Event -->
                <template v-if="event.type === 'user_profile_update'">
                  <div class="text-body-2">
                    更新了：{{ getUpdatedFields(event.event_data?.updated_fields) }}
                  </div>
                </template>

                <!-- Project Related Events -->
                <template v-else-if="event.target?.type === 'project'">
                  <div class="text-body-2">
                    <span>{{ eventTypes[event.type]?.text || '操作了' }}</span>
                    <router-link :to="`/app/link/project?id=${event.target.id}`" class="text-decoration-none ml-1">
                      {{ event.event_data?.project_name || event.target.title || `项目 #${event.target.id}` }}
                    </router-link>
                  </div>
                </template>

                <!-- Other Events -->
                <div v-else class="text-body-2 text-medium-emphasis">
                  {{ getTargetContent(event.target, event.type) }}
                </div>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>

        <div class="d-flex justify-center mt-4 mb-4">
          <v-btn v-if="hasMoreEvents" :loading="isLoadingMore" variant="tonal" @click="loadMoreEvents">
            加载更多
          </v-btn>
          <div v-else-if="timeline.events.length > 0" class="text-medium-emphasis">
            没有更多内容了
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script>
import Comment from "../../components/Comment.vue";
import { useHead } from "@unhead/vue";
import { getUserByUsername } from "../../stores/user.js";
import request from "../../axios/axios.js";
import { getUserById } from "../../stores/user";
import Markdown from "@/components/Markdown.vue";
import "github-markdown-css";
import TimeAgo from "@/components/TimeAgo.vue";
import UserProjectLists from "@/components/projectlist/UserProjectLists.vue";
import UserRelationControls from "@/components/user/UserRelationControls.vue";
import FollowStats from "@/components/user/FollowStats.vue";
import { localuser } from "@/services/localAccount";
import UserFollowers from "@/components/user/UserFollowers.vue";
import UserFollowing from "@/components/user/UserFollowing.vue";

export default {
  components: {
    Comment,
    Markdown,
    TimeAgo,
    UserProjectLists,
    UserRelationControls,
    FollowStats,
    UserFollowers,
    UserFollowing
  },
  data() {
    return {
      username: this.$route.params.username,
      user: {},
      lists: [],
      url: "",
      tab: this.$route.query.tab || 'home',
      timeline: {
        events: [],
        pagination: {
          current: 1,
          size: 20,
          total: 0
        }
      },
      currentPage: 1,
      isLoadingMore: false,
      pageSize: 20,
      localuser,
      eventTypes: {
        project_create: {
          text: '创建了新项目',
          label: '新建',
          color: 'success',
          isProject: true
        },
        project_publish: {
          text: '更新了项目',
          label: '更新',
          color: 'info',
          isProject: true
        },
        project_fork: {
          text: '复刻了项目',
          label: '复刻',
          color: 'warning',
          isProject: true
        },
        project_delete: {
          text: '删除了项目',
          label: '删除',
          color: 'error',
          isProject: true
        },
        user_profile_update: {
          text: '更新了个人资料',
          label: '更新',
          color: 'info'
        },
        user_register: {
          text: '加入了 ZeroCat',
          label: '注册',
          color: 'primary'
        },
        project_commit: {
          text: '提交了项目更新',
          label: '提交',
          color: 'info',
          isProject: true
        },
        project_rename: {
          text: '重命名了项目',
          label: '重命名',
          color: 'warning',
          isProject: true
        },
        project_info_update: {
          text: '更新了项目信息',
          label: '更新信息',
          color: 'info',
          isProject: true
        },
      },
      fieldDisplayNames: {
        display_name: '昵称',
        motto: '个性签名',
        sex: '性别',
        birthday: '生日',
        avatar: '头像',
        background: '背景图片',
        email: '邮箱',
        phone: '手机号',
        website: '个人网站',
        bio: '个人简介',
        social_links: '社交链接',
        preferences: '偏好设置',
        visibility: '可见性设置',
        language: '语言设置'
      },
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    };
  },
  watch: {
    '$route.query.tab'(newTab) {
      this.tab = newTab || 'home';
    }
  },
  async created() {
    await this.fetchUser();
    await this.getProjectList();
    await this.fetchTimeline();
    this.tab = this.$route.query.tab || 'home';
  },
  computed: {
    hasMoreEvents() {
      return this.timeline.events.length < this.timeline.pagination.total;
    },
  },
  methods: {
    async fetchUser() {
      this.user = await getUserByUsername(this.username);
      useHead({
        title: "" + this.user.display_name,
      });
      this.url = `/searchapi?search_userid=${this.user.id}&search_type=&search_title=&search_source=&search_description=&search_orderby=view_up&search_state=public&search_tag=`;
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
            page: page,
            limit: this.pageSize
          }
        });

        if (response.data.status === 'success') {
          if (page === 1) {
            this.timeline = response.data.data;
          } else {
            this.timeline.events = [
              ...this.timeline.events,
              ...response.data.data.events
            ];
            this.timeline.pagination = response.data.data.pagination;
          }
        }
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      }
    },
    getUpdatedFields(fields) {
      if (!fields?.length) return '';
      return fields
        .map(field => this.fieldDisplayNames[field] || field)
        .join('、');
    },
    async loadMoreEvents() {
      if (this.isLoadingMore || !this.hasMoreEvents) return;

      try {
        this.isLoadingMore = true;
        this.currentPage += 1;
        await this.fetchTimeline(this.currentPage);
      } catch (error) {
        console.error('Failed to load more events:', error);
      } finally {
        this.isLoadingMore = false;
      }
    },
    getTargetContent(target, eventType) {
      if (!target) return '';

      switch (target.type) {
        case 'project': {
          return target.title || `项目 #${target.id}`;
        }
        case 'user': {
          return target.display_name || `用户 #${target.id}`;
        }
        case 'projectlist':
          return `项目列表 #${target.id}`;
        default:
          return `${target.type} #${target.id}`;
      }
    },
    getFieldDisplayName(field) {
      const fieldNames = {
        title: '标题',
        description: '描述',
        type: '类型',
        state: '状态',
        visibility: '可见性',
        tags: '标签',
        category: '分类',
        // Add more field names as needed
      };
      return fieldNames[field] || field;
    },
  },
};
</script>

<style scoped>
.username {
  color: #fff;
  /* 白色文本 */
  font-weight: bold;
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0.911),
      rgba(255, 255, 255, 0.911));
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

.v-btn {
  min-width: 120px;
}

.timeline-item-content {
  width: 100%;
}

.project-card {
  border-left: 3px solid var(--v-primary-base);
  padding-left: 12px;
}

.comment-preview {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  padding: 8px 12px;
  font-style: italic;
}

.v-timeline-item {
  margin-bottom: 16px;
}

.simple-event {
  border-radius: 4px;
  transition: background-color 0.2s;
}

.simple-event:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.06);
}

.comment-text {
  font-style: italic;
  color: var(--v-medium-emphasis-color);
}

.text-decoration-none {
  color: var(--v-primary-base);

  &:hover {
    text-decoration: underline;
  }
}

.event-header {
  display: flex;
  align-items: center;
}

.project-event {
  border-left: 3px solid var(--v-primary-base);
  background-color: var(--v-surface-variant);
}

.project-info {
  padding-left: 12px;
}

.event-content {
  border-radius: 4px;
  transition: background-color 0.2s;
}

.event-content:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.06);
}

.comment-text {
  font-style: italic;
  color: var(--v-medium-emphasis-color);
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.commit-card {
  border-left: 3px solid var(--v-info-base);
  background-color: var(--v-surface-variant);
  transition: transform 0.2s;
}

.commit-card:hover {
  transform: translateY(-2px);
}

.commit-message {
  white-space: pre-wrap;
  word-break: break-word;
}

.commit-hash {
  font-family: monospace;
}

.rename-card {
  border-left: 3px solid var(--v-warning-base);
  background-color: var(--v-surface-variant);
  transition: transform 0.2s;
}

.rename-card:hover {
  transform: translateY(-2px);
}

.rename-details {
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.project-meta {
  margin-top: 8px;
}

.info-update-card {
  border-left: 3px solid var(--v-info-base);
  background-color: var(--v-surface-variant);
  transition: transform 0.2s;
}

.info-update-card:hover {
  transform: translateY(-2px);
}

.info-updates {
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.update-item {
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.5);
}

.field-changes {
  margin-left: 8px;
  padding: 4px 8px;
  border-left: 2px solid var(--v-info-base);
}

.old-value,
.new-value {
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.new-value {
  font-weight: 500;
}
</style>
