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
            <v-img :alt="studioinfo.username" :src="studioinfo.image"></v-img>
          </v-avatar>
        </template>
        <template v-slot:title>
          <span class="font-weight-black">{{ studioinfo.title }}</span>
        </template>
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <template v-slot:subtitle>
          <v-chip-group column>
            <v-chip>
              <v-icon icon="mdi-account-circle" start></v-icon>

              ID:{{ studioinfo.id }}
            </v-chip>
            <v-chip>
              <v-icon icon="mdi-clock" start></v-icon>

              {{ studioinfo.history.created }}创建
            </v-chip>
            <v-chip>
              <v-icon icon="mdi-clock" start></v-icon>

              {{ studioinfo.history.modified }}更新</v-chip
            >
            <v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              {{ studioinfo.public == true ? "公开" : "私密" }}</v-chip
            >
            <v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              {{
                studioinfo.open_to_all == true ? "对所有人开放" : "需要邀请"
              }}</v-chip
            >
            <v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              {{
                studioinfo.comments_allowed == true
                  ? "Scratch官网允许评论"
                  : "Scratch官网不允许评论"
              }}</v-chip
            ><v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              Scratch官网{{ studioinfo.stats.comments }}评论</v-chip
            ><v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              {{ studioinfo.stats.followers }}被关注</v-chip
            ><v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              {{ studioinfo.stats.managers }}成员</v-chip
            ><v-chip>
              <v-icon icon="mdi-earth" start></v-icon>

              {{ studioinfo.stats.projects }}项目</v-chip
            ></v-chip-group
          >
        </template>
        <v-tabs v-model="tab">
          <v-tab value="description">简介</v-tab>
          <v-tab value="members">成员</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="description">
              {{ studioinfo.description }}
            </v-tabs-window-item>

            <v-tabs-window-item value="members">
              <h1>管理员</h1>
              <v-row>
                <v-col cols=" 12" md="3" v-for="info in managers" :key="info">
                  <v-card :to="'/proxy/user/' + info.username">
                    <v-card-item>
                      <template v-slot:prepend>
                        <v-avatar
                          :image="`${this.scratch_proxy}/avatars/${info.profile.id}`"
                        ></v-avatar> </template
                      ><v-card-title>{{ info.username }}</v-card-title>

                      <v-card-subtitle>{{
                        info.profile.country
                      }}</v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col></v-row
              >
              <br /><v-btn
                @click="onManagersPageChange(managerspage + 1)"
                :disabled="!managerscanload"
                >继续加载</v-btn
              >
              <br /><br />
              <h1>成员</h1>
              <v-row>
                <v-col cols=" 12" md="3" v-for="info in curators" :key="info">
                  <v-card :to="'/proxy/user/' + info.username">
                    <v-card-item>
                      <template v-slot:prepend>
                        <v-avatar
                          :image="`${this.scratch_proxy}/avatars/${info.profile.id}`"
                        ></v-avatar> </template
                      ><v-card-title>{{ info.username }}</v-card-title>

                      <v-card-subtitle>{{
                        info.profile.country
                      }}</v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col></v-row
              ><br />
              <v-btn
                @click="onCuratorsPageChange(curatorspage + 1)"
                :disabled="!curatorscanload"
                >继续加载</v-btn
              >
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
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
      <v-row>
        <v-col cols="4" md="2" v-for="info in projects" :key="info">
          <v-card :to="'/proxy/' + info.id">
            <v-img
              :src="`${scratch_proxy}/thumbnails/${info.id}`"
              cover
              lazy-src="../../../assets/43-lazyload.png"
            ></v-img
            ><v-card-item>
              <template v-slot:prepend>
                <v-avatar
                  :image="`${this.scratch_proxy}/avatars/${info.actor_id}`"
                ></v-avatar> </template
              ><v-card-title>{{ info.title }}</v-card-title>

              <v-card-subtitle>{{ info.username }}</v-card-subtitle>
            </v-card-item>
          </v-card>
        </v-col></v-row
      ><br />
      <v-btn @click="onPageChange(curPage + 1, false)">继续加载</v-btn>
      <br /><br />
      <v-card subtitle="这是Scratch上的内容" title="ScratchMirror">
        <v-card-text class="bg-surface-light pt-4">
          我们使用这种方式促进Scratch及其社区的发展，这些内容是按照<a
            >署名-相同方式共享 2.0 通用</a
          >协议传播的，您可以在<a>https://creativecommons.org/licenses/by-sa/2.0/</a>查看协议全文。
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            :href="'https://scratch.mit.edu/studios/' + studioinfo.id"
            target="_blank"
            >Scratch上的工作室主页</v-btn
          >
          <v-btn href="https://scratch.mit.edu/terms_of_use" target="_blank"
            >Scratch使用条款</v-btn
          >
        </template>
      </v-card>
    </div>
    <!--<Projects :authorid="userid" ref="Projects" showinfo="true"></Projects>-->

    <Comment
      :url="'scratchmitedustudio-' + this.$route.params.id"
      name="工作室"
    ></Comment>
  </v-container>
