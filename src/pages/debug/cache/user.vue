<template>
  <v-container>
    <v-card border>
      <v-card-title>获取数据</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="inputValue"
          label="输入ID"
          class="mb-4"
        ></v-text-field>
        <v-btn @click="startLiveFetch" color="primary" class="mb-4">实时获取数据</v-btn>
        <v-list>
          <v-list-item v-for="friend in users" :key="friend.id">
            <v-list-item-title>{{ friend.display_name || '未缓存' }}</v-list-item-title>
            <v-list-item-subtitle>{{ friend.motto || '' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card class="mt-4" border>
      <v-card-title>添加数据</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="UserID"
            label="ID"
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
  </v-container>
</template>

<script>
import { liveQuery } from "dexie";
import { ref } from "vue";
import { db } from "@/stores/db.js";
import { fetchUserDetails, addUserCache, removeUserCache, refreshUserCache, liveFetchUserDetails } from "../../../stores/cache/user.js";

export default {
  data() {
    return {
      inputValue: "",
      users: [],
      status: "",
      UserID: 0,
      liveQuerySubscription: null,
    };
  },
  methods: {
    async fetchUsers() {
      const ids = this.inputValue.split(",").map((id) => Number(id.trim())); // 确保 id 类型为 number
      const result = await fetchUserDetails(ids);
      if (typeof result === "object" && !Array.isArray(result)) {
        this.users = [result];
      } else {
        this.users = result;
      }
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
  },
  mounted() {
    liveQuery(() => db.users.toArray()).subscribe((users) => {
      this.users = users;
    });
  },
  beforeDestroy() {
    if (this.liveQuerySubscription) {
      this.liveQuerySubscription.unsubscribe();
    }
  },
};
</script>
