<template>
  <v-container>
    <v-row
      ><v-col cols="6">
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
        <v-text-field
          control-variant="用户ID"
          :label="'用户ID 为：' + search.authorid"
          v-model="localuser.user.userid"
          disabled
        ></v-text-field
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
      <v-col cols="12">
        <v-btn
          color="primary"
          variant="flat"
          rounded="xl"
          @click="onPageChange()"
          append-icon="mdi-magnify"
          >搜索</v-btn
        >
        <v-btn
          color=""
          variant="flat"
          rounded="xl"
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
        >
      </v-col></v-row
    >
    <br />
    <br />

    <Projects
      :authorid="localuser.user.userid"
      :title="search.title"
      :description="search.description"
      :source="search.source"
      :order="search.order"
      :type="search.type"
      ref="Projects"
      showinfo="true"
      :state="search.state"
      :tag="search.tag"
      :actions="[
        { name: '信息', function: openinfo },
        { name: '编辑', function: openedit },
        { name: '推送页', function: openpushpage },
      ]"
    >
    </Projects>
    <v-dialog
      v-model="dialog"
      max-width="70vw"
      persistent
      origin="center center"
    >
      <v-card prepend-icon="mdi-xml" title="作品信息">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12" sm="12">
              <v-text-field
                label="标题"
                required
                v-model="currentProject.title"
                hint="将会在首页展示"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12" sm="12">
              <v-textarea
                hint="介绍作品类型，玩法，并向对这个作品有帮助的人致谢！"
                label="简介"
                v-model="currentProject.description"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                :items="['scratch', 'python', 'text']"
                label="类型"
                required
                hint="不建议你改"
                v-model="currentProject.type"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6"
              ><v-select
                v-model="currentProject.state"
                :items="projectstates"
                item-title="state"
                item-value="abbr"
                label="项目状态"
                hint="我们鼓励开源"
              ></v-select>
            </v-col>
            <!--<v-col cols="12" sm="6"><v-select v-model="currentProject.history" :items="projecthistory" item-title="state"
                item-value="abbr" label="项目历史" hint="开启后会记录每一次保存的历史"></v-select> </v-col>-->

            <!--<v-col cols="12" sm="6">
              <v-autocomplete
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                label="Interests" auto-select-first multiple v-model="currentProject.tags"></v-autocomplete>
            </v-col>-->
            <v-col cols="12">
              <v-combobox
                v-model="aboutTags.chips"
                :items="aboutTags.items"
                label="标签"
                prepend-icon="mdi-tag"
                variant="solo"
                chips
                multiple
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :model-value="selected"
                    closable
                    @click="select"
                    @click:close="removetag(item)"
                  >
                    <strong>{{ item.name }}</strong
                    >&nbsp;
                    <span>(interest)</span>
                  </v-chip>
                </template>
              </v-combobox></v-col
            >
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title>详细数据</v-expansion-panel-title>
                <v-expansion-panel-text>
                  {{ currentProject }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            color="error"
            text="删除"
            variant="tonal"
            @click="deleteProject"
          ></v-btn>
          <v-btn
            color="text"
            text="一键推送"
            variant="tonal"
            @click="pushproject(currentProject.id)"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
          <v-btn
            color="primary"
            text="保存"
            variant="tonal"
            @click="SaveProjectsInfo"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import openEditor from "../../stores/openEdit";

import request from "../../axios/axios";
import Projects from "../../components/Projects.vue";
import { localuser } from "@/stores/user";
import { useHead } from "@unhead/vue";
export default {
  components: { Projects },

  data() {
    return {
      localuser: localuser,
      projectstates: [
        { state: "私密", abbr: "private" },
        { state: "开源", abbr: "public" },
      ],
      projecthistory: [
        { state: "关闭", abbr: "0" },
        { state: "开启", abbr: "1" },
      ],
      searchstates: [
        { state: "所有", abbr: "" },
        { state: "私密", abbr: "private" },
        { state: "开源", abbr: "public" },
      ],
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
      currentProjectID: 0,
      dialog: false,
      currentProject: {},
      previousProject: {},
      search: {
        title: "",
        type: "",
        description: "",
        source: "",
        order: "view_up",
        authorid: "",
        type: "",
        state: "",
        tag: "",
      },
      aboutTags: {
        items: ["动画", "故事", "音乐", "硬核", "艺术", "水"],
        chips: ref({}),
        selected: [],
      },
    };
  },

  async created() {
    if (this.localuser.islogin == false) {
      this.$router.push("/account/login");
    }
  },
  setup() {
    useHead({
      title: "我的作品",
    });
  },
  methods: {
    removetag(item) {
      chips.value.splice(chips.value.indexOf(item), 1);
    },
    projecttypeProps(item) {
      return {
        title: item.name,
        subtitle: item.department,
      };
    },
    onPageChange() {
      this.$refs.Projects.onPageChange(1);
    },
    addtoast(a) {
      this.$toast.add({
        severity: "info",
        summary: "info",
        detail: a,
        life: 3000,
      });
    },
    openinfo(id, info) {
      this.currentProjectID = id;
      this.currentProject = info;
      this.previousProject = { ...info };
      this.aboutTags.chips = this.currentProject.tags.map(tag => tag.name);
      this.dialog = true;
    },
    openpushpage(id) {
      this.$router.push("/projects/" + id + "/push");
    },
    pushproject(id, info) {
      request({
        url: "/project/" + id + "/push",
        method: "post",
      })
        .then((res) => {
          console.log(res);
          this.addtoast(res.message);
          this.onPageChange();
        })
        .catch((err) => {
          console.log(err);
          this.addtoast("失败");
        });
    },
    openedit(id, info) {
      this.$toast.add({
        severity: "info",
        summary: "info",
        detail: `尝试打开${info.type}编辑器并编辑${id}号作品`,
        life: 3000,
      });
      openEditor(id, info.type);
    },
    deleteProject() {
      this.$toast.add({
        severity: "error",
        summary: "info",
        detail: `尝试删除${this.currentProjectID}号作品`,
        life: 3000,
      });
      request({
        url: "/project/" + this.currentProjectID,
        method: "delete",
      })
        .then((res) => {
          console.log(res);
          this.addtoast(res.message);
          this.onPageChange();
          this.dialog = false;
        })
        .catch((err) => {
          console.log(err);
          this.addtoast("删除失败");
        });
    },
    SaveProjectsInfo() {
      this.currentProject.tags = this.aboutTags.chips.map(name => name);
      request({
        url: "/project/" + this.currentProjectID,
        method: "put",
        data: this.currentProject,
      })
        .then((res) => {
          console.log(res);
          this.addtoast(res.message);
          this.dialog = false;
          this.onPageChange();
        })
        .catch((err) => {
          console.log(err);
          this.addtoast("修改失败");
        });
    },

  },
};
</script>
