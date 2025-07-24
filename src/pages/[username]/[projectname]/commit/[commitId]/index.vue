<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="8" md="8" sm="12" xl="8" xs="12" xxl="8">
        <div class="mb-2" style="display: flex; justify-content: space-between">
          <div>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="text-none"
                  prepend-icon="mdi-source-commit"
                  rounded="lg"
                  v-bind="props"
                  variant="tonal"
                >
                  <template v-slot:prepend>
                    <v-icon/>
                  </template
                  >
                  {{ commitInfo ? commitInfo.commit.branch : "加载中..." }}
                </v-btn
                >
              </template>
            </v-menu>
          </div>
          <v-btn
            :to="`/${$route.params.username}/${
              $route.params.projectname
            }/tree/${commitInfo?.commit.branch || 'main'}`"
            class="text-none"
            prepend-icon="mdi-source-branch"
            rounded="lg"
            variant="tonal"
          >
            <template v-slot:prepend>
              <v-icon/>
            </template>
            返回最新提交
          </v-btn
          >
        </div>

        <ProjectPlayer
          :commit-id="$route.params.commitId"
          :project-id="project.id"
          :showplayer="showplayer"
        />
        <br/>
        <v-card
          :subtitle="commitInfo ? commitInfo.commit.commit_date : '加载中...'"
          :title="commitInfo ? commitInfo.commit.commit_message : '加载中...'"
          border
          hover
        >
          <v-card-text>{{
            commitInfo ? commitInfo.commit.commit_description : "加载中..."
            }}
          </v-card-text>
        </v-card>
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
