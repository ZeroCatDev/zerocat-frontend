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
      空间配置
    </div>
    <div class="text-body-2 text-medium-emphasis mb-6">
      管理基本信息、评论策略及安全设置
    </div>

    <v-skeleton-loader v-if="loading" type="card, card" />

    <template v-else>
      <!-- Basic Info -->
      <v-card variant="flat" border class="mb-5">
        <v-card-text class="pa-5">
          <div class="d-flex align-center mb-4">
            <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
              <v-icon size="16" color="primary">mdi-information-outline</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold">基本信息</div>
          </div>

          <v-text-field
            v-model="info.name"
            label="空间名称"
            variant="solo-filled"
            flat
            density="comfortable"
            class="mb-4"
          />

          <v-text-field
            v-model="info.domain"
            label="绑定域名"
            variant="solo-filled"
            flat
            density="comfortable"
            placeholder="blog.example.com"
            hint="限制评论嵌入的域名，留空表示不限制"
            persistent-hint
            class="mb-4"
          />

          <v-select
            v-model="info.status"
            label="空间状态"
            variant="solo-filled"
            flat
            density="comfortable"
            :items="[
              { title: '活跃', value: 'active' },
              { title: '停用', value: 'inactive' },
            ]"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="px-5 py-3">
          <v-spacer />
          <v-btn color="primary" :loading="savingInfo" @click="saveInfo" class="text-none">
            保存
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Comment & Security Config (single card, single save) -->
      <v-card variant="flat" border class="mb-5">
        <!-- 评论设置 -->
        <v-card-text class="pa-5 pb-2">
          <div class="d-flex align-center mb-4">
            <v-avatar size="32" color="info" variant="tonal" class="mr-3">
              <v-icon size="16" color="info">mdi-comment-check-outline</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold">评论设置</div>
          </div>

          <v-switch
            v-model="configBool.audit"
            label="新评论需要审核"
            color="primary"
            hide-details
            density="compact"
            class="mb-4"
          />

          <v-select
            v-model="config.login"
            label="登录要求"
            variant="solo-filled"
            flat
            density="comfortable"
            :items="[
              { title: '允许匿名评论', value: '' },
              { title: '强制登录', value: 'force' },
            ]"
            class="mb-4"
          />

          <v-text-field
            v-model="config.ipqps"
            label="IP 评论间隔（秒）"
            variant="solo-filled"
            flat
            density="comfortable"
            type="number"
            hint="同一 IP 两次评论的最短间隔"
            persistent-hint
            class="mb-4"
          />

          <v-textarea
            v-model="config.forbiddenWords"
            label="敏感词"
            variant="solo-filled"
            flat
            density="comfortable"
            placeholder="用逗号分隔，例如：广告,spam,垃圾"
            rows="2"
            hint="匹配到敏感词的评论将被标记为垃圾"
            persistent-hint
          />
        </v-card-text>

        <v-divider class="mx-5" />

        <!-- 显示设置 -->
        <v-card-text class="pa-5 pb-2">
          <div class="d-flex align-center mb-4">
            <v-avatar size="32" color="success" variant="tonal" class="mr-3">
              <v-icon size="16" color="success">mdi-eye-outline</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold">显示设置</div>
          </div>

          <v-switch
            v-model="configBool.disableUserAgent"
            label="隐藏浏览器/操作系统信息"
            color="primary"
            hide-details
            density="compact"
            class="mb-3"
          />

          <v-switch
            v-model="configBool.disableRegion"
            label="隐藏 IP 地区信息"
            color="primary"
            hide-details
            density="compact"
            class="mb-4"
          />

          <v-text-field
            v-model="config.avatarProxy"
            label="头像代理地址"
            variant="solo-filled"
            flat
            density="comfortable"
            placeholder="https://proxy.example.com"
          />
        </v-card-text>

        <v-divider class="mx-5" />

        <!-- 安全设置 -->
        <v-card-text class="pa-5 pb-2">
          <div class="d-flex align-center mb-4">
            <v-avatar size="32" color="warning" variant="tonal" class="mr-3">
              <v-icon size="16" color="warning">mdi-shield-lock-outline</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold">安全设置</div>
          </div>

          <v-textarea
            v-model="config.secureDomains"
            label="嵌入域名白名单"
            variant="solo-filled"
            flat
            density="comfortable"
            placeholder="用逗号分隔，例如：blog.example.com,docs.example.com"
            rows="2"
            hint="允许嵌入评论组件的域名，留空表示不限制"
            persistent-hint
            class="mb-4"
          />

          <v-text-field
            v-model="config.levels"
            label="用户等级阈值"
            variant="solo-filled"
            flat
            density="comfortable"
            placeholder="用逗号分隔，例如：0,10,50,100,500"
            hint="根据评论数量划分用户等级"
            persistent-hint
          />
        </v-card-text>

        <v-divider />
        <v-card-actions class="px-5 py-3">
          <v-spacer />
          <v-btn color="primary" :loading="savingConfig" @click="saveConfig" class="text-none">
            保存配置
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Danger Zone -->
      <v-card variant="flat" border="error thin" class="mb-4">
        <v-card-text class="pa-5">
          <div class="d-flex align-center mb-4">
            <v-avatar size="32" color="error" variant="tonal" class="mr-3">
              <v-icon size="16" color="error">mdi-alert-outline</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold text-error">危险操作</div>
          </div>
          <div class="d-flex align-center">
            <div>
              <div class="text-body-2 font-weight-medium">删除空间</div>
              <div class="text-caption text-medium-emphasis">
                删除后所有评论、用户数据将被永久清除，无法恢复
              </div>
            </div>
            <v-spacer />
            <v-btn
              color="error"
              variant="tonal"
              size="small"
              class="text-none"
              @click="confirmDelete = true"
            >
              删除空间
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Delete Dialog -->
      <v-dialog v-model="confirmDelete" max-width="420">
        <v-card border>
          <v-card-text class="pa-6">
            <div class="d-flex align-center mb-4">
              <v-avatar size="40" color="error" variant="tonal" class="mr-3">
                <v-icon color="error">mdi-delete-alert-outline</v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold">确认删除</div>
            </div>
            <div class="text-body-2 text-medium-emphasis">
              确定要删除此空间吗？此操作不可撤销，所有评论和用户数据将被永久删除。
            </div>
          </v-card-text>
          <v-card-actions class="px-6 pb-5">
            <v-spacer />
            <v-btn variant="text" @click="confirmDelete = false" class="text-none">取消</v-btn>
            <v-btn color="error" :loading="deleting" @click="doDelete" class="text-none">
              确认删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import {
  getSpace,
  updateSpace,
  getSpaceConfig,
  updateSpaceConfig,
  deleteSpace,
} from "@/services/commentService";

