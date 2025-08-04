<template>
  <v-container class="notifications-page" >    <!-- 通知卡片 -->

        <notifications-card
          :show-pagination="true"
          :menu-mode="false"
          :show-header="true"
          :auto-fetch="true"
        />

  </v-container>
</template>

<script>
import NotificationsCard from '@/components/NotificationsCard.vue';

export default {
  name: 'NotificationsPage',
  components: {
    NotificationsCard
  }
};
</script>

<style scoped>
.notifications-page {
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .d-flex.align-center.justify-space-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>