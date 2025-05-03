<template>
  <v-container fluid class="pa-4">
    <v-card class="mb-4" border title="用户关系" subtitle="管理您的关注、粉丝和拉黑用户列表" prepend-icon="mdi-account-group">


    </v-card>

    <v-card hover border>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="following" prepend-icon="mdi-account-multiple">我的关注</v-tab>
        <v-tab value="followers" prepend-icon="mdi-account-group">我的粉丝</v-tab>
        <v-tab value="blocked" prepend-icon="mdi-account-cancel">拉黑用户</v-tab>
      </v-tabs>

      <v-card-text class="pa-4">
        <v-window v-model="tab">
          <v-window-item value="following">
            <h3 class="text-h5 mb-4">我的关注</h3>
            <p class="text-subtitle-1 mb-4">您正在关注的用户列表，可以随时取消关注</p>
            <user-following :user-id="userInfo.id" :show-all="true" v-if="userInfo.id" />
            <v-skeleton-loader v-else type="list-item-three-line" :loading="true" />
          </v-window-item>

          <v-window-item value="followers">
            <h3 class="text-h5 mb-4">我的粉丝</h3>
            <p class="text-subtitle-1 mb-4">关注您的用户列表，您可以选择关注回去</p>
            <user-followers :user-id="userInfo.id" :show-all="true" v-if="userInfo.id" />
            <v-skeleton-loader v-else type="list-item-three-line" :loading="true" />
          </v-window-item>

          <v-window-item value="blocked">
            <h3 class="text-h5 mb-4">拉黑用户</h3>
            <p class="text-subtitle-1 mb-4">您拉黑的用户列表，这些用户无法关注您或与您互动</p>
            <user-blocked :user-id="userInfo.id" :show-all="true" v-if="userInfo.id" />
            <v-skeleton-loader v-else type="list-item-three-line" :loading="true" />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { localuser } from "@/services/localAccount";
import { useHead } from "@unhead/vue";
import { getAccount } from "@/services/accountService";
import UserFollowing from "@/components/user/UserFollowing.vue";
import UserFollowers from "@/components/user/UserFollowers.vue";
import UserBlocked from "@/components/user/UserBlocked.vue";

export default {
  components: {
    UserFollowing,
    UserFollowers,
    UserBlocked
  },
  data() {
    return {
      tab: "following",
      localuser: localuser,
      userInfo: {},
      loading: false
    };
  },
  setup() {
    useHead({ title: "用户关系" });
  },
  watch: {
    "$route.query.tab": {
      immediate: true,
      handler(val) {
        if (val && ["following", "followers", "blocked"].includes(val)) {
          this.tab = val;
        }
      }
    },
    tab(val) {
      if (this.$route.query.tab !== val) {
        this.$router.replace({ query: { ...this.$route.query, tab: val } });
      }
    }
  },
  async created() {
    if (!localuser.isLogin.value) {
      this.$router.push("/app/account/login");
    } else {
      await this.getUserById();
    }
  },
  methods: {
    async getUserById() {
      this.loading = true;
      try {
        const response = await getAccount(localuser.user.value.id);
        this.userInfo = response.data.data;
      } catch (error) {
        this.showToast("error", "获取用户信息失败", error.message);
      } finally {
        this.loading = false;
      }
    },
    showToast(severity, summary, detail) {
      this.$toast.add({ severity, summary, detail, life: 3000 });
    }
  }
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>