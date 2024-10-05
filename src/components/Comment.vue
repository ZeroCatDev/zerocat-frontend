<template>
  <v-container>
    <v-card class="mb-2" elevation hover v-for="comment in comments" :key="comment.id" @click="showMore(comment)">
      <v-card-item>
        <template v-slot:prepend>
          <v-avatar color="blue-darken-2">
            <v-img :src="comment.avatar"></v-img>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-btn icon="mdi-reply">
          </v-btn><v-btn icon="mdi-delete" @click="deleteCommnet({ id: comment.id })"
            v-if="comment.user_id == localuser.user.id">
          </v-btn>
        </template>
        <v-card-title :to="'/user/' + comment.user_id">{{
          comment.nick
        }}</v-card-title>

        <v-card-subtitle>{{ comment.time }} - {{ comment.browser }} ({{
          comment.os
        }})</v-card-subtitle>
      </v-card-item>
      <v-card-text>{{ comment.comment }}</v-card-text>
      <v-card class="pb-3 pl-10 pr-3" v-if="comment.children && comment.children.length">
        <v-list density="default">
          <v-list-item v-for="children in comment.children.slice(0, 2)" :key="children.id" link
            @click="showMore(comment)">
            <template v-slot:prepend>
              <v-img :src="comment.avatar"></v-img>
            </template>

            <v-list-item-title>{{ children.nick }}</v-list-item-title>
            <v-list-item-subtitle>{{ children.comment }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item v-if="comment.children.length > 2" link @click="viewAllComments">
            <v-list-item-title class="text-blue" @click="showMore(comment)">查看全部</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card>

    <v-btn @click="getComments" :disabled="loadbuttondisabled">继续加载</v-btn>
    <v-btn @click="changesort">{{ sort }}</v-btn>

    <v-card class="mt-8 mb-8" elevation hover>
      <v-card-title class="headline">为项目评论</v-card-title>
      <v-card-text>
        <v-form @submit.prevent>
          <v-textarea v-model="comment" label="评论" dense auto-grow :rules="commentrules" required></v-textarea>
          <v-btn color="primary" @click="addComment({ pid: null, rid: null })">
            评论 </v-btn><v-btn variant="text">{{ info }}</v-btn></v-form>
      </v-card-text>
    </v-card>



    <v-dialog v-model="moredialog" width="auto"><v-card><v-container>
          <v-card variant="tonal" class="mb-2" elevation hover>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="blue-darken-2">
                  <v-img :src="morecommnets.avatar"></v-img>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-delete" @click="deleteCommnet({ id: morecommnets.id })"
                  v-if="morecommnets.user_id == localuser.user.id">
                </v-btn>
              </template>
              <v-card-title :to="'/user/' + morecommnets.user_id">{{
                morecommnets.nick
              }}</v-card-title>

              <v-card-subtitle>{{ morecommnets.time }} - {{ morecommnets.browser }} ({{
                morecommnets.os
              }})</v-card-subtitle>
            </v-card-item>
            <v-card-text>{{ morecommnets.comment }}</v-card-text>
          </v-card>
          <v-card class="mb-2" v-for="comment in morecommnets.children" :key="comment.id" elevation hover>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="blue-darken-2">
                  <v-img :src="comment.avatar"></v-img>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-reply" @click="
                  replyid = comment.id
                  ">
                </v-btn><v-btn icon="mdi-delete" @click="deleteCommnet({ id: comment.id })"
                  v-if="comment.user_id == localuser.user.id">
                </v-btn>
              </template>
              <v-card-title :to="'/user/' + comment.user_id">{{
                comment.nick
              }}</v-card-title>

              <v-card-subtitle>{{ comment.time }} - {{ comment.browser }} ({{
                comment.os
              }})</v-card-subtitle>
            </v-card-item>
            <v-card-text>{{ comment.comment }}</v-card-text>
          </v-card>

          <v-card class="mt-4" elevation hover>
            <v-card-title class="headline">回复评论{{ replyid }}<v-btn @click="replyid = null">取消</v-btn></v-card-title>
            <v-card-text>
              <v-form @submit.prevent>
                <v-textarea v-model="comment" label="评论" dense auto-grow :rules="commentrules" required></v-textarea>
                <v-btn color="primary" @click="
                  addComment({
                    pid: replyid,
                    rid: morecommnets.id,
                    commnet: comment,
                  })
                  ">
                  评论 </v-btn><v-btn variant="text">{{ info }}</v-btn></v-form>
            </v-card-text>
          </v-card></v-container></v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import request from "../axios/axios";
import { localuser } from "@/stores/user";
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 评论列表
      url: this.url,
      sort: "时间倒序",
      sorttext: "insertedAt_desc",
      comments: [],
      page: 0,
      totalPages: 0,
      pageSize: 10,
      count: 0,
      loadbuttondisabled: false,
      moredialog: false,
      morecommnets: [],
      localuser: localuser,
      commentrules: [
        (value) => {
          if (value) return true;
          return "不可为空";
        },
      ],
      comment: "",
      replyid: "",
    };
  },
  mounted() {
    this.getComments();
  },
  methods: {
    getComments(info = {}) {
      if (info.retry == true) {
        this.page = 0;
        this.comments = [];
      }
      // 获取评论列表
      request({
        url: `/comment/api/comment?path=${this.url}&page=${this.page + 1
          }&pageSize=${this.pageSize}&sortBy=${this.sorttext}`,

        method: "get",
      }).then((res) => {
        //在数据末尾添加新数据
        if (res.data.data.length == 0) {
          this.loadbuttondisabled = true;
        }
        this.comments = this.comments.concat(res.data.data);
        this.page = Number(res.data.page);
        this.totalPages = Number(res.data.totalPages);
        this.pageSize = Number(res.data.pageSize);
        this.count = Number(res.data.count);
        this.moredialog = false;
      });
    },
    changesort() {
      if (this.sort == "时间倒序") {
        this.sort = "时间正序";
        this.sorttext = "insertedAt_asc";
        this.getComments({ retry: true });
      } else {
        this.sort = "时间倒序";
        this.sorttext = "insertedAt_desc";
        this.getComments({ retry: true });
      }
    },
    addComment(info) {
      request({
        url: `/comment/api/comment?path=${this.url}`,
        method: "post",
        data: {
          url: this.url,
          comment: this.comment,
          pid: info.pid || null,
          rid: info.rid || null,
        },
      }).then((res) => {
        if (res.errno == 0) {
          this.info = "评论成功";
          this.comment = "";
          this.replyid = null;
          this.getComments({ retry: true });
        } else {
          this.info = "评论失败";
          this.getComments({ retry: true });
        }
      });
    },
    deleteCommnet(info) {
      console.log(info);
      request({
        url: `/comment/api/comment/${info.id}`,
        method: "delete",
      }).then((res) => {
        if (res.errno == 0) {
          this.info = "删除成功";
          this.getComments({ retry: true });
        } else {
          this.info = "删除失败";
          this.getComments({ retry: true });
        }
      });
    },
    showMore(info) {
      this.morecommnets = info;
      this.moredialog = true;
    },
  },
};
</script>
