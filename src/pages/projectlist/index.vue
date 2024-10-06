<template>
  <v-container>
    <h1>列表</h1>
    <v-btn @click="NewProjectListDialog = true">创建</v-btn><br /><br />
    <div v-for="item in lists" :key="item.id">
      <v-card>
        <v-card-item>
          <v-card-title
            >{{ item.title
            }}<v-chip :color="item.state == 'private' ? 'primary' : 'green'">
              {{ item.state == "private" ? "私密" : "公开" }}
            </v-chip></v-card-title
          >

          <v-card-subtitle>{{
            item.createTime + "创建，" + item.updateTime + "更新"
          }}</v-card-subtitle>
        </v-card-item>

        <v-card-text> {{ item.description }} </v-card-text>
        <v-card-actions
          ><v-btn
            @click="
              editlistid = item.id;
              EditProjectListConfigDialog = true;
            "
            >编辑</v-btn
          ><v-btn :to="`/projectlist/${item.id}`">打开</v-btn>
        </v-card-actions>
      </v-card>
      <br />
    </div>
  </v-container>
  <v-dialog v-model="EditProjectListConfigDialog">
    <EditProjectListConfig
      :listid="editlistid"
      :close="() => (EditProjectListConfigDialog = false)"
      :callback="getProjectList"
    ></EditProjectListConfig>
  </v-dialog>
  <v-dialog v-model="NewProjectListDialog">
    <NewProjectList
      :listid="editlistid"
      :close="() => (NewProjectListDialog = false)"
      :callback="getProjectList"
    >
    </NewProjectList>
  </v-dialog>
</template>
<script>
import NewProjectList from "@/components/NewProjectList.vue";
import EditProjectListConfig from "@/components/EditProjectListConfig.vue";
import { localuser } from "@/stores/user";
import request from "../../axios/axios";
export default {
  components: { NewProjectList, EditProjectListConfig },

  name: "projectlist",
  data() {
    return {
      localuser: localuser,
      userinfo: localuser.user,
      editlistid: 0,
      EditProjectListConfigDialog: false,
      NewProjectListDialog: false,
      lists: [],
    };
  },
  methods: {
    async getProjectList() {
      this.lists = (
        await request({
          url: "/projectlist/user/" + this.userinfo.userid,
          method: "get",
        })
      ).data;
    },
  },
  mounted() {
    this.getProjectList();
  },
};
</script>
