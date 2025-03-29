<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    
    <template v-else>
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <span>{{ listInfo.title || '未命名列表' }}</span>
              <v-chip class="ml-2" :color="listInfo.state === 'public' ? 'success' : 'warning'" size="small">
                {{ listInfo.state === 'public' ? '公开' : '私密' }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-btn
                v-if="isOwner"
                icon="mdi-pencil"
                variant="text"
                size="small"
                @click="openEditDialog"
                color="primary"
              ></v-btn>
            </v-card-title>
            
            <v-card-subtitle v-if="listInfo.description">
              {{ listInfo.description }}
            </v-card-subtitle>
            
            <v-card-text>
              <div class="d-flex align-center mb-2">
                <v-avatar size="24" class="mr-2">
                  <v-img :src="getAvatarUrl(authorInfo)" alt="用户头像"></v-img>
                </v-avatar>
                <span class="text-caption">{{ authorInfo.username || authorInfo.display_name || '未知用户' }}</span>
              </div>
              <div class="d-flex flex-wrap">
                <span class="text-caption mr-4">创建于: {{ formatDate(listInfo.createTime) }}</span>
                <span class="text-caption">更新于: {{ formatDate(listInfo.updateTime) }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row v-if="!hasProjects">
        <v-col cols="12" class="text-center">
          <v-alert type="info" variant="tonal">
            此列表暂无项目
          </v-alert>
        </v-col>
      </v-row>
      
      <v-row v-else>
        <v-col cols="12">
          <h3 class="text-h6 mb-4">项目列表</h3>
          <v-row>
            <v-col 
              v-for="project in listInfo.projects" 
              :key="project.id"
              cols="12" sm="6" md="4" lg="3"
            >
              <project-card 
                :project-data="project" 
                :author-data="getUserInfo(project.authorid)" 
                :show-author="true"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
    
    <v-dialog v-model="editDialog" max-width="600px">
      <EditProjectListConfig 
        :listid="listId" 
        :callback="fetchProjectList" 
        :close="() => editDialog = false" 
      />
    </v-dialog>
  </v-container>
</template>

<script>
import request from "../../axios/axios";
import EditProjectListConfig from "./EditProjectListConfig.vue";
import { localuser } from "../../services/localAccount";
import { getUserById } from "../../stores/user";
import ProjectCard from "../project/ProjectCard.vue";

export default {
  props: {
    listId: {
      type: String,
      required: true,
    },
  },
  components: {
    EditProjectListConfig,
    ProjectCard
  },
  data() {
    return {
      loading: true,
      listInfo: {},
      isOwner: false,
      editDialog: false,
      userCache: {},
      authorInfo: {}
    };
  },
  computed: {
    hasProjects() {
      return this.listInfo.projects && this.listInfo.projects.length > 0;
    }
  },
  async created() {
    await this.fetchProjectList();
  },
  methods: {
    async fetchProjectList() {
      this.loading = true;
      try {
        const response = await request.get(`/projectlist/lists/listid/${this.listId}`);
        if (response.data.status === "success") {
          this.listInfo = response.data.data;
          
          // 检查当前用户是否是列表所有者
          const currentUser = localuser.user.value;
          this.isOwner = currentUser && currentUser.id === this.listInfo.authorid;
          
          // 获取作者信息
          if (this.listInfo.authorid) {
            this.authorInfo = await this.fetchUserInfo(this.listInfo.authorid);
          }
          
          // 获取项目作者信息
          if (this.listInfo.projects && this.listInfo.projects.length > 0) {
            const authorIds = [...new Set(this.listInfo.projects.map(p => p.authorid))];
            await Promise.all(authorIds.map(id => this.fetchUserInfo(id)));
          }
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: response.data.message || "获取列表失败",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("获取列表失败:", error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "获取列表失败",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserInfo(userId) {
      if (this.userCache[userId]) return this.userCache[userId];
      
      try {
        const userData = await getUserById(userId);
        this.userCache[userId] = userData;
        return userData;
      } catch (error) {
        console.error(`获取用户 ${userId} 信息失败:`, error);
        return { id: userId, username: `用户${userId}` };
      }
    },
    
    getUserInfo(userId) {
      return this.userCache[userId] || { id: userId, username: `用户${userId}` };
    },
    
    getAvatarUrl(user) {
      if (!user) return '';
      
      if (user.avatar) return user.avatar;
      
      if (user.images) {
        return `${import.meta.env.VITE_APP_S3_BUCKET}/user/${user.images}`;
      }
      
      return '';
    },
    
    openEditDialog() {
      this.editDialog = true;
    },
    
    formatDate(dateString) {
      if (!dateString) return '未知';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
};
</script>

<style scoped>
.v-card-title {
  word-break: break-word;
}
</style>
