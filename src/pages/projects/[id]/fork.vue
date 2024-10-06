<template>
  <v-container class="pa-md-12">
    <div class="d-flex justify-space-between">
      <h1 class="text-h4">Fork <span v-text="project.title"></span></h1>
    </div>
    <br />
    <v-card>
      <template v-slot:title>
        {{ project.title }}
      </template>

      <template v-slot:subtitle>
        作者{{ project.author.display_name }}，发布于：{{ project.time }}，{{
          project.view_count
        }}次浏览
      </template>

      <template v-slot:text>
        {{ project.description }}
      </template> </v-card
    ><br />
    <v-card>
      <template v-slot:title> 你正在分叉一个项目 </template>

      <template v-slot:subtitle> 等等，确认点事 </template>

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
    <br /><v-card>
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
        开源许可证授予你合理的权利，但前提是你必须遵守许可证的条款。如果没有许可证(显示为NULL)，则默认受专有版权保护，在你分发(开源作品)前，你需要尝试联系作者获得授权。<br />
        避风港原则，许可证不限制ZeroCatNext分发您的作品。
      </template>
      <v-card-actions>
        <v-checkbox label="我已了解并确认" v-model="checklicense"></v-checkbox>
      </v-card-actions> </v-card
    ><br />
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

import request from "../../../axios/axios";
import { localuser } from "@/stores/user";
export default {
  data() {
    return {
      project: {},
      openEditor: openEditor,
      localuser: localuser,
      checktext: "",
      checkknow: false,
      checklicense: false,

      textRules: [
        (value) => {
          if (value) return true;

          return "记得输入内容哦~";
        },
        (value) => {
          if (value != "我保证会好好对待改编的作品") {
            return "输的不太对~";
          }
        },
      ],
    };
  },

  async created() {
    await this.getproject();
  },

  methods: {
    async getproject() {
      this.project = await request({
        url: "/project/" + this.$route.params.id,
        method: "get",
      });
      console.log(this.project);
    },
    async forkproject(id) {
      await request({
        url: "/project/" + id + "/fork",
        method: "post",
      })
        .then((res) => {
          console.log(res);
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "分叉成功",
            life: 3000,
          });
          if (res.id) {
            this.$router.push("/projects/" + res.id);
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
