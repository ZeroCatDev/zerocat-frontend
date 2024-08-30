<template>
  <v-container>
    <div class="mb-2">
      <v-card class="mx-auto" :disabled="UserCardLoading" :loading="UserCardLoading">
        <template v-slot:prepend>
          <v-avatar class="mb-2">
            <v-img :alt="userinfo.username" :src="this.scratch_proxy +'/avatars/'+ userinfo.id
              "></v-img>
          </v-avatar>
        </template>
        <template v-slot:title>
          <span class="font-weight-black">{{
           userinfo.username
          }}</span>
        </template>
        <template v-slot:loader="{ isActive }">
          <v-progress-linear :active="isActive" height="4" indeterminate></v-progress-linear>
        </template>
        <template v-slot:subtitle>
          <v-chip>
            <v-icon icon="mdi-account-circle" start></v-icon>

            ID:{{ userinfo.id }}
          </v-chip>
          <v-chip>
            <v-icon icon="mdi-clock" start></v-icon>

            {{ userinfo.history.joined }}注册
          </v-chip>
          <v-chip>
            <v-icon icon="mdi-tag" start></v-icon>

            {{scratchteam ? "Scratch Team" : "普通用户"}}</v-chip>  <v-chip>
            <v-icon icon="mdi-earth" start></v-icon>

            {{userinfo.profile.country}}</v-chip>
          <span class=""></span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
          {{ userinfo.profile.status }}
        </v-card-text>
        <v-card-text class="bg-surface-light pt-4">
          {{ userinfo.profile.bio }}
        </v-card-text>
      </v-card>
    </div>
    <!--<Projects :authorid="userid" ref="Projects" showinfo="true"></Projects>-->

    <div id="waline"></div>
  </v-container>
</template>

<script>
import request from "../../../axios/axios";
import { init } from "@waline/client";
import Projects from "../../../components/Projects.vue";

import "@waline/client/style";
export default {
  components: { Projects },

  data() {
    return {
      UserCardLoading: true,
      userid: this.$route.params.id,
      userinfo: {
        id: 1,
        username: "加载中",
        scratchteam: false,
        history: {
          joined: "2021-06-20T01:01:52.000Z",
        },
        profile: {
          id: 77777952,
          images: {
            "90x90":
              "https://cdn2.scratch.mit.edu/get_image/user/78738602_90x90.png?v=",
            "60x60":
              "https://cdn2.scratch.mit.edu/get_image/user/78738602_60x60.png?v=",
            "55x55":
              "https://cdn2.scratch.mit.edu/get_image/user/78738602_55x55.png?v=",
            "50x50":
              "https://cdn2.scratch.mit.edu/get_image/user/78738602_50x50.png?v=",
            "32x32":
              "https://cdn2.scratch.mit.edu/get_image/user/78738602_32x32.png?v=",
          },
          status: "加载中",
          bio: "加载中",
          country: "加载中",
        },
      },
      projects: [],
      scratchcount: 0,
      curPage: 1,
      totalPage: 1,
      limit: 8,

      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
    };
  },

  async created() {
    await this.getuserinfo();
    init({
      el: "#waline",
      serverURL: "https://zerocat-waline.190823.xyz",
      path: "scratchmiuedu-user-" + this.$route.params.id || "undefined",
      copyright: false,
      reaction: true,
      pageview: true,
      locale: {
        reactionTitle: "这个用户怎么样？",
      },
      emoji: [
        "//unpkg.com/@waline/emojis@1.1.0/weibo",
        "//unpkg.com/@waline/emojis@1.1.0/bilibili",
      ],
      dark:
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    });
    this.$message({
      message: "Hello",
      color: "success",
    });
  },
  methods: {
    async getuserinfo() {
      this.userinfo = await request({
        url: this.scratch_proxy + "/users/" + this.$route.params.username,
        method: "get",
      });
      //this.$refs.Projects.onPageChange(1);

      this.UserCardLoading = false;
      console.log(this.userinfo);
    },
  },
};
</script>
