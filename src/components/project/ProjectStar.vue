<template>
  <div class="d-flex align-center">
    <v-btn
      icon="mdi-star"
      variant="text"
      size="small"
      :color="isStarred ? 'amber' : 'grey'"
      @click="toggleStar"
      :loading="loading"
    ></v-btn>
    <span class="text-caption ml-1">{{ starCount }}</span>
  </div>
</template>

<script>
import { 
  checkStarStatus, 
  starProject, 
  unstarProject, 
  getProjectStarCount 
} from "../../services/projectListService";

export default {
  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isStarred: false,
      starCount: 0,
      loading: false
    };
  },
  async created() {
    await this.checkStarStatus();
    await this.getStarCount();
  },
  methods: {
    async checkStarStatus() {
      try {
        const response = await checkStarStatus(this.projectId);
        if (response.status === "success") {
          this.isStarred = response.star;
        }
      } catch (error) {
        console.error("检查收藏状态失败:", error);
      }
    },
    
    async getStarCount() {
      try {
        const response = await getProjectStarCount(this.projectId);
        if (response.status === "success") {
          this.starCount = response.data;
        }
      } catch (error) {
        console.error("获取收藏数失败:", error);
      }
      this.$emit('star-updated');
    },
    
    async toggleStar() {
      this.loading = true;
      try {
        const response = this.isStarred 
          ? await unstarProject(this.projectId)
          : await starProject(this.projectId);
        
        if (response.status === "success") {
          this.isStarred = !this.isStarred;
          await this.getStarCount();
          
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 2000,
          });
        }
      } catch (error) {
        console.error("切换收藏状态失败:", error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "操作失败",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
