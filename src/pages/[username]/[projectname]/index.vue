<template>
  <div>
    <PageAnalytics :target-id="project.id" target-type="project"/>
    <ProjectPageLayout>
      <template #main>
        <ProjectBranchNav
          :branch-history="projectbranchhistory"
          :branches="projectbranchs"
          :current-branch="player.branch"
          :current-commit-id="player.commit.id"
          :projectname="$route.params.projectname"
          :username="$route.params.username"
        />

        <ProjectPlayer
          :branch="player.branch"
          :commit-id="player.commit.id"
          :project-id="project.id"
          :showplayer="showplayer"
          :type="project.type"
        />
        <v-card class="mt-4">
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
                <License :licenseKey="project.license || 'none'"/>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </template>
      <template #sidebar>
        <ProjectInfoCard
          :author="author"
          :project="project"
          :projectname="$route.params.projectname"
          :username="$route.params.username"
        />
        <div class="mt-4">
          <CloudVariablesInfoCard
            v-if="project.id"
            :project-id="project.id"
            :projectname="$route.params.projectname"
            :username="$route.params.username"
          />
        </div>
        <div class="mt-4">
          <RelatedPostsPanel
            v-if="project.id"
            type="project"
            :id="project.id"
            :hide-current-context-base="true"
            :project-route-base="projectRouteBase"
          />
        </div>
        <div class="mt-4">
          <Comment :url="'project-' + project.id" name="项目"></Comment>
        </div>
      </template>
    </ProjectPageLayout>
  </div>
</template>

<script>
import {use404Helper} from '@/composables/use404';
import {localuser} from "@/services/localAccount";
import Comment from '@/components/Comment.vue';
import RelatedPostsPanel from '@/components/posts/RelatedPostsPanel.vue';
import {useHead} from "@unhead/vue";
import {ref} from "vue";
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
import ProjectPageLayout from "@/components/project/ProjectPageLayout.vue";
import CloudVariablesInfoCard from "@/components/project/CloudVariablesInfoCard.vue";
import "github-markdown-css";
import PageAnalytics from "@/components/analytics/PageAnalytics.vue";

export default {
  components: {
    Comment,
    RelatedPostsPanel,
    Markdown,
    License,
    ProjectBranchNav,
    ProjectPlayer,
    ProjectInfoCard,
    ProjectPageLayout,
    CloudVariablesInfoCard,
    PageAnalytics,
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
  computed: {
    projectRouteBase() {
      const username = this.$route.params.username;
      const projectname = this.$route.params.projectname;
      if (!username || !projectname) return '';
      return `/${username}/${projectname}`;
    }
  },
  setup() {
    const pageTitle = ref("项目");
    useHead({
      title: pageTitle,
    });
    return {
      pageTitle,
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
      this.pageTitle = this.project.title;
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


