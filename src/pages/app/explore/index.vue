<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search.title"
          label="作品名"
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn @click="toggleAdvancedSearch" variant="text">
          <v-icon>{{ showAdvancedSearch ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          高级搜索
        </v-btn>
        <br/><br/>
        <v-expand-transition>
          <v-row v-if="showAdvancedSearch">
            <v-col cols="6">
              <v-text-field
                v-model="search.description"
                label="作品描述"
                prepend-inner-icon="mdi-text"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search.source"
                label="作品内容"
                prepend-inner-icon="mdi-file"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="search.authorid"
                label="用户ID"
                prepend-inner-icon="mdi-account"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="search.tag"
                :items="tags"
                label="标签"
                prepend-inner-icon="mdi-tag"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="search.order"
                :items="orderitems"
                item-title="name"
                item-value="type"
                label="排序"
                prepend-inner-icon="mdi-sort"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="search.type"
                :items="typeitems"
                item-title="name"
                item-value="type"
                label="项目类型"
                prepend-inner-icon="mdi-format-list-bulleted"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="search.state"
                :items="searchstates"
                item-title="state"
                item-value="abbr"
                label="项目状态"
                prepend-inner-icon="mdi-state-machine"
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="primary" @click="onPageChange" append-icon="mdi-magnify" class="mr-2">
          搜索
        </v-btn>
        <v-btn @click="resetSearch" append-icon="mdi-refresh">
          重置
        </v-btn>
      </v-col>
      <v-col cols="12" class="d-flex justify-end mt-4">
        <v-btn color="secondary" @click="viewLatest" append-icon="mdi-new-box" class="mr-2">
          最新作品
        </v-btn>
        <v-btn color="secondary" @click="viewPopular" append-icon="mdi-fire">
          最热门作品
        </v-btn>
      </v-col>
    </v-row>
    <Projects :url="url"></Projects>
  </v-container>
</template>

<script>
import Projects from "../../../components/project/Projects.vue";
import { useHead } from "@unhead/vue";

export default {
  components: { Projects },
  setup() {
    useHead({ title: "项目" });
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
        limit: 20,
      },
      showAdvancedSearch: false,
      searchstates: [{ state: "所有", abbr: "public" }],
      typeitems: [
        { name: "所有", type: "" },
        { name: "Scratch", type: "scratch" },
        { name: "Python", type: "python" },
      ],
      orderitems: [
        { name: "观看量升序", type: "view_up" },
        { name: "观看量降序", type: "view_down" },
        { name: "时间升序", type: "time_up" },
        { name: "时间降序", type: "time_down" },
        { name: "序号升序", type: "id_up" },
        { name: "序号降序", type: "id_down" },
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
        limit: 20,
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
    await this.onPageChange();
  },
};
</script>
