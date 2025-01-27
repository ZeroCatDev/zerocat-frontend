<template>
  <v-container class="pa-md-12">
    <div class="d-flex justify-space-between">
      <h1 class="text-h4">Fork <span v-text="project.title"></span></h1>
    </div>
    <br />
    <v-card hover border>
      <template v-slot:title>
        {{ project.title }}
      </template>

      <template v-slot:subtitle>
        作者{{ author.display_name }}，发布于：{{ project.time }}，{{ project.view_count }}次浏览
      </template>

      <template v-slot:text>
        {{ project.description }}
      </template>
    </v-card>
    <br />
    <v-card hover border>
      <template v-slot:title> 你正在分叉一个项目 </template>

      <template v-slot:subtitle>等等，确认点事 </template>

      <template v-slot:text>
        你正在分叉
        <span v-text="project.title"></span>
        ，这将会从此项目的生产环境创建一个一模一样的项目，新的项目将拥有一样的名称，简介与源代码内容。分叉是一个技术概念，不代表作者对你有任何授权。
        <br />改编设立的目的是为了让社区中的作品得到更好的发展，请不要滥用改编，更不能直接抄袭。
      </template>
      <v-card-actions>
        <v-checkbox label="我已了解并确认" v-model="checkknow"></v-checkbox>
      </v-card-actions>
    </v-card>
    <br />
    <v-card hover border>
      <template v-slot:title>
        {{ project.license }}
      </template>

      <template v-slot:subtitle>
        你需要遵守：{{ project.license }}许可证。
      </template>

      <template v-slot:text>
        <v-btn
          :href="'https://choosealicense.com/licenses/' + project.license"
          target="_blank"
          variant="outlined"
          >了解此许可证</v-btn
        >
        <br /><br />
        开源许可证授予您某些权利，前提是您必须遵守相关许可证条款。如未明确标示许可证（显示为NULL），则默认作品受专有版权保护。在分发该作品之前，您需联系作者并获得授权。
        <br />
        用户在ZeroCatNext上分发该作品，并不意味着其拥有该作品的所有权。作品的分叉仅为技术行为，不等同于获得作者的法律授权。<br />
        ZeroCatNext对用户上传、分发或使用的任何作品不承担任何法律责任。ZeroCatNext仅提供技术支持和托管服务，用户对所上传、分发及使用的作品负责，若因作品内容引发任何法律纠纷或损失，ZeroCatNext不承担任何责任。
      </template>
      <v-card-actions>
        <v-checkbox label="我已了解并确认" v-model="checklicense"></v-checkbox>
      </v-card-actions>
    </v-card>
    <br />
    <v-text>如果您已了解以上内容，请在下方的输入框中输入</v-text> <br /><br />
    <v-text-field
      hint="请准确输入上方的话"
      label="我保证会好好对待改编的作品"
      type="input"
      v-model="checktext"
      :rules="textRules"
      required
      variant="outlined"
      clearable
    ></v-text-field>
    <br />
    <v-btn
      class="text-none"
      color="primary"
      rounded="xl"
      text="Fork"
      variant="flat"
      size="large"
      @click="forkproject(project.id)"
      append-icon="mdi-arrow-right"
      :disabled="!checkknow || !checklicense || !checktext"
    ></v-btn>
    <!-- login button -->
  </v-container>
</template>

<script>
import openEditor from "../../../stores/openEdit";
import { localuser } from "@/services/localAccount";
import { useHead } from "@unhead/vue";
import { getProjectInfoByNamespace } from "../../../stores/project.js";
import { getUserById } from "../../../stores/user.js";
import request from "../../../axios/axios";

export default {
  data() {
    return {
      project: {},
      author: {},
      openEditor: openEditor,
      localuser: localuser,
      checktext: "",
      checkknow: false,
      checklicense: false,
      textRules: [
        (value) => value ? true : "记得输入内容哦~",
        (value) => value === "我保证会好好对待改编的作品" ? true : "输的不太对~",
      ],
    };
  },

  async created() {
    if (localuser.isLogin.value === false) {
      this.$router.push("/app/account/login");
    }
    this.fetchProjectAndAuthorDetails();
  },
  setup() {
    useHead({
      title: "分叉",
    });
  },
  methods: {
    async fetchProjectAndAuthorDetails() {
      const username = this.$route.params.username;
      const projectname = this.$route.params.projectname;
      this.project = await getProjectInfoByNamespace(username, projectname);
      this.projectid = this.project.id; // 更新 projectid
      useHead({
        title: "分叉" + this.project.title,
      });
      this.author = await getUserById(this.project.authorid);
    },
    async forkproject(id) {
      await request({
        url: "/project/" + id + "/fork",
        method: "post",
      })
        .then((res) => {
          console.log(res.data);
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "分叉成功",
            life: 3000,
          });
          if (res.data.id) {
            this.$router.push(`${localuser.user.id}/${res.data.id}`);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: err,
            life: 3000,
          });
        });
    },
  },
};
</script>
