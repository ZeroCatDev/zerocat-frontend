<template>
  <v-row>
    <v-col
      v-for="project in projects"
      :key="project.id"
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
      xxl="2"
    >
      <v-card rounded="lg" border>
        <v-card
          :to="`/${project.author.username}/${project.id}`"
          style="aspect-ratio: 4/3"
          rounded="lg"
        >
          <v-img
            :src="'https://s4-1.wuyuan.1r.ink/scratch_slt/' + project.id"
            class="align-end"
            lazy-src="../../assets/43-lazyload.png"
            height="100%"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            cover
          >
            <v-card-item>
              <v-card-title>{{ project.title || "未缓存" }}</v-card-title>
              <v-card-subtitle>{{ project.description || "" }}</v-card-subtitle>
            </v-card-item>
          </v-img>
        </v-card>
        <!-- <v-card-title>{{ project.author.display_name || "未知用户" }}</v-card-title>
        <v-card-subtitle>{{ project.created_at || "未知时间" }}</v-card-subtitle>-->
        <v-card-actions v-if="actions">
          <div v-for="action in actions" :key="action.name">
            <v-btn @click="action.function(project.id, project)">{{
              action.name
            }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import request from "@/axios/axios.js";

export default {
  props: {
    projectIds: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
    },
  },
  data() {
    return {
      projects: [],
      authorids: [],
      authors: {},
    };
  },
  watch: {
    projectIds: {
      handler() {
        this.fetchProjects();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async fetchProjects() {
      const response = await request({
        url: "/project/batch",
        method: "post",
        data: {
          projectIds: this.projectIds,
        },
      });
      const projectMap = new Map(response.data.data.map(project => [project.id, project]));
      this.projects = this.projectIds.map(id => ({
        ...projectMap.get(id),
        author: { display_name: "加载中..." },
      }));
      this.updateAuthorIds();
    },
    updateAuthorIds() {
      this.authorids = [
        ...new Set(this.projects.map((project) => project.authorid)),
      ];
      this.fetchAuthors();
    },
    async fetchAuthors() {
      const response = await request({
        url: "/user/batch",
        method: "post",
        data: {
          userIds: this.authorids,
        },
      });
      const authors = {};
      response.data.data.forEach((user) => {
        authors[user.id] = user;
      });
      this.authors = authors;
      this.updateProjectAuthors();
    },
    updateProjectAuthors() {
      this.projects = this.projects.map((project) => ({
        ...project,
        author: this.authors[project.authorid] || { display_name: "未知用户" },
      }));
    },
  },
};
</script>
