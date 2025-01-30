<template>
  <div>
    <v-progress-linear
      :active="loading"
      height="4"
      indeterminate
    ></v-progress-linear>
    <v-row>
      <v-col cols="4" md="2" v-for="project in projects" :key="project.id">
        <v-card :to="'/app/proxy/' + project.id">
          <v-img
            :src="`${scratch_proxy}/thumbnails/${project.id}`"
            cover
            lazy-src="../assets/43-lazyload.png"
          ></v-img>
          <v-card-item>
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card-item>
          <v-list v-if="showUserInfo">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar
                  :image="`${this.scratch_proxy}/avatars/${project.author.id}`"
                ></v-avatar>
              </template>
              <v-list-item-title>
                {{ project.author.username }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ project.author.id }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <br />
    <v-btn @click="fetchProjects" :disabled="!canLoad">继续加载</v-btn>
    <br /><br />
  </div>
</template>

<script>
import request from "@/axios/axios";

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    showUserInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      projects: [],
      page: 0,
      canLoad: true,
      loading: false,
      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
      limit: 40,
    };
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        const res = await request.get(
          `${this.scratch_proxy}${this.url}limit=${this.limit}&offset=${this.page * this.limit}`
        );
        if (res.data.length === 0) {
          this.canLoad = false;
        }
        this.projects = this.projects.concat(res.data);
        this.page += 1;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    url: {
      handler() {
        this.projects = [];
        this.page = 0;
        this.canLoad = true;
        this.fetchProjects();
      },
      immediate: true,
    },
  },
  created() {
    this.fetchProjects();
  },
};
</script>
