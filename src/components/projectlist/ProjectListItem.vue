<template>
  <v-card
    :title="list.title"
    :subtitle="list.description || '无描述'"
    class="h-100"
    :to="`/app/projectlist/${list.id}`"
  >
    <v-card-text>
      <div class="d-flex align-center">
        <v-chip :color="list.state === 'public' ? 'success' : 'warning'" size="small" class="mr-2">
          {{ list.state === 'public' ? '公开' : '私密' }}
        </v-chip>
        <span class="text-caption">{{ formatDate(list.updateTime || list.updatedAt) }}</span>
      </div>
      <div class="mt-2 d-flex align-center">
        <span class="text-caption">项目数: {{ projectCount }}</span>
        <v-spacer></v-spacer>
        <span v-if="list.author" class="text-caption">
          <v-avatar size="16" class="mr-1">
            <v-img :src="getUserAvatar(list.author)" alt="用户头像"></v-img>
          </v-avatar>
          {{ list.author.display_name || list.author.username || `用户${list.authorid}` }}
        </span>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        v-if="isOwner"
        icon="mdi-pencil"
        variant="text"
        size="small"
        @click.stop.prevent="$emit('edit', list.id)"
        color="primary"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-eye"
        variant="text"
        size="small"
        :to="`/app/projectlist/${list.id}`"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { localuser } from "../../services/localAccount";
import { getProjectListById } from "../../services/projectListService";
import { ref, onMounted } from "vue";
import { get } from "@/services/serverConfig";

export default {
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      projectCount: 0,
      loading: false,
      error: null,
    };
  },
  computed: {
    isOwner() {
      const currentUser = localuser.user.value;
      return currentUser && currentUser.id === (this.list.authorid || this.list.userId);
    }
  },
  async created() {
    await this.fetchProjectCount();
  },
  setup() {
    const s3BucketUrl = ref(null);

    onMounted(async () => {
      s3BucketUrl.value = await get('s3.staticurl');
    });

    const getUserAvatar = (user) => {
      if (!user || !user.avatar) return '';
      return `${s3BucketUrl.value}/user/${user.avatar}`;
    };

    return {
      s3BucketUrl,
      getUserAvatar,
    };
  },
  methods: {
    async fetchProjectCount() {
      if (!this.list.projects) {
        try {
          this.loading = true;
          const response = await getProjectListById(this.list.id);
          if (response.status === "success" && response.data) {
            this.projectCount = response.data.projects?.length || 0;
          }
        } catch (error) {
          console.error(`获取列表 ${this.list.id} 项目数量失败:`, error);
        } finally {
          this.loading = false;
        }
      } else {
        this.projectCount = this.list.projects.length;
      }
    },

    formatDate(dateString) {
      if (!dateString) return '未知';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  }
};
</script>