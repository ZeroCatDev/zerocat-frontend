<template>
  <v-app-bar :elevation="2" fixed >
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <template v-if="isProjectPath">
        <div class="d-flex align-center">
          <v-btn variant="text" :to="`/${getPathSegments[0]}`" class="text-none ">
            {{ getPathSegments[0] }}
          </v-btn>
          <span class="mx-1">/</span>
          <v-btn variant="text" :to="`/${getPathSegments[0]}/${getPathSegments[1]}`" class="text-none ">
            {{ getPathSegments[1] }}
          </v-btn>
        </div>
      </template>
      <template v-else>
        <strong>Zero</strong>Cat
      </template>
    </v-app-bar-title>
    <template #append>
      <v-btn icon="mdi-plus" to="/app/new"></v-btn>

      <v-btn :icon="isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme"></v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item to="/" prepend-icon="mdi-home" title="首页" rounded="xl"></v-list-item>
          <v-list-item :href="BASE_API" prepend-icon="mdi-web" title="本站后端" rounded="xl"></v-list-item>
        </v-list>
      </v-menu>

      <!-- Notification Menu -->
      <v-menu v-if="localuser.isLogin" :close-on-content-click="false" location="bottom">
        <template #activator="{ props, isActive }">
          <v-btn icon v-bind="props">
            <v-badge color="error" dot :model-value="hasUnreadNotifications">
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <notification-menu :menu-open="true" @update:unread-count="updateUnreadCount" />
      </v-menu>

      <!-- User Menu -->
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <template v-if="localuser.isLogin">
            <v-btn icon v-bind="props">
              <v-avatar :image="VITE_APP_S3_BUCKET + '/user/' + localuser.user.images
                "></v-avatar>
            </v-btn>
          </template>
          <template v-else>
            <v-btn to="/app/account/login" text="登录" rounded="xl"></v-btn>
            <v-btn to="/app/account/register" text="注册" rounded="xl" color="primary" variant="tonal"></v-btn>
          </template>
        </template>
        <v-card border style="padding: 10px">
          <v-card @click="localuser.loadUser(true)" :title="localuser.user.display_name"
            :subtitle="localuser.user.username" :append-avatar="VITE_APP_S3_BUCKET + '/user/' + localuser.user.avatar
              "></v-card>
          <v-list>
            <v-list-item :to="`/${localuser.user.username}`" prepend-icon="mdi-account" title="个人主页" rounded="xl"
              color="primary"></v-list-item>
            <v-list-item to="/app/account" prepend-icon="mdi-cog" title="设置" rounded="xl" color="primary"></v-list-item>
            <v-list-item to="/app/project" prepend-icon="mdi-xml" title="项目" rounded="xl" color="primary"></v-list-item>
            <v-list-item to="/app/projectlist" prepend-icon="mdi-format-list-bulleted" title="列表" rounded="xl"
              color="primary"></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item to="/app/account/logout" prepend-icon="mdi-logout" title="退出" color="error" active
              variant="plain" rounded="xl"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
    <template v-slot:extension v-if="subNavItems.length">
      <transition name="fade">
        <v-tabs align-tabs="center" v-model="activeTab">
          <div v-for="item in subNavItems" :key="item.name">
            <v-tab :to="item.link" :value="item.name" :disabled="item.disabled" rounded="lg">
              {{ item.title }}
            </v-tab>
          </div>
        </v-tabs>
      </transition>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :rail="drawerRail" expand-on-hover >
    <v-list v-for="lists in items" :key="lists.title">
      <div v-if="lists.login === false || lists.login === isLogin">
        <v-list-subheader>
          <v-icon :icon="lists.icon" size="small"></v-icon>
          {{ lists.title }}
        </v-list-subheader>
        <v-list-item v-for="item in lists.list" :key="item.title" :prepend-icon="item.icon" :title="item.title"
          :to="item.link" rounded="xl"></v-list-item>
      </div>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item @click="drawerRail = !drawerRail"
        :prepend-icon="drawerRail ? 'mdi-chevron-right' : 'mdi-chevron-left'" rounded="xl"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { localuser } from "@/services/localAccount";
import { useTheme } from 'vuetify';
import { ref, onMounted } from 'vue';
import { getNotifications } from '@/services/notificationService';
import NotificationMenu from '@/components/NotificationMenu.vue';

export default {
  components: {
    NotificationMenu
  },
  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      localuser,
      drawer: true,
      drawerRail: true,
      isLogin: localuser.isLogin,
      items: this.initializeNavItems(),
      subNavItems: [],
      hideNavPaths: ["/app", "/404"],
      hideExactPaths: ["/", "/index.html"],
      activeTab: "1",
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
      isDarkTheme: false,
      theme: null,
      hasUnreadNotifications: false,
      unreadNotificationsCount: 0,
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

    // Check for unread notifications if user is logged in
    if (this.localuser.isLogin) {
      this.checkUnreadNotifications();
    }
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
    'localuser.isLogin'(newVal) {
      if (newVal) {
        this.checkUnreadNotifications();
      }
    }
  },
  methods: {
    updateUnreadCount(count) {
      this.unreadNotificationsCount = count;
      this.hasUnreadNotifications = count > 0;
    },

    async checkUnreadNotifications() {
      try {
        const data = await getNotifications();
        const unreadCount = data.notifications.filter(n => !n.read).length;
        this.hasUnreadNotifications = unreadCount > 0;
        this.unreadNotificationsCount = unreadCount;
      } catch (error) {
        console.error('Error checking unread notifications:', error);
      }
    },

    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      localStorage.setItem("theme", this.isDarkTheme ? "dark" : "light");
      this.applyTheme();
    },

    applyTheme() {
      if (this.theme) {
        this.theme.global.name = this.isDarkTheme ? 'dark' : 'light';
      }
    },

    initializeNavItems() {
      return {
        main: {
          title: "导航",
          icon: "mdi-menu",
          login: false,
          list: [
            { title: "首页", link: "/", icon: "mdi-home" },
            { title: "项目", link: "/app/explore", icon: "mdi-xml" },
            { title: "搜索", link: "/app/algolia", icon: "mdi-earth" },
          ],
        },
        mirror: {
          title: "镜像",
          icon: "mdi-link-variant",
          login: true,
          list: [
            { title: "首页", link: "/app/proxy", icon: "mdi-home" },
            { title: "探索", link: "/app/proxy/explore", icon: "mdi-earth" },
            { title: "搜索", link: "/app/proxy/search", icon: "mdi-xml" },
            { title: "新闻", link: "/app/proxy/news", icon: "mdi-newspaper" },

            { title: "打开", link: "/app/proxy/open", icon: "mdi-link" },
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
            },
            {
              title: "项目比较器",
              link: "/app/tools/comparer",
              icon: "mdi-xml",
            },
          ],
        },
      };
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
        { title: "关注者", link: `/${userId}/?tab=followers`, name: "followers" },
        { title: "时间线", link: `/${userId}/?tab=timeline`, name: "timeline" },

      ];
    },
    getProjectSubNavItems(projectname, authorname) {
      const isAuthor = localuser.user.value.username == authorname;
      return [
        { title: "代码", link: `/${authorname}/${projectname}`, name: "home" },
        {
          title: "分叉",
          link: `/${authorname}/${projectname}/fork`,
          name: "fork",
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
  },
  computed: {
    getPathSegments() {
      return this.$route.path.split('/').filter(Boolean);
    },
    isProjectPath() {
      const pathSegments = this.getPathSegments;
      return pathSegments.length >= 2 && !this.hideNavPaths.some(path => this.$route.path.startsWith(path));
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
