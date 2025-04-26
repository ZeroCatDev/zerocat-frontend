<template>
  <div class="user-following">
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="following.length === 0">
      <v-col cols="12" class="text-center">
        <p class="text-medium-emphasis">暂无关注的用户</p>
      </v-col>
    </v-row>

    <template v-else>
      <v-card v-for="followedUser in following" :key="followedUser.id" class="mb-3" hover>
        <v-card-item>
          <template v-slot:prepend>
            <router-link :to="`/${followedUser.user.username}`">
              <v-avatar size="50">
                <v-img :src="VITE_APP_S3_BUCKET + '/user/' + (followedUser.user.avatar || followedUser.user.images)" alt="用户头像" />
              </v-avatar>
            </router-link>
          </template>

          <v-card-title>
            <router-link :to="`/${followedUser.user.username}`" class="text-decoration-none">
              {{ followedUser.user.display_name }}
            </router-link>
          </v-card-title>

          <v-card-subtitle class="text-truncate">{{ followedUser.created_at || '' }}</v-card-subtitle>

          <template v-slot:append>
            <div class="d-flex align-center">
              <v-chip v-if="followedUser.followsYou" color="secondary" size="small" class="mr-2">
                关注了你
              </v-chip>
              <v-btn
                v-if="localuser.user.id && localuser.user.id !== followedUser.user.id"
                :loading="unfollowingId === followedUser.user.id"
                variant="outlined"
                color="primary"
                size="small"
                prepend-icon="mdi-account-minus"
                @click="unfollowUser(followedUser.user.id, followedUser.user.display_name)"
              >
                取消关注
              </v-btn>
            </div>
          </template>
        </v-card-item>
      </v-card>

      <div class="d-flex justify-center mt-4 mb-4">
        <v-btn v-if="hasMoreFollowing" :loading="loadingMore" variant="tonal" @click="loadMoreFollowing">
          加载更多
        </v-btn>
        <div v-else-if="following.length > 0" class="text-medium-emphasis">
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
  name: "UserFollowing",
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
      following: [],
      loading: true,
      loadingMore: false,
      unfollowingId: null,
      totalFollowing: 0,
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
    hasMoreFollowing() {
      return this.following.length < this.totalFollowing && this.showAll;
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.fetchFollowing();
        }
      }
    }
  },
  methods: {
    async fetchFollowing(loadMore = false) {
      if (!this.userId) return;

      try {
        if (loadMore) {
          this.loadingMore = true;
        } else {
          this.loading = true;
        }

        const offset = loadMore ? this.following.length : 0;
        const limitToUse = this.showAll ? this.limit : Math.min(this.limit, 5);

        const response = await request.get(`/follows/following/${this.userId}`, {
          params: {
            limit: limitToUse,
            offset: offset
          }
        });

        if (response.data.success) {
          const data = response.data.data;

          if (loadMore) {
            this.following = [...this.following, ...data.following];
          } else {
            this.following = data.following;
          }

          this.totalFollowing = data.total;
        }
      } catch (error) {
        console.error("获取关注用户失败:", error);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },
    async unfollowUser(userId, displayName) {
      if (!this.localuser.user.id) {
        this.$router.push('/app/account/login');
        return;
      }

      try {
        this.unfollowingId = userId;

        await request.delete(`/follows/${userId}`);

        // Remove the unfollowed user from the list if viewing own following list
        if (this.userId === this.localuser.user.id) {
          this.following = this.following.filter(follow => follow.user.id !== userId);
          this.totalFollowing--;
        } else {
          // Just update the status if viewing someone else's following list
          const index = this.following.findIndex(follow => follow.user.id === userId);
          if (index !== -1) {
            this.following[index].isFollowing = false;
          }
        }

        this.showSnackbar(`已取消关注 ${displayName}`, "info");
      } catch (error) {
        console.error("取消关注失败:", error);
        this.showSnackbar("操作失败，请稍后重试", "error");
      } finally {
        this.unfollowingId = null;
      }
    },
    async loadMoreFollowing() {
      await this.fetchFollowing(true);
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