<template>
  <v-container>
    <!-- 主标题卡片 -->
    <v-card class="mb-6" elevation="2">
      <v-card-item>
        <template v-slot:prepend>
          <v-icon
            icon="mdi-code-braces"
            size="large"
            class="me-4"
            color="primary"
          ></v-icon>
        </template>
        <v-card-title class="text-h5">系统管理</v-card-title>
        <v-card-subtitle class="mt-2"> 系统管理 </v-card-subtitle>
      </v-card-item>
    </v-card>

    <v-row>
      <!-- OAuth 应用卡片 -->
      <v-col cols="6" md="6" v-for="item in config" :key="item.path">
        <v-card :to="item.path" elevation="1" hover>
          <v-card-item>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-subtitle>
              {{ item.path }}
            </v-card-subtitle>
            <template v-slot:append>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AdminIndex",
  data() {
    return {
      config: [
        { name: "配置管理", path: "/app/admin/config" },
        { name: "Sitemap", path: "/app/admin/sitemap" },
        { name: "用户管理", path: "/app/admin/users" },
        { name: "项目管理", path: "/app/admin/project" },
      ],
    };
  },
};
</script>
