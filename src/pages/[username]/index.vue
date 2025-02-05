<template>
  <v-container>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="home">
        <v-responsive class="mt-8">
          <v-row class="d-flex align-center">
            <v-col>
              <p class="font-weight-medium text-primary">ZeroCat 用户</p>
              <p class="font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username">
                {{ user.display_name }}
                <v-avatar size="52" class="ma-2">
                  <v-img :src="'https://s4-1.wuyuan.1r.ink/user/' + user.images" />
                </v-avatar>
              </p>
              <p class="mt-2 text-body-1 text-medium-emphasis">{{ user.motto }}</p>
              <p class="mt-2 text-medium-emphasis">
                <v-chip>
                  <v-icon icon="mdi-account-circle" start></v-icon>
                  ID:{{ user.id }}
                </v-chip>
                <v-chip>
                  <v-icon icon="mdi-clock" start></v-icon>
                  {{ user.regTime }}注册
                </v-chip>
                <v-chip>
                  <v-icon icon="mdi-tag" start></v-icon>
                  创作者
                </v-chip>
              </p>
            </v-col>
          </v-row>
        </v-responsive>
        <br />
        <Projects :url="url"></Projects>
        <v-row>
          <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="2" xxl="2" v-for="item in lists" :key="item.id">
            <v-card rounded="lg">
              <v-card :to="'/app/projectlist/' + item.id" rounded="lg" :title="item.title" :subtitle="item.description"
                color="primary" variant="tonal">
              </v-card>
            </v-card>
          </v-col>
        </v-row>
        <br />
        <Comment :url="'user-' + user.id" name="用户"></Comment>
      </v-tabs-window-item>
      <v-tabs-window-item value="comment">
        <Comment :url="'user-' + user.id" name="用户"></Comment>
      </v-tabs-window-item>
      <v-tabs-window-item value="timeline">
        <v-timeline side="end" align="start" class="mt-4">
          <v-timeline-item v-for="event in timeline.events" :key="event.id" size="small" dot-color="primary">
            <template v-slot:opposite>
              {{ new Date(event.created_at).toLocaleString() }}
            </template>

            <v-card class="elevation-1" :to="getTargetLink(event.target)" v-if="getTargetLink(event.target)">
              <v-card-title class="text-subtitle-1">
                {{ getEventDisplayText(event) }}
              </v-card-title>

              <v-card-text>
                <v-chip size="small" :color="getEventColor(event.type)" class="mr-2">
                  {{ getEventChipText(event.type) }}
                </v-chip>

                <div>{{ getTargetContent(event.target, event.type) }}</div>

                <div v-if="event.event_data.comment_text" class="text-body-2 mt-1 text-grey">
                  {{ event.event_data.comment_text }}
                </div>
              </v-card-text>
            </v-card>

            <v-card class="elevation-1" v-else>
              <v-card-title class="text-subtitle-1">
                {{ getEventDisplayText(event) }}
              </v-card-title>

              <v-card-text>
                <v-chip size="small" :color="getEventColor(event.type)" class="mr-2">
                  {{ getEventChipText(event.type) }}
                </v-chip>

                <div>{{ getTargetContent(event.target, event.type) }}</div>

                <div v-if="event.event_data.comment_text" class="text-body-2 mt-1 text-grey">
                  {{ event.event_data.comment_text }}
                </div>
              </v-card-text>
            </v-card>
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
import Projects from "../../components/project/Projects.vue";
import { useHead } from "@unhead/vue";
import { getUserByUsername } from "../../stores/user.js";
import request from "../../axios/axios.js";
import { getProjectInfo } from "../../services/projectService";
import { getUserById } from "../../stores/user";

