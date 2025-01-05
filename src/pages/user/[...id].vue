<template>
  <v-container
    ><v-responsive class="mt-12">
      <v-row class="d-flex align-center">
        <!-- 用户信息 -->
        <v-col>
          <p class="font-weight-medium text-primary">ZeroCat 用户</p>

          <p
            class="font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username"
          >
            {{ userinfo.info.user.display_name }}
            <v-avatar size="52" class="ma-2">
              <v-img
                :src="
                  'https://s4-1.wuyuan.1r.ink/user/' + userinfo.info.user.images
                "
              />
            </v-avatar>
          </p>

          <p class="mt-2 text-body-1 text-medium-emphasis">
            {{ userinfo.info.user.motto }}
          </p>

          <p class="mt-2 text-medium-emphasis">
            <v-chip>
              <v-icon icon="mdi-account-circle" start></v-icon>

              ID:{{ userinfo.info.user.id }}
            </v-chip>
            <v-chip>
              <v-icon icon="mdi-clock" start></v-icon>

              {{ userinfo.info.user.regTime }}注册
            </v-chip>
            <v-chip>
              <v-icon icon="mdi-tag" start></v-icon>

              创作者</v-chip
            >
          </p>
        </v-col>
      </v-row>
    </v-responsive>
    <br />
    <Projects :authorid="userid" ref="Projects" showinfo="true"></Projects>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        xxl="2"
        v-for="item in lists"
        :key="item.id"
      >
        <v-card rounded="lg">
          <v-card
            :to="'/projectlist/' + item.id"
            style="aspect-ratio: 4/3"
            rounded="lg"
          >
            <v-img
              class="align-end"
              lazy-src="../../assets/43-lazyload.png"
              height="100%"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              cover
            >
              <v-card-item>
                <v-card-title>{{ item.title }} </v-card-title>
                <v-card-subtitle>{{ item.title }} </v-card-subtitle>
              </v-card-item>
              <!--<v-card-text>
                    <v-chip size="small">{{ item.type }}</v-chip>
                  </v-card-text>-->
            </v-img>
            <!-- v-img 高度与 v-card-item 一致 -->
          </v-card>
        </v-card>
      </v-col></v-row
    ><br />
    <Comment :url="'user-' + $route.params.id" name="用户"></Comment>
  </v-container>
</template>

<script>
import Comment from "../../components/Comment.vue";

import request from "../../axios/axios";
import Projects from "../../components/Projects.vue";
import { useHead } from "@unhead/vue";
export default {
  components: { Projects, Comment },

  data() {
    return {
      UserCardLoading: true,
      userid: this.$route.params.id,
      userinfo: {
        status: "ok",
        info: {
          user: {
            id: 0,
            display_name: "加载中",
            motto: "加载中",
            images: "0ec4beb623e3bcdbe0f207c9804f0bc2",
            regTime: "0000-00-00T00:00:00.000Z",
            sex: 0,
            username: "loading",
          },
          count: { pythoncount: 0, scratchcount: 0 },
        },
      },
      projects: [],
      scratchcount: 0,
      curPage: 1,
      totalPage: 1,
      limit: 20,
      lists: [],
    };
  },
  setup() {
    useHead({
      title: "用户",
    });
  },
  async created() {
    await this.getuserinfo();
    await this.getProjectList();
  },
  methods: {
    async getuserinfo() {
      if (
        Number(this.$route.params.id) &&
        Number(this.$route.params.id) !== 0
      ) {
        this.userinfo = await request({
          url: "/api/getuserinfo?id=" + this.$route.params.id,
          method: "get",
        });
        this.$refs.Projects.onPageChange(1);

        this.UserCardLoading = false;
        useHead({
          title: "" + this.userinfo.info.user.display_name,
        });
        console.log(this.userinfo);
      }
    },
    async getProjectList() {
      this.lists = (
        await request({
          url: `/projectlist/userid/${this.userinfo.info.user.id}/public`,
          method: "get",
        })
      ).data;
    },
  },
};
</script>
<style scoped>
.username {
  color: #fff;
  /* 白色文本 */
  font-weight: bold;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.911),
    rgba(255, 255, 255, 0.911)
  );
  background-clip: text;
  -webkit-background-clip: text;
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
}
</style>
