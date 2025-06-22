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
        <v-card-title class="text-h5">开发者资源</v-card-title>
        <v-card-subtitle class="mt-2">
          将 ZeroCat 接入到你的应用中，探索我们丰富的开发工具和API。
        </v-card-subtitle>
      </v-card-item>
    </v-card>

    <v-row>
      <!-- OAuth 应用卡片 -->
      <v-col cols="12" md="6">
        <v-card to="/app/oauth/applications" class="h-100" elevation="1" hover>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon
                icon="mdi-key-variant"
                size="large"
                class="me-4"
                color="primary"
              ></v-icon>
            </template>
            <v-card-title>ZeroCat OAuth</v-card-title>
            <v-card-subtitle class="mt-2">
              创建和管理你的 OAuth 应用，实现安全的用户认证和授权。
            </v-card-subtitle>
            <v-card-text class="pt-4">
              <v-chip color="primary" variant="flat" size="small"
                >应用管理</v-chip
              >
              <v-chip color="primary" variant="flat" size="small" class="ms-2"
                >API 访问</v-chip
              >
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- API 文档卡片 -->
      <v-col cols="12" md="6">
        <v-card
          class="h-100"
          elevation="1"
          hover
          href="https://docs.wuyuan.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <v-card-item append-icon="mdi-open-in-new">
            <template v-slot:prepend>
              <v-icon
                icon="mdi-book-open-variant"
                size="large"
                class="me-4"
                color="primary"
              ></v-icon>
            </template>
            <v-card-title>社区文档</v-card-title>
            <v-card-subtitle class="mt-2">
              查看详细的社区文档，了解如何集成 ZeroCat 的功能。
            </v-card-subtitle>
            <v-card-text class="pt-4">
              <v-chip color="primary" variant="flat" size="small"
                >社区文档</v-chip
              >
              <v-chip color="primary" variant="flat" size="small" class="ms-2"
                >API 文档</v-chip
              >
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- 开发者支持卡片 -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="1">
          <v-card-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-help-circle" size="large" class="me-4"></v-icon>
            </template>
            <v-card-title>支持</v-card-title>
            <v-card-subtitle class="mt-2">
              遇到问题？我们提供多种支持渠道帮助你解决开发过程中的疑难。
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-github"
                variant="tonal"
                href="https://github.com/ZeroCatDev/ZeroCat/issues"
                target="_blank"
                rel="noopener noreferrer"
                append-icon="mdi-open-in-new"
                class="me-2"
                >GitHub</v-btn
              >
              <v-btn
                prepend-icon="mdi-email"
                variant="tonal"
                href="https://qm.qq.com/q/M7nifPnskw"
                target="_blank"
                rel="noopener noreferrer"
                append-icon="mdi-open-in-new"
                class="me-2"
                >QQ群</v-btn
              >
            </v-card-actions>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 如果需要添加交互功能可以在这里实现
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: translateY(-2px);
}
</style>
