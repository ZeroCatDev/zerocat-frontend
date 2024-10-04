<template>
  <v-card class="mt-8 mb-8" outlined>
    <v-card-title class="headline">为项目评论</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-textarea v-model="comment" label="评论" outlined dense auto-grow :rules="commentrules" required></v-textarea>
        <v-btn color="primary" @click="addComment"> 评论 </v-btn>{{ info }}</v-form>
    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog"  max-width="600px">
    <v-card class="mt-8 mb-8" outlined>
    <v-card-title class="headline">为项目评论</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-textarea v-model="comment" label="评论" outlined dense auto-grow :rules="commentrules" required></v-textarea>
        <v-btn color="primary" @click="addComment({pid:pid,rid:rid})"> 评论 </v-btn>{{ info }}</v-form>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>
<script>
import { localuser } from "@/stores/user";
import request from "../axios/axios";
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    pid: { type: Number, required: false },
    rid: { type: Number, required: false },
    callback: {
      type: Function,
      required: false,
    }
  },
  name: "addcommnet",
  data() {
    return {
      dialog: false,
      localuser: localuser,
      userinfo: localuser.user,
      info: "",
      comment: "",
      commentrules: [
        (value) => {
          if (value) return true;
          return "不可为空";
        },
      ],
      pid: this.pid,
      rid: this.rid,
    };
  },

  methods: {
    openAddComment(info){
      this.dialog = true
      this.pid = info.pid
      this.rid = info.rid
    },
    addComment(info) {
      console.log(info)
      request({
        url: `/comment/api/comment?path=${this.url}`,
        method: "post",
        data: {
          url: this.url,
          comment: this.comment,
          pid: info.pid||null,
          rid: info.rid||null,
        },
      }).then((res) => {
        if (res.errno == 0) {
          this.info = ("评论成功");
          this.callback()
        } else {
          this.info = ("评论失败");
          this.callback()
        }
      });
    },
  },
  mounted() { },
};
</script>
