<template>
  <v-container>
    <div class="d-flex justify-space-between mb-4">
      <h1>列表</h1>

      <div class="d-flex ga-2">
        <v-btn
        @click="NewProjectListDialog = true"
          border
          color="primary"
          rounded="lg"
          slim
          text="创建"
          variant="flat"
        />

      </div>
    </div>
    <div v-for="item in lists" :key="item.id">
      <v-card border>
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
          ><v-btn :to="`/app/projectlist/${item.id}`">打开</v-btn>
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
import NewProjectList from "@/components/projectlist/NewProjectList.vue";
import EditProjectListConfig from "@/components/projectlist/EditProjectListConfig.vue";
import { localuser } from "@/stores/user";
import request from "../../../axios/axios";
import { useHead } from "@unhead/vue";
export default {
  components: {NewProjectList, EditProjectListConfig},

  async created() {
    if (this.localuser.islogin == false) {
      this.$router.push("/app/account/login");
    }
  },
  data() {
    return {
      localuser: localuser,
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
          url: `/projectlist/my`,
          method: "get",
        })
      ).data.data;
    },
  },

  mounted() {
    this.getProjectList();
  },
  name: "projectlist",
  setup() {
    useHead({
      title: "列表",
    });
  },
};
</script>
