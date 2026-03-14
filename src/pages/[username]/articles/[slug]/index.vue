<template>
  <v-container max-width="800" class="py-8">
    <!-- Loading -->
    <div v-if="loading" class="d-flex flex-column align-center justify-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="d-flex flex-column align-center justify-center py-16">
      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
      <div class="text-h6 mb-2">{{ loadError }}</div>
      <v-btn color="primary" variant="tonal" @click="load">重试</v-btn>
    </div>

    <!-- Article -->
    <template v-else>
      <!-- Header -->
      <div class="mb-6">
        <div class="d-flex align-center mb-3">
          <v-chip
            v-if="article.state === 'private'"
            size="small"
            color="warning"
            class="mr-2"
            prepend-icon="mdi-lock-outline"
          >草稿</v-chip>
          <TimeAgo :date="article.time" class="text-caption text-medium-emphasis mr-auto" />
          <v-btn
            v-if="isAuthor"
            :to="`/${username}/articles/${slug}/edit`"
            variant="tonal"
            size="small"
            prepend-icon="mdi-pencil-outline"
            class="ml-2"
          >编辑</v-btn>
        </div>

        <h1 class="text-h3 font-weight-bold mb-4">{{ article.title }}</h1>

        <!-- Author info -->
        <div class="d-flex align-center">
          <v-avatar size="36" class="mr-3">
            <v-img :src="localuser.getUserAvatar(article.author?.avatar)" />
          </v-avatar>
          <div>
            <router-link
              :to="`/${username}`"
              class="text-body-1 font-weight-medium text-decoration-none"
            >{{ article.author?.display_name || username }}</router-link>
            <div class="text-caption text-medium-emphasis">@{{ username }}</div>
          </div>
        </div>
      </div>

      <v-divider class="mb-8" />

      <!-- Content -->
      <div v-if="content" class="markdown-body article-content">
        <Markdown>{{ content }}</Markdown>
      </div>
      <div v-else class="text-center py-12 text-medium-emphasis">
        <v-icon size="48" class="mb-4">mdi-file-document-outline</v-icon>
        <div>这篇文章还没有内容</div>
        <v-btn
          v-if="isAuthor"
          :to="`/${username}/articles/${slug}/edit`"
          color="primary"
          variant="tonal"
          class="mt-4"
          prepend-icon="mdi-pencil"
        >开始写作</v-btn>
      </div>

      <v-divider class="mt-12 mb-6" />

      <!-- Footer: back to articles -->
      <div class="d-flex align-center">
        <v-btn
          :to="`/${username}/articles`"
          variant="text"
          prepend-icon="mdi-arrow-left"
          size="small"
        >{{ article.author?.display_name || username }} 的所有文章</v-btn>
      </div>

      <!-- Comments -->
      <div class="mt-8">
        <RelatedPostsPanel
          v-if="article.id"
          type="article"
          :id="article.id"
          :hide-current-context-base="true"
        />
      </div>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { localuser } from '@/services/localAccount'
import { getProjectInfoByNamespace } from '@/services/projectService'
import Markdown from '@/components/Markdown.vue'
import TimeAgo from '@/components/TimeAgo.vue'
import RelatedPostsPanel from '@/components/posts/RelatedPostsPanel.vue'
import 'github-markdown-css'
import request from '@/axios/axios'

const route = useRoute()
const username = computed(() => route.params.username)
const slug = computed(() => route.params.slug)

const article = ref({ id: 0, title: '', state: 'public', author: null, time: null })
const content = ref('')
const loading = ref(true)
const loadError = ref('')

const isAuthor = computed(() =>
  localuser.isLogin.value && localuser.user.value?.id === article.value.authorid
)

useHead({ title: computed(() => article.value.title || slug.value) })

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const info = await getProjectInfoByNamespace(username.value, slug.value)
    if (!info || !info.id || info.id === 0) {
      loadError.value = '文章不存在'
      return
    }
    if (info.type !== 'article') {
      loadError.value = '该内容不是文章类型'
      return
    }
    article.value = info

    // Load content
    try {
      const commitRes = await request.get(`/project/${info.id}/main/latest`)
      if (commitRes.data?.status === 'success') {
        const token = commitRes.data.accessFileToken
        const commitFile = commitRes.data.commit?.commit_file
        if (commitFile) {
          const fileRes = await request.get(
            `/project/files/${commitFile}?accessFileToken=${token}&content=true`
          )
          let raw = fileRes.data
          if (typeof raw === 'object') {
            raw = raw.index ?? JSON.stringify(raw, null, 2)
          }
          content.value = typeof raw === 'string' ? raw : ''
        }
      }
    } catch (_) {
      content.value = ''
    }
  } catch (e) {
    loadError.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
}

load()
</script>

<style scoped>
.article-content {
  font-size: 1.05rem;
  line-height: 1.8;
}
</style>
