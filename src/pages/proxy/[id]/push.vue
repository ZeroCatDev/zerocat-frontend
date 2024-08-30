<template>
  <v-container class="pa-md-12">
    <div class="d-flex justify-space-between">
      <h1 class="text-h4">推送 <span v-text="project.title"></span></h1>


    </div><br />
    <v-card>
      <template v-slot:title>
        {{ project.title }}
      </template>

      <template v-slot:subtitle>
        发布于：{{ project.time }}，{{ project.view_count }}次浏览
      </template>

      <template v-slot:text>
        {{ project.description }}
      </template>

    </v-card><br />
    <v-card>
      <template v-slot:title>
        你正在推送你的项目
      </template>

      <template v-slot:subtitle>
        等等，确认点事 </template>

      <template v-slot:text>
        你正在推送 <span v-text="project.title"></span> ，这将会从项目开发分支代码复制到生产分支，并创建一份历史记录，您的用户将会看到新的作品。
      </template>

    </v-card>
    <br /><v-card>
      <template v-slot:title>
        您可以执行推送
      </template>

      <template v-slot:subtitle>
        分支保护
      </template>

      <template v-slot:text> 没有有关的分支保护
      </template>
      <v-card-actions>
        <v-checkbox label="我已了解并确认" v-model="checkprotect"></v-checkbox>

      </v-card-actions>
    </v-card><br />
    <br /><br />

    <br />
    <v-btn class="text-none" color="primary" rounded="xl" text="Push" variant="flat" size="large"
      @click="pushproject(project.id)" append-icon="mdi-arrow-right" :disabled="!checkprotect"></v-btn>
    <!-- login button -->

  </v-container>
</template>

<script>

import request from '../../../axios/axios'
import '@waline/client/style';
import { localuser } from "@/stores/user";
export default {
  data() {
    return {
      project: {},
      localuser: localuser,
      checkprotect: true,


    }
  },

  async created() {
    await this.getproject()
    if (!this.localuser.user && this.project.authorid != this.localuser.user.id) {
      this.$toast.add({
        severity: 'error',
        summary: '错误',
        detail: '您不是项目所有者或您未登录',
        life: 3000,
      })
      this.$router.push('/')
    }
  },

  methods: {
    async getproject() {
      this.project = await request({
        url: '/api/projectinfo?id=' + this.$route.params.id,
        method: 'get',
      })
      console.log(this.project)
    },
    async pushproject(id) {

      await request({
        url: '/project/' + id + '/push',
        method: 'post',
      }).then(res => {
        console.log(res)
        this.$toast.add({
          severity: 'success',
          summary: '成功',
          detail: '推送成功',
          life: 3000,
        })
        if (res.status=='1') {
          this.$router.push('/projects/' + this.project.id)
        }
      }).catch(err => {
        console.log(err)
        this.$toast.add({
          severity: 'error',
          summary: '错误',
          detail: err,
          life: 3000,
        }
        )
      })
    }
  },
}


</script>
