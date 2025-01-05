<template>
  <v-container
    ><v-responsive class="mt-12"
      ><v-container class="pa-md-12">
        <v-list
          border
          class="pb-4 mx-auto"
          lines="two"
          max-width="600"
          rounded="lg"
          slim
        >
          <v-list-item>
            <template #prepend>
              <v-badge
                bordered
                class="me-n2"
                color="amber"
                icon="mdi-star"
                location="bottom end"
                offset-x="4"
                offset-y="8"
              >
                <v-avatar color="surface-variant" />
              </v-badge>
            </template>
            <template #title>
              <strong>johnleider</strong>
              <span class="text-medium-emphasis font-weight-light">
                starred a repository
              </span>
            </template>
            <template #subtitle>
              <span class="font-weight-regular text-caption">3 hours ago</span>
            </template>
            <template #append>
              <v-btn
                class="mt-n4"
                icon="mdi-dots-horizontal"
                size="small"
                variant="text"
              />
            </template>
          </v-list-item>
          <v-list
            bg-color="surface-light"
            class="mx-4 pb-5"
            color="surface-light"
            density="compact"
            :lines="false"
            rounded="lg"
          >
            <v-list-item>
              <template #prepend>
                <v-avatar class="me-n2" color="surface-variant" size="18" />
              </template>
              <template #title> <strong>vuetifyjs/one</strong> </template>
              <template #append>
                <v-btn-group
                  border
                  color="primary"
                  density="compact"
                  rounded="lg"
                  size="x-small"
                >
                  <v-btn
                    class="text-none"
                    prepend-icon="mdi-star-outline"
                    text="Star"
                  />
                  <v-divider color="surface-light" vertical />
                  <v-btn class="px-5" icon="mdi-menu-down" />
                </v-btn-group>
              </template>
            </v-list-item>
            <div class="ps-4">
              <div class="mb-3 text-body-2">
                <span class="pe-1">✨</span> Binding the Vuetify ecosystem
              </div>
              <div class="d-flex align-center text-caption">
                <div class="me-4">
                  <v-badge color="primary" dot inline /> TypeScript
                </div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-star-outline" /> 431
                </div>
              </div>
            </div>
          </v-list>
        </v-list>
      </v-container>
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
