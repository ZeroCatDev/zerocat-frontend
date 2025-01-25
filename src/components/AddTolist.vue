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
            ? removeProjectFromList(item.id)
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
import NewProjectList from "@/components/projectlist/NewProjectList.vue";
import { localuser } from "@/middleware/userMiddleware";
import request from "../axios/axios";
export default {
  components: { NewProjectList },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localuser: localuser,
      userinfo: localuser.user,
      newProjectListDialog: false,
      projectLists: [],
    };
  },
  watch: {
    projectId: {
      immediate: true,
      handler(newVal) {
        this.getProjectList(newVal);
      },
    },
  },
  methods: {
    async getProjectList(projectId) {
      this.projectLists = (
        await request({
          url: "/projectlist/check?projectid=" + projectId,
          method: "get",
        })
      ).data.data;
    },
    async addProjectToList(id) {
      await request({
        url: "/projectlist/add",
        data: {
          userid: this.userinfo.id,
          projectid: this.projectId,
          listid: id,
        },
        method: "post",
      }).then((res) => {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res.data.message,
          life: 3000,
        });
        this.getProjectList(this.projectId);
      });
    },
    async removeProjectFromList(id) {
      await request({
        url: "/projectlist/remove",
        data: {
          projectid: this.projectId,
          listid: id,
        },
        method: "post",
      }).then((res) => {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res.data.message,
          life: 3000,
        });
        this.getProjectList(this.projectId);
      });
    },
  },
};
</script>
