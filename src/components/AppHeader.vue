<template>
  <v-app-bar :elevation="2" fixed>
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-btn variant="text" icon @click="goHome" :active="false">
      <v-icon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="100" fill="#FFFFFF"></circle>
          <path
            d="M38 162.867L100.5 100.367L100.5 162.867L38 162.867ZM163 100.367L100.5 100.367L100.5 162.867L163 100.367Z"
            fill-rule="evenodd"
            fill="#415F91"
          ></path>
          <path
            d="M38 100.367L100.5 37.8672L100.5 100.367L38 100.367ZM163 37.8672L100.5 37.8672L100.5 100.367L163 37.8672Z"
            fill-rule="evenodd"
            fill="#8EACE3"
          ></path>
        </svg>
      </v-icon>
    </v-btn>
    <v-app-bar-title>
      <template v-if="isProjectPath">
        <div class="d-flex align-center">
          <v-btn
            variant="text"
            :to="`/${getPathSegments[0]}`"
            class="text-none"
          >
            {{ getPathSegments[0] }}
          </v-btn>
          <span class="mx-1">/</span>
          <v-btn
            variant="text"
            :to="`/${getPathSegments[0]}/${getPathSegments[1]}`"
            class="text-none"
          >
            {{ getPathSegments[1] }}
          </v-btn>
        </div>
      </template>
      <template v-else> <strong>Zero</strong>Cat </template>
    </v-app-bar-title>
    <template #append>
      <SearchDialog />
      <v-btn icon="mdi-plus" to="/app/new"></v-btn>
      <v-menu :close-on-content-click="false" location="bottom">
        <template #activator="{ props, isActive }"
          ><template v-if="localuser.isLogin.value">
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
            <LoginDialog @login-success="handleLoginSuccess" @login-error="handleLoginError" />
            <v-btn
              to="/app/account/register"
              text="注册"
              rounded="xl"
              color="primary"
              variant="tonal"
            ></v-btn>
          </template>
        </template>
        <v-card border min-width="300px">
          <v-tabs v-model="userTab" grow>
            <v-tab value="notifications">
              <v-icon start>mdi-bell</v-icon>
              通知
              <v-badge
                v-if="unreadCount > 0"
                :content="unreadCount"
                color="error"
                floating
                dot
              ></v-badge>
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
                  :menuMode="true"
                  :showHeader="false"
                  :maxHeight="'auto'"
                >
                </NotificationsCard>
              </v-window-item>

              <!-- 个人资料选项卡内容 -->
              <v-window-item value="profile">
                <v-card
                  @click="localuser.loadUser(true)"
                  :title="localuser.user.value.display_name"
                  :subtitle="localuser.user.value.username"
                  :append-avatar="
                    s3BucketUrl + '/user/' + localuser.user.value.avatar
                  "
                ></v-card>
                <v-list>
                  <v-list-item
                    :to="`/${localuser.user.value.username}`"
                    prepend-icon="mdi-account"
                    title="个人主页"
                    rounded="xl"
                    color="primary"
                  ></v-list-item>
                  <v-list-item
                    to="/app/account"
                    prepend-icon="mdi-cog"
                    title="设置"
                    rounded="xl"
                    color="primary"
                  ></v-list-item>
                  <v-list-item
                    to="/app/project"
                    prepend-icon="mdi-xml"
                    title="项目"
                    rounded="xl"
                    color="primary"
                  ></v-list-item>
                  <v-list-item
                    to="/app/projectlist"
                    prepend-icon="mdi-format-list-bulleted"
                    title="列表"
                    rounded="xl"
                    color="primary"
                  ></v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item
                    to="/app/account/logout"
                    prepend-icon="mdi-logout"
                    title="退出"
                    color="error"
                    active
                    variant="plain"
                    rounded="xl"
                  ></v-list-item>
                </v-list>
              </v-window-item>
            </v-window> </v-card-text
        ></v-card>
      </v-menu>
    </template>
    <template v-slot:extension v-if="subNavItems.length">
      <transition name="fade">
        <v-tabs align-tabs="center" v-model="activeTab">
          <div v-for="item in subNavItems" :key="item.name">
            <v-tab
              :to="item.link"
              :value="item.name"
              :disabled="item.disabled"
              rounded="lg"
            >
              {{ item.title }}
            </v-tab>
          </div>
        </v-tabs>
      </transition>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :rail="drawerRail" expand-on-hover v-if="!isAdminRoute">
    <!-- 导航部分 -->
    <v-list>
      <v-list-subheader>
        <v-icon icon="mdi-menu" size="small"></v-icon>
        导航
      </v-list-subheader>

      <v-list-item
        to="/"
        prepend-icon="mdi-home"
        title="首页"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        v-if="localuser.isLogin"
        to="/app/dashboard"
        prepend-icon="mdi-view-dashboard"
        title="仪表盘"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/explore"
        prepend-icon="mdi-xml"
        title="项目"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/search"
        prepend-icon="mdi-earth"
        title="搜索"
        rounded="xl"
      ></v-list-item>
    </v-list>

    <!-- 镜像部分 -->
    <v-list v-if="proxyEnabled">
      <v-list-subheader>
        <v-icon icon="mdi-link-variant" size="small"></v-icon>
        镜像
      </v-list-subheader>

      <v-list-item
        to="/app/proxy"
        prepend-icon="mdi-home"
        title="首页"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/proxy/explore"
        prepend-icon="mdi-earth"
        title="探索"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/proxy/search"
        prepend-icon="mdi-xml"
        title="搜索"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/proxy/news"
        prepend-icon="mdi-newspaper"
        title="新闻"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/proxy/open"
        prepend-icon="mdi-link"
        title="打开"
        rounded="xl"
      ></v-list-item>
    </v-list>

    <!-- 工具部分 -->
    <v-list>
      <v-list-subheader>
        <v-icon icon="mdi-tools" size="small"></v-icon>
        工具
      </v-list-subheader>

      <v-list-item
        to="/app/tools/asdm"
        prepend-icon="mdi-download"
        title="桌面版镜像"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/tools/comparer"
        prepend-icon="mdi-xml"
        title="项目比较器"
        rounded="xl"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!-- 主题和抽屉控制 -->
    <v-list>
      <v-list-item
        @click="toggleTheme"
        :prepend-icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        rounded="xl"
      ></v-list-item>
      <v-list-item
        @click="drawerRail = !drawerRail"
        :prepend-icon="drawerRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        rounded="xl"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer v-model="drawer" :rail="drawerRail" expand-on-hover v-else>
    <v-list>
      <v-list-item
        to="/"
        prepend-icon="mdi-arrow-left"
        title="返回"
        rounded="xl"
      ></v-list-item>
      <v-list-subheader>
        <v-icon icon="mdi-shield" size="small"></v-icon>
        管理
      </v-list-subheader>

      <v-list-item
        to="/app/admin/users"
        prepend-icon="mdi-account-group"
        title="用户管理"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/admin/project"
        prepend-icon="mdi-xml"
        title="项目管理"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/admin/config"
        prepend-icon="mdi-cog"
        title="系统设置"
        rounded="xl"
      ></v-list-item>

      <v-list-item
        to="/app/admin/sitemap"
        prepend-icon="mdi-sitemap"
        title="站点地图"
        rounded="xl"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <!-- 主题和抽屉控制 -->
    <v-list>
      <v-list-item
        @click="toggleTheme"
        :prepend-icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        rounded="xl"
      ></v-list-item>
      <v-list-item
        @click="drawerRail = !drawerRail"
        :prepend-icon="drawerRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        rounded="xl"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { localuser } from "@/services/localAccount";
