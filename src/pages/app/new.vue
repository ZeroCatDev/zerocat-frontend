<template>
  <v-container>
    <h1>创建一个新的作品</h1>
    <p>作品包含你的代码文件，包括修订历史记录。作品信息可以随时修改。</p>
    <br />

    <v-text-field
      width="40%"
      label="项目名称"
      required
      :prefix="localuser.user.username + '/'"
      v-model="projectinfo.name"
      active
      variant="outlined"
    ></v-text-field>
    <p>
      优秀的项目名称简短而令人难忘。需要灵感吗？<a
        style="text-decoration: none"
        color="primary"
        @click.native="projectinfo.name = examplename"
        href="javascript:void(0)"
        >{{ examplename }}</a
      >
      如何？
    </p>
    <br />
    <v-textarea
    counter="1000"
      label="简介（不必填）"
      required
      v-model="projectinfo.description"
      active
      variant="outlined"
    ></v-textarea
    ><v-divider></v-divider><br />
    <v-radio-group v-model="projectinfo.state" row>
      <v-radio value="public">
        <template v-slot:label>
          <div>
            <strong>公开</strong><br />互联网上的任何人都可以看到这个作品。
          </div>
        </template></v-radio
      >
      <v-radio value="private">
        <template v-slot:label>
          <div><strong>私密</strong><br />只有你可以看到这个作品。</div>
        </template></v-radio
      > </v-radio-group
    ><v-divider></v-divider><br />
    <v-select
      :items="['scratch', 'python', 'text']"
      label="使用以下类型初始化此作品："
      required
      v-model="projectinfo.type"
    ></v-select>

    <LicenseSelector v-model="projectinfo.license" />

    <p class="text-caption text-medium-emphasis">
      许可证告诉其他人他们可以和不能使用您的代码。<a
        href="https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository"
        >了解有关许可证的更多信息</a
      >或<a href="https://choosealicense.com/">选择一个许可证</a>。
    </p>
    <br /><v-divider></v-divider><br />

    <div class="d-flex justify-end">
      <v-btn
        border
        color="primary"
        text="创建"
        variant="tonal"
        @click="newProject()"
        :disabled="created"
      ></v-btn>
    </div>
  </v-container>
</template>

<script>
import openEdit from "../../stores/openEdit";
import request from "@/axios/axios";
import { useHead } from "@unhead/vue";
import { localuser } from "@/services/localAccount";
import { generate } from "random-words";
import LicenseSelector from "@/components/LicenseSelector.vue";

export default {
  components: {
    LicenseSelector
  },
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
        name: "",
        state: "public",
        description: "",
        license: "None",
      },
      examplename: generate(Math.floor(Math.random() * 2) + 2).join("-"),
    };
  },

  async created() {
    if (localuser.isLogin.value === false) {
      this.$router.push("/app/account/login");
    }
  },
  methods: {
    async newProject() {
      this.projectinfo.title = this.projectinfo.name;
      await request.post("/project/", this.projectinfo).then((res) => {
        console.log(res.data);
        if (res.data.status == "error") {
          this.$toast.add({
            severity: "error",
            life: 3000,
            summary: "创建失败",
            detail: res.data.message,
          });
        }
        if (res.data.status == "success") {
          this.$router.push("/" + localuser.user.value.username + "/" + this.projectinfo.name);
        }
      });
    },
  },
};
</script>

<style scoped></style>
