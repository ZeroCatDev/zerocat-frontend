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
      <v-card rounded="lg" border >
        <v-card
          :to="`${project.authorid}/${project.id}`"
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
        <v-card-actions v-if="actions">
          <div v-for="action in actions" :key="action.name">
            <v-btn @click="action.function(project.id, project)">{{ action.name }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { liveFetchProjectDetails, refreshProjectCache } from "@/stores/cache/project.js";
import { liveFetchUserDetails, refreshUserCache } from "@/stores/cache/user.js";

export default {
  props: {
    projectIds: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
    }
  },
  data() {
    return {
      projects: [],
      authorids: [],
      authors: {},
      liveQuerySubscription: null,
      authorQuerySubscription: null,
    };
  },
  watch: {
    projectIds: {
      handler() {
        this.startLiveFetch();
        this.refreshData();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    startLiveFetch() {
      if (this.liveQuerySubscription) {
        this.liveQuerySubscription.unsubscribe();
      }
      this.liveQuerySubscription = liveFetchProjectDetails(this.projectIds, (projects) => {
        const projectMap = new Map(projects.map(project => [project.id, project]));
        this.projects = this.projectIds.map(id => projectMap.get(id)).filter(Boolean);
        this.updateAuthorIds();
      });
    },
    updateAuthorIds() {
      const newAuthorIds = [...new Set(this.projects.map((project) => project.authorid))];
      if (JSON.stringify(newAuthorIds) !== JSON.stringify(this.authorids)) {
        this.authorids = newAuthorIds;
        this.startAuthorLiveFetch();
      }
    },
    startAuthorLiveFetch() {
      if (this.authorQuerySubscription) {
        this.authorQuerySubscription.unsubscribe();
      }
      this.authorQuerySubscription = liveFetchUserDetails(this.authorids, (users) => {
        const authors = {};
        users.forEach((user) => {
          authors[user.id] = user;
        });
        this.authors = authors;
      });
    },
    async refreshData() {
      await refreshProjectCache(this.projectIds);
      await refreshUserCache(this.authorids);
    },
  },
  beforeDestroy() {
    if (this.liveQuerySubscription) {
      this.liveQuerySubscription.unsubscribe();
    }
    if (this.authorQuerySubscription) {
      this.authorQuerySubscription.unsubscribe();
    }
  },
};
</script>
