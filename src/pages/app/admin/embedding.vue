<template>
  <v-container fluid>
    <!-- 标题卡片 -->
    <v-card class="mb-6" elevation="2">
      <v-card-item>
        <template v-slot:prepend>
          <v-icon class="me-4" color="primary" icon="mdi-cube-scan" size="large" />
        </template>
        <v-card-title class="text-h5">Embedding 向量服务</v-card-title>
        <v-card-subtitle class="mt-2">管理语义向量生成与相似推荐功能</v-card-subtitle>
        <template v-slot:append>
          <v-btn
            :loading="statusLoading"
            icon="mdi-refresh"
            variant="text"
            title="刷新状态"
            @click="loadStatus"
          />
        </template>
      </v-card-item>
    </v-card>

    <v-row>
      <!-- ─── 服务状态 ─── -->
      <v-col cols="12" md="5">
        <v-card variant="outlined" height="100%">
          <v-card-title class="d-flex align-center ga-2 pt-4 px-4">
            <v-icon icon="mdi-server-network" />
            服务状态
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader v-if="statusLoading" type="list-item-two-line,list-item-two-line,list-item-two-line" />
            <template v-else>
              <v-list density="compact">
                <!-- 启用状态 -->
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon
                      :color="status.enabled ? 'success' : 'error'"
                      :icon="status.enabled ? 'mdi-check-circle' : 'mdi-close-circle'"
                    />
                  </template>
                  <v-list-item-title>运行状态</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ status.enabled ? '已启用' : '未启用' }}
                  </v-list-item-subtitle>
                </v-list-item>

                <!-- pgvector 状态 -->
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon
                      :color="pgvectorReady ? 'success' : 'warning'"
                      :icon="pgvectorReady ? 'mdi-database-check' : 'mdi-database-alert'"
                    />
                  </template>
                  <v-list-item-title>pgvector</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ pgvectorReady ? '已初始化' : '未初始化' }}
                  </v-list-item-subtitle>
                </v-list-item>

                <template v-if="status.enabled">
                  <!-- 模型提供商 -->
                  <v-list-item v-if="status.provider">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-robot-outline" />
                    </template>
                    <v-list-item-title>提供商</v-list-item-title>
                    <v-list-item-subtitle>{{ status.provider }}</v-list-item-subtitle>
                  </v-list-item>

                  <!-- 模型名 -->
                  <v-list-item v-if="status.model">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-brain" />
                    </template>
                    <v-list-item-title>模型</v-list-item-title>
                    <v-list-item-subtitle>{{ status.model }}</v-list-item-subtitle>
                  </v-list-item>

                  <!-- 向量维度 -->
                  <v-list-item v-if="status.dimensions">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-vector-line" />
                    </template>
                    <v-list-item-title>向量维度</v-list-item-title>
                    <v-list-item-subtitle>{{ status.dimensions }}</v-list-item-subtitle>
                  </v-list-item>

                  <!-- API 地址 -->
                  <v-list-item v-if="status.apiBase">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-link" />
                    </template>
                    <v-list-item-title>API 地址</v-list-item-title>
                    <v-list-item-subtitle class="text-truncate">{{ status.apiBase }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-list>

              <!-- 向量统计 -->
              <template v-if="status.enabled && pgvectorReady && storedEmbeddings">
                <v-divider class="my-2" />
                <p class="text-subtitle-2 font-weight-bold px-2 mb-1">已存储向量数</p>
                <v-table density="compact">
                  <tbody>
                    <tr v-for="(count, type) in storedEmbeddings" :key="type">
                      <td>{{ type }}</td>
                      <td class="text-right">{{ count.toLocaleString() }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </template>

              <v-alert
                v-if="statusError"
                type="error"
                variant="tonal"
                class="mt-3"
                :text="statusError"
              />
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ─── 右侧操作区 ─── -->
      <v-col cols="12" md="7">
        <v-row>
          <!-- pgvector 初始化 -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="d-flex align-center ga-2 pt-4 px-4">
                <v-icon icon="mdi-database-cog" />
                初始化 pgvector
              </v-card-title>
              <v-card-subtitle class="px-4 pb-2">
                首次使用前需执行。幂等操作，可重复调用。
              </v-card-subtitle>
              <v-card-text>
                <v-btn
                  color="secondary"
                  prepend-icon="mdi-database-plus"
                  :loading="initLoading"
                  block
                  @click="runInit"
                >
                  初始化 / 验证 pgvector 扩展与表结构
                </v-btn>
                <v-alert
                  v-if="initResult"
                  :type="initResult.status === 'success' ? 'success' : 'error'"
                  variant="tonal"
                  class="mt-3"
                  :text="initResult.message"
                  closable
                  @click:close="initResult = null"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 全量生成 -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="d-flex align-center ga-2 pt-4 px-4">
                <v-icon icon="mdi-lightning-bolt" />
                全量生成向量
              </v-card-title>
              <v-card-subtitle class="px-4 pb-2">
                任务通过 BullMQ 队列异步执行，可在 Bull Board 面板查看队列进度。
              </v-card-subtitle>
              <v-card-text>
                <!-- force 开关 -->
                <v-switch
                  v-model="forceRegen"
                  label="强制重新生成（忽略 change detection，覆盖已有向量）"
                  color="warning"
                  density="compact"
                  hide-details
                  class="mb-4"
                />

                <v-row>
                  <!-- 全部 -->
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      prepend-icon="mdi-all-inclusive"
                      :loading="generating.all"
                      :disabled="anyGenerating"
                      block
                      size="large"
                      @click="runGenerate('all')"
                    >
                      全量生成（帖子 + 用户）
                    </v-btn>
                  </v-col>
                  <!-- 帖子 -->
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="secondary"
                      prepend-icon="mdi-file-document-outline"
                      :loading="generating.posts"
                      :disabled="anyGenerating"
                      block
                      @click="runGenerate('posts')"
                    >
                      全量帖子向量
                    </v-btn>
                  </v-col>
                  <!-- 用户 -->
                  <v-col cols="12" sm="6">
                    <v-btn
                      color="secondary"
                      prepend-icon="mdi-account-group-outline"
                      :loading="generating.users"
                      :disabled="anyGenerating"
                      block
                      @click="runGenerate('users')"
                    >
                      全量用户向量
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- 进行中提示 -->
                <v-alert
                  v-if="anyGenerating"
                  type="info"
                  variant="tonal"
                  class="mt-4"
                  icon="mdi-timer-sand"
                  text="任务已入队，请在 Bull Board 面板查看执行进度……"
                />

                <!-- 生成结果 -->
                <template v-if="generateResult">
                  <v-divider class="my-4" />
                  <p class="text-subtitle-2 font-weight-bold mb-2">
                    <v-icon icon="mdi-check-circle" color="success" size="small" class="mr-1" />
                    {{ generateResult.message ?? '任务入队成功' }}
                  </p>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>类别</th>
                        <th>总数</th>
                        <th>批次数</th>
                        <th>Job 数</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="generateResult.data?.posts || generateResult.data?.users">
                        <tr v-if="generateResult.data.posts">
                          <td>帖子</td>
                          <td>{{ generateResult.data.posts.total?.toLocaleString() }}</td>
                          <td>{{ generateResult.data.posts.batches }}</td>
                          <td>{{ generateResult.data.posts.jobIds?.length }}</td>
                        </tr>
                        <tr v-if="generateResult.data.users">
                          <td>用户</td>
                          <td>{{ generateResult.data.users.total?.toLocaleString() }}</td>
                          <td>{{ generateResult.data.users.batches }}</td>
                          <td>{{ generateResult.data.users.jobIds?.length }}</td>
                        </tr>
                      </template>
                      <tr v-else-if="generateResult.data?.total !== undefined">
                        <td>-</td>
                        <td>{{ generateResult.data.total?.toLocaleString() }}</td>
                        <td>{{ generateResult.data.batches }}</td>
                        <td>{{ generateResult.data.jobIds?.length }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </template>

                <!-- 生成错误 -->
                <v-alert
                  v-if="generateError"
                  type="error"
                  variant="tonal"
                  class="mt-4"
                  :text="generateError"
                  closable
                  @click:close="generateError = null"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 单条生成 -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="d-flex align-center ga-2 pt-4 px-4">
                <v-icon icon="mdi-target" />
                单条向量生成
              </v-card-title>
              <v-card-subtitle class="px-4 pb-2">
                强制模式，立即入队，忽略 change detection。
              </v-card-subtitle>
              <v-card-text>
                <v-row align="start">
                  <!-- 单帖子 -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="singlePostId"
                      label="帖子 ID"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details="auto"
                      :error-messages="singlePostError"
                      clearable
                    />
                    <v-btn
                      class="mt-2"
                      color="primary"
                      prepend-icon="mdi-file-send-outline"
                      :loading="singleLoading.post"
                      :disabled="!singlePostId || anySingleLoading"
                      block
                      @click="runSinglePost"
                    >
                      生成帖子向量
                    </v-btn>
                    <v-alert
                      v-if="singlePostResult"
                      :type="singlePostResult.status === 'success' ? 'success' : 'error'"
                      variant="tonal"
                      density="compact"
                      class="mt-2"
                      :text="singlePostResult.message"
                      closable
                      @click:close="singlePostResult = null"
                    />
                  </v-col>

                  <!-- 单用户 -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model.number="singleUserId"
                      label="用户 ID"
                      type="number"
                      density="compact"
                      variant="outlined"
                      hide-details="auto"
                      :error-messages="singleUserError"
                      clearable
                    />
                    <v-btn
                      class="mt-2"
                      color="primary"
                      prepend-icon="mdi-account-arrow-right-outline"
                      :loading="singleLoading.user"
                      :disabled="!singleUserId || anySingleLoading"
                      block
                      @click="runSingleUser"
                    >
                      生成用户向量
                    </v-btn>
                    <v-alert
                      v-if="singleUserResult"
                      :type="singleUserResult.status === 'success' ? 'success' : 'error'"
                      variant="tonal"
                      density="compact"
                      class="mt-2"
                      :text="singleUserResult.message"
                      closable
                      @click:close="singleUserResult = null"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import EmbeddingService from '@/services/embeddingService';

// ─── 状态 ─────────────────────────────────────────────────────────────────────
const statusLoading = ref(false);
const statusError = ref(null);
const status = ref({});

const pgvectorReady = computed(() => {
  if (status.value.pgvectorReady === false) return false;
  const emb = status.value.storedEmbeddings;
  return emb !== undefined; // null → 未初始化, object → 已初始化
});

const storedEmbeddings = computed(() => status.value.storedEmbeddings ?? null);

// ─── 初始化 ───────────────────────────────────────────────────────────────────
const initLoading = ref(false);
const initResult = ref(null);

// ─── 全量生成 ─────────────────────────────────────────────────────────────────
const forceRegen = ref(false);
const generating = ref({ all: false, posts: false, users: false });
const generateResult = ref(null);
const generateError = ref(null);
const anyGenerating = computed(() => Object.values(generating.value).some(Boolean));

// ─── 单条生成 ─────────────────────────────────────────────────────────────────
const singlePostId = ref(null);
const singleUserId = ref(null);
const singleLoading = ref({ post: false, user: false });
const singlePostResult = ref(null);
const singleUserResult = ref(null);
const singlePostError = ref('');
const singleUserError = ref('');
const anySingleLoading = computed(() => Object.values(singleLoading.value).some(Boolean));

// ─── 方法 ─────────────────────────────────────────────────────────────────────

const loadStatus = async () => {
  statusLoading.value = true;
  statusError.value = null;
  try {
    status.value = await EmbeddingService.getAdminStatus();
  } catch (e) {
    statusError.value = e.message;
  } finally {
    statusLoading.value = false;
  }
};

const runInit = async () => {
  initLoading.value = true;
  initResult.value = null;
  try {
    initResult.value = await EmbeddingService.initPgvector();
    // 刷新状态以更新 pgvector 就绪标志
    await loadStatus();
  } catch (e) {
    initResult.value = { status: 'error', message: e.message };
  } finally {
    initLoading.value = false;
  }
};

const generateMap = {
  all: () => EmbeddingService.generateAll(forceRegen.value),
  posts: () => EmbeddingService.generateAllPosts(forceRegen.value),
  users: () => EmbeddingService.generateAllUsers(forceRegen.value),
};

const runGenerate = async (type) => {
  generating.value[type] = true;
  generateResult.value = null;
  generateError.value = null;
  try {
    generateResult.value = await generateMap[type]();
  } catch (e) {
    generateError.value = e.message;
  } finally {
    generating.value[type] = false;
  }
};

const runSinglePost = async () => {
  singlePostError.value = '';
  if (!singlePostId.value || singlePostId.value <= 0) {
    singlePostError.value = '请输入有效的帖子 ID';
    return;
  }
  singleLoading.value.post = true;
  singlePostResult.value = null;
  try {
    singlePostResult.value = await EmbeddingService.generatePost(singlePostId.value);
  } catch (e) {
    singlePostResult.value = { status: 'error', message: e.message };
  } finally {
    singleLoading.value.post = false;
  }
};

const runSingleUser = async () => {
  singleUserError.value = '';
  if (!singleUserId.value || singleUserId.value <= 0) {
    singleUserError.value = '请输入有效的用户 ID';
    return;
  }
  singleLoading.value.user = true;
  singleUserResult.value = null;
  try {
    singleUserResult.value = await EmbeddingService.generateUser(singleUserId.value);
  } catch (e) {
    singleUserResult.value = { status: 'error', message: e.message };
  } finally {
    singleLoading.value.user = false;
  }
};

onMounted(loadStatus);
</script>
