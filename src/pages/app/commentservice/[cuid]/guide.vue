<template>
  <v-container fluid class="pa-4 pa-md-6" style="max-width: 840px">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      :to="`/app/commentservice/${cuid}`"
      class="mb-4 text-none"
    >
      返回空间详情
    </v-btn>

    <div class="text-h5 font-weight-bold mb-1" style="letter-spacing: -0.5px">
      接入指南
    </div>
    <div class="text-body-2 text-medium-emphasis mb-6">
      按照以下步骤将评论服务嵌入到你的网站
    </div>

    <!-- Step 1 -->
    <v-card variant="flat" border class="mb-4">
      <v-card-text class="pa-5">
        <div class="d-flex align-center mb-3">
          <v-avatar size="28" color="primary" variant="tonal" class="mr-3">
            <span class="text-caption font-weight-bold">1</span>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold">安装依赖</div>
        </div>
        <v-card variant="flat" color="grey-lighten-4" class="rounded-lg">
          <v-card-text class="pa-4">
            <code class="text-body-2" style="font-family: 'Consolas', 'Monaco', monospace">npm install @waline/client</code>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Step 2 -->
    <v-card variant="flat" border class="mb-4">
      <v-card-text class="pa-5">
        <div class="d-flex align-center mb-3">
          <v-avatar size="28" color="primary" variant="tonal" class="mr-3">
            <span class="text-caption font-weight-bold">2</span>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold">嵌入代码</div>
        </div>
        <div class="text-body-2 text-medium-emphasis mb-3">
          将以下代码添加到你的页面中：
        </div>
        <div class="position-relative">
          <v-card variant="flat" color="grey-lighten-4" class="rounded-lg">
            <v-card-text class="pa-4">
              <pre class="text-body-2" style="white-space: pre-wrap; word-break: break-all; font-family: 'Consolas', 'Monaco', monospace; margin: 0">{{ embedCode }}</pre>
            </v-card-text>
          </v-card>
          <v-btn
            icon="mdi-content-copy"
            size="x-small"
            variant="tonal"
            class="position-absolute"
            style="top: 12px; right: 12px"
            @click="copyCode"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Step 3 -->
    <v-card variant="flat" border class="mb-4">
      <v-card-text class="pa-5">
        <div class="d-flex align-center mb-3">
          <v-avatar size="28" color="primary" variant="tonal" class="mr-3">
            <span class="text-caption font-weight-bold">3</span>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold">配置说明</div>
        </div>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="font-weight-bold">参数</th>
              <th class="font-weight-bold">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>el</code></td>
              <td>挂载评论组件的 DOM 元素选择器</td>
            </tr>
            <tr>
              <td><code>serverURL</code></td>
              <td>评论服务地址，指向你的空间 API 端点</td>
            </tr>
            <tr>
              <td><code>path</code></td>
              <td>页面路径，用于区分不同页面的评论（默认 <code>window.location.pathname</code>）</td>
            </tr>
            <tr>
              <td><code>login</code></td>
              <td>
                设为 <code>'force'</code> 强制登录后才能评论
              </td>
            </tr>
            <tr>
              <td><code>pageview</code></td>
              <td>设为 <code>true</code> 启用页面浏览计数</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Step 4 -->
    <v-card variant="flat" border>
      <v-card-text class="pa-5">
        <div class="d-flex align-center mb-3">
          <v-avatar size="28" color="primary" variant="tonal" class="mr-3">
            <span class="text-caption font-weight-bold">4</span>
          </v-avatar>
          <div class="text-subtitle-1 font-weight-bold">更多文档</div>
        </div>
        <div class="text-body-2">
          完整配置请参考
          <a href="https://waline.js.org/" target="_blank" rel="noopener noreferrer" class="text-primary font-weight-medium">
            Waline 官方文档
          </a>。本服务完全兼容 <code>@waline/client</code>，所有客户端配置均可使用。
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="copied" :timeout="1500" color="success">
      已复制到剪贴板
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";

useHead({ title: "接入指南" });

const route = useRoute();
const cuid = route.params.cuid;
const copied = ref(false);

const serverURL = computed(() => {
  const origin = window.location.origin;
  return `${origin}/comment/${cuid}`;
});

const embedCode = computed(() => {
  return `import { init } from '@waline/client';
import '@waline/client/style';

init({
  el: '#waline',
  serverURL: '${serverURL.value}',
  // path: window.location.pathname,
  // login: 'force',
  // pageview: true,
});`;
});

async function copyCode() {
  try {
    await navigator.clipboard.writeText(embedCode.value);
    copied.value = true;
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = embedCode.value;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    copied.value = true;
  }
}
</script>
