<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>ZeroCatNext</v-app-bar-title>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
          <v-list-item to="/" prepend-icon="mdi-home" title="首页" rounded="xl">
          </v-list-item>
          <v-list-item
            href="https://zerocat.houlangs.com"
            prepend-icon="mdi-web"
            title="原站点"
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
        v-if="islogin == true"
        :prepend-avatar="'https://s4-1.wuyuan.1r.ink/user/' + userinfo.avatar"
        rounded="xl"
        :subtitle="userinfo.username"
        :to="'/user/' + userinfo.userid"
        :title="userinfo.display_name"
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
    </v-list>
  </v-navigation-drawer>
  <NewProjectDialog ref="NewProjectDialog" />
</template>

<script>
import NewProjectDialog from "@/components/NewProjectDialog.vue";
import Algolia from "@/pages/algolia.vue";
import { localuser } from "@/stores/user";
export default {
  components: { NewProjectDialog },
  data: () => ({
    localuser: localuser,
    userinfo: localuser.user,
    drawer: true,
    islogin: localuser.islogin,
    clicklogout: 0,
    logoutbutton: "退出",
    urltoken: "",
    algolia_AppId: import.meta.env.VITE_APP_ALGOLIA_APP_ID,
    items: {
      main: {
        title: "导航",
        list: [
          { title: "首页", link: "/", icon: "mdi-home" },
          { title: "项目", link: "/projects", icon: "mdi-xml" },
          { title: "搜索", link: "/algolia", icon: "mdi-earth" },
          { title: "新作品", link: "/projects/new", icon: "mdi-plus" },
        ],
      },
      mirror: {
        title: "镜像",
        list: [
          { title: "首页", link: "/proxy/", icon: "mdi-home" },
          { title: "探索", link: "/proxy/explore", icon: "mdi-earth" },
          { title: "搜索", link: "/proxy/search", icon: "mdi-xml" },
          { title: "打开", link: "/proxy/open", icon: "mdi-link" },
        ],
      },
      account: {
        title: "账户",
        list: [
          { title: "账户设置", link: "/account", icon: "mdi-cog" },
          { title: "我的项目", link: "/projects/my", icon: "mdi-xml" },
          { title: "我的列表", link: "/projectlist", icon: "mdi-xml" },
          { title: "退出", link: "/account/logout", icon: "mdi-export" },
        ],
      },
      tools: {
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
    userinfo(newName, oldName) {
      this.$forceUpdate();
    },
    drawer(newVal) {
      // 当 drawer 状态发生变化时，将状态存入localStorage
      localStorage.setItem("drawerStatus", newVal);
    },
  },
  methods: {
    trylogout() {
      console.log(111);
      if (this.clicklogout == 1) {
        this.$router.push("/account/logout");
        this.clicklogout = 0;
        this.logoutbutton = "退出";
      } else {
        this.clicklogout = this.clicklogout + 1;

        this.logoutbutton = "再点一次退出";
      }
    },
  },
};
</script>
