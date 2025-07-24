<template>
  <v-card :to="'/' + author.username" border hover>
    <v-card-item>
      <template v-slot:prepend>
        <v-avatar>
          <v-img
            :alt="author.display_name"
            :src="s3BucketUrl + '/user/' + author.avatar"
          ></v-img>
        </v-avatar>
      </template>
      <v-card-title class="text-white">{{ author.display_name }}</v-card-title>
      <v-card-subtitle class="text-white">{{ author.bio }}</v-card-subtitle>

      <template v-if="localuser.id && localuser.id !== author.id" v-slot:append>
        <user-relation-controls
          :display-name="author.display_name"
          :user-id="author.id"
          :username="author.username"
        />
      </template>
    </v-card-item>
  </v-card>
</template>

<script>
import {localuser} from "@/services/localAccount";
import UserRelationControls from "@/components/user/UserRelationControls.vue";
import {get} from "@/services/serverConfig";

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
      loading: false,
      error: null,
      s3BucketUrl: '',
    }
  },
  async mounted() {
    this.s3BucketUrl = await get('s3.staticurl');
  }
}
</script>
