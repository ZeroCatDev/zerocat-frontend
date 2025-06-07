<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="12" md="8" lg="8" xl="8" xxl="8" cols="12">
        <ProjectBranchNav
          :username="$route.params.username"
          :projectname="$route.params.projectname"
          :current-branch="$route.params.branch"
          :current-commit-id="currentCommitId"
          :branches="projectbranchs"
          :branch-history="projectbranchhistory"
        />

        <ProjectPlayer
          :project-id="project.id"
          :branch="$route.params.branch"
          :commit-id="currentCommitId"
          :showplayer="showplayer"
        />
        <br />
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
        <Comment :url="'project-' + project.id+'#'+$route.params.branch" :name="` ${project.title} 的分支：${$route.params.branch} `"></Comment>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { use404Helper } from "@/composables/use404";
import { localuser } from "@/services/localAccount";
import { useHead } from "@unhead/vue";
import {
  getProjectInfoByNamespace,
  initProject,
  getBranchs,
  getBranchHistoryByCommit,
} from "@/services/projectService";
import ProjectBranchNav from "@/components/project/ProjectBranchNav.vue";
import ProjectPlayer from "@/components/project/ProjectPlayer.vue";
import ProjectInfoCard from "@/components/project/ProjectInfoCard.vue";

export default {
  components: {
    ProjectBranchNav,
    ProjectPlayer,
    ProjectInfoCard,
  },
  data() {
    return {
      project: {},
      author: {},
      localuser,
      projectbranchs: [],
      projectbranchhistory: [],
      showplayer: true,
      currentCommitId: "",
      initProject,
    };
  },
  async mounted() {
    await this.initlizeProject();
  },
  methods: {
    async initlizeProject() {
      const username = this.$route.params.username;
      const projectname = this.$route.params.projectname;
      const branch = this.$route.params.branch;

      // 遗留问题
      if (username === "proxy") {
        this.$router.replace(`/app${this.$route.path}`);
        return;
      }

      // 获取云端数据
      const projectFromCloud = await getProjectInfoByNamespace(
        username,
        projectname
      );
      if (projectFromCloud.id === 0) {
        use404Helper.show404();
        return;
      }

      this.project = projectFromCloud;
      if (this.project.default_branch == null) {
        this.showplayer = false;
        return;
      }

      var res = await getBranchs(this.project.id);
      if (res.data.length === 0) {
        this.showplayer = false;
        return;
      }

      this.projectbranchs = res.data;
      const currentBranch = this.projectbranchs.find(
        (item) => item.name === branch
      );

      if (!currentBranch) {
        use404Helper.show404();
        return;
      }

      this.currentCommitId = currentBranch.latest_commit_hash;
      this.loadBranchHistory();

      useHead({ title: `${this.project.title} at ${branch}` });
      this.author = this.project.author;
    },
    async loadBranchHistory() {
      const res = await getBranchHistoryByCommit(
        this.project.id,
        this.currentCommitId
      );
      this.projectbranchhistory = res;
    },
  },
  watch: {
    "$route.params.branch": {
      handler: async function (newBranch) {
        await this.initlizeProject();
      },
      immediate: true,
    },
  },
};
</script>
