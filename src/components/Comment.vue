<template>
  <v-card
    hover
    border
    class="mb-2"
    elevation
    v-for="comment in commentList"
    :key="comment.id"
    @click="showMore(comment)"
  >
    <v-card-item>
      <template v-slot:prepend>
        <v-avatar color="blue-darken-2">
          <v-img
            :src="
              'https://s4-1.wuyuan.1r.ink/user/' + users[comment.user_id].images
            "
          ></v-img>
        </v-avatar>
      </template>

      <v-card-title :to="'/user/' + comment.user_id">{{
        users[comment.user_id].display_name
      }}</v-card-title>

      <v-card-subtitle>
        <TimeAgo :date="comment.insertedAt" /> - ({{
          UAParser(comment.user_ua).browser.name
        }}
        -
        {{
          UAParser(comment.user_ua).os.name +
          UAParser(comment.user_ua).os.version
        }})
      </v-card-subtitle>
    </v-card-item>
    <v-card-text><Markdown>{{ comment.text }}</Markdown></v-card-text>
    <v-card
      class="pb-3 pl-10 pr-3"
      v-if="comment.children && comment.children.length"
    >
      <v-list density="default" >
        <v-list-item
          v-for="children in comment.children.slice(0, 2)"
          :key="children.id"
          link
          @click="showMore(comment)"
        >
          <template v-slot:prepend>
            <v-img
              :src="
                'https://s4-1.wuyuan.1r.ink/user/' +
                users[children.user_id].images
              "
            ></v-img>
          </template>

          <v-list-item-title>{{
            users[children.user_id].display_name
          }}</v-list-item-title>
          <v-list-item-subtitle>{{ children.text }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item
          v-if="comment.children.length > 2"
          link
          @click="viewAllComments"
        >
          <v-list-item-title class="text-blue" @click="showMore(comment)"
            >查看全部</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-card>
  </v-card>

  <v-btn @click="getComments" :disabled="loadbuttondisabled" border class="mr-2"
    >继续加载</v-btn
  >
  <v-btn @click="changesort" border>{{ sort }}</v-btn>

  <v-card class="mt-2" elevation hover border>
    <v-card-title class="headline">为{{ name }}评论</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-textarea
          v-model="comment"
          label="评论"
          dense
          auto-grow
          :rules="commentrules"
          required
        ></v-textarea>
        <v-btn
          color="primary"
          @click="addComment({ pid: null, rid: null })"
          border
        >
          评论 </v-btn
        ><v-btn variant="text">{{ info }}</v-btn></v-form
      >
    </v-card-text>
  </v-card>

  <v-dialog v-model="moredialog" width="auto"
    ><v-card hover border
      ><v-container>
        <v-card class="mb-2" elevation hover border>
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-img
                  :src="
                    'https://s4-1.wuyuan.1r.ink/user/' +
                    users[moreComments.user_id].images
                  "
                ></v-img>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props" border></v-btn>
                </template>
                <v-list border>
                  <v-list-item
                  v-if="moreComments.user_id == localuser.user.id"
                  prepend-icon="mdi-delete"
                  @click="deleteCommnet({ id: moreComments.id })"
                  >
                    <v-list-item-title>删除</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    prepend-icon="mdi-reply"
                    @click="replyId = moreComments.id"
                  >
                    <v-list-item-title>回复</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

            </template>
            <v-card-title :to="'/user/' + moreComments.user_id">{{
              users[moreComments.user_id].display_name
            }}</v-card-title>

            <v-card-subtitle>
              <TimeAgo :date="moreComments.insertedAt" /> - ({{
                UAParser(moreComments.user_ua).browser.name
              }}
              -
              {{
                UAParser(moreComments.user_ua).os.name +
                UAParser(moreComments.user_ua).os.version
              }}) - {{ moreComments.insertedAt }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text><Markdown>{{ moreComments.text }}</Markdown></v-card-text>
        </v-card>
        <v-card
          class="mb-2"
          v-for="comment in moreComments.children"
          :key="comment.id"
          elevation
          hover
          border
        >
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="blue-darken-2">
                <v-img
                  :src="
                    'https://s4-1.wuyuan.1r.ink/user/' +
                    users[comment.user_id].images
                  "
                ></v-img>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-btn
                icon="mdi-reply"
                @click="replyId = comment.id"
                border
                v-if="comment.user_id != localuser.user.id"
              >
              </v-btn>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props" border></v-btn>
                </template>
                <v-list border>
                  <v-list-item
                    v-if="comment.user_id == localuser.user.id"
                    prepend-icon="mdi-delete"
                    @click="deleteCommnet({ id: comment.id })"
                  >
                    <v-list-item-title>删除</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    prepend-icon="mdi-reply"
                    @click="replyId = comment.id"
                  >
                    <v-list-item-title>回复</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <v-card-title :to="'/' + comment.user_id">{{
              users[comment.user_id].display_name
            }}</v-card-title>

            <v-card-subtitle
              ><TimeAgo :date="comment.insertedAt" /> - ({{
                UAParser(comment.user_ua).browser.name
              }}
              -
              {{
                UAParser(comment.user_ua).os.name +
                UAParser(comment.user_ua).os.version
              }}) - {{ comment.insertedAt }}</v-card-subtitle
            >
          </v-card-item>
          <v-card-text><Markdown>{{ comment.text }}</Markdown></v-card-text>
        </v-card>

        <v-card class="mt-4" elevation hover border>
          <v-card-title class="headline"
            >回复评论{{ replyId
            }}<v-btn @click="replyId = null" v-if="replyId != null"
              >取消</v-btn
            ></v-card-title
          >
          <v-card-text>
            <v-form @submit.prevent>
              <v-textarea
                v-model="comment"
                label="评论"
                dense
                auto-grow
                :rules="commentrules"
                required
              ></v-textarea>
              <v-btn
                color="primary"
                @click="
                  addComment({
                    pid: replyId,
                    rid: moreComments.id,
                    commnet: comment,
                  })
                "
              >
                评论 </v-btn
              ><v-btn variant="text">{{ info }}</v-btn></v-form
            >
          </v-card-text>
        </v-card></v-container
      ></v-card
    >
  </v-dialog>
</template>

<script>
import Markdown from "./Markdown.vue";
import TimeAgo from "./TimeAgo.vue";

import request from "../axios/axios";
import { localuser } from "@/middleware/userMiddleware";
import { UAParser } from "ua-parser-js";

export default {
  components: {
    TimeAgo,
    Markdown,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  watch: {
    url: function (newUrl, oldUrl) {
      this.getComments({ retry: true });
    },
  },
  data() {
    return {
      // 评论列表
      url: this.url,
      sort: "时间倒序",
      sorttext: "insertedAt_desc",
      commentList: [],
      users: {},
      page: 0,
      totalPages: 0,
      pageSize: 10,
      count: 0,
      loadbuttondisabled: false,
      moredialog: false,
      moreComments: [],
      localuser: localuser,
      commentrules: [
        (value) => {
          if (value) return true;
          return "不可为空";
        },
      ],
      comment: "",
      replyId: "",
      UAParser,
    };
  },
  mounted() {
    this.getComments();
  },
  methods: {
    getComments(info = {}) {
      if (info.retry == true) {
        this.page = 0;
        this.commentList = [];
      }
      // 获取评论列表
      request({
        url: `/comment/api/comment?path=${this.url}&page=${
          this.page + 1
        }&pageSize=${this.pageSize}&sortBy=${this.sorttext}`,

        method: "get",
      }).then((res) => {
        //在数据末尾添加新数据
        if (res.data.data.data.length == 0) {
          this.loadbuttondisabled = true;
        }
        this.commentList = this.commentList.concat(res.data.data.data);
        console.log(res.data.users);
        res.data.users.forEach((user) => {
          this.users[user.id] = user;
        });

        this.page = Number(res.data.data.page);
        this.totalPages = Number(res.data.data.totalPages);
        this.pageSize = Number(res.data.data.pageSize);
        this.count = Number(res.data.data.count);
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
        if (res.data.errno == 0) {
          this.info = "评论成功";
          this.comment = "";
          this.replyId = null;
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
        if (res.data.errno == 0) {
          this.info = "删除成功";
          this.getComments({ retry: true });
        } else {
          this.info = "删除失败";
          this.getComments({ retry: true });
        }
      });
    },
    showMore(info) {
      this.moreComments = info;
      this.moredialog = true;
    },
    createDateFromMysql(mysql_string) {
      var t,
        result = null;

      if (typeof mysql_string === "string") {
        t = mysql_string.split(/[- :]/);

        //when t[3], t[4] and t[5] are missing they defaults to zero
        result = new Date(
          t[0],
          t[1] - 1,
          t[2],
          t[3] || 0,
          t[4] || 0,
          t[5] || 0
        );
      }

      return result;
    },
  },
};
</script>
