<template>
  <v-container>
    <v-row
      ><v-col cols="6" >
        <v-text-field
          :label="'作品名 包含：' + search.title"
          v-model="search.title"
        ></v-text-field
      ></v-col>
      <v-col cols="6"
        ><v-text-field
          :label="'作品描述 包含：' + search.description"
          v-model="search.description"
        ></v-text-field
      ></v-col>
      <v-col cols="6">
        <v-text-field
          :label="'作品内容 包含：' + search.source"
          v-model="search.source"
        ></v-text-field
      ></v-col>
      <v-col cols="6">
        <v-number-input
          control-variant="用户ID"
          :label="'用户ID 为：' + search.authorid"
          v-model="search.authorid"
        ></v-number-input
      ></v-col>

      <v-col cols="3"
        ><v-select
          v-model="search.order"
          :items="orderitems"
          item-title="name"
          item-value="type"
          label="排序"
        ></v-select
      ></v-col>

      <v-col cols="3"
        ><v-select
          v-model="search.type"
          :items="typeitems"
          item-title="name"
          item-value="type"
          label="项目类型"
        ></v-select
      ></v-col>
      <v-col cols="3"
        ><v-select
          v-model="search.state"
          :items="searchstates"
          item-title="state"
          item-value="abbr"
          label="项目状态"
        ></v-select
      ></v-col>

      <v-col cols="3">
        <v-autocomplete
          :label="'标签 为：' + search.tag"
          :items="['', '动画', '故事', '音乐', '硬核', '艺术', '水']"
          v-model="search.tag"
        ></v-autocomplete
      ></v-col>
      <v-col cols="3">
        <v-btn @click="onPageChange()"> 搜索 </v-btn>
        <v-btn
          @click="
            search.order = 'view_up';
            search.type = '';
            search.authorid = '';
            search.source = '';
            search.description = '';
            search.title = '';
            search.state = 'public';

            onPageChange();
          "
          >重置</v-btn
        ></v-col
      ></v-row
    >
    <br />
    <br />

    <Projects
      :authorid="search.authorid"
      :title="search.title"
      :description="search.description"
      :source="search.source"
      :order="search.order"
      :type="search.type"
      :state="search.state"
      :tag="search.tag"
      ref="Projects"
      showinfo="true"
    >
    </Projects>
  </v-container>
</template>

<script>
import Projects from "../../components/Projects.vue";

export default {
  components: { Projects },

  data() {
    return {
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
      search: {
        title: "",
        type: "",
        description: "",
        source: "",
        order: "view_up",
        authorid: "",
        type: "scratch",
        state: "public",
        tag: "",
      },
    };
  },
  methods: {
    onPageChange() {
      this.$refs.Projects.onPageChange(1);
    },
  },
};
</script>
