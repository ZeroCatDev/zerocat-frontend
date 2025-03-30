<template>
  <component :is="currentLayout">
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// 导入布局
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SimpleLayout from '@/layouts/SimpleLayout.vue';

const route = useRoute();

// 布局映射
const layouts = {
  'default': DefaultLayout,
  'simple': SimpleLayout,
};

// 根据路由元数据确定当前布局
const currentLayout = computed(() => {
  const layoutName = route.meta.layout || 'default';
  return layouts[layoutName];
});
</script> 