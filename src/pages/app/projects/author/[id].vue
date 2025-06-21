<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <user-info-card :user-id="$route.params.id" />
      </v-col>
      <v-col cols="12" md="8" lg="9">
        <project-query-view type="author" :target="$route.params.id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProjectQueryView from "@/components/project/ProjectQueryView.vue";
import UserInfoCard from "@/components/user/UserInfoCard.vue";

export default {
  components: {
    ProjectQueryView,
    UserInfoCard,
  },
};
</script>