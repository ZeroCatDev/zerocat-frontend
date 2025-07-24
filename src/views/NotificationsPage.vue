<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <NotificationsCard :showPagination="true"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NotificationsCard from "@/components/NotificationsCard.vue";

export default {
  components: {
    NotificationsCard
  }
};
</script>
