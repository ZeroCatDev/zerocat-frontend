<template>
  <v-container>
    <v-card border>
      <v-card-title>实时获取缓存的用户数据</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="inputValue"
          label="输入用户ID"
          class="mb-4"
        ></v-text-field>
        <v-btn @click="fetchUserInfo" color="primary" class="mb-4">获取用户信息</v-btn>
        <v-list>
          <v-list-item v-for="friend in users" :key="friend.id">
            <v-list-item-title>{{ friend.display_name || '未缓存' }}</v-list-item-title>
            <v-list-item-subtitle>{{ friend.motto || '' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card class="mt-4" border>
      <v-card-title>添加缓存的用户数据</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="UserID"
            label="用户ID"
            type="number"
            required
          ></v-text-field>

          <div class="d-flex gap-2">
            <v-btn @click="addUser" color="primary">添加</v-btn>
            <v-btn @click="removeUser" color="error">删除</v-btn>
            <v-btn @click="refreshUser" color="info">刷新</v-btn>
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
      <v-card-title>所有缓存的用户数据</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="user in allUsers" :key="user.id">
            <v-list-item-title>{{ user.display_name || '未缓存' }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.motto || '' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { fetchUserDetails, addUserCache, removeUserCache, refreshUserCache, getUserInfo, liveFetchUserDetails, DebugliveFetchAllUserDetails } from "../../../stores/cache/user.js";

export default {
  data() {
    return {
      inputValue: "",
      users: [],
      status: "",
      UserID: 0,
      liveQuerySubscription: null,
      allUsers: [],
    };
  },
  methods: {
    async fetchUserInfo() {
      const ids = this.inputValue.split(",").map((id) => Number(id.trim())); // 确保 id 类型为 number
      const result = await Promise.all(ids.map(id => getUserInfo(id)));
      this.users = result;
    },
    async addUser() {
      const user = {
        id: Number(this.UserID), // 确保 id 类型为 number
        display_name: "测试用户",
        motto: "这是一个测试",
        images: [],
        regTime: new Date().toISOString(),
        sex: "未知",
        username: "testuser",
      };
      this.status = await addUserCache(user);
    },
    async removeUser() {
      this.status = await removeUserCache(Number(this.UserID)); // 确保 id 类型为 number
      this.UserID = 0;
    },
    async refreshUser() {
      this.status = await refreshUserCache(Number(this.UserID)); // 确保 id 类型为 number
    },
    startLiveFetch() {
      const ids = this.inputValue.split(",").map((id) => Number(id.trim())); // 确保 id 类型为 number
      if (this.liveQuerySubscription) {
        this.liveQuerySubscription.unsubscribe();
      }
      this.liveQuerySubscription = liveFetchUserDetails(ids, (users) => {
        this.users = users;
      });
    },
    startLiveFetchAll() {
      if (this.liveQuerySubscription) {
        this.liveQuerySubscription.unsubscribe();
      }
      this.liveQuerySubscription = DebugliveFetchAllUserDetails((users) => {
        this.allUsers = users;
      });
    },
  },
  mounted() {
    this.startLiveFetch();
    this.startLiveFetchAll();
  },
  beforeDestroy() {
    if (this.liveQuerySubscription) {
      this.liveQuerySubscription.unsubscribe();
    }
  },
};
</script>



