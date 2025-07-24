<template>
  <v-card v-if="type === 'scratch'" border hover style="aspect-ratio: 4 / 3">
    <iframe
      :src="embedurl"
      frameborder="0"
      scrolling="no"
      style="width: 100%; height: 100%"
    ></iframe>
  </v-card>
  <div v-if="type === 'python'">
    <div style="width: 100%; height: 100%; aspect-ratio: 4 / 3">
      <iframe
        :src="pythonplayer"
        frameborder="0"
        scrolling="no"
        style="width: 100%; height: 100%"
      ></iframe>
    </div>
  </div>

</template>
<script>
import request from "../../axios/axios";
import {ref} from "vue";

export default {

  data() {
    return {
      embedurl: "/",
      watchedtype: "",
      watchedid: "",
      pythonplayer: "",
      code: "",
    };
  },

  props: {
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      default: "1",
    },
  },

  watch: {
    type: async function (newVal, oldVal) {
      this.watchedtype = newVal;
      this.watchedid = newVal;

      if (this.type === "scratch") {
        this.embedurl = `/scratch/embed.html?id=${this.id}&branch=main&ref=latest&embed=true`;
      }
      if (this.type === "python") {
        this.pythonplayer = "/python/nextplay.html?id=" + this.id;
      }
    },
  },
};
</script>
