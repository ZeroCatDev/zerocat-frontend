<template>
  <v-app>
    <Toast />
    <AppHeader />
    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition name="md3" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import Toast from "primevue/toast";
</script>

<style scoped>
.md3-enter-active,
.md3-leave-active {
  transition: opacity 0.25s ease, transform 0.3s ease-in-out;
}

/* 页面进入的初始状态 */
.md3-enter-from {
  opacity: 0;
  transform: translateX(15px) scale(1); /* 从右侧轻微滑入并缩小 */
}

/* 页面离开状态 */
.md3-leave-to {
  opacity: 0;
  transform: translateX(-15px) scale(1); /* 向左滑出并缩小 */
}
</style>
