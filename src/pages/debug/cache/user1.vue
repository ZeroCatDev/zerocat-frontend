<template>
  <v-container>
    <v-card border>
      <v-card-title>实时获取数据</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="friend in users" :key="friend.id">
            <v-list-item-title>{{ friend.display_name || '未缓存' }}</v-list-item-title>
            <v-list-item-subtitle>{{ friend.motto || '' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { liveFetchUserDetails } from "../../../stores/cache/user.js";

export default {
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    const ids = [0, 1]; // 写死获取 0 用户和 1 用户
    liveFetchUserDetails(ids, (users) => {
      this.users = users;
    });
  },
};
</script>
