<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="12" md="8" lg="8" xl="8" xxl="8" cols="12">
        <ProjectRunner :type="project.type" :id="project.id" /><br/>
        <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="readme">README</v-tab>
      <v-tab value="license">LICENSE</v-tab>
      <v-tab value="three">Item Three</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="readme">
          <Markdown>{{project.description}}</Markdown>
        </v-tabs-window-item>

        <v-tabs-window-item value="license">
          {{project.license}}
        </v-tabs-window-item>

        <v-tabs-window-item value="three">
          Three
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
      </v-col>
      <v-col xs="12" sm="12" md="4" lg="4" xl="4" xxl="8" cols="12">
        <v-card hover border>
          <v-card-item>
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card-item>
          <div class="px-4 d-flex ga-2 mb-2">
            <v-chip pill>
              <v-avatar start>
                <v-img
                  :src="'https://s4-1.wuyuan.1r.ink/user/' + author.images"
                ></v-img> </v-avatar
              >{{ author.display_name }}
            </v-chip>
          </div>
          <div class="px-4 d-flex ga-2 mb-2">
            <v-chip pill prepend-icon="mdi-eye"
              >{{ project.view_count }}浏览</v-chip
            >

            <v-chip pill prepend-icon="mdi-clock">
              <TimeAgo :date="project.time" />
            </v-chip>
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
            <div v-for="tag in project.tags">
              <v-chip>{{ tag.name }}</v-chip>
            </div>
          </div>
          <div class="px-4 d-flex ga-2 mb-2">
            <ProjectStar :projectId="project.id" />
            <v-btn @click="openEditor(project.id, project.type)" variant="text"
              >打开创造页</v-btn
            >
            <v-btn
              v-if="project.authorid != localuser.user.id"
              :to="`${project.authorid}/${projectid}/fork`"
              variant="text"
              >改编</v-btn
            >
          </div>
          <div class="px-4">
            <v-card hover :to="'/' + author.username" border>
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img
                      :alt="author.display_name"
                      :src="'https://s4-1.wuyuan.1r.ink/user/' + author.images"
                    ></v-img>
                  </v-avatar>
                </template>
                <v-card-title class="text-white">{{
                  author.display_name
                }}</v-card-title>
                <v-card-subtitle class="text-white">{{
                  author.motto
                }}</v-card-subtitle>
              </v-card-item>
            </v-card>
          </div>
          <br />
        </v-card>

      </v-col>
      <v-col xxl="8" xl="8" lg="8" md="8" sm="12" xs="12" cols="12">
        <Comment :url="'project-' + project.id" name="项目"></Comment>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import openEditor from "../../../stores/openEdit";
import ProjectRunner from "../../../components/project/ProjectRunner.vue";
import { localuser } from "@/middleware/userMiddleware";
import ProjectStar from "../../../components/project/ProjectStar.vue";
import Comment from "../../../components/Comment.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import { useHead } from "@unhead/vue";
import { getProjectInfoByNamespace } from "../../../stores/cache/project.js";
import { getUserById } from "../../../stores/cache/user.js";
import Markdown from "@/components/Markdown.vue";
export default {
  components: { ProjectRunner, TimeAgo, Comment, ProjectStar,Markdown },
  data() {
    return {
      projectid: this.$route.params.id,
      project: {},
      author: {},
      openEditor: openEditor,
      localuser: localuser,
      tab: "readme",
    };
  },
  async mounted() {
    this.fetchProjectAndAuthorDetails();
  },
  methods: {
    async fetchProjectAndAuthorDetails() {
      const username = this.$route.params.username;
      const projectname = this.$route.params.projectname;

      // 获取云端数据
      const projectFromCloud = await getProjectInfoByNamespace(username, projectname);
      this.project = projectFromCloud;
      this.projectid = this.project.id; // 更新 projectid
      useHead({ title: this.project.title });
      this.author = await getUserById(this.project.authorid);
    },
  },
};
</script>
