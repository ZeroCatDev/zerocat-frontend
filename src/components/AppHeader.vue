<template>
  <v-app-bar :elevation="2" border>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title><strong>ZeroCat</strong>Next</v-app-bar-title>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item to="/" prepend-icon="mdi-home" title="首页" rounded="xl">
          </v-list-item>
          <v-list-item
            :href="BASE_API"
            prepend-icon="mdi-web"
            title="本站后端"
            rounded="xl"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item
        v-if="isLogin == true"
        :prepend-avatar="'https://s4-1.wuyuan.1r.ink/user/' + userInfo.avatar"
        rounded="xl"
        :subtitle="userInfo.username"
        :to="'/user/' + userInfo.userid"
        :title="userInfo.display_name"
      ></v-list-item>
      <v-list-item
        v-else
        prepend-icon="mdi-account"
        subtitle="登录"
        to="/account/login"
        rounded="xl"
        title="登录 ZeroCat 账户"
      ></v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list v-for="lists in items" :key="lists">
      <div v-if="lists.login == false || lists.login == localuser.islogin">
        <v-list-subheader>{{ lists.title }}</v-list-subheader>
        <v-list-item
          v-for="item in lists.list"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.link"
          :to="item.link"
          rounded="xl"
        ></v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { localuser } from "@/stores/user";
export default {
  data: () => ({
    BASE_API:import.meta.env.VITE_APP_BASE_API,
    localuser: localuser,
    userInfo: localuser.user,
    drawer: true,
    isLogin: localuser.islogin,
    clickLogout: 0,
    logoutButton: "退出",
    urltoken: "",
    algolia_AppId: import.meta.env.VITE_APP_ALGOLIA_APP_ID,
    items: {
      main: {
        title: "导航",
        login: false,
        list: [
          { title: "首页", link: "/", icon: "mdi-home" },
          { title: "项目", link: "/projects", icon: "mdi-xml" },
          { title: "搜索", link: "/algolia", icon: "mdi-earth" },
          { title: "新作品", link: "/projects/new", icon: "mdi-plus" },
        ],
      },
      mirror: {
        title: "镜像",
        login: true,
        list: [
          { title: "首页", link: "/proxy/", icon: "mdi-home" },
          { title: "探索", link: "/proxy/explore", icon: "mdi-earth" },
          { title: "搜索", link: "/proxy/search", icon: "mdi-xml" },
          { title: "打开", link: "/proxy/open", icon: "mdi-link" },
        ],
      },
      account: {
        login: true,
        title: "账户",
        list: [
          { title: "账户设置", link: "/account", icon: "mdi-cog" },
          { title: "我的项目", link: "/projects/my", icon: "mdi-xml" },
          { title: "我的列表", link: "/projectlist", icon: "mdi-xml" },
          { title: "退出", link: "/account/logout", icon: "mdi-export" },
        ],
      },
      tools: {
        login: false,

        title: "工具",
        list: [
          { title: "桌面版镜像", link: "/tools/asdm", icon: "mdi-download" },
          { title: "项目比较器", link: "/tools/comparer", icon: "mdi-xml" },
        ],
      },
    },
  }),
  created() {
    // 在组件创建时检查localStorage中的状态
    const drawerStatus = localStorage.getItem("drawerStatus");
    this.drawer = drawerStatus === "true"; // 根据存储的值设置drawer
  },
  watch: {
    userInfo(newName, oldName) {
      this.$forceUpdate();
    },
    drawer(newVal) {
      // 当 drawer 状态发生变化时，将状态存入localStorage
      localStorage.setItem("drawerStatus", newVal);
    },
  },
  methods: {
    tryLogout() {
      if (this.clickLogout == 1) {
        this.$router.push("/account/logout");
        this.clickLogout = 0;
        this.logoutButton = "退出";
      } else {
        this.clickLogout = this.clickLogout + 1;

        this.logoutButton = "再点一次退出";
      }
    },
  },
};
</script>
