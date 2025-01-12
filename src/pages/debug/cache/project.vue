<template>
  <v-container>
    <v-card border>
      <v-card-title>实时获取缓存的项目数据</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="inputValue"
          label="输入项目ID"
          class="mb-4"
        ></v-text-field>
        <v-btn @click="startLiveFetch" color="primary" class="mb-4">实时获取数据</v-btn>
        <v-list>
          <v-list-item v-for="project in projects" :key="project.id">
            <v-list-item-title>{{ project.title || '未缓存' }}</v-list-item-title>
            <v-list-item-subtitle>{{ project.description || '' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>


    <v-card class="mt-4" border>
      <v-card-title>添加缓存的项目数据</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="ProjectID"
            label="项目ID"
            type="number"
            required
          ></v-text-field>

          <div class="d-flex gap-2">
            <v-btn @click="addProject" color="primary">添加</v-btn>
            <v-btn @click="removeProject" color="error">删除</v-btn>
            <v-btn @click="refreshProject" color="info">刷新</v-btn>
          </div>

          <v-alert
            v-if="status"
            :type="status.includes('成功') ? 'success' : 'error'"
            class="mt-4"
          >
            {{ status }}
          </v-alert>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card class="mt-4" border>
      <v-card-title>所有缓存的项目数据</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="project in allProjects" :key="project.id">
            <v-list-item-title>{{ project.title || '未缓存' }}</v-list-item-title>
            <v-list-item-subtitle>{{ project.description || '' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { fetchProjectDetails, addProjectCache, removeProjectCache, refreshProjectCache, liveFetchProjectDetails,DebugliveFetchAllProjectDetails } from "../../../stores/cache/project.js";

export default {
  data() {
    return {
      inputValue: "",
      projects: [],
      allProjects: [],
      status: "",
      ProjectID: 0,
      liveQuerySubscription: null,
      allProjectsSubscription: null,
    };
  },
  methods: {
    async fetchProjects() {
      const ids = this.inputValue.split(",").map((id) => Number(id.trim())); // 确保 id 类型为 number
      const result = await fetchProjectDetails(ids);
      if (typeof result === "object" && !Array.isArray(result)) {
        this.projects = [result];
      } else {
        this.projects = result;
      }
    },
    async addProject() {
      const project = {
        id: Number(this.ProjectID), // 确保 id 类型为 number
        title: "测试项目",
        description: "这是一个测试项目",
        authorid: 1,
        type: "text",
        licence: "MIT",
        state: "public",
        view_count: 0,
        time: new Date().toISOString(),
        tags: [],
        source: "test",
      };
      this.status = await addProjectCache(project);
    },
    async removeProject() {
      this.status = await removeProjectCache(Number(this.ProjectID)); // 确保 id 类型为 number
      this.ProjectID = 0;
    },
    async refreshProject() {
      this.status = await refreshProjectCache(Number(this.ProjectID)); // 确保 id 类型为 number
    },
    startLiveFetch() {
      const ids = this.inputValue.split(",").map((id) => Number(id.trim())); // 确保 id 类型为 number
      if (this.liveQuerySubscription) {
        this.liveQuerySubscription.unsubscribe();
      }
      this.liveQuerySubscription = liveFetchProjectDetails(ids, (projects) => {
        this.projects = projects;
      });

      if (this.allProjectsSubscription) {
        this.allProjectsSubscription.unsubscribe();
      }
      this.allProjectsSubscription = DebugliveFetchAllProjectDetails((projects) => {
        this.allProjects = projects;
      });
    },
  },
  mounted() {
    this.startLiveFetch();
  },
  beforeDestroy() {
    if (this.liveQuerySubscription) {
      this.liveQuerySubscription.unsubscribe();
    }
    if (this.allProjectsSubscription) {
      this.allProjectsSubscription.unsubscribe();
    }
  },
};
</script>

