<template>
  <v-container>
    <v-card hover border title="新建作品">
      <v-card-text>
        作品是你存储代码的地方，你可以选择你喜欢的类型以从模板创建，作品信息可以随时修改。
      </v-card-text>
    </v-card>
    <br />
    <v-card hover border>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              label="标题"
              required
              hint="将会在首页展示"
              v-model="projectinfo.title"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              :items="['scratch', 'python', 'text']"
              label="类型"
              required
              hint="可以随时修改"
              v-model="projectinfo.type"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text="打开"
          variant="plain"
          @click="openEdit(newid, projectinfo.type)"
          :disabled="!created"
        ></v-btn>

        <v-spacer></v-spacer>

        <v-btn
          border
          color="primary"
          text="创建"
          variant="tonal"
          @click="newProject()"
          :disabled="created"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import openEdit from "../../../stores/openEdit";
import request from "@/axios/axios";
import { useHead } from "@unhead/vue";
import { localuser } from "@/stores/user";
export default {
  setup() {
    useHead({
      title: "新建作品",
    });
  },

  data() {
    return {
      localuser: localuser,
      projectinfo: {
        title: "新建作品",
        type: "scratch",
      },
      created: false,
      newid: 0,
      openEdit,
    };
  },

  async created() {
    if (this.localuser.islogin == false) {
      this.$router.push("/app/account/login");
    }
  },
  methods: {
    async newProject() {
      await request.post("/project/", this.projectinfo).then((res) => {
        console.log(res);
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res,
          life: 3000,
        });
        if (res.status == "1") {
          this.created = true;
          this.newid = res.id;
        }
      });
    },
  },
};
</script>

<style scoped></style>