export default {
  components: { Projects, Comment },
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
      projectInfo: {},
      userInfo: {},
      currentPage: 1,
      isLoadingMore: false,
      pageSize: 20,
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
      this.lists = (
        await request({
          url: `/projectlist/userid/${this.user.id}/public`,
          method: "get",
        })
      ).data.data;
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
          await this.fetchRelatedInfo();
        }
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      }
    },
    async fetchRelatedInfo() {
      const projectIds = new Set();
      const userIds = new Set();

      const startIndex = (this.currentPage - 1) * this.pageSize;
      const events = this.timeline.events.slice(startIndex);

      events.forEach(event => {
        try {
          if (['project_create', 'project_delete', 'project_fork', 'project_publish', 'comment_create'].includes(event.type)) {
            if (event.target?.id) {
              projectIds.add(event.target.id);
            }
          }
          if (event.type === 'comment_create' && event.event_data.page?.type === 'project') {
            projectIds.add(event.event_data.page.id);
          }
          if (event.type === 'comment_create') {
            if (event.target?.page?.type === 'user' && event.target.page?.id) {
              userIds.add(event.target.page.id);
            }
          }
        } catch (error) {
          console.warn('Error processing event:', event, error);
        }
      });

      try {
        if (projectIds.size > 0) {
          const projectsData = await getProjectInfo(Array.from(projectIds));

          const authorIds = new Set();
          projectsData.forEach(project => {
            if (project && project.id) {
              this.projectInfo[project.id] = project;
              if (project.authorid) {
                authorIds.add(project.authorid);
              }
            } else {
              console.warn('Project data is missing for ID:', project.id);
            }
          });

          authorIds.forEach(id => {
            if (id) userIds.add(id);
          });
        }

        if (userIds.size > 0) {
          const usersData = await getUserById(Array.from(userIds));
          usersData.forEach(user => {
            if (user && user.id) {
              this.userInfo[user.id] = user;

              Object.values(this.projectInfo).forEach(project => {
                if (project && project.authorid === user.id) {
                  project.author_username = user.username;
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching related info:', error);
      }
    },
    getTargetLink(target) {
      if (!target) return null;

      try {
        const targetId = target.id || target.page?.id;
        const targetType = target.type || target.page?.type;

        if (!targetType || !targetId) return null;

        switch (targetType) {
          case 'comment': {
            if (!target.page?.type || !target.page?.id) return null;
            const { type: pageType, id: pageId } = target.page;

            if (pageType === 'project') {
              const project = this.projectInfo[pageId];
              if (!project?.author_username || !project?.name) return null;
              return `/${project.author_username}/${project.name}`;
            }
            if (pageType === 'user') {
              const user = this.userInfo[pageId];
              if (!user?.username) return null;
              return `/${user.username}`;
            }
            return null;
          }
          case 'project': {
            const project = this.projectInfo[targetId];
            if (!project?.author_username || !project?.name) return null;
            return `/${project.author_username}/${project.name}`;
          }
          case 'user': {
            const user = this.userInfo[targetId];
            if (!user?.username) return null;
            return `/${user.username}`;
          }
          case 'projectlist': {
            return `/projectlist/${targetId}`;
          }
          default:
            return null;
        }
      } catch (error) {
        console.warn('Error generating target link:', error);
        return null;
      }
    },

    getTargetContent(target, eventType) {
      if (!target) return '';

      try {
        switch (target.type) {
          case 'comment':
            return this.getCommentTargetContent(target, eventType);
          case 'project':
            return this.getProjectTargetContent(target, eventType);
          case 'user':
            return this.getUserTargetContent(target, eventType);
          default:
            return `未知目标类型 #${target?.id || '未知'}`;
        }
      } catch (error) {
        console.warn('Error generating target content:', error);
        return '内容获取失败';
      }
    },

    getCommentTargetContent(target, eventType) {
      if (!target.page && !target.page?.type) return `评论 #${target.id}`;

      const { type: pageType, id: pageId } = target.page || {};

      switch (pageType) {
        case 'project': {
          const project = this.projectInfo[pageId];
          if (!project) return `在作品 #${pageId} 下的评论`;
          return `在作品 ${project.title} 下的评论`;
        }
        case 'user': {
          const user = this.userInfo[pageId];
          if (!user) return `在用户 #${pageId} 主页下的评论`;
          return `在用户 ${user.display_name} 主页下的评论`;
        }
        default:
          return `在 ${pageType} #${pageId} 下的评论`;
      }
    },

    getProjectTargetContent(target, eventType) {
      const project = this.projectInfo[target.id];
      if (!project) return `项目 #${target.id}`;

      if (eventType === 'project_publish') {
        const stateText = project.state === 'public' ? '公开' : '私有';
        return `${project.title || project.name}（${stateText}）`;
      }

      return project.title || project.name;
    },

    getUserTargetContent(target, eventType) {
      const user = this.userInfo[target.id];
      if (!user) return `用户 #${target.id}`;
      return user.display_name;
    },

    getEventChipText(type) {
      const texts = {
        'project_create': '新建项目',
        'project_delete': '删除项目',
        'project_fork': '复刻项目',
        'project_publish': '发布项目',
        'comment_create': '评论',
        'user_profile_update': '个人资料',
        'user_register': '用户注册'
      };
      return texts[type] || type;
    },

    getEventColor(type) {
      const colors = {
        'project_create': 'success',
        'project_delete': 'error',
        'project_fork': 'warning',
        'project_publish': 'info',
        'comment_create': 'secondary',
        'user_profile_update': 'info',
        'user_register': 'primary'
      };
      return colors[type] || 'primary';
    },

    getEventDisplayText(event) {
      const actor = event.actor.display_name;

      switch (event.type) {
        case 'project_create':
          return `${actor} 创建了新项目`;
        case 'project_delete':
          return `${actor} 删除了项目`;
        case 'project_fork':
          return `${actor} 复刻了项目`;
        case 'project_publish':
          return `${actor} 发布了项目`;
        case 'comment_create':
          return `${actor} 发表了评论`;
        case 'user_profile_update': {
          const fields = event.event_data.updated_fields
            .map(field => this.getFieldDisplayName(field))
            .join('、');
          return `${actor} 更新了个人资料（${fields}）`;
        }
        case 'user_register':
          return `${actor} 加入了 ZeroCat`;
        default:
          return `${actor} 进行了操作`;
      }
    },

    getFieldDisplayName(field) {
      const fieldMap = {
        'display_name': '昵称',
        'motto': '个性签名',
        'sex': '性别',
        'birthday': '生日',
        'avatar': '头像',
        'background': '背景图片',
        'email': '邮箱',
        'phone': '手机号',
        'website': '个人网站',
        'bio': '个人简介',
        'social_links': '社交链接',
        'preferences': '偏好设置',
        'visibility': '可见性设置',
        'language': '语言设置'
      };

      return fieldMap[field] || field;
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
</style>
