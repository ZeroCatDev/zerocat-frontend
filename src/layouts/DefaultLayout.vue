<template>
  <v-app>
    <Toast/>
    <AppHeader/>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition mode="out-in" name="md3">
          <component
            :is="use404(route) ? error404 : Component"
            :key="route.path"
          />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import {onMounted, watch} from "vue";
import {useTheme} from "vuetify";
import AppHeader from "@/components/AppHeader.vue";
import Toast from "primevue/toast";
import error404 from "@/components/error/404.vue";
import {use404} from "@/composables/use404";

const theme = useTheme();

/**
 * 主题管理
 */
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  } else {
    // 检测系统主题偏好
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    theme.global.name.value = prefersDark ? "dark" : "light";
    localStorage.setItem("theme", theme.global.name.value);

    // 监听主题变化并保存到本地存储
    watch(
      () => theme.global.name.value,
      (newTheme) => {
        localStorage.setItem("theme", newTheme);
      }
    );
  }
};

// 初始化主题
onMounted(initTheme);
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
