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
  htmlAttrs: {
    lang: "zh-CN",
  },
  meta: [
    {
      name: "description",
      content: "ZeroCat是新一代开源编程社区！",
    },
    {
      name: "keywords",
      content:
        "scratch编程,scratch社区,python编程,python社区,在线编程,编程社区,开源,自托管,开源编程社区,代码,阿尔法营,有道小图灵,别针社区,clipcc,蝾螈池,zerocat",
    },
    {
      property: "og:title",
      content: "ZeroCat社区",
    },
    {
      property: "og:description",
      content: "ZeroCat是新一代开源编程社区！",
    },
    {
      property: "og:image",
      content: "https://zerocat.houlangs.com/og.png",
    },
    {
      property: "og:url",
      content: "https://zerocat.houlangs.com",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "ZeroCat社区",
    },
    {
      name: "twitter:description",
      content: "ZeroCat是新一代开源编程社区！",
    },
    {
      name: "twitter:image",
      content: "https://zerocat.houlangs.com/og.png",
    },
    {
      name: "twitter:url",
      content: "https://zerocat.houlangs.com",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black",
    },
    {
      name: "apple-mobile-web-app-title",
      content: "ZeroCat社区",
    },
    {
      name: "msapplication-TileColor",
      content: "#da532c",
    },
  ],
});
</script>
