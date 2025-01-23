<template>
  <v-container>
    <v-card subtitle="这是Scratch上的内容" title="ZeroCatScratchMirror" border>
      <v-card-text class="bg-surface-light pt-4">
        我们使用这种方式促进Scratch及其社区的发展，这些内容是按照<a
          >署名-相同方式共享 2.0 通用</a
        >协议传播的，您可以在<a>https://creativecommons.org/licenses/by-sa/2.0/</a>查看协议全文。
      </v-card-text>
      <template v-slot:actions>
        <v-btn href="https://scratch.mit.edu/explore/projects/all"
          >Scratch上的发现页</v-btn
        >
        <v-btn href="https://scratch.mit.edu/terms_of_use" target="_blank"
          >Scratch使用条款</v-btn
        >
      </template> </v-card
    ><br />
    <v-progress-linear
      :active="ProjectsLoading"
      height="4"
      indeterminate
    ></v-progress-linear>
    <div class="mb-2">
      <v-chip
        ><v-icon icon="mdi-clock" start></v-icon>本页加载用时{{
          Math.abs(usetime / 1000)
        }}秒
      </v-chip>
    </div>
    <div v-for="(name, key) in projects" :key="name">
      <h1>{{ translate[key] || key }}</h1>
      <br />
      <v-row>
        <v-col cols="4" md="2" v-for="info in name" :key="info">
          <v-card :to="'/app/proxy/' + info.id" v-if="info.type == 'project'">
            <v-img
              :src="`${scratch_proxy}/thumbnails/${info.id}`"
              cover
              lazy-src="../../../assets/43-lazyload.png"
            ></v-img
            ><v-card-item>
              <v-card-title>{{ info.title }}</v-card-title>
              <v-card-subtitle>{{ info.creator }}</v-card-subtitle>
            </v-card-item>
          </v-card>
          <v-card
            :to="'/proxy/studios/' + info.id"
            v-if="info.type == 'gallery'"
          >
            <v-card-item>
              <v-card-title>{{ info.title }}</v-card-title>

              <v-card-subtitle>{{ info.id }}</v-card-subtitle>
            </v-card-item>
          </v-card>
        </v-col> </v-row
      ><br /><br /><br /><br />
    </div>
  </v-container>
</template>

<script>
import request from "../../../axios/axios";
import { useHead } from "@unhead/vue";

export default {
  setup() {
    useHead({
      title: "Proxy",
    });
  },
  data() {
    return {
      orderitems: [
        { name: "热门的", type: "trending" },
        { name: "最受欢迎的", type: "popular" },
        { name: "新建的", type: "recent" },
      ],
      tagitems: [
        { name: "全部", type: "*" },
        { name: "动画", type: "animations" },
        { name: "艺术", type: "art" },
        { name: "游戏", type: "games" },
        { name: "音乐", type: "music" },
        { name: "故事", type: "stories" },
        { name: "教程", type: "tutorials" },
      ],
      search: {
        order: "trending",
        tag: "*",
        limit: 18,
      },
      usetime: 0,
      ProjectsLoading: false,
      projects: {},
      projectscount: 0,
      curPage: 1,
      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
      translate: {
        community_newest_projects: "最新创建",
        community_most_remixed_projects: "大家在改编的作品",
        scratch_design_studio: "Scratch设计室",
        curator_top_projects: "被特殊用户挑选的作品",

        community_featured_studios: "特色工作室",
        community_most_loved_projects: "大家在点赞的作品",
        community_featured_projects: "社区特殊作品",
      },
    };
  },
  async created() {
    await this.getprojects();
  },
  methods: {
    async getprojects() {
      this.onPageChange(1);
    },
    async onPageChange() {
      this.usetime = Date.now();
      this.ProjectsLoading = true;

      this.projects = await request({
        url: this.scratch_proxy + `/proxy/featured`,
        method: "get",
      });

      this.ProjectsLoading = false;
      this.usetime = Date.now() - this.usetime;
    },
  },
};
</script>
