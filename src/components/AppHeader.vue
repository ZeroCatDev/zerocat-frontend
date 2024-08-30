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
          <v-list-item href="https://zerocat.houlangs.com" prepend-icon="mdi-web" title="原站点" rounded="xl">
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item v-if="islogin == true" :prepend-avatar="'https://s4-1.wuyuan.1r.ink/user/' + userinfo.avatar"
        rounded="xl" :subtitle="userinfo.username" :to="'/user/' + userinfo.userid"
        :title="userinfo.display_name"></v-list-item>
      <v-list-item v-else prepend-icon="mdi-account" subtitle="登录" to="/account/login" rounded="xl"
        title="登录 ZeroCat 账户"></v-list-item>

    </v-list>
    <v-divider></v-divider>
    <v-list>


      <v-list-subheader>导航</v-list-subheader>

      <v-list-item rounded="xl" prepend-icon="mdi-home" title="首页" value="home" to="/"></v-list-item>
      <v-list-item rounded="xl" prepend-icon="mdi-xml" title="项目" value="projects" to="/projects"></v-list-item>
      <v-list-item rounded="xl" prepend-icon="mdi-plus" title="新作品" value="projects"
        @click="$refs.NewProjectDialog.show()" v-if="islogin == true"></v-list-item>
      <div v-if="islogin == true"> <v-list-subheader>Mirror！</v-list-subheader>
        <v-list-item rounded="xl" prepend-icon="mdi-home" title="首页" value="home" to="/proxy/"></v-list-item>

        <v-list-item rounded="xl" prepend-icon="mdi-earth" title="探索" value="home" to="/proxy/explore"></v-list-item>
        <v-list-item rounded="xl" prepend-icon="mdi-xml" title="搜索" value="projects" to="/proxy/search"></v-list-item>
      </div>
      <div v-if="islogin == true">
        <v-list-subheader>账户</v-list-subheader>

        <v-list-item rounded="xl" prepend-icon="mdi-cog" title="账户设置" value="account" to="/account"></v-list-item>
        <v-list-item rounded="xl" prepend-icon="mdi-xml" title="我的项目" value="myprojects"
          to="/projects/my"></v-list-item>

        <v-list-item rounded="xl" prepend-icon="mdi-export" :title="logoutbutton" value="logout"
          @click="trylogout"></v-list-item>

      </div>

    </v-list>
  </v-navigation-drawer>
  <NewProjectDialog ref="NewProjectDialog" />
</template>

<script>
import NewProjectDialog from '@/components/NewProjectDialog.vue'
import { localuser } from '@/stores/user';
export default {
  components: { NewProjectDialog },
  data: () => ({
    localuser: localuser,
    userinfo: localuser.user,
    drawer: true,
    islogin: localuser.islogin,
    clicklogout: 0,
    logoutbutton: '退出',
    urltoken: '',
  }),
  watch: {
    userinfo(newName, oldName) {
      this.$forceUpdate()
    }
  },
  methods: {
    trylogout() {

      console.log(111)
      if (this.clicklogout == 1) {
        this.$router.push('/account/logout')
        this.clicklogout = 0
        this.logoutbutton = '退出'

      } else {
        this.clicklogout = this.clicklogout + 1

        this.logoutbutton = '再点一次退出'
      }

    }
  }
}
</script>
