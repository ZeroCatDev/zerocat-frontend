<template>
 <v-navigation-drawer expand-on-hover rail v-model="drawer">
    <v-list>
      <v-list-item :prepend-avatar="'https://s4-1.wuyuan.1r.ink/user/'+userinfo.avatar" :subtitle="userinfo.username" :href="'/user?id='+userinfo.userid"
        :title="userinfo.display_name"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home" title="首页" value="home" href="/"></v-list-item>
      <v-list-item prepend-icon="mdi-xml" title="项目" value="projects" href="/projects"></v-list-item>

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
import userinfo from '@/stores/user';
export default {
  data: () => ({
    userinfo: userinfo.user,
    drawer: true,
  }),
}
</script>
