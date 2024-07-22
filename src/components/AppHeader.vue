<template>
 <v-navigation-drawer expand-on-hover rail v-model="drawer">
    <v-list>
      <v-list-item v-if="islogin==true" :prepend-avatar="'https://s4-1.wuyuan.1r.ink/user/'+userinfo.avatar" :subtitle="userinfo.username"  :to="'/user/'+userinfo.userid"
        :title="userinfo.display_name"></v-list-item>
        <v-list-item v-else prepend-icon="mdi-account" subtitle="登录" to="/account/login"
        title="登录 ZeroCat 账户"></v-list-item>

    </v-list>    <v-divider></v-divider>
      <v-list>
    <v-list-item prepend-icon="mdi-cog" title="账户设置" value="account" to="/account"></v-list-item>
    <v-list-item prepend-icon="mdi-xml" title="我的项目" value="myprojects" to="/projects/my"></v-list-item>

    <v-list-item v-if="islogin==true"  prepend-icon="mdi-export" title="退出" value="logout" to="/account/logout"></v-list-item>

</v-list>
    <v-divider></v-divider>

    <v-list >
      <v-list-item prepend-icon="mdi-home" title="首页" value="home" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-xml" title="项目" value="projects" to="/projects"></v-list-item>

    </v-list>
  </v-navigation-drawer>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>ZeroCatNext</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-heart"></v-btn>

      <v-btn icon="mdi-magnify"></v-btn>

      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
  </v-app-bar>


</template>

<script>
import user from '@/stores/user';
export default {
  data: () => ({
    userinfo: user.user,
    drawer: true,
    islogin: user.islogin,
  }),
}
</script>
