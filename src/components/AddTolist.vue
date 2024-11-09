<template>
  <v-list>
    <div v-for="item in projectLists" :key="item.id">
      <v-list-item

        :append-icon="
          item.include == true ? 'mdi-minus-circle' : 'mdi-plus-circle'
        "
        :active="item.include == true"
        color="primary"
        @click="
          item.include == true
            ? deleteProjectFromList(item.id)
            : addProjectToList(item.id)
        "
      >
        <v-list-item-title> {{ item.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
      </v-list-item>
    </div>
    <v-list-item @click="newProjectListDialog = true">新建列表</v-list-item>
  </v-list>

  <v-dialog v-model="newProjectListDialog">
    <NewProjectList
      :listid="editlistid"
      :close="() => (newProjectListDialog = false)"
      :callback="getProjectList"
    >
    </NewProjectList>
  </v-dialog>
</template>
<script>
import NewProjectList from "@/components/NewProjectList.vue";
import { localuser } from "@/stores/user";
import request from "../axios/axios";
export default {
  components: { NewProjectList },

  name: "addtolist",
  data() {
    return {
      localuser: localuser,
      userinfo: localuser.user,
      newProjectListDialog: false,
      projectLists: [],
    };
  },
  methods: {
    async getProjectList() {
      this.projectLists = (
        await request({
          url: "/projectlist/check?projectid=" + this.$route.params.id,
          data: {
            userid: this.userinfo.id,
            projectid: this.$route.params.id,
          },
          method: "get",
        })
      ).data;
    },
    async addProjectToList(id) {
      await request({
        url: "/projectlist/add",
        data: {
          userid: this.userinfo.id,
          projectid: this.$route.params.id,
          listid: id,
        },
        method: "post",
      }).then((res) => {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res.message,
          life: 3000,
        });
        this.getProjectList();
      });
    },
    async deleteProjectFromList(id) {
      await request({
        url: "/projectlist/delete",
        data: {
          userid: this.userinfo.id,
          projectid: this.$route.params.id,
          listid: id,
        },
        method: "post",
      }).then((res) => {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res.message,
          life: 3000,
        });
        this.getProjectList();
      });
    },
  },
  mounted() {
    this.getProjectList();
  },
};
</script>
