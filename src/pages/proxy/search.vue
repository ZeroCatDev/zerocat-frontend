<template>
  <v-container>
    <v-row>
      <v-col cols="12"><v-text-field :label="'搜索 为：' + search.text" v-model="search.text"></v-text-field>
  </v-col>

      <v-col cols="3"><v-select v-model="search.order" :items="orderitems" item-title="name" item-value="type"
          :label="'排序 为：' + search.order"></v-select></v-col>




      <v-col cols="3">
        <v-btn @click="onPageChange(1,true)"> 搜索 </v-btn>
     </v-col></v-row>
    <br />
    <br />

    <v-progress-linear :active="ProjectsLoading" height="4" indeterminate></v-progress-linear>
    <div class="mb-2">

      <v-chip><v-icon icon="mdi-clock" start></v-icon>本页加载用时{{
        Math.abs(usetime / 1000)
      }}秒
      </v-chip>
    </div>
    <v-row>
      <v-col cols=" 12" md="3" v-for="info in projects" :key="info">
        <v-card :to="'/proxy/'+info.id">
          <v-img :src="`${scratch_proxy}/thumbnails/${info.id}`" cover></v-img><v-card-item> <v-card-title>{{ info.title
              }}</v-card-title>

            <v-card-subtitle>{{ info.description || '简介未找到' }}</v-card-subtitle>


          </v-card-item>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar :image="`${this.scratch_proxy}/avatars/${info.author.id}`"></v-avatar>
              </template>
              <v-list-item-title> {{ info.author.username }} </v-list-item-title>
              <v-list-item-subtitle>{{ info.author.id }}</v-list-item-subtitle>
            </v-list-item></v-list>


        </v-card> </v-col></v-row><br/>
    <v-btn @click="onPageChange(curPage + 1,false)">继续加载</v-btn>
  </v-container>
</template>

<script>
import request from "../../axios/axios";

export default {

  data() {
    return {


      orderitems: [
        { name: "热门的", type: "trending" },
        { name: "最受欢迎的", type: "popular" },
        { name: "新建的", type: "recent" },
      ],
      search: {
        text: '',
        order: "trending",
        limit: 16
      },
      usetime: 0,
      ProjectsLoading: false,
      projects: [],
      projectscount: 0,
      curPage: 1,
      scratch_proxy:import.meta.env.VITE_APP_SCRATCH_PROXY
    };
  }, async created() {
    await this.getprojects();


  },
  methods: {
    async getprojects() {
      //this.onPageChange(1);
    },
    async onPageChange(page,clean) {
      if(clean==true){
        this.projects = [];
      }
      this.usetime = Date.now();
      this.ProjectsLoading = true

      this.projects = this.projects.concat(await request({
        url: this.scratch_proxy+`/projects/search/projects?mode=${this.search.order}&q=${this.search.text}&offset=${(page * 16) - 16}&limit=${this.search.limit}&language=zh-cn`,
        method: "get",
      }))

      this.curPage = page;
      this.ProjectsLoading = false
      this.usetime = Date.now() - this.usetime;
    },
  },
};
</script>
