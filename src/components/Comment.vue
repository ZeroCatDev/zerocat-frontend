<template>
  <v-container>
    <v-card class="mb-4" v-for="comment in comments" :key="comment.id">
      <v-card-item>
        <template v-slot:prepend>
          <v-avatar color="blue-darken-2">
            <v-img :src="comment.avatar"></v-img>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-btn icon="mdi-reply" @click="$refs.commentComponent.openAddComment({ pid: comment.id, rid: comment.id })">
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
          <!-- Loop over only the first 3 child comments -->
          <v-list-item v-for="children in comment.children.slice(0, 3)" :key="children.id" link>
            <template v-slot:prepend>
              <v-img :src="comment.avatar"></v-img>
            </template>

            <v-list-item-title>{{ children.nick }}</v-list-item-title>
            <v-list-item-subtitle>{{ children.comment }}</v-list-item-subtitle>
          </v-list-item>

          <!-- Conditionally render "View All" if there are more than 3 comments -->
          <v-list-item v-if="comment.children.length > 3" link @click="viewAllComments">
            <v-list-item-title class="text-blue">查看全部</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card> </v-card><v-btn @click="getComments" :disabled="loadbuttondisabled">继续加载</v-btn> <v-btn
      @click="changesort">{{
        sort }}</v-btn>
    <!--<v-pagination :length="totalPages" rounded="circle" v-model="page" @update:model-value="getComments(page)" @input="getComments(page)"></v-pagination>-->

    <!--<v-card class="mb-4 ml-10">
      <v-card-item>
        <template v-slot:prepend>
          <v-avatar color="blue-darken-2">
            <v-img
              src="https://s4-1.wuyuan.1r.ink/user/0d4f67a46d95d99c440e063f9c1e66c9"
            ></v-img>
          </v-avatar>
        </template>
        <template v-slot:append>
          <v-btn icon="mdi-reply"> </v-btn>
        </template>
        <v-card-title>孙悟元</v-card-title>

        <v-card-subtitle>昨天 20:29[湖南]</v-card-subtitle>
      </v-card-item>
      <v-card-text
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
        ratione debitis quis est labore voluptatibus! Eaque cupiditate minima,
        at placeat totam, magni doloremque veniam neque porro libero rerum unde
        voluptatem!</v-card-text
      >
    </v-card>-->

    <!-- 添加新评论 -->
    <AddComment :url="url" :callback="() => getComments({ retry: true })" ref="commentComponent" />
  </v-container>
</template>

<script>
import AddComment from "../components/AddComment.vue";
import request from "../axios/axios";
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  components: {
    AddComment,
  },
  data() {
    return {
      // 评论列表
      url: this.url,
      sort: "时间倒序",
      sorttext: "insertedAt_desc",
      openAddComment: AddComment.openAddComment,
      comments: [],
      newComment: "",
      page: 0,
      totalPages: 0,
      pageSize: 10,
      count: 0,
      loadbuttondisabled: false,
      // Edit Dialogs
      editDialog: {
        visible: false,
        commentIndex: null,
        text: "",
      },
      editReplyDialog: {
        visible: false,
        commentIndex: null,
        replyIndex: null,
        text: "",
      },
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
  },
};
</script>

<style scoped>
.headline {
  font-size: 24px;
  font-weight: bold;
}

.v-list-item {
  padding: 0;
}

.v-card {
  border-radius: 8px;
}

.v-avatar {
  background-color: #f0f0f0;
}

.v-btn {
  text-transform: none;
}

.v-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
