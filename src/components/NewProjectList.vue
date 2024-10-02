<template>


    <v-card prepend-icon="mdi-xml" title="新建列表">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="12" sm="12">
            <v-text-field label="标题" required hint="将便于查找" v-model="projectinfo.title" disabled></v-text-field>
          </v-col>
        </v-row>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn text="关闭" variant="plain" @click="close()"></v-btn>

        <v-btn color="primary" text="创建" variant="tonal" @click="newProjectList();close()" :disabled="created"></v-btn>
      </v-card-actions>
    </v-card>
</template>


<script>
import openEdit from "../stores/openEdit";
import request from "../axios/axios";
export default {
  data() {
    return {
      projectinfo: {
        title: '新建项目列表',
      },
      created: false,
      newid: 0,
      isVisible: false,
      openEdit
    };
  },
  props: {
    callback: {
      type: Function,
      required: false, // 可以根据需要设置为 true
    }, close: {
      type: Function,
      required: false, // 可以根据需要设置为 true
    },
  },
  methods: {
    show() {
      this.projectinfo = {
        title: '新建项目列表',
      },
        this.created = false
      this.newid = 0
      this.isVisible = true
    },
    async newProjectList() {
      await request.post('/projectlist/', this.projectinfo).then((res) => {
        console.log(res)
        this.$toast.add({ severity: 'info', summary: 'info', detail: res, life: 3000 });
        if (res.status == '1') {
          //this.created = true
          this.newid = res.id

        }
      })
      this.callback()
    }
  },
};
</script>

<style scoped></style>
