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
                  prepend-icon="mdi-source-commit"
                  v-bind="props"
                  ><template v-slot:prepend><v-icon /></template
                  >{{ commitInfo ? commitInfo.commit.branch : "加载中..." }}</v-btn
                >
              </template>
            </v-menu>
          </div>
          <v-btn
            variant="tonal"
            class="text-none"
            prepend-icon="mdi-source-branch"
            rounded="lg"
            :to="`/${$route.params.username}/${
              $route.params.projectname
            }/tree/${commitInfo?.commit.branch || 'main'}`"
            ><template v-slot:prepend><v-icon /></template>返回最新提交</v-btn
          >
        </div>

        <ProjectPlayer
          :project-id="project.id"
          :commit-id="$route.params.commitId"
          :showplayer="showplayer"
        />
        <br />
        <v-card
          hover
          border
          :title="commitInfo ? commitInfo.commit.commit_message : '加载中...'"
          :subtitle="commitInfo ? commitInfo.commit.commit_date : '加载中...'"
        >
          <v-card-text>{{
            commitInfo ? commitInfo.commit.commit_description : "加载中..."
          }}</v-card-text>
        </v-card>
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
  getCommitInfo,
} from "@/services/projectService";
import ProjectPlayer from "@/components/project/ProjectPlayer.vue";
import ProjectInfoCard from "@/components/project/ProjectInfoCard.vue";

export default {
  components: {
    ProjectPlayer,
    ProjectInfoCard,
  },
  data() {
    return {
      project: {},
      author: {},
      localuser,
      showplayer: true,
      commitInfo: null,
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
      const commitId = this.$route.params.commitId;

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

      // 获取提交信息
      this.commitInfo = await getCommitInfo(this.project.id, commitId);
      if (!this.commitInfo) {
        use404Helper.show404();
        return;
      }

      useHead({
        title: `${this.project.title} at ${this.commitInfo.commit_message}`,
      });
      this.author = this.project.author;
    },
  },
  watch: {
    "$route.params.commitId": {
      handler: async function (newCommitId) {
        await this.initlizeProject();
      },
      immediate: true,
    },
  },
};
</script>
