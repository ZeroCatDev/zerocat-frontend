<template>
  <v-app>
    <Toast/>
    <AppHeader @toggle-drawer="drawer = !drawer" />

    <!-- 统一侧边栏 - 使用 Vuetify 原生 temporary 模式 -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      :width="280"
    >
      <UnifiedSidebar mode="vuetify" />
    </v-navigation-drawer>

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
import { ref, onMounted, watch } from "vue";
import { useTheme } from "vuetify";
import AppHeader from "@/components/AppHeader.vue";
import UnifiedSidebar from "@/components/sidebar/UnifiedSidebar.vue";
import Toast from "primevue/toast";
import error404 from "@/components/error/404.vue";
import { use404 } from "@/composables/use404";

const theme = useTheme();

// 抽屉状态 - 默认关闭，不缓存
const drawer = ref(false);

// 主题管理
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.global.name.value = prefersDark ? "dark" : "light";
    localStorage.setItem("theme", theme.global.name.value);
  }
};

watch(() => theme.global.name.value, (newTheme) => {
  localStorage.setItem("theme", newTheme);
});

onMounted(() => {
  initTheme();
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
