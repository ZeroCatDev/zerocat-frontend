<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="12" md="8" lg="8" xl="8" xxl="8" cols="12">
        <div style="display: flex; justify-content: space-between" class="mb-2">
          <div>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  rounded="lg"
                  variant="tonal"
                  class="text-none"
                  prepend-icon="mdi-git"
                  append-icon="mdi-menu-down"
                  v-bind="props"
                  ><template v-slot:prepend><v-icon /></template
                  >{{ player.branch }}</v-btn
                >
              </template>

              <v-list dense>
                <v-list-item
                  v-for="item in projectbranchs"
                  :key="item"
                  :title="item.name"
                  :subtitle="item.description"
                  :value="item.name"
                  :active="item.name === player.branch"
                  @click="
                    player.branch = item.name;
                    player.commit.id = item.latest_commit_hash;
                    player.latest_commit_hash = item.latest_commit_hash;
                  "
                ></v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              class="ml-2"
              variant="text"
              :to="`/${$route.params.username}/${$route.params.projectname}/branches`"
              >{{ projectbranchs.length }}个分支</v-btn
            >
          </div>
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="tonal"
                class="text-none"
                prepend-icon="mdi-history"
                rounded="lg"
                append-icon="mdi-menu-down"
                v-bind="props"
                ><template v-slot:prepend><v-icon /></template
                >{{ projectbranchhistory.length }} 次提交</v-btn
              >
            </template>

            <v-list dense>
              <v-list-item
                v-for="item in projectbranchhistory"
                :key="item"
                :title="item.commit_message"
                :subtitle="`${item.commit_date} - #${item.author_id}`"
                :active="item.id === player.commit.id"
                @click="player.commit.id = item.id"
              ></v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-card
          hover
          border
          style="aspect-ratio: 4 / 3"
          v-if="showplayer == true"
        >
          <iframe
            :src="embedurl"
            scrolling="no"
            frameborder="0"
            style="width: 100%; height: 100%"
          ></iframe>
        </v-card>

        <v-card
          v-if="!showplayer"
          hover
          border
          :title="player.commit.error_code"
        >
          <v-card-actions>
            <v-btn @click="initProject(project.id)"
              >以Scratch模板初始化项目</v-btn
            >
          </v-card-actions>
        </v-card>
        <br />
        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="readme">README</v-tab>
            <v-tab value="license">LICENSE</v-tab>
          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="readme">
                <Markdown>{{ project.description }}</Markdown>
              </v-tabs-window-item>

              <v-tabs-window-item value="license">
                <License :licenseKey="project.license || 'none'" />
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
              :to="`${project.authorid}/${project.id}/fork`"
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
import { localuser } from "@/services/localAccount";
import ProjectStar from "../../../components/project/ProjectStar.vue";
import Comment from "../../../components/Comment.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import { useHead } from "@unhead/vue";
import {
  getProjectInfoByNamespace,
  initProject,
} from "../../../services/projectService";
import { getUserById } from "../../../stores/user.js";
import Markdown from "@/components/Markdown.vue";
import License from "@/components/license/License.vue";
import {
  getBranchs,
  getBranchHistoryByCommit,
} from "@/services/projectService";
export default {
  components: {
    ProjectRunner,
    TimeAgo,
    Comment,
    ProjectStar,
    Markdown,
    License,
  },
  data() {
    return {
      project: {},
      author: {},
      openEditor: openEditor,
      localuser,
      tab: "readme",
      embedurl: "",
      projectbranchs: [],
      projectbranchhistory: [],
      showplayer: true,
      player: {
        branch: "main",
        commit: {
          id: "latest",
        },
        latest_commit_hash: "latest",
      },
      initProject,
    };
  },
  async mounted() {
    this.initlizeProject();
  },
  methods: {
    async initlizeProject() {
      const username = this.$route.params.username;
      const projectname = this.$route.params.projectname;

      // 遗留问题
      if (this.$route.params.username == "proxy") {
        this.$router.replace(`/app${this.$route.path}`);
      }

      // 获取云端数据
      const projectFromCloud = await getProjectInfoByNamespace(
        username,
        projectname
      );
      this.project = projectFromCloud;
      this.project.id = this.project.id; // 更新 projectid
      if(this.project.default_branch == null) this.showplayer = false;
      this.player.branch = this.project.default_branch;
      var res = await getBranchs(this.project.id);
      if (res.data.length == 0) this.showplayer = false;
      this.projectbranchs = res.data;
      const currentBranch = this.projectbranchs.find(
        (item) => item.name === this.player.branch
      );
      console.log(currentBranch);
      console.log(currentBranch);
      console.log(currentBranch);
      if (currentBranch) {
        this.player.commit.id = currentBranch.latest_commit_hash;
        this.player.latest_commit_hash = currentBranch.latest_commit_hash;
      }
      this.loadProjectPlayer();
      this.loadBranchHistory();
      useHead({ title: this.project.title });
      this.author = await getUserById(this.project.authorid);
    },
    loadProjectPlayer() {
      this.embedurl = `/scratch/embed.html?id=${this.project.id}&branch=${this.player.branch}&ref=${this.player.commit.id}&embed=true`;
    },
    loadBranchHistory() {
      getBranchHistoryByCommit(
        this.project.id,
        this.player.latest_commit_hash
      ).then((res) => {
        this.projectbranchhistory = res;
      });
    },
  },
  watch: {
    player: {
      handler: function (newVal, oldVal) {
        this.loadProjectPlayer();
        this.loadBranchHistory();
      },
      deep: true,
    },
  },
};
</script>
