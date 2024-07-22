<template>
    <v-container>{{ userinfo }}
      <v-text-field :label="'作品名 包含：' + search.title" v-model="search.title"></v-text-field>
      <v-text-field :label="'作品描述 包含：' + search.description" v-model="search.description"></v-text-field>
      <v-text-field :label="'作品内容 包含：' + search.src" v-model="search.src"></v-text-field>
      <v-number-input control-variant="用户ID" :label="'用户ID 为：' + search.authorid"
        v-model="userinfo.user.userid" disabled></v-number-input>

      <v-select v-model="search.order" :items="search.orderitems" item-title="name" item-value="order" label="排序"
        return-object></v-select>

      <v-select v-model="search.type" :items="search.typeitems" item-title="name" item-value="type" label="项目类型"
        return-object></v-select>

      <v-btn @click="onPageChange(1);"> 搜索 </v-btn>
      <v-btn @click="
        search.order = { name: '观看量升序', type: 'view_up' }; search.type={ name: '所有' , type: '' }; search.authorid='' ;
        search.src='' ; search.description='' ; search.title='' ; onPageChange(1); ">重置</v-btn>
      <br />
      <br />




  <Projects :authorid='userinfo.user.userid' :title="search.title" :description="search.description" :src='search.src' :order="search.order.type" :type="search.type.type"  ref="Projects" showinfo='true' :actions="[{ name:'信息',function: addtoast},{ name:'信息',function: addtoast}]"></Projects>

          </v-container>
  </template>

  <script>
  import Projects from "../../components/Projects.vue";
import localuserinfo from '../../stores/user'
  export default {
    components: {Projects},

    data() {
      return {
        search: {
          title: "",
          type: "",
          description: "",
          src: "",
          order: { name: "观看量升序", type: "view_up" },
          authorid: "",
          type: { name: "所有", type: "" },
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
        },
        userinfo: localuserinfo,
      };
    },
    methods: {
       onPageChange() {
        this.$refs.Projects.onPageChange(1);

      },
      addtoast(a) {
        this.$toast.add({ severity: 'info', summary: 'info', detail: a, life: 3000 });
      },
    },
  };
  </script>
