<template>
  <NotificationsPage />
</template>

<script setup>
import NotificationsPage from "@/views/NotificationsPage.vue";
</script>

<route>
{
  meta: {
    requiresAuth: true
  }
}
</route>