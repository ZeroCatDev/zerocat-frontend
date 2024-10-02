<template>
  <v-container>
    <v-card class="mx-auto" :disabled="Loading" :loading="Loading">
      <template v-slot:title>
        <span class="font-weight-black">{{ projectlist.title }}</span>
      </template>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear :active="isActive" height="4" indeterminate></v-progress-linear>
      </template>
      <template v-slot:subtitle>
        <v-chip>
          <v-icon icon="mdi-account-circle" start></v-icon>

          ID:{{ projectlist.id }}
        </v-chip>
        <v-chip>
          <v-icon icon="mdi-account-circle" start></v-icon>

          {{ projectlist.state }}
        </v-chip>
        <v-chip>
          <v-icon icon="mdi-clock" start></v-icon>

          {{ projectlist.createTime }}创建
        </v-chip>
      </template>

      <v-card-text class="bg-surface-light pt-4">
        {{ projectlist.description }}
      </v-card-text> </v-card><v-container>
      <ProjectsCards :projects="projectlist.data"></ProjectsCards>
    </v-container>
    <div id="waline"></div>
  </v-container>
</template>

<script>
import request from "../../axios/axios";
import { init } from "@waline/client";
import "@waline/client/style";
import { localuser } from "@/stores/user";
import ProjectsCards from "../../components/ProjectsCards.vue";

export default {
  components: { ProjectsCards },

  data() {
    return {
      projectlist: {
        status: "1",
        message: "加载中",
        data: {
          id: 7,
          authorid: 1,
          title: "加载中",
          description: "加载中",
          state: "private",
          list: "",
          updateTime: null,
          createTime: "2000-00-01T00:00:00.000Z",
          data: {
            projects: [],
            users: [],
          },
        },
      },
      localuser: localuser,
      Loading: true,
    };
  },

  async created() {
    init({
      el: "#waline",
      serverURL: "https://zerocat-waline.190823.xyz",
      path: "projectlist-" + this.$route.params.id,
      copyright: false,
      reaction: true,
      pageview: true,
      locale: {
        reactionTitle: "这个列表怎么样？",
      },
      emoji: [
        "//unpkg.com/@waline/emojis@1.1.0/weibo",
        "//unpkg.com/@waline/emojis@1.1.0/bilibili",
      ],
      dark:
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    });
  },
  methods: {
    async getprojectlist() {
      this.projectlist = await request({
        url: "/projectlist/" + this.$route.params.id,
        method: "get",
      });
      if (this.projectlist.status == "1") {
        this.projectlist = this.projectlist.data;
      } else {
        this.$router.push("/404");
      }
      console.log(this.projectlist);
    },
  },
  mounted() {
    this.Loading = true;
    this.getprojectlist();
    this.Loading = false;
  },
};
</script>
