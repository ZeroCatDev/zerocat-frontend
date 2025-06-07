<template>
  <v-card hover :to="'/' + author.username" border>
    <v-card-item>
      <template v-slot:prepend>
        <v-avatar>
          <v-img
            :alt="author.display_name"
            :src="VITE_APP_S3_BUCKET + '/user/' + author.images"
          ></v-img>
        </v-avatar>
      </template>
      <v-card-title class="text-white">{{ author.display_name }}</v-card-title>
      <v-card-subtitle class="text-white">{{ author.motto }}</v-card-subtitle>

      <template v-slot:append v-if="localuser.id && localuser.id !== author.id">
        <user-relation-controls
          :user-id="author.id"
          :username="author.username"
          :display-name="author.display_name"
        />
      </template>
    </v-card-item>
  </v-card>
</template>

<script>
import { localuser } from "@/services/localAccount";
import UserRelationControls from "@/components/user/UserRelationControls.vue";

export default {
  name: 'ProjectAuthorCard',
  components: {
    UserRelationControls
  },
  props: {
    author: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localuser,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
    }
  }
}
</script>