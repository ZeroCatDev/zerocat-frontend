<template>
  <error404 />
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import error404 from "@/components/error/404.vue";

const router = useRouter();
const route = useRoute();

if (route.path.startsWith('/proxy')) {
  router.replace(`/app${route.path}`);
}
</script>
