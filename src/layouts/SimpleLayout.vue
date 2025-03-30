<template>
  <v-app>
    <Toast />
    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition name="md3" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import Toast from "primevue/toast";
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

// 从本地存储中获取主题设置
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});
</script>

<style>
.md3-enter-active,
.md3-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.md3-enter-from,
.md3-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 