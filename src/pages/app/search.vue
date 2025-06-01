<template>
  <v-container>
    <SearchComponent />
  </v-container>
</template>

<script>
import { useHead } from "@unhead/vue";
import SearchComponent from '../../components/SearchComponent.vue';

export default {
  components: {
    SearchComponent
  },

  setup() {
    useHead({
      title: "搜索 - ZeroCat",
    });
  }
};
</script>
