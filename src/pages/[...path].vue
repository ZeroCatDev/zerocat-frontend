<template>
  <error404/>
</template>

<script setup>
import error404 from "@/components/error/404.vue";


if (this.$route.path.startsWith('/proxy')) {
  this.$router.replace(`/app${route.path}`);
}
</script>
