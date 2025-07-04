<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        xxl="2"
        v-for="project in projects"
        :key="project.id"
      >
        <v-card :to="'/app/proxy/' + project.id" border hover>
          <v-img
            :src="`${scratch_proxy}/thumbnails/${project.id}`"
            cover
            lazy-src="../../assets/43-lazyload.png"
          ></v-img>
          <v-card-item>
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card-item>
          <v-list v-if="showUserInfo">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar
                  :image="`${this.scratch_proxy}/avatars/${project.author?.id||project.creator_id||''}`"
                ></v-avatar>
              </template>
              <v-list-item-title>
                {{ project.author?.username||project.username }}
              </v-list-item-title>
              <v-list-item-subtitle>{{
                project.author?.id||project.creator_id
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="project.actor_id">
              <template v-slot:prepend>
                <v-avatar
                  :image="`${this.scratch_proxy}/avatars/${project.actor_id}`"
                ></v-avatar>
              </template>
              <v-list-item-title>
                {{ project.actor_id }}
              </v-list-item-title>
              <v-list-item-subtitle>将作品添加进工作室</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col> </v-row
    ><br /><v-card :title="title" :subtitle="subtitle" border hover>
      <v-progress-linear
        :active="loading"
        height="4"
        indeterminate
      ></v-progress-linear>
      <v-card-actions>
        <v-btn @click="fetchProjects" :disabled="!canLoad"
          >继续加载</v-btn
        ></v-card-actions
      ></v-card
    >
    <br /><br />
  </div>
</template>

<script>
import request from "@/axios/axios";
import { get } from '@/services/serverConfig';

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
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    autoload: {
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
      scratch_proxy: '',
      limit: 40,
    };
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        const res = await request.get(
          `${this.scratch_proxy}${this.url}limit=${this.limit}&offset=${
            this.page * this.limit
          }`
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
        if (this.autoload == true) this.fetchProjects();
      },
      immediate: true,
    },
  },
  created() {
    if (this.autoload == true) this.fetchProjects();
  },
  async mounted() {
    this.scratch_proxy = await get('scratchproxy.url');
  },
};
</script>
