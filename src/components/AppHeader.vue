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
          <template v-if="isLogin">
            <v-btn icon v-bind="props">
              <v-avatar :image="'https://s4-1.wuyuan.1r.ink/user/'+userInfo.avatar"></v-avatar>
            </v-btn>
          </template>
          <template v-else>
            <v-btn to="/account/login" text="登录" rounded="xl"></v-btn>
            <v-btn
              to="/account/register"
              text="注册"
              rounded="xl"
              color="primary"
              variant="tonal"
            ></v-btn>
          </template>
        </template>
        <v-card border style="padding: 10px">
          <v-card
            :title="userInfo.display_name"
            :subtitle="userInfo.username"
            :append-avatar="'https://s4-1.wuyuan.1r.ink/user/'+userInfo.avatar"
          ></v-card>
          <v-list>
            <v-list-item
              :to="`/user/${userInfo.userid}`"
              prepend-icon="mdi-account"
              title="个人主页"
              rounded="xl"
              color="primary"
            ></v-list-item>
            <v-list-item
              to="/account"
              prepend-icon="mdi-cog"
              title="账户设置"
              rounded="xl"
              color="primary"
            ></v-list-item>
            <v-list-item
              to="/projects/my"
              prepend-icon="mdi-xml"
              title="项目"
              rounded="xl"
              color="primary"
            ></v-list-item>
            <v-list-item
              to="/projectlist"
              prepend-icon="mdi-xml"
              title="列表"
              rounded="xl"
              color="primary"
            ></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              to="/account/logout"
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
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :rail="drawerRail" expand-on-hover>
    <v-list v-for="lists in items" :key="lists">
      <div v-if="lists.login === false || lists.login === isLogin">
        <v-list-subheader>
          <v-icon :icon="lists.icon" size="small"></v-icon>
        </v-list-subheader>
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
import { localuser } from "@/stores/user";

export default {
  data() {
    return {
      BASE_API: import.meta.env.VITE_APP_BASE_API,
      localuser,
      userInfo: localuser.user,
      drawer: true,
      drawerRail: true,
      isLogin: localuser.islogin,
      items: {
        main: {
          title: "导航",
          icon: "mdi-menu",
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
          icon: "mdi-link-variant",
          login: true,
          list: [
            { title: "首页", link: "/proxy/", icon: "mdi-home" },
            { title: "探索", link: "/proxy/explore", icon: "mdi-earth" },
            { title: "搜索", link: "/proxy/search", icon: "mdi-xml" },
            { title: "打开", link: "/proxy/open", icon: "mdi-link" },
          ],
        },
        tools: {
          login: false,
          icon: "mdi-tools",
          title: "工具",
          list: [
            { title: "桌面版镜像", link: "/tools/asdm", icon: "mdi-download" },
            { title: "项目比较器", link: "/tools/comparer", icon: "mdi-xml" },
          ],
        },
      },
    };
  },
  created() {
    // 在组件创建时检查localStorage中的状态
    const drawerStatus = localStorage.getItem("drawerStatus");
    const drawerRailStatus = localStorage.getItem("drawerRailStatus");

    this.drawer = drawerStatus === "true"; // 根据存储的值设置drawer
    this.drawerRail = drawerRailStatus === "true"; // 根据存储的值设置drawerRail
  },
  watch: {
    userInfo(newName, oldName) {
      this.$forceUpdate();
    },
    drawer(newVal) {
      // 当 drawer 状态发生变化时，将状态存入localStorage
      localStorage.setItem("drawerStatus", newVal);
    },
    drawerRail(newVal) {
      // 当 drawerRail 状态发生变化时，将状态存入localStorage
      localStorage.setItem("drawerRailStatus", newVal);
    },
  },
  methods: {
    tryLogout() {
      if (this.clickLogout === 1) {
        this.$router.push("/account/logout");
        this.clickLogout = 0;
        this.logoutButton = "退出";
      } else {
        this.clickLogout += 1;

        this.logoutButton = "再点一次退出";
      }
    },
  },
};
</script>

