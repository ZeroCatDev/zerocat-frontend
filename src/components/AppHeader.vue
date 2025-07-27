<template>
  <v-app-bar :elevation="2" fixed>
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-btn :active="false" icon variant="text" @click="goHome">
      <v-icon>
        <svg
          fill="none"
          height="200"
          viewBox="0 0 200 200"
          width="200"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <circle cx="100" cy="100" fill="#FFFFFF" r="100"></circle>
          <path
            d="M38 162.867L100.5 100.367L100.5 162.867L38 162.867ZM163 100.367L100.5 100.367L100.5 162.867L163 100.367Z"
            fill="#415F91"
            fill-rule="evenodd"
          ></path>
          <path
            d="M38 100.367L100.5 37.8672L100.5 100.367L38 100.367ZM163 37.8672L100.5 37.8672L100.5 100.367L163 37.8672Z"
            fill="#8EACE3"
            fill-rule="evenodd"
          ></path>
        </svg>
      </v-icon>
    </v-btn>
    <v-app-bar-title>
      <template v-if="isProjectPath">
        <div class="d-flex align-center">
          <v-btn
            :to="`/${getPathSegments[0]}`"
            class="text-none"
            variant="text"
          >
            {{ getPathSegments[0] }}
          </v-btn>
          <span class="mx-1">/</span>
          <v-btn
            :to="`/${getPathSegments[0]}/${getPathSegments[1]}`"
            class="text-none"
            variant="text"
          >
            {{ getPathSegments[1] }}
          </v-btn>
        </div>
      </template>
      <template v-else><strong>Zero</strong>Cat</template>
    </v-app-bar-title>
    <template #append>
      <SearchDialog/>
      <v-btn icon="mdi-plus" to="/app/new"></v-btn>
      <v-menu :close-on-content-click="false" location="bottom">
        <template #activator="{ props, isActive }"
        >
          <template v-if="localuser.isLogin.value">
            <v-btn
              icon
              v-bind="props"
              @click="notificationsCard?.fetchNotifications()"
            >
              <v-avatar
                :image="
                  s3BucketUrl + '/user/' + localuser.user.value.avatar
                "
              ></v-avatar>
            </v-btn>
          </template>
          <template v-else>
            <LoginDialog @login-success="handleLoginSuccess" @login-error="handleLoginError"/>
            <v-btn
              color="primary"
              rounded="xl"
              text="注册"
              to="/app/account/register"
              variant="tonal"
            ></v-btn>
          </template>
        </template>
        <v-card border min-width="300px">
          <v-tabs v-model="userTab" grow>
            <v-tab value="notifications">
              <v-icon start>mdi-bell</v-icon>
              通知
              <!--<v-badge
                v-if="unreadCount > 0"
                :content="unreadCount"
                color="error"
                dot
                floating
              ></v-badge>-->
            </v-tab>
            <v-tab value="profile">
              <v-icon start>mdi-account</v-icon>
              我的
            </v-tab>
          </v-tabs>

          <v-card-text class="pa-0">
            <v-window v-model="userTab">
              <!-- 通知选项卡内容 -->
              <v-window-item value="notifications">
                <NotificationsCard
                  ref="notificationsCard"
                  :autoFetch="true"
                  :maxHeight="'auto'"
                  :menuMode="true"
                  :showHeader="false"
                >
                </NotificationsCard>
              </v-window-item>

              <!-- 个人资料选项卡内容 -->
              <v-window-item value="profile">
                <v-card
                  :append-avatar="
                    s3BucketUrl + '/user/' + localuser.user.value.avatar
                  "
                  :subtitle="localuser.user.value.username"
                  :title="localuser.user.value.display_name"
                  @click="localuser.loadUser(true)"
                ></v-card>
                <v-list>
                  <v-list-item
                    :to="`/${localuser.user.value.username}`"
                    color="primary"
                    prepend-icon="mdi-account"
                    rounded="xl"
                    title="个人主页"
                  ></v-list-item>
                  <v-list-item
                    color="primary"
                    prepend-icon="mdi-cog"
                    rounded="xl"
                    title="设置"
                    to="/app/account"
                  ></v-list-item>
                  <v-list-item
                    color="primary"
                    prepend-icon="mdi-xml"
                    rounded="xl"
                    title="项目"
                    to="/app/project"
                  ></v-list-item>
                  <v-list-item
                    color="primary"
                    prepend-icon="mdi-format-list-bulleted"
                    rounded="xl"
                    title="列表"
                    to="/app/projectlist"
                  ></v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item
                    active
                    color="error"
                    prepend-icon="mdi-logout"
                    rounded="xl"
                    title="退出"
                    to="/app/account/logout"
                    variant="plain"
                  ></v-list-item>
                </v-list>
              </v-window-item>
            </v-window>
          </v-card-text
          >
        </v-card>
      </v-menu>
    </template>
    <template v-if="subNavItems.length || showEditorTabs" v-slot:extension>
      <transition name="fade">
        <!-- 编辑器标签页 -->
        <v-tabs
          v-if="showEditorTabs"
          v-model="activeEditorTab"
          class="editor-tabs"
          density="compact"
          show-arrows
        >
          <v-tab
            v-for="tab in editorTabs"
            :key="tab.id"
            :value="tab.id"
            class="editor-tab"
            :class="{ 'editor-tab--modified': tab.modified }"
          >
            <div class="d-flex align-center">
              <v-icon
                :icon="tab.icon"
                size="16"
                class="mr-2"
              ></v-icon>
              <span class="tab-title">{{ tab.title }}</span>
              <v-btn
                v-if="tab.closeable"
                icon
                size="x-small"
                variant="text"
                class="ml-2 close-btn"
                @click.stop="closeTab(tab.id)"
              >
                <v-icon size="12">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-tab>
        </v-tabs>
        <!-- 原有的导航标签页 -->
        <v-tabs v-else-if="subNavItems.length" v-model="activeTab" align-tabs="center">
          <div v-for="item in subNavItems" :key="item.name">
            <v-tab
              :disabled="item.disabled"
              :to="item.link"
              :value="item.name"
              rounded="lg"
            >
              {{ item.title }}
            </v-tab>
          </div>
        </v-tabs>
      </transition>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-if="!isAdminRoute" v-model="drawer" :rail="drawerRail" expand-on-hover>
    <!-- 导航部分 -->
    <v-list>
      <v-list-subheader>
        <v-icon icon="mdi-menu" size="small"></v-icon>
        导航
      </v-list-subheader>

      <v-list-item
        prepend-icon="mdi-home"
        rounded="xl"
        title="首页"
        to="/"
      ></v-list-item>

      <v-list-item
        v-if="localuser.isLogin"
        prepend-icon="mdi-view-dashboard"
        rounded="xl"
        title="仪表盘"
        to="/app/dashboard"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-xml"
        rounded="xl"
        title="项目"
        to="/app/explore"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-earth"
        rounded="xl"
        title="搜索"
        to="/app/search"
      ></v-list-item>
    </v-list>

    <!-- 镜像部分 -->
    <v-list v-if="proxyEnabled">
      <v-list-subheader>
        <v-icon icon="mdi-link-variant" size="small"></v-icon>
        镜像
      </v-list-subheader>

      <v-list-item
        prepend-icon="mdi-home"
        rounded="xl"
        title="首页"
        to="/app/proxy"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-earth"
        rounded="xl"
        title="探索"
        to="/app/proxy/explore"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-xml"
        rounded="xl"
        title="搜索"
        to="/app/proxy/search"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-newspaper"
        rounded="xl"
        title="新闻"
        to="/app/proxy/news"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-link"
        rounded="xl"
        title="打开"
        to="/app/proxy/open"
      ></v-list-item>
    </v-list>

    <!-- 工具部分 -->
    <v-list>
      <v-list-subheader>
        <v-icon icon="mdi-tools" size="small"></v-icon>
        工具
      </v-list-subheader>

      <v-list-item
        prepend-icon="mdi-download"
        rounded="xl"
        title="桌面版镜像"
        to="/app/tools/asdm"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-xml"
        rounded="xl"
        title="项目比较器"
        to="/app/tools/comparer"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!-- 主题和抽屉控制 -->
    <v-list>
      <v-list-item
        :prepend-icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        rounded="xl"
        @click="toggleTheme"
      ></v-list-item>
      <v-list-item
        :prepend-icon="drawerRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        rounded="xl"
        @click="drawerRail = !drawerRail"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer v-else v-model="drawer" :rail="drawerRail" expand-on-hover>
    <v-list>
      <v-list-item
        prepend-icon="mdi-arrow-left"
        rounded="xl"
        title="返回"
        to="/"
      ></v-list-item>
      <v-list-subheader>
        <v-icon icon="mdi-shield" size="small"></v-icon>
        管理
      </v-list-subheader>

      <v-list-item
        prepend-icon="mdi-account-group"
        rounded="xl"
        title="用户管理"
        to="/app/admin/users"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-xml"
        rounded="xl"
        title="项目管理"
        to="/app/admin/project"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-cog"
        rounded="xl"
        title="系统设置"
        to="/app/admin/config"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-sitemap"
        rounded="xl"
        title="站点地图"
        to="/app/admin/sitemap"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!-- 主题和抽屉控制 -->
    <v-list>
      <v-list-item
        :prepend-icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        rounded="xl"
        @click="toggleTheme"
      ></v-list-item>
      <v-list-item
        :prepend-icon="drawerRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        rounded="xl"
        @click="drawerRail = !drawerRail"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {localuser} from "@/services/localAccount";
