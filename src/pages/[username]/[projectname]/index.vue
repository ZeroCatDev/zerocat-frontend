<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="12" md="8" lg="8" xl="8" xxl="8" cols="12">
        <ProjectBranchNav
          :username="$route.params.username"
          :projectname="$route.params.projectname"
          :current-branch="player.branch"
          :current-commit-id="player.commit.id"
          :branches="projectbranchs"
          :branch-history="projectbranchhistory"
        />

        <ProjectPlayer
          :project-id="project.id"
          :branch="player.branch"
          :commit-id="player.commit.id"
          :showplayer="showplayer"
        />
        <br />
        <v-card>
          <v-tabs v-model="tab" bg-color="primary">
            <v-tab value="readme">README</v-tab>
            <v-tab value="license">LICENSE</v-tab>
          </v-tabs>

          <v-card-text class="markdown-body">
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
        <ProjectInfoCard
          :project="project"
          :author="author"
          :username="$route.params.username"
          :projectname="$route.params.projectname"
        />
      </v-col>
      <v-col xxl="8" xl="8" lg="8" md="8" sm="12" xs="12" cols="12">
        <Comment :url="'project-' + project.id" name="项目"></Comment>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { use404Helper } from '@/composables/use404';
import { localuser } from "@/services/localAccount";
import Comment from "@/components/Comment.vue";
import { useHead } from "@unhead/vue";
import {
  getProjectInfoByNamespace,
  initProject,
  getBranchs,
  getBranchHistoryByCommit,
} from "@/services/projectService";
import Markdown from "@/components/Markdown.vue";
import License from "@/components/license/License.vue";
import ProjectBranchNav from "@/components/project/ProjectBranchNav.vue";
import ProjectPlayer from "@/components/project/ProjectPlayer.vue";
import ProjectInfoCard from "@/components/project/ProjectInfoCard.vue";
import "github-markdown-css";

export default {
  components: {
    Comment,
    Markdown,
    License,
    ProjectBranchNav,
    ProjectPlayer,
    ProjectInfoCard,
  },
  data() {
    return {
      project: {},
      author: {},
      localuser,
      tab: "readme",
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
      if (projectFromCloud.id == 0) {
        use404Helper.show404();
        return;
      }
      this.project = projectFromCloud;
      this.project.id = this.project.id; // 更新 projectid
      if (this.project.default_branch == null) this.showplayer = false;
      this.player.branch = this.project.default_branch;
      var res = await getBranchs(this.project.id);
      if (res.data.length == 0) this.showplayer = false;
      this.projectbranchs = res.data;
      const currentBranch = this.projectbranchs.find(
        (item) => item.name === this.player.branch
      );
      if (currentBranch) {
        this.player.commit.id = currentBranch.latest_commit_hash;
        this.player.latest_commit_hash = currentBranch.latest_commit_hash;
      }
      this.loadBranchHistory();
      useHead({ title: this.project.title });
      this.author = this.project.author;
    },
    async loadBranchHistory() {
      const res = await getBranchHistoryByCommit(
        this.project.id,
        this.player.latest_commit_hash
      );
      this.projectbranchhistory = res;
    },
  },
  watch: {
    player: {
      handler: function (newVal, oldVal) {
        this.loadBranchHistory();
      },
      deep: true,
    },
  },
};
</script>
