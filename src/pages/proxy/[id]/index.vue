<template>
  <v-container>
    <v-row><v-col cols="8" md="8" lg="8" xl="8" sm="8" xs="8">
        <iframe :src="embedurl" scrolling="no" frameborder="0" style="width: 100%; aspect-ratio:4/3"></iframe>
      <br/><br/><v-card>
        <v-card-title>操作说明
        </v-card-title>
        <v-card-text>{{ project.instructions }}</v-card-text></v-card><br/>
      <v-card>
        <v-card-title>备注与鸣谢</v-card-title>
        <v-card-text>{{ project.description }}</v-card-text></v-card>
      </v-col>

      <v-col cols="4">
        <v-card hover>
          <v-card-list><v-card-item>
              <v-card-title>{{ project.title }}</v-card-title>
              <v-card-subtitle>{{
                project.id
              }}</v-card-subtitle> </v-card-item><v-card-item>

            </v-card-item>
            <v-card-item>
              <v-chip pill>
                <v-avatar start>
                  <v-img :src="project.author.profile.images['90x90']"></v-img> </v-avatar>{{ project.author.username ||
                    "加载中" }}</v-chip>
            </v-card-item>
            <v-card-item>
              <v-chip pill prepend-icon="mdi-eye">{{ project.stats.views }}浏览</v-chip>
              <v-chip pill prepend-icon="mdi-eye">{{ project.stats.loves }}赞</v-chip>
              <v-chip pill prepend-icon="mdi-eye">{{ project.stats.favorites }}star</v-chip>
              <v-chip pill prepend-icon="mdi-eye">{{ project.stats.remixes }}fork</v-chip>

              <v-chip pill prepend-icon="mdi-clock">{{ project.history.created }}创建</v-chip>
              <v-chip pill prepend-icon="mdi-clock">{{ project.history.modified }}更新</v-chip>
              <v-chip pill prepend-icon="mdi-clock">{{ project.history.shared }}开源</v-chip>
            </v-card-item>
          </v-card-list>

          <div class="px-4 d-flex  ga-2 mb-2">
            <v-btn :href="scratch_proxy_gui + '/editor.html#' + project.id" variant="text" target="_blank">打开创造页</v-btn>


          </div>

          <div class="px-4">
            <v-card hover variant="tonal" :to="'/proxy/user/' + project.author.username">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img :src="`${this.scratch_proxy}/avatars/${project.author.id}`"></v-img>
                  </v-avatar>
                </template>
                <v-card-title class="text-white">
                  {{ project.author.username }}
                </v-card-title>
                <v-card-subtitle class="text-white">
                  {{ project.author.id }}
                </v-card-subtitle>
              </v-card-item></v-card>
          </div>

          <br />
        </v-card>
      </v-col>
    </v-row>

    <div id="waline"></div>
  </v-container>
</template>

<script>
import openEditor from "../../../stores/openEdit";

import request from "../../../axios/axios";
import { init } from "@waline/client";
import ProjectRunner from "../../../components/ProjectRunner.vue";
import "@waline/client/style";
import { localuser } from "@/stores/user";
export default {
  components: { ProjectRunner },
  data() {
    return {
      project: {
        id: 1,
        title: "加载中",
        description: "加载中",
        instructions: "加载中",
        visibility: "visible",
        public: true,
        comments_allowed: true,
        is_published: true,
        author: {
          id: 1,
          username: "加载中",
          scratchteam: false,
          history: {
            joined: "2000-01-01T00:00:00.000Z",
          },
          profile: {
            id: null,
            images: {
              "90x90":
                "",
              "60x60":
                "",
              "55x55":
                "",
              "50x50":
                "",
              "32x32":
                "",
            },
          },
        },
        image:
          "",
        images: {
          "282x218":
            "",
          "216x163":
            "",
          "200x200":
            "",
          "144x108":
            "",
          "135x102":
            "",
          "100x80":
            "",
        },
        history: {
          created: "2000-01-01T00:00:00.000Z",
          modified: "2000-01-01T00:00:00.000Z",
          shared: "2000-01-01T00:00:00.000Z",
        },
        stats: {
          views: 0,
          loves: 0,
          favorites: 0,
          remixes: 0,
        },
        remix: {
          parent: null,
          root: null,
        },
        project_token:
          "",
      },
      openEditor: openEditor,
      localuser: localuser,
      embedurl: '',
      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
      scratch_proxy_gui: import.meta.env.VITE_APP_SCRATCH_PROXY_GUI

    };
  },

  async created() {
    await this.getproject();
    init({
      el: "#waline",
      serverURL: "https://zerocat-waline.190823.xyz",
      path: "scratchmitedu-project-" + this.$route.params.id,
      copyright: false,
      reaction: true,
      pageview: true,
      locale: {
        reactionTitle: "这个作品怎么样？",
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
    async getproject() {
      this.project = await request({
        url: this.scratch_proxy + "/projects/" + this.$route.params.id,
        method: "get",
      });
      this.embedurl = this.scratch_proxy_gui + '/embed.html#' + this.$route.params.id
      console.log(this.project);
    },
  },
};
</script>
