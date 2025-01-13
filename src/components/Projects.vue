<template>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-row>
      <v-col cols="12">
        <p class="mt-2 text-medium-emphasis">
          <v-chip>
            <v-icon icon="mdi-timer" start></v-icon>
            加载耗时: {{ loadTime }} ms
          </v-chip>
          <v-chip v-if="totalCount">
            <v-icon icon="mdi-counter" start></v-icon>
            总作品数量: {{ totalCount }}
          </v-chip>
        </p>
      </v-col>
    </v-row>
    <show-projects :projectIds="projectIds" :actions="actions"></show-projects>
    <br />
    <v-pagination
      v-if="hasTotalCount"
      v-model="page"
      :length="totalPage"
      @input="fetchProjects"
      rounded="circle"
    ></v-pagination>
    <v-btn v-else @click="loadMore" color="primary">继续加载</v-btn>
</template>

<script>
import showProjects from "./project/showProjects.vue";
import request from "@/axios/axios";

export default {
  components: { showProjects },
  props: {
    url: {
      type: String,
      required: true,
    },
    actions: {
      type: Array,
    },
  },
  data() {
    return {
      projectIds: [],
      page: 1,
      limit: 16,
      totalPage: 1,
      totalCount: 0,
      loading: false,
      loadTime: 0,
    };
  },
  computed: {
    hasTotalCount() {
      return this.totalCount > 0;
    },
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      const startTime = performance.now();
      try {
        const response = await request.get(
          `${this.url}&curr=${this.page}&limit=${this.limit}`
        );
        this.projectIds = this.hasTotalCount
          ? response.projects
          : [...this.projectIds, ...response.projects];
        this.totalCount = response.totalCount || 0;
        this.totalPage = this.totalCount
          ? Math.ceil(this.totalCount / this.limit)
          : 1;
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        this.loading = false;
        this.loadTime = performance.now() - startTime;
      }
    },
    loadMore() {
      this.page++;
      this.fetchProjects();
    },
  },
  watch: {
    url: {
      handler() {
        this.page = 1;
        this.fetchProjects();
      },
      immediate: true,
    },
    page: {
      handler() {
        this.fetchProjects();
      },
    },
  },
};
</script>
