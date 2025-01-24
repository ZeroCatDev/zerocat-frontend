<template>
  <v-container>
<v-tabs-window v-model="tab">
  <v-tabs-window-item value="home">

    <v-responsive class="mt-8">
      <v-row class="d-flex align-center">
        <v-col>
          <p class="font-weight-medium text-primary">ZeroCat 用户</p>

          <p
            class="font-weight-bold text-sm-h2 text-h4 mt-2 d-inline-flex align-center username"
          >
            {{ user.display_name }}
            <v-avatar size="52" class="ma-2">
              <v-img :src="'https://s4-1.wuyuan.1r.ink/user/' + user.images" />
            </v-avatar>
          </p>

          <p class="mt-2 text-body-1 text-medium-emphasis">{{ user.motto }}</p>

          <p class="mt-2 text-medium-emphasis">
            <v-chip>
              <v-icon icon="mdi-account-circle" start></v-icon>
              ID:{{ user.id }}
            </v-chip>
            <v-chip>
              <v-icon icon="mdi-clock" start></v-icon>
              {{ user.regTime }}注册
            </v-chip>
            <v-chip>
              <v-icon icon="mdi-tag" start></v-icon>
              创作者
            </v-chip>
          </p>
        </v-col>
      </v-row>
    </v-responsive>
    <br />
    <Projects :url="url"></Projects>

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
            :to="'/app/projectlist/' + item.id"
            rounded="lg"
            :title="item.title"
            :subtitle="item.description"
            color="primary"
            variant="tonal"
          >
          </v-card>
        </v-card>
      </v-col>
    </v-row>
    <br />
    <Comment :url="'user-' + user.id" name="用户"></Comment>

  </v-tabs-window-item>
  <v-tabs-window-item value="comment">
    <Comment :url="'user-' + user.id" name="用户"></Comment>

  </v-tabs-window-item>
  <v-tabs-window-item value="3">
    <div>内容 3</div>
  </v-tabs-window-item>
</v-tabs-window> </v-container>

</template>

<script>
import Comment from "../../components/Comment.vue";
import Projects from "../../components/project/Projects.vue";
import { useHead } from "@unhead/vue";
import { getUserByUsername } from "../../stores/cache/user.js";
import request from "../../axios/axios.js";
export default {
  components: { Projects, Comment },
  data() {
    return {
      username: this.$route.params.username,
      user: {},
      lists: [],
      url: "",
      tab: this.$route.query.tab || 'home',
    };
  },
  watch: {
    '$route.query.tab'(newTab) {
      this.tab = newTab || 'home';
    }
  },
  async created() {
    await this.fetchUser();
    await this.getProjectList();
    this.tab = this.$route.query.tab || 'home';
  },
  methods: {
    async fetchUser() {
      this.user = await getUserByUsername(this.username);
      useHead({
        title: "" + this.user.display_name,
      });
      this.url = `/searchapi?search_userid=${this.user.id}&search_type=&search_title=&search_source=&search_description=&search_orderby=view_up&search_state=public&search_tag=`;
    },
    async getProjectList() {
      this.lists = (
        await request({
          url: `/projectlist/userid/${this.user.id}/public`,
          method: "get",
        })
      ).data.data;
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
  color: transparent;
  -webkit-text-fill-color: transparent;
}
</style>
