<template>
  <v-card border :title="`${listInfo.title}(#${listInfo.id})`">
    <v-card-text>
      <v-text-field
        v-model="newListInfo.title"
        label="名称"
        required
      ></v-text-field>
      <v-text-field
        v-model="newListInfo.description"
        label="简介"
        required
      ></v-text-field>

      <v-select
        v-model="newListInfo.state"
        :items="listStates"
        item-title="state"
        item-value="abbr"
        label="项目状态"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text="删除"
        variant="plain"
        @click="
          deleteProjectList(listid);
          close();
        "
        color="red"
      ></v-btn>

      <v-spacer></v-spacer>
      <v-btn
        text="回退"
        variant="plain"
        @click="newListInfo = Object.assign({}, listInfo)"
      ></v-btn>

      <v-btn text="关闭" variant="plain" @click="close()"></v-btn>

      <v-btn
        color="primary"
        text="保存"
        variant="tonal"
        @click="updateProjectList(listid)"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import request from "../../axios/axios";
export default {
  data() {
    return {
      listStates: [
        { state: "私密", abbr: "private" },
        { state: "公开", abbr: "public" },
      ],
      created: false,
      newid: 0,
      isVisible: false,
      listInfo: {},
      newListInfo: {},
    };
  },
  props: {
    listid: {
      type: String,
      required: true,
    },
    callback: {
      type: Function,
      required: false,
    },
    close: {
      type: Function,
      required: false,
    },
  },
  methods: {
    show() {
      this.created = false;
      this.newid = 0;
      this.isVisible = true;
    },
    async getProjectList(listid) {
      await request.get("/projectlist/listid/" + listid).then((res) => {
        console.log(res);
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res,
          life: 3000,
        });
        if (res.status == "success") {
          //this.created = true
          this.listInfo = Object.assign({}, res.data);

          this.newListInfo = Object.assign({}, res.data);
        }
      });
      this.callback();
    },
    async updateProjectList(listid) {
      await request
        .post("/projectlist/update/" + listid, this.newListInfo)
        .then((res) => {
          console.log(res);
          this.$toast.add({
            severity: "info",
            summary: "info",
            detail: res,
            life: 3000,
          });
          if (res.status == "1") {
            //this.created = true
            this.listInfo = Object.assign({}, res.data);

            this.newListInfo = Object.assign({}, res.data);
          }
        });
      this.callback();
    },
    async deleteProjectList(listid) {
      await request.delete("/projectlist/" + listid).then((res) => {
        console.log(res);
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res,
          life: 3000,
        });
      });
      this.callback();
    },
  },
  mounted() {
    this.getProjectList(this.listid);
  },
};
</script>

<style scoped></style>
