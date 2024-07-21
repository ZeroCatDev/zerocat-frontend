<template>
  <v-app>
    <Toast />
    <AppHeader />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import Toast from 'primevue/toast';
</script>
