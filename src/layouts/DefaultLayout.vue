<template>
  <v-app>

    <Toast />
    <AppHeader />
    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script setup>
import Toast from "primevue/toast";
import AppHeader from "@/components/AppHeader.vue";
import { onMounted, watch } from 'vue';
import { useTheme } from 'vuetify';
// 引入Monaco编辑器的语言和主题配置
import * as monaco from 'monaco-editor';

const theme = useTheme();

// 从本地存储中获取主题设置
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  } else {
    // 检测系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme.global.name.value = prefersDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme.global.name.value);
  }


});

// 监听主题变化并保存到本地存储
watch(() => theme.global.name.value, (newTheme) => {
  localStorage.setItem('theme', newTheme);
});
</script>

