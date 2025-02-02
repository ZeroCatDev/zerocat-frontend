<template>
  <v-container>
    <div class="mb-2">
      <v-card
        class="mx-auto mb-4"
        :disabled="UserCardLoading"
        :loading="UserCardLoading"
      >
        <template v-slot:prepend>
          <v-avatar class="mb-2">
            <v-img
              :alt="userinfo.username"
              :src="this.scratch_proxy + '/avatars/' + userinfo.id"
            ></v-img>
          </v-avatar>
        </template>
        <template v-slot:title>
          <span class="font-weight-black">{{ userinfo.username }}</span>
        </template>
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            height="4"
            indeterminate
          ></v-progress-linear>
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

            {{ scratchteam ? "Scratch Team" : "普通用户" }}</v-chip
          >
          <v-chip>
            <v-icon icon="mdi-earth" start></v-icon>

            {{ userinfo.profile.country }}</v-chip
          >
          <span class=""></span>
        </template>

        <v-card-text class="bg-surface-light pt-4">
          {{ userinfo.profile.status }}
        </v-card-text>
        <v-card-text class="bg-surface-light pt-4">
          {{ userinfo.profile.bio }}
        </v-card-text>
      </v-card>

      <ProxyShowProjects
      autoload="true"
 title="作品"
        subtitle="此用户的作品"
        :url="`/users/${userinfo.username}/projects?`"
      ></ProxyShowProjects>
      <br />

      <ProxyShowUsers
        title="他关注的人"
        :url="`/users/${userinfo.username}/following?`"
      ></ProxyShowUsers>
      <br />
      <ProxyShowUsers
        title="关注他的人"
        :url="`/users/${userinfo.username}/followers?`"
      ></ProxyShowUsers>
      <br />
      <proxylicense
        :url="'https://scratch.mit.edu/users/' + userinfo.username"
      ></proxylicense>
    </div>
    <Comment
      :url="'scratchmiteduuser-' + userinfo.id"
      name="Scratch官网用户"
    ></Comment>
  </v-container>
</template>

<script>
import { getUserById } from "@/services/proxy/userService";
import Comment from "../../../../components/Comment.vue";
import ProxyShowUsers from "../../../../components/proxy/ProxyShowUsers.vue";
import ProxyShowProjects from "../../../../components/proxy/ProxyShowProjects.vue";

export default {
  components: { Comment, ProxyShowUsers, ProxyShowProjects },

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
          id: 1,
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
      usetime: 0,
      curPage: 1,
      totalPage: 1,
      limit: 40,

      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
    };
  },

  async created() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const res = await getUserById(this.$route.params.username);
        this.userinfo = res.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.UserCardLoading = false;
      }
    },
  },
};
</script>
