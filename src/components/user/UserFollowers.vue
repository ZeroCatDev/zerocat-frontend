<template>
  <div class="user-followers">
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="followers.length === 0">
      <v-col cols="12" class="text-center">
        <p class="text-medium-emphasis">暂无关注者</p>
      </v-col>
    </v-row>

    <template v-else>
      <v-card v-for="follower in followers" :key="follower.id" class="mb-3" hover>
        <v-card-item>
          <template v-slot:prepend>
            <router-link :to="`/${follower.user.username}`">
              <v-avatar size="50">
                <v-img :src="VITE_APP_S3_BUCKET + '/user/' + (follower.user.avatar || follower.user.images)" alt="用户头像" />
              </v-avatar>
            </router-link>
          </template>

          <v-card-title>
            <router-link :to="`/${follower.user.username}`" class="text-decoration-none">
              {{ follower.user.display_name }}
            </router-link>
          </v-card-title>

          <v-card-subtitle class="text-truncate">{{ follower.created_at || '' }}</v-card-subtitle>

          <template v-slot:append>
            <div class="d-flex align-center">
              <v-btn
                v-if="localuser.user.id && localuser.user.id !== follower.user.id"
                :loading="actionLoading === follower.user.id"
                :variant="follower.youFollow ? 'outlined' : 'tonal'"
                :color="'primary'"
                :prepend-icon="follower.youFollow ? 'mdi-account-minus' : 'mdi-account-plus'"
                size="small"
                @click="toggleFollow(follower.user.id, follower.user.display_name, follower.youFollow)"
              >
                {{ follower.youFollow ? "取消关注" : "关注" }}
              </v-btn>
            </div>
          </template>
        </v-card-item>
      </v-card>

      <div class="d-flex justify-center mt-4 mb-4">
        <v-btn v-if="hasMoreFollowers" :loading="loadingMore" variant="tonal" @click="loadMoreFollowers">
          加载更多
        </v-btn>
        <div v-else-if="followers.length > 0" class="text-medium-emphasis">
          没有更多内容了
        </div>
      </div>
    </template>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import request from "@/axios/axios.js";
import { localuser } from "@/services/localAccount";

export default {
  name: "UserFollowers",
  props: {
    userId: {
      type: Number,
      required: true
    },
    limit: {
      type: Number,
      default: 20
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      followers: [],
      loading: true,
      loadingMore: false,
      actionLoading: null,
      totalFollowers: 0,
      localuser,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
      snackbar: {
        show: false,
        text: "",
        color: "success"
      }
    };
  },
  computed: {
    hasMoreFollowers() {
      return this.followers.length < this.totalFollowers && this.showAll;
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.fetchFollowers();
        }
      }
    }
  },
  methods: {
    async fetchFollowers(loadMore = false) {
      if (!this.userId) return;

      try {
        if (loadMore) {
          this.loadingMore = true;
        } else {
          this.loading = true;
        }

        const offset = loadMore ? this.followers.length : 0;
        const limitToUse = this.showAll ? this.limit : Math.min(this.limit, 5);

        const response = await request.get(`/follows/followers/${this.userId}`, {
          params: {
            limit: limitToUse,
            offset: offset
          }
        });

        if (response.data.success) {
          const data = response.data.data;

          if (loadMore) {
            this.followers = [...this.followers, ...data.followers];
          } else {
            this.followers = data.followers;
          }

          this.totalFollowers = data.total;
        }
      } catch (error) {
        console.error("获取关注者失败:", error);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },
    async toggleFollow(userId, displayName, isFollowing) {
      if (!this.localuser.user.id) {
        this.$router.push('/app/account/login');
        return;
      }

      try {
        this.actionLoading = userId;

        if (isFollowing) {
          await request.delete(`/follows/${userId}`);
          this.showSnackbar(`已取消关注 ${displayName}`, "info");
        } else {
          await request.post(`/follows/${userId}`);
          this.showSnackbar(`已成功关注 ${displayName}`, "success");
        }

        // Update the follow status in the list
        const index = this.followers.findIndex(follower => follower.user.id === userId);
        if (index !== -1) {
          this.followers[index].youFollow = !isFollowing;
        }
      } catch (error) {
        console.error("关注操作失败:", error);
        this.showSnackbar("操作失败，请稍后重试", "error");
      } finally {
        this.actionLoading = null;
      }
    },
    async loadMoreFollowers() {
      await this.fetchFollowers(true);
    },
    showSnackbar(text, color = "success") {
      this.snackbar = {
        show: true,
        text,
        color
      };
    }
  }
};
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
  color: inherit;
}

.text-decoration-none:hover {
  text-decoration: underline;
  opacity: 0.8;
}
</style>