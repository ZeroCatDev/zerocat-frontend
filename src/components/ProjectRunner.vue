<template>
  <div v-if="type === 'scratch'">
    <div style="width: 100%; height: 100%; aspect-ratio: 4 / 3">
      <iframe
        :src="embedurl"
        scrolling="no"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
    </div>
  </div>
  <div v-if="type === 'python'">
    <div style="width: 100%; height: 100%; aspect-ratio: 4 / 3">
      <iframe
        :src="pythonplayer"
        scrolling="no"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
    </div>
  </div>
  <br />
  <v-expansion-panels v-if="type != 'scratch'">
    <v-expansion-panel>
      <v-expansion-panel-title>原始数据</v-expansion-panel-title>
      <v-expansion-panel-text>
        <highlightjs autodetect :code="code" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import request from "../axios/axios";
import { ref } from "vue";
export default {
  components: {
    highlightjs: hljsVuePlugin.component,
  },
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

      this.code = await request({
        url: "/project/" + this.id + "/source/",
        method: "get",
      });
      console.log(this.code);
      if (this.type === "scratch") {
        this.embedurl = "/scratch/embed.html#" + this.id;
      }
      if (this.type === "python") {
        this.pythonplayer = "/python/nextplay.html?id=" + this.id;
      }
    },
  },
};
</script>