useHead({ title: "空间配置" });

const route = useRoute();
const router = useRouter();
const cuid = route.params.cuid;

const loading = ref(true);
const savingInfo = ref(false);
const savingConfig = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const confirmDelete = ref(false);
const deleting = ref(false);

const info = ref({ name: "", domain: "", status: "active" });
const config = reactive({
  audit: "false",
  login: "",
  ipqps: "60",
  forbiddenWords: "",
  disableUserAgent: "false",
  disableRegion: "false",
  secureDomains: "",
  avatarProxy: "",
  levels: "",
});

const configBool = reactive({
  get audit() { return config.audit === "true"; },
  set audit(v) { config.audit = v ? "true" : "false"; },
  get disableUserAgent() { return config.disableUserAgent === "true"; },
  set disableUserAgent(v) { config.disableUserAgent = v ? "true" : "false"; },
  get disableRegion() { return config.disableRegion === "true"; },
  set disableRegion(v) { config.disableRegion = v ? "true" : "false"; },
});

function showMsg(text, color = "success") {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
}

async function saveInfo() {
  savingInfo.value = true;
  try {
    const body = { name: info.value.name, status: info.value.status };
    if (info.value.domain) body.domain = info.value.domain;
    else body.domain = null;
    await updateSpace(cuid, body);
    showMsg("基本信息已保存");
  } catch (e) {
    showMsg("保存失败", "error");
  } finally {
    savingInfo.value = false;
  }
}

async function saveConfig() {
  savingConfig.value = true;
  try {
    await updateSpaceConfig(cuid, { ...config });
    showMsg("配置已保存");
  } catch (e) {
    showMsg("保存失败", "error");
  } finally {
    savingConfig.value = false;
  }
}

async function doDelete() {
  deleting.value = true;
  try {
    await deleteSpace(cuid);
    router.replace("/app/commentservice");
  } catch (e) {
    showMsg("删除失败", "error");
  } finally {
    deleting.value = false;
  }
}

onMounted(async () => {
  try {
    const [spaceRes, configRes] = await Promise.all([
      getSpace(cuid),
      getSpaceConfig(cuid),
    ]);
    const s = spaceRes.data;
    info.value = { name: s.name, domain: s.domain || "", status: s.status };
    Object.assign(config, configRes.data);
  } catch (e) {
    console.error("Failed to load settings:", e);
  } finally {
    loading.value = false;
  }
});
</script>
