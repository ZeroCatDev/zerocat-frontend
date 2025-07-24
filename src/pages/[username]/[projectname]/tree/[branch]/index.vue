<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8" md="8" sm="12" xl="8" xs="12" xxl="8">
        <ProjectBranchNav
          :branch-history="projectbranchhistory"
          :branches="projectbranchs"
          :current-branch="$route.params.branch"
          :current-commit-id="currentCommitId"
          :projectname="$route.params.projectname"
          :username="$route.params.username"
        />

        <ProjectPlayer
          :branch="$route.params.branch"
          :commit-id="currentCommitId"
          :project-id="project.id"
          :showplayer="showplayer"
        />
        <br/>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="12" xl="4" xs="12" xxl="8">
        <ProjectInfoCard
          :author="author"
          :project="project"
          :projectname="$route.params.projectname"
          :username="$route.params.username"
        />
      </v-col>
      <v-col cols="12" lg="8" md="8" sm="12" xl="8" xs="12" xxl="8">
        <Comment :name="` ${project.title} 的分支：${$route.params.branch} `"
                 :url="'project-' + project.id+'#'+$route.params.branch"></Comment>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {use404Helper} from "@/composables/use404";
import {localuser} from "@/services/localAccount";
import {useHead} from "@unhead/vue";
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

      useHead({title: `${this.project.title} at ${branch}`});
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
