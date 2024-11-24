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
import { useHead } from "@unhead/vue";
useHead({
  titleTemplate: (title) => (!title ? "ZeroCat社区" : `${title} - ZeroCat社区`),
  meta: [
    {
      name: "description",
      content:
        "ZeroCat是新一代开源编程社区！",
    },
    {
      name: "keywords",
      content:
        "scratch编程,scratch社区,python编程,python社区,在线编程,编程社区,开源,自托管,开源编程社区,代码,阿尔法营,有道小图灵,别针社区,clipcc,蝾螈池,zerocat",
    },
  ],
});
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
