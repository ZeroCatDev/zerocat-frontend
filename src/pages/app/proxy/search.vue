<template>
  <v-container>
    <v-card subtitle="这是Scratch上的内容" title="ZeroCatScratchMirror" border>
      <v-card-text class="bg-surface-light pt-4">
        我们使用这种方式促进Scratch及其社区的发展，这些内容是按照<a
          >署名-相同方式共享 2.0 通用</a
        >协议传播的，您可以在<a>https://creativecommons.org/licenses/by-sa/2.0/</a>查看协议全文。
      </v-card-text>
      <template v-slot:actions>
        <v-btn href="https://scratch.mit.edu/explore/projects/all"
          >Scratch上的发现页</v-btn
        >
        <v-btn href="https://scratch.mit.edu/terms_of_use" target="_blank"
          >Scratch使用条款</v-btn
        >
      </template>
    </v-card>
    <br />
    <v-row>
      <v-col cols="12">
        <v-text-field
          :label="'搜索 为：' + search.text"
          v-model="search.text"
        ></v-text-field>
      </v-col>

      <v-col cols="3">
        <v-select
          v-model="search.order"
          :items="orderitems"
          item-title="name"
          item-value="type"
          :label="'排序 为：' + search.order"
        ></v-select>
      </v-col>

      <v-col cols="3">
        <v-btn @click="onSearch"> 搜索 </v-btn>
      </v-col>
    </v-row>
    <br />
    <br />

    <ProxyShowProjects
      :url="searchUrl"
      :show-user-info="true"
    ></ProxyShowProjects>
  </v-container>
</template>

<script>
import ProxyShowProjects from "@/components/ProxyShowProjects.vue";

export default {
  components: { ProxyShowProjects },
  data() {
    return {
      orderitems: [
        { name: "热门的", type: "trending" },
        { name: "最受欢迎的", type: "popular" },
        { name: "新建的", type: "recent" },
      ],
      search: {
        text: "",
        order: "trending",
      },
      searchUrl: "",
    };
  },
  methods: {
    onSearch() {
      this.searchUrl = `/projects/search/projects?mode=${this.search.order}&q=${this.search.text}&`;
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.search.text = this.$route.query.text || "";
        this.search.order = this.$route.query.order || "trending";
      },
      immediate: true,
    },
  },
};
</script>
