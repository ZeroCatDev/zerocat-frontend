<template>
  <v-container>
    <v-row
      ><v-col cols="8" md="8" lg="8" xl="8" sm="8" xs="8">
        <ProjectRunner :type="project.type" :id="project.id" />
        <br /><Comment :url="'project-' + $route.params.id"></Comment>
      </v-col>

      <v-col cols="4">
        <v-card hover
          ><v-card-item>
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card-item>
          <div class="px-4 d-flex ga-2 mb-2">
            <v-chip pill>
              <v-avatar start>
                <v-img
                  :src="
                    'https://s4-1.wuyuan.1r.ink/user/' + project.author.images
                  "
                ></v-img> </v-avatar
              >{{ project.author.display_name }}</v-chip
            >
          </div>
          <div class="px-4 d-flex ga-2 mb-2">
            <v-chip pill prepend-icon="mdi-eye"
              >{{ project.view_count }}浏览</v-chip
            >
            <v-chip pill prepend-icon="mdi-clock">{{ project.time }}</v-chip>
          </div>
          <div class="px-4 d-flex ga-2 mb-2">
            <v-chip pill prepend-icon="mdi-xml" v-if="project.state == 'public'"
              >开源作品</v-chip
            >
            <v-chip
              pill
              prepend-icon="mdi-xml"
              v-if="project.state == 'private'"
              >私密作品</v-chip
            >

            <v-chip pill prepend-icon="mdi-application">{{
              project.type
            }}</v-chip>
          </div>
          <div class="px-4 d-flex ga-2 mb-2">
            <div v-for="tag in project.tags.split(',')">
              <v-chip>{{ tag }}</v-chip>
            </div>
          </div>
          <div class="px-4 d-flex ga-2 mb-2">
            <v-btn @click="openEditor(project.id, project.type)" variant="text"
              >打开创造页</v-btn
            >
            <v-btn
              v-if="project.authorid != localuser.user.id"
              :to="'/projects/' + project.id + '/fork'"
              variant="text"
              >改编</v-btn
            >
          </div>

          <div class="px-4">
            <v-card hover variant="tonal" :to="'/user/' + project.authorid">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img
                      :alt="project.author.display_name"
                      :src="
                        'https://s4-1.wuyuan.1r.ink/user/' +
                        project.author.images
                      "
                    ></v-img>
                  </v-avatar>
                </template>
                <v-card-title class="text-white">
                  {{ project.author.display_name }}
                </v-card-title>
                <v-card-subtitle class="text-white">
                  {{ project.author.motto }}
                </v-card-subtitle>
              </v-card-item></v-card
            >
          </div>

          <br />
        </v-card>
        <br />
        <v-card hover><AddTolist></AddTolist></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import openEditor from "../../../stores/openEdit";

import request from "../../../axios/axios";
import ProjectRunner from "../../../components/ProjectRunner.vue";
import { localuser } from "@/stores/user";
import AddTolist from "../../../components/AddTolist.vue";
import Comment from "../../../components/Comment.vue";
export default {
  components: { ProjectRunner },
  data() {
    return {
      project: {
        id: 1,
        authorid: 1,
        time: "2000-01-01T00:00:00.000Z",
        view_count: 0,
        like_count: 0,
        type: "text",
        favo_count: 0,
        title: "加载中",
        state: "public",
        description: "加载中",
        license: "MIT",
        tags: "",
        likeid: "",
        favoid: "",
        author: {
          id: 1,
          display_name: "加载中",
          images: "加载中",
        },
      },
      openEditor: openEditor,
      localuser: localuser,
    };
  },

  async created() {
    await this.getproject();
    //init({ el: "#waline", serverURL: "https://zerocat-waline.190823.xyz", path: "scratchproject-" + this.$route.params.id, copyright: false, reaction: true, pageview: true, locale: { reactionTitle: "这个作品怎么样？", }, emoji: [ "//unpkg.com/@waline/emojis@1.1.0/weibo", "//unpkg.com/@waline/emojis@1.1.0/bilibili", ], dark: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches, });
  },
  methods: {
    async getproject() {
      this.project = await request({
        url: "/project/" + this.$route.params.id,
        method: "get",
      });
      console.log(this.project);
    },
  },
};
</script>
