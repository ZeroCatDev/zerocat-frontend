<template>
  <v-card border>
    <v-card-title>获取数据</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="inputValue"
        label="输入ID"
        class="mb-4"
      ></v-text-field>
      <v-btn @click="fetchUsers" color="primary" class="mb-4">获取数据</v-btn>
      <v-list>
        <v-list-item v-for="friend in users" :key="friend.id">
          <v-list-item-title>{{ friend.display_name }}</v-list-item-title>
          <v-list-item-subtitle>{{ friend.motto }}</v-list-item-subtitle>
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
          <v-btn @click="addFriend" color="primary">添加</v-btn>
          <v-btn @click="removeFriend" color="error">删除</v-btn>
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
</template>
<script>
import { liveQuery } from "dexie";
import { ref } from "vue";
import { db } from "@/stores/db.js";

export default {
  data() {
    return {
      inputValue: "",
      users: [],
      status: "",
      UserID: 0,
    };
  },
  methods: {
    async fetchUsers() {
      const ids = this.inputValue.split(",").map((id) => id.trim());
      const result = await this.fetchUserDetails(ids);
      console.log(result); // Display raw result
    },
    async fetchUserDetails(ids) {
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      return Promise.all(
        ids.map((id) =>
          db.users.get(Number(id)).then((user) => user || { id, cached: false })
        )
      ).then((users) => (ids.length === 1 ? users[0] : users));
    },
    async addFriend() {
      try {
        const resp = await fetch(
          `http://localhost:3000/api/getuserinfo?id=${this.UserID}`
        );
        const data = await resp.json();

        if (data.status === "ok") {
          const existingUser = await db.users.get(data.info.user.id);

          if (existingUser) {
            await db.users.put({
              id: data.info.user.id,
              display_name: data.info.user.display_name,
              motto: data.info.user.motto,
              images: data.info.user.images,
              regTime: data.info.user.regTime,
              sex: data.info.user.sex,
              username: data.info.user.username,
            });
            this.status = `用户 ${data.info.user.display_name} 更新成功.`;
          } else {
            const id = await db.users.add({
              id: data.info.user.id,
              display_name: data.info.user.display_name,
              motto: data.info.user.motto,
              images: data.info.user.images,
              regTime: data.info.user.regTime,
              sex: data.info.user.sex,
              username: data.info.user.username,
            });
            this.status = `用户 ${data.info.user.display_name} 成功缓存. 获取到id为 ${id}`;
          }
        } else {
          this.status = `添加 ${this.UserID} 失败: ${data.status}`;
        }
      } catch (error) {
        this.status = `添加 ${this.UserID} 失败: ${error}`;
      }
    },
    async removeFriend() {
      try {
        const existingUser = await db.users.get(Number(this.UserID));

        if (existingUser) {
          await db.users.delete(Number(this.UserID));
          this.status = `用户 ${existingUser.display_name} 删除成功.`;
        } else {
          this.status = `删除 ${this.UserID} 失败: User not found`;
        }

        this.UserID = 0;
      } catch (error) {
        this.status = `删除 ${this.UserID} 失败: ${error}`;
      }
    },
  },
  mounted() {
    liveQuery(() => db.users.toArray()).subscribe((users) => {
      this.users = users;
    });
  },
};
</script>