</template>

<script>
import request from "../../../axios/axios";
import Projects from "../../../components/Projects.vue";
import { Comment } from "../../components/Comment.vue";

import { ref } from "vue";
export default {
  components: { Projects, Comment },

  data() {
    return {
      tab: ref(null),
      UserCardLoading: true,
      ProjectsLoading: true,
      userid: this.$route.params.id,
      studioinfo: {
        id: 1,
        title: "加载中",
        host: 1,
        description: "加载中",
        visibility: "visible",
        public: true,
        open_to_all: true,
        comments_allowed: true,
        image: "",
        history: {
          created: "2000-01-01T00:00:00.000Z",
          modified: "2000-01-01T00:00:00.000Z",
        },
        stats: {
          comments: 0,
          followers: 0,
          managers: 0,
          projects: 0,
        },
      },
      curators: [],
      curatorspage: 0,
      curatorscanload: true,

      managers: [],
      managerspage: 0,
      managerscanload: true,

      usetime: 0,
      projects: [],
      curPage: 1,
      limit: 18,

      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
    };
  },

  async created() {
    await this.getstudioinfo();
    await this.onPageChange(1, false);
    //await this.onCuratorsPageChange(1);
    //await this.onManagersPageChange(1)
  },
  methods: {
    async onPageChange(page, clean) {
      if (clean == true) {
        this.projects = [];
      }
      this.usetime = Date.now();
      this.ProjectsLoading = true;

      this.projects = this.projects.concat(
        await request({
          url: `${this.scratch_proxy}/studios/${
            this.$route.params.id
          }/projects?&offset=${page * 16 - 16}&limit=${this.limit}`,
          method: "get",
        })
      );

      this.curPage = page;
      this.ProjectsLoading = false;
      this.usetime = Date.now() - this.usetime;
    },
    async onCuratorsPageChange(page) {
      var loadcurators = await request({
        url: `${this.scratch_proxy}/studios/${
          this.$route.params.id
        }/curators?&offset=${page * 16 - 16}&limit=${this.limit}`,
        method: "get",
      });
      if (loadcurators.length == 0) {
        this.curatorscanload = false;
      }
      this.curators = this.curators.concat(loadcurators);

      this.curatorspage = page;
    },
    async onManagersPageChange(page) {
      var loadmanagers = await request({
        url: `${this.scratch_proxy}/studios/${
          this.$route.params.id
        }/managers?&offset=${page * 16 - 16}&limit=${this.limit}`,
        method: "get",
      });
      if (loadmanagers.length == 0) {
        this.managerscanload = false;
      }
      this.managers = this.managers.concat(loadmanagers);

      this.managerspage = page;
    },
    async getstudioinfo() {
      this.studioinfo = await request({
        url: `${this.scratch_proxy}/studios/${this.$route.params.id}`,
        method: "get",
      });
      //this.$refs.Projects.onPageChange(1);

      this.UserCardLoading = false;
      console.log(this.studioinfo);
    },
  },
};
</script>
