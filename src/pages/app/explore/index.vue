<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search.title"
          clearable
          label="作品名"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn variant="text" @click="toggleAdvancedSearch">
          <v-icon>{{ showAdvancedSearch ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          高级搜索
        </v-btn>
        <br/><br/>
        <v-expand-transition>
          <v-row v-if="showAdvancedSearch">
            <v-col cols="6">
              <v-text-field
                v-model="search.description"
                clearable
                label="作品描述"
                prepend-inner-icon="mdi-text"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search.source"
                clearable
                label="作品内容"
                prepend-inner-icon="mdi-file"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search.authorid"
                clearable
                label="用户ID"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="search.tag"
                :items="tags"
                clearable
                label="标签"
                prepend-inner-icon="mdi-tag"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="search.order"
                :items="orderitems"
                clearable
                item-title="name"
                item-value="type"
                label="排序"
                prepend-inner-icon="mdi-sort"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="search.type"
                :items="typeitems"
                clearable
                item-title="name"
                item-value="type"
                label="项目类型"
                prepend-inner-icon="mdi-format-list-bulleted"
              ></v-select>
            </v-col>

          </v-row>
        </v-expand-transition>
      </v-col>
      <v-col class="d-flex justify-end" cols="12">
        <v-btn append-icon="mdi-magnify" class="mr-2" color="primary" @click="onPageChange">
          搜索
        </v-btn>
        <v-btn append-icon="mdi-refresh" @click="resetSearch">
          重置
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end mt-4" cols="12">
        <v-btn append-icon="mdi-new-box" class="mr-2" color="secondary" @click="viewLatest">
          最新作品
        </v-btn>
        <v-btn append-icon="mdi-fire" color="secondary" @click="viewPopular">
          最热门作品
        </v-btn>
      </v-col>
    </v-row>
    <Projects :url="url"></Projects>
  </v-container>
</template>

<script>
import Projects from "../../../components/project/Projects.vue";
import {useHead} from "@unhead/vue";

export default {
  components: {Projects},
  setup() {
    useHead({title: "项目"});
  },
  data() {
    return {
      search: {
        title: "",
        type: "scratch",
        description: "",
        source: "",
        order: "view_up",
        authorid: "",
        state: "public",
        tag: "",
        limit: 40,
      },
      showAdvancedSearch: false,
      typeitems: [
        {name: "所有", type: ""},
        {name: "Scratch", type: "scratch"},
        {name: "Python", type: "python"},
      ],
      orderitems: [
        {name: "观看量升序", type: "view_up"},
        {name: "观看量降序", type: "view_down"},
        {name: "星标升序", type: "star_up"},
        {name: "星标降序", type: "star_down"},
        {name: "时间升序", type: "time_up"},
        {name: "时间降序", type: "time_down"},
        {name: "序号升序", type: "id_up"},
        {name: "序号降序", type: "id_down"},
      ],
      tags: ["", "动画", "故事", "音乐", "硬核", "艺术", "水"],
      url: "",
    };
  },
  methods: {
    toggleAdvancedSearch() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
    },
    onPageChange() {
      const timestamp = new Date().getTime();
      this.url = `/searchapi?search_userid=${this.search.authorid}&search_type=${this.search.type}&search_title=${this.search.title}&search_source=${this.search.source}&search_description=${this.search.description}&search_orderby=${this.search.order}&search_state=${this.search.state}&search_tag=${this.search.tag}&timestamp=${timestamp}`;
    },
    resetSearch() {
      this.search = {
        title: "",
        type: "scratch",
        description: "",
        source: "",
        order: "view_up",
        authorid: "",
        state: "public",
        tag: "",
        limit: 40,
      };
      this.onPageChange();
    },
    viewLatest() {
      this.search.order = "time_down";
      this.onPageChange();
    },
    viewPopular() {
      this.search.order = "view_down";
      this.onPageChange();
    },
  },
  async created() {
    this.onPageChange();
  },
};
</script>
