<template>
  <v-app-bar :elevation="2" border>
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title><strong>ZeroCat</strong>Next</v-app-bar-title>
    <template #append>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item
            to="/"
            prepend-icon="mdi-home"
            title="首页"
            rounded="xl"
          ></v-list-item>
          <v-list-item
            :href="BASE_API"
            prepend-icon="mdi-web"
            title="本站后端"
            rounded="xl"
          ></v-list-item>
        </v-list>
      </v-menu>
      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <template v-if="localuser.isLogin">
            <v-btn icon v-bind="props">
              <v-avatar
                :image="
                  'https://s4-1.wuyuan.1r.ink/user/' + localuser.user.images
                "
              ></v-avatar>
            </v-btn>
          </template>
          <template v-else>
            <v-btn to="/app/account/login" text="登录" rounded="xl"></v-btn>
            <v-btn
              to="/app/account/register"
              text="注册"
              rounded="xl"
              color="primary"
              variant="tonal"
            ></v-btn>
          </template>
        </template>
        <v-card border style="padding: 10px">
          <v-card
            @click="localuser.loadUser(true)"
            :title="localuser.user.display_name"
            :subtitle="localuser.user.username"
            :append-avatar="
              'https://s4-1.wuyuan.1r.ink/user/' + localuser.user.avatar
            "
          ></v-card>
          <v-list>
            <v-list-item
              :to="`/${localuser.user.username}`"
              prepend-icon="mdi-account"
              title="个人主页"
              rounded="xl"
              color="primary"
            ></v-list-item>
            <v-list-item
              to="/app/account"
              prepend-icon="mdi-cog"
              title="账户设置"
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
              prepend-icon="mdi-xml"
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
        </v-card>
      </v-menu>
    </template>
    <template v-slot:extension v-if="subNavItems.length">
      <transition name="fade">
        <v-tabs align-tabs="center" v-model="activeTab">
          <div v-for="item in subNavItems" :key="item.name">
            <v-tab :to="item.link" :value="item.name">
              {{ item.title }}
            </v-tab>
          </div>
        </v-tabs>
      </transition>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :rail="drawerRail" expand-on-hover>
    <v-list v-for="lists in items" :key="lists.title">
      <div v-if="lists.login === false || lists.login === isLogin">
        <v-list-subheader>
          <v-icon :icon="lists.icon" size="small"></v-icon>
          {{ lists.title }}
        </v-list-subheader>
        <v-list-item
          v-for="item in lists.list"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.link"
          rounded="xl"
        ></v-list-item>
      </div>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item
        @click="drawerRail = !drawerRail"
        :prepend-icon="drawerRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        rounded="xl"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { localuser } from "@/middleware/userMiddleware";

export default {
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
    };
  },
  created() {
    const drawerStatus = localStorage.getItem("drawerStatus");
    const drawerRailStatus = localStorage.getItem("drawerRailStatus");

    this.drawer = drawerStatus === "true";
    this.drawerRail = drawerRailStatus === "true";
    this.updateSubNavItems(this.$route);
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
  },
  methods: {
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
            { title: "新作品", link: "/app/explore/new", icon: "mdi-plus" },
          ],
        },
        mirror: {
          title: "镜像",
          icon: "mdi-link-variant",
          login: true,
          list: [
            { title: "首页", link: "/app/proxy/", icon: "mdi-home" },
            { title: "探索", link: "/app/proxy/explore", icon: "mdi-earth" },
            { title: "搜索", link: "/app/proxy/search", icon: "mdi-xml" },
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
      ];
    },
    getProjectSubNavItems(projectname, authorname) {
      const isAuthor = this.localuser.user.username == authorname;
      return [
        { title: "代码", link: `/${authorname}/${projectname}`, name: "home" },
        ...(isAuthor
          ? [
              {
                title: "推送",
                link: `/${authorname}/${projectname}/push`,
                name: "push",
              },
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
