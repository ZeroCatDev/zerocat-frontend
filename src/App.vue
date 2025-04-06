<template>
  <component :is="layout" :key="route.path">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from "@unhead/vue";

// 导入布局
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SimpleLayout from '@/layouts/SimpleLayout.vue';

const route = useRoute();

// 根据路由元数据确定使用哪个布局
const layout = computed(() => {
  const layoutName = route.meta.layout || 'default';
  return layouts[layoutName];
});

// 可用布局映射
const layouts = {
  'default': DefaultLayout,
  'simple': SimpleLayout,
};

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
