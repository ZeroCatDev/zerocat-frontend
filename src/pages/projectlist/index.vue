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
import { useHead } from "@unhead/vue";
export default {
  components: { NewProjectList, EditProjectListConfig },

  name: "projectlist",
  data() {
    return {
      localuser: localuser,
      editlistid: 0,
      EditProjectListConfigDialog: false,
      NewProjectListDialog: false,
      lists: [],
    };
  },
  setup() {
    useHead({
      title: "列表",
    });
  },

  async created() {
    if (this.localuser.islogin == false) {
      this.$router.push("/account/login");
    }
  },
  methods: {
    async getProjectList() {
      this.lists = (
        await request({
          url: `/projectlist/user/${this.localuser.user.userid}`,
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