import { useTheme } from "vuetify";
import { ref, onMounted, watch, nextTick } from "vue";
import NotificationsCard from "@/components/NotificationsCard.vue";
import SearchDialog from "@/components/SearchDialog.vue";
import LoginDialog from "@/components/account/LoginDialog.vue";
import { get } from "@/services/serverConfig";

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
            { title: "首页", link: "/", icon: "mdi-home" , login: false },
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
            { title: "搜索", link: "/app/search", icon: "mdi-earth", login: false },
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
            { title: "首页", link: "/app/proxy", icon: "mdi-home", login: false  },
            { title: "探索", link: "/app/proxy/explore", icon: "mdi-earth" , login: false },
            { title: "搜索", link: "/app/proxy/search", icon: "mdi-xml" , login: false },
            { title: "新闻", link: "/app/proxy/news", icon: "mdi-newspaper" , login: false },
            { title: "打开", link: "/app/proxy/open", icon: "mdi-link" , login: false },
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
        { title: "主页", link: `/${userId}`, name: "home" },
        { title: "评论", link: `/${userId}/?tab=comment`, name: "comment" },
        { title: "关注", link: `/${userId}/?tab=following`, name: "following" },
        {
          title: "关注者",
          link: `/${userId}/?tab=followers`,
          name: "followers",
        },
        { title: "时间线", link: `/${userId}/?tab=timeline`, name: "timeline" },
      ];
    },
    getProjectSubNavItems(projectname, authorname) {
      const isAuthor = localuser.user.value.username == authorname;
      return [
        { title: "代码", link: `/${authorname}/${projectname}`, name: "home" },
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
  },
  computed: {
    getPathSegments() {
      return this.$route.path.split("/").filter(Boolean);
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
</style>
