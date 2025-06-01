<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="text-center pa-4">
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <template v-else-if="error">
            <v-alert type="error" text>
              {{ error }}
            </v-alert>
          </template>
          <template v-else>
            <v-card-text>
              正在跳转到项目页面...
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectInfo } from '@/services/projectService'
import { getUserById } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const projectId = route.query.id
    if (!projectId) {
      throw new Error('项目ID不能为空')
    }

    // 获取项目信息
    const projectInfo = await getProjectInfo(projectId)
    console.log(projectInfo)
    if (!projectInfo) {
      throw new Error('项目不存在')
    }
    console.log(await getUserById(projectInfo.authorid))
    // 获取作者信息
    const userData  = await getUserById(projectInfo.authorid)
    if (!userData) {
      throw new Error('作者信息不存在')
    }

    // 重定向到项目页面
    await router.push(`/${userData.username}/${projectInfo.name}`)
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})
</script>
