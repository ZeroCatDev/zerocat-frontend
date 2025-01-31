<template>
<v-container>
<v-list>
  <v-list-item v-for="item in news" :key="item.id" :href="item.url" target="_blank" :prepend-avatar="item.image">

    <v-list-item-title>{{ item.headline }}</v-list-item-title>
    <v-list-item-subtitle>{{ item.copy }} - {{ item.stamp }}</v-list-item-subtitle>
  </v-list-item>

</v-list></v-container>
</template>
<script>
import request from "@/axios/axios";
export default {
  data() {
    return {
      news: [],
      loading: false,
      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
    };
  },
  methods: {
    async fetchNews() {
      this.loading = true;
      try {
        const res = await request.get(this.scratch_proxy+"/news");
        this.news = res.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchNews();
  },
}</script>