import {useTheme} from "vuetify";
import {ref, onMounted, watch, nextTick} from "vue";
import NotificationsCard from "@/components/NotificationsCard.vue";
import SearchDialog from "@/components/SearchDialog.vue";
import LoginDialog from "@/components/account/LoginDialog.vue";
import {get} from "@/services/serverConfig";

export default {
  components: {
    NotificationsCard,
    SearchDialog,
    LoginDialog,
  },
  async mounted() {
    this.s3BucketUrl = await get('s3.staticurl');
    // 获取scratchproxy.enabled配置
    this.proxyEnabled = await get('scratchproxy.enabled');
  },
  setup() {
    const notificationsCard = ref(null);

    onMounted(async () => {
      // 如果用户已登录，等待组件实例化后检查未读通知
      if (localuser.isLogin) {
        await nextTick();
        if (notificationsCard.value) {
          notificationsCard.value.checkUnreadNotifications();
        }
      }

    });

    return {
      notificationsCard,
      localuser,
      s3BucketUrl: '',
    };
  },
  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      drawer: true,
      drawerRail: true,
      isLogin: localuser.isLogin,
      items: this.initializeNavItems(),
      subNavItems: [],
      hideNavPaths: ["/app", "/404"],
      hideExactPaths: ["/", "/index.html"],
      activeTab: "notifications",
      isDarkTheme: false,
      theme: null,
      userTab: "profile",
      proxyEnabled: false,
      // 编辑器标签页相关
      showEditorTabs: false,
      activeEditorTab: null,
      editorTabs: [],
      tabIdCounter: 0
    };
  },
  created() {
    const drawerStatus = localStorage.getItem("drawerStatus");
    const drawerRailStatus = localStorage.getItem("drawerRailStatus");
    const savedTheme = localStorage.getItem("theme");

    this.drawer = drawerStatus === "true";
    this.drawerRail = drawerRailStatus === "true";
    this.updateSubNavItems(this.$route);

    // Initialize theme
    this.theme = useTheme();
    this.isDarkTheme = savedTheme === "dark";
    this.applyTheme();
  },
  watch: {
    userInfo() {
      this.$forceUpdate();
    },
    drawer(newVal) {
      localStorage.setItem("drawerStatus", newVal);
    },
    drawerRail(newVal) {
      localStorage.setItem("drawerRailStatus", newVal);
    },
    $route(to) {
      this.updateSubNavItems(to);
    },
    activeTab(newVal) {
      this.setSubNavItems(this.$route);
    },
    "localuser.isLogin"(newVal) {
      if (newVal && this.notificationsCard) {
        this.notificationsCard.checkUnreadNotifications();
      }
    },
    
    activeEditorTab(newTabId, oldTabId) {
      if (newTabId !== oldTabId) {
        const previousTab = this.editorTabs.find(tab => tab.id === oldTabId);
        const currentTab = this.editorTabs.find(tab => tab.id === newTabId);
        
        this.$emit('tab-switched', {
          from: previousTab,
          to: currentTab
        });
      }
    }
  },
  methods: {
    goHome() {
      if (this.$route.path === "/") {
        window.location.reload();
      } else {
        this.$router.push("/");
      }
    },
    checkNotifications() {
      if (this.notificationsCard) {
        this.notificationsCard.notificationsHandler.fetchNotifications();
      }
    },

    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      localStorage.setItem("theme", this.isDarkTheme ? "dark" : "light");
      this.applyTheme();
    },

    applyTheme() {
      if (this.theme) {
        this.theme.global.name = this.isDarkTheme ? "dark" : "light";
      }
    },

    initializeNavItems() {
      const items = {
        main: {
          title: "导航",
          icon: "mdi-menu",
          login: false,
          list: [
            {title: "首页", link: "/", icon: "mdi-home", login: false},
            {
              title: "仪表盘",
              link: "/app/dashboard",
              icon: "mdi-view-dashboard",
              login: true,
            },
            {
              title: "项目",
              link: "/app/explore",
              icon: "mdi-xml",
              login: false,
            },
            {title: "搜索", link: "/app/search", icon: "mdi-earth", login: false},
          ],
        },
        tools: {
          login: false,
          icon: "mdi-tools",
          title: "工具",
          list: [
            {
              title: "桌面版镜像",
              link: "/app/tools/asdm",
              icon: "mdi-download",
              login: false
            },
            {
              title: "项目比较器",
              link: "/app/tools/comparer",
              icon: "mdi-xml",
              login: false
            },
          ],
        },
      };

      // 只有当proxyEnabled为true时才添加mirror部分
      if (this.proxyEnabled) {
        items.mirror = {
          title: "镜像",
          icon: "mdi-link-variant",
          login: true,
          list: [
            {title: "首页", link: "/app/proxy", icon: "mdi-home", login: false},
            {title: "探索", link: "/app/proxy/explore", icon: "mdi-earth", login: false},
            {title: "搜索", link: "/app/proxy/search", icon: "mdi-xml", login: false},
            {title: "新闻", link: "/app/proxy/news", icon: "mdi-newspaper", login: false},
            {title: "打开", link: "/app/proxy/open", icon: "mdi-link", login: false},
          ],
        };
      }

      return items;
    },
    updateSubNavItems(route) {
      if (this.shouldHideNav(route.path)) {
        this.subNavItems = [];
        this.activeTab = null;
      } else {
        this.setSubNavItems(route);
      }
    },
    shouldHideNav(path) {
      return (
        this.hideNavPaths.some((hidePath) => path.startsWith(hidePath)) ||
        this.hideExactPaths.includes(path)
      );
    },
    setSubNavItems(route) {
      const pathSegments = route.path.split("/").filter(Boolean);
      if (this.shouldHideNav(route.path)) {
        this.subNavItems = [];
        this.activeTab = null;
      } else if (pathSegments.length === 1) {
        this.subNavItems = this.getUserSubNavItems(pathSegments[0]);
        this.activeTab = route.query.tab || "home";
      } else {
        this.subNavItems = this.getProjectSubNavItems(
          pathSegments[1],
          pathSegments[0]
        );
        this.activeTab = pathSegments[2] || "home";
      }
    },
    getUserSubNavItems(userId) {
      return [
        {title: "主页", link: `/${userId}`, name: "home"},
        {title: "评论", link: `/${userId}/?tab=comment`, name: "comment"},
        {title: "关注", link: `/${userId}/?tab=following`, name: "following"},
        {
          title: "关注者",
          link: `/${userId}/?tab=followers`,
          name: "followers",
        },
        {title: "时间线", link: `/${userId}/?tab=timeline`, name: "timeline"},
      ];
    },
    getProjectSubNavItems(projectname, authorname) {
      const isAuthor = localuser.user.value.username == authorname;
      return [
        {title: "代码", link: `/${authorname}/${projectname}`, name: "home"},
        {
          title: "分析",
          link: `/${authorname}/${projectname}/analytics`,
          name: "analytics",
        },
        ...(isAuthor
          ? [
            {
              title: "设置",
              link: `/${authorname}/${projectname}/settings`,
              name: "settings",
            },
          ]
          : []),
      ];
    },
    handleLoginSuccess(response) {
      // 刷新用户信息
      localuser.loadUser(true);
    },

    handleLoginError(error) {
      console.error('Login error:', error);
    },

    // 编辑器标签页管理方法
    enableEditorTabs() {
      this.showEditorTabs = true;
    },

    disableEditorTabs() {
      this.showEditorTabs = false;
      this.editorTabs = [];
      this.activeEditorTab = null;
    },

    addTab(tabConfig) {
      const tabId = `tab-${++this.tabIdCounter}`;
      const tab = {
        id: tabId,
        title: tabConfig.title || '未命名',
        icon: tabConfig.icon || 'mdi-file-document',
        type: tabConfig.type || 'editor', // editor, diff, view
        closeable: tabConfig.closeable !== false,
        modified: false,
        data: tabConfig.data || {}
      };
      
      this.editorTabs.push(tab);
      this.activeEditorTab = tabId;
      
      // 通知父组件标签页已创建
      this.$emit('tab-added', tab);
      
      return tab;
    },

    removeTab(tabId) {
      const index = this.editorTabs.findIndex(tab => tab.id === tabId);
      if (index !== -1) {
        const tab = this.editorTabs[index];
        
        // 通知父组件标签页即将被移除
        this.$emit('tab-removing', tab);
        
        this.editorTabs.splice(index, 1);
        
        // 如果被删除的是当前活动标签页，切换到下一个
        if (this.activeEditorTab === tabId) {
          if (this.editorTabs.length > 0) {
            // 优先选择下一个标签页，如果没有就选择前一个
            const nextIndex = index < this.editorTabs.length ? index : index - 1;
            this.activeEditorTab = this.editorTabs[nextIndex].id;
          } else {
            this.activeEditorTab = null;
          }
        }
        
        // 通知父组件标签页已被移除
        this.$emit('tab-removed', tab);
      }
    },

    closeTab(tabId) {
      const tab = this.editorTabs.find(t => t.id === tabId);
      if (tab && tab.modified) {
        // 如果有未保存的更改，弹出确认对话框
        if (confirm(`标签页 "${tab.title}" 有未保存的更改，确定要关闭吗？`)) {
          this.removeTab(tabId);
        }
      } else {
        this.removeTab(tabId);
      }
    },

    updateTab(tabId, updates) {
      const tab = this.editorTabs.find(t => t.id === tabId);
      if (tab) {
        Object.assign(tab, updates);
      }
    },

    setTabModified(tabId, modified = true) {
      this.updateTab(tabId, { modified });
    },

    getActiveTab() {
      return this.editorTabs.find(tab => tab.id === this.activeEditorTab);
    },

    switchToTab(tabId) {
      if (this.editorTabs.find(tab => tab.id === tabId)) {
        const previousTab = this.getActiveTab();
        this.activeEditorTab = tabId;
        const currentTab = this.getActiveTab();
        
        // 通知父组件标签页切换
        this.$emit('tab-switched', {
          from: previousTab,
          to: currentTab
        });
      }
    }
  },
  computed: {
    getPathSegments() {
      return decodeURIComponent(this.$route.path).split("/").filter(Boolean);
    },
    isProjectPath() {
      const pathSegments = this.getPathSegments;
      return (
        pathSegments.length >= 2 &&
        !this.hideNavPaths.some((path) => this.$route.path.startsWith(path))
      );
    },
    isAdminRoute() {
      return this.$route.path.startsWith('/app/admin');
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 编辑器标签页样式 */
.editor-tabs {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.editor-tab {
  min-width: 120px;
  max-width: 200px;
  text-transform: none;
  border-right: 1px solid rgba(var(--v-border-color), 0.12);
  position: relative;
}

.editor-tab--modified .tab-title::after {
  content: '●';
  color: rgb(var(--v-theme-warning));
  margin-left: 4px;
}

.editor-tab .close-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.editor-tab:hover .close-btn {
  opacity: 1;
}

.tab-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  font-size: 13px;
}
</style>
