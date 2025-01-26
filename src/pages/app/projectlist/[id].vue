<template>
  <v-container>
    <v-card class="mx-auto" :disabled="Loading" :loading="Loading" border>
      <template v-slot:title>
        <span class="font-weight-black">{{ projectlist.title }}</span>
      </template>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>
      <template v-slot:subtitle>
        <v-chip>
          <v-icon icon="mdi-account-circle" start></v-icon>

          ID:{{ projectlist.id }}
        </v-chip>
        <v-chip>
          <v-icon icon="mdi-account-circle" start></v-icon>

          {{ projectlist.state }}
        </v-chip>
        <v-chip>
          <v-icon icon="mdi-clock" start></v-icon>

          {{ projectlist.createTime }}创建
        </v-chip>
      </template>

      <v-card-text class="bg-surface-light pt-4">
        {{ projectlist.description }}
      </v-card-text>
    </v-card>
    <br />
    <showProjects :projectIds="projectlist.projects"></showProjects><br />

    <Comment
      :url="'projectlist-' + projectlist.id"
      name="列表"
    ></Comment>
  </v-container>
</template>

<script>
import Comment from "../../../components/Comment.vue";
import request from "../../../axios/axios";
import { localuser } from "@/services/localAccount";
import { useHead } from "@unhead/vue";
import showProjects from "../../../components/project/showProjects.vue";
export default {
  components: { showProjects, Comment },

  data() {
    return {
      localuser: localuser,
      projectid: this.$route.params.id,
      projectlist: {
        status: "1",
        message: "加载中",
        data: {
          id: 7,
          authorid: 1,
          title: "加载中",
          description: "加载中",
          state: "private",
          list: "",
          updateTime: null,
          createTime: "2000-00-01T00:00:00.000Z",
          data: {
            projects: [],
            users: [],
          },
        },
      },
      localuser: localuser,
      Loading: true,
    };
  },
  setup() {
    useHead({
      title: "ZeroCat - 列表",
    });
  },

  async created() {
    if (localuser.isLogin.value === false) {
      this.$router.push("/app/account/login");
    }
  },
  methods: {
    async getprojectlist() {
      const res = await request.get(`/projectlist/listid/${this.$route.params.id}`);
      if (res.data.status === "success") {
        this.projectlist = res.data.data;
      } else {
        this.$router.push("/404");
      }
      useHead({
        title: "" + this.projectlist.title,
      });
      console.log(this.projectlist);
    },
  },
  mounted() {
    this.Loading = true;
    this.getprojectlist();
    this.Loading = false;
  },
};
</script>

