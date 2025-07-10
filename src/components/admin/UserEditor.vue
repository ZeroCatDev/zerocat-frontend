<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800px"
    persistent
  >
    <v-card><v-card-item>
      <v-card-title class="headline">
        编辑用户信息

      </v-card-title>
      <v-card-subtitle>
        <v-icon>mdi-account</v-icon>
        {{ userData.username }}
      </v-card-subtitle>
    <template v-slot:append>
      <v-btn icon @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
    </v-card-item>
      <v-divider></v-divider>

      <v-card-text class="pt-4">
        <v-form ref="editForm" v-model="formValid">
          <v-tabs
            :model-value="tabIndex"
            @update:model-value="tabIndex = $event"

          >
            <!-- <v-tab :value="0">基本信息</v-tab> -->
            <v-tab :value="1">个人资料</v-tab>
            <v-tab :value="2">账户连接</v-tab>
            <v-tab :value="3">头像设置</v-tab>
            <v-tab :value="4">数据</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window
              :model-value="tabIndex"
              @update:model-value="tabIndex = $event"
            >
              <!-- 基本信息标签页 -->
              <v-window-item :value="0">
                <v-container>
                  <v-row> </v-row>
                </v-container>
              </v-window-item>

              <!-- 个人资料标签页 -->
              <v-window-item :value="1">
                <v-container
                  ><v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="userData.display_name"
                      label="显示名称"
                      :rules="[(v) => !!v || '显示名称不能为空']"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="userData.username"
                      label="用户名"

                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="userData.status"
                      :items="statusOptions"
                      item-title="text"
                      item-value="value"
                      label="用户状态"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="userData.type"
                      :items="typeOptions"
                      item-title="text"
                      item-value="value"
                      label="用户类型"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="userData.email"
                      label="邮箱"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="userData.featured_projects"
                      label="精选项目"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="userData.motto"
                        label="一句话简介"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="userData.location"
                        label="位置"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        :model-value="selectedRegion ? selectedRegion.text : ''"
                        label="地区"
                        outlined
                        dense
                        readonly
                        @click="showRegionSelector = true"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="userData.url"
                        label="个人主页"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="userData.sex"
                        :items="sexOptions"
                        item-title="text"
                        item-value="value"
                        label="性别"
                        outlined
                        dense
                      ></v-select>
                    </v-col>
                    <!-- <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="userData.birthday"
                        label="生日"
                        type="date"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col> -->
                    <v-col cols="12">
                      <v-textarea
                        v-model="userData.bio"
                        label="个人简介"
                        outlined
                        dense
                        rows="3"
                        hint="支持 Markdown 格式"
                        persistent-hint
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>

              <!-- 账户连接标签页 -->
              <v-window-item :value="2">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <div class="d-flex align-center mb-4">
                        <h3 class="text-h6">连接</h3>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          prepend-icon="mdi-plus"
                          @click="showAddConnectionDialog"
                        >
                          添加连接
                        </v-btn>
                      </div>

                      <v-data-table
                        :headers="connectionHeaders"
                        :items="connections"
                        :loading="loadingConnections"
                        class="elevation-1"
                      >
                        <!-- 连接类型列 -->
                        <template v-slot:item.contact_type="{ item }">
                          <v-chip
                            :color="getConnectionTypeColor(item.contact_type)"
                            size="small"
                          >
                            {{ getConnectionTypeText(item.contact_type) }}
                          </v-chip>
                        </template>

                        <!-- 验证状态列 -->
                        <template v-slot:item.verified="{ item }">
                          <v-icon
                            :color="item.verified ? 'success' : 'warning'"
                            :icon="
                              item.verified
                                ? 'mdi-check-circle'
                                : 'mdi-alert-circle'
                            "
                          ></v-icon>
                          {{ item.verified ? "已验证" : "未验证" }}
                        </template>

                        <!-- 随机值列 -->
                        <template v-slot:item.contact_info="{ item }">
                          <div v-if="item.contact_info">
                            <div v-if="item.contact_info.username">
                              用户名: {{ item.contact_info.username }}
                            </div>
                            <div
                              v-if="item.contact_info.email"
                              class="text-caption"
                            >
                              邮箱: {{ item.contact_info.email }}
                            </div>
                          </div>
                          <span v-else class="text-caption">无详细信息</span>
                        </template>

                        <!-- 操作列 -->
                        <template v-slot:item.actions="{ item }">
                          <v-btn
                            icon="mdi-pencil"
                            size="small"
                            class="mr-2"
                            @click="editConnection(item)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-delete"
                            size="small"
                            color="error"
                            @click="confirmDeleteConnection(item)"
                          ></v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>

              <!-- 头像设置标签页 -->
              <v-window-item :value="3">
                <v-container>
                  <v-row justify="center" align="center">
                    <v-col cols="12" class="text-center">
                      <v-avatar size="150" class="mb-4">
                        <v-img
                          :src="s3BucketUrl + '/user/' + userData.avatar"
                        ></v-img>
                      </v-avatar>
                      <div>
                        <v-text-field
                          v-model="userData.avatar"
                          label="头像图片哈希"
                          outlined
                          dense
                          class="mt-4"
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>
              <v-window-item :value="4"><pre>{{ userData }}</pre></v-window-item>
            </v-window>
          </v-card-text>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">取消</v-btn>
        <v-btn
          color="primary"
          :loading="saving"
          :disabled="!formValid || saving"
          @click="save"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- 地区选择器对话框 -->
    <region-selector
      v-model="showRegionSelector"
      :selected-region="selectedRegion"
      @select="onRegionSelect"
      @clear="onRegionClear"
    />

    <!-- 添加/编辑连接对话框 -->
    <v-dialog v-model="connectionDialog.show" max-width="800px">
      <v-card>
        <v-card-title>
          {{ connectionDialog.isEdit ? "编辑连接 #" + connectionDialog.data.contact_id : "添加新连接" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="connectionForm" v-model="connectionDialog.valid">
            <v-select
              v-if="!connectionDialog.isEdit"
              v-model="connectionDialog.data.contact_type"
              :items="oauthTypes"
              label="连接类型"
              required
              :rules="[(v) => !!v || '请选择连接类型']"
            ></v-select>

            <v-text-field
              v-if="!connectionDialog.isEdit"
              v-model="connectionDialog.data.contact_value"
              label="提供商用户ID"
              required
              :rules="[(v) => !!v || '请输入提供商用户ID']"
            ></v-text-field>

            <v-card class="mt-4 pa-4" variant="outlined">
              <div class="d-flex align-center mb-4">
                <div class="text-subtitle-1">连接信息</div>
                <v-spacer></v-spacer>
              </div>
              <v-text-field
                v-model="connectionDialog.data.contact_value"
                label="连接值"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="connectionDialog.data.contact_info"
                label="随机值"
                outlined
                dense
              ></v-text-field>
              <v-select
                v-model="connectionDialog.data.contact_type"
                :items="oauthTypes"
                label="连接类型"
                outlined
                dense
              ></v-select>
            </v-card>

            <v-card class="mt-4 pa-4" variant="outlined">
              <div class="d-flex align-center mb-4">
                <div class="text-subtitle-1">元数据</div>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  size="small"
                  prepend-icon="mdi-plus"
                  @click="addMetadataField"
                >
                  添加字段
                </v-btn>
              </div>

              <div
                v-for="(value, key, index) in connectionDialog.data.metadata"
                :key="index"
                class="d-flex align-center mb-2 gap-2"
              >
                <v-text-field
                  v-model="connectionDialog.metadataKeys[index]"
                  label="字段名"
                  density="compact"
                  hide-details
                  class="flex-grow-0"
                  style="width: 200px"
                  @update:model-value="updateMetadataKey(index, key, $event)"
                ></v-text-field>
                <v-text-field
                  v-model="connectionDialog.data.metadata[key]"
                  :label="'值'"
                  density="compact"
                  hide-details
                  class="flex-grow-1"
                ></v-text-field>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  variant="text"
                  @click="removeMetadataField(key)"
                ></v-btn>
              </div>
            </v-card>

            <v-switch
              v-model="connectionDialog.data.verified"
              label="已验证"
              color="success"
              hide-details
              class="mt-4"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="connectionDialog.show = false"> 取消 </v-btn>
          <v-btn
            color="primary"
            :loading="connectionDialog.saving"
            :disabled="!connectionDialog.valid || connectionDialog.saving"
            @click="saveConnection"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除连接确认对话框 -->
    <v-dialog v-model="deleteConnectionDialog.show" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 text-error"> 确认删除连接 </v-card-title>
        <v-card-text>
          确定要删除这个
          {{
            getConnectionTypeText(
              deleteConnectionDialog.connection?.contact_type
            )
          }}
          连接吗？此操作不可撤销。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteConnectionDialog.show = false">
            取消
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteConnectionDialog.deleting"
            @click="deleteConnection"
          >
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import RegionSelector from "@/components/account/RegionSelector.vue";
import axios from "@/axios/axios";
import { get } from "@/services/serverConfig";

export default {
  name: "UserEditor",

  components: {
    RegionSelector,
  },

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
      default: () => ({}), // 提供默认空对象
    },
  },

  emits: ["update:modelValue", "save"],

  data() {
    return {
      // 表单控制
      tabIndex: 1,
      formValid: true,
      saving: false,
      showRegionSelector: false,
      selectedRegion: null,
      regionOptions: [], // 添加regionOptions到data中

      // 选项配置
      statusOptions: [
        { text: "活跃", value: "active" },
        { text: "已暂停", value: "suspended" },
        { text: "已封禁", value: "banned" },
        { text: "待验证", value: "pending" },
      ],
      typeOptions: [
        { text: "访客", value: "guest" },
        { text: "普通用户", value: "user" },
        { text: "管理员", value: "admin" },
      ],
      sexOptions: [
        { text: "男", value: "male" },
        { text: "女", value: "female" },
        { text: "其他", value: "other" },
      ],
      contactTypes: [
        { text: "邮箱", value: "email" },
        { text: "电话", value: "phone" },
        { text: "QQ", value: "qq" },
        { text: "Google", value: "oauth_google" },
        { text: "GitHub", value: "oauth_github" },
        { text: "Microsoft", value: "oauth_microsoft" },
        { text: "40code", value: "oauth_40code" },
        { text: "LinuxDo", value: "oauth_linuxdo" },
        { text: "其他", value: "other" },
      ],

      // 用户数据
      userData: this.initUserData(),

      // 连接管理相关
      connections: [],
      loadingConnections: false,
      connectionHeaders: [
        { title: "类型", key: "contact_type", width: "150px" },
        { title: "验证状态", key: "verified", width: "100px" },
        { title: "创建时间", key: "created_at", width: "180px" },
        { title: "操作", key: "actions", width: "100px", sortable: false },
      ],
      oauthTypes: [
        { title: "Google", value: "oauth_google" },
        { title: "GitHub", value: "oauth_github" },
        { title: "Microsoft", value: "oauth_microsoft" },
        { title: "40code", value: "oauth_40code" },
        { title: "LinuxDo", value: "oauth_linuxdo" },
        { title: "email", value: "email" },
        { title: "phone", value: "phone" },
        { title: "qq", value: "qq" },
        { title: "other", value: "other" },
      ],
      connectionDialog: {
        show: false,
        isEdit: false,
        valid: true,
        saving: false,
        data: this.initConnectionData(),
        infoKeys: [], // 用于跟踪 contact_info 的键
        metadataKeys: [], // 用于跟踪 metadata 的键
      },
      deleteConnectionDialog: {
        show: false,
        deleting: false,
        connection: null,
      },
      s3BucketUrl: "",
    };
  },

  async created() {
    // 加载地区选项
    try {
      const region_zh_CN = await import("@/constants/region_zh-CN.json");
      this.regionOptions = Object.entries(region_zh_CN.default).map(
        ([value, text]) => ({
          value,
          text,
        })
      );
    } catch (error) {
      console.error("Error loading region options:", error);
      this.regionOptions = [];
    }
    this.s3BucketUrl = await get("s3.staticurl");
  },

  watch: {
    user: {
      handler(newUser) {
        if (!newUser) {
          this.userData = this.initUserData();
          this.selectedRegion = null;
          return;
        }

        this.userData = this.initUserData(newUser);

        // 设置地区
        if (newUser?.region) {
          const regionText = this.getRegionText(newUser.region);
          if (regionText) {
            this.selectedRegion = {
              value: newUser.region,
              text: regionText,
            };
          } else {
            this.selectedRegion = null;
          }
        } else {
          this.selectedRegion = null;
        }

        if (newUser?.id) {
          this.loadConnections();
        }
      },
      immediate: true,
    },
  },

  methods: {
    initUserData(user = {}) {
      // 确保user参数有默认值
      return {
        // 基本信息
        id: user?.id ?? null,
        username: user?.username ?? "",
        display_name: user?.display_name ?? "",
        status: user?.status ?? "active",
        type: user?.type ?? "user",
        email: user?.email ?? "",
        featured_projects: user?.featured_projects ?? "",
        // 个人资料
        motto: user?.motto ?? "",
        bio: user?.bio ?? "",
        location: user?.location ?? "",
        region: user?.region ?? "",
        birthday: user?.birthday ?? "",
        sex: user?.sex ?? "",
        url: user?.url ?? "",
        // 自定义状态
        custom_status: user?.custom_status ?? {
          emoji: "",
          text: "",
        },

        // 头像
        avatar: user?.avatar ?? "",

        // 特色项目
        featured_projects: user?.featured_projects ?? [],

        // 联系方式
        contacts: (user?.contacts ?? []).map((contact) => ({
          contact_type: contact?.contact_type ?? "",
          contact_value: contact?.contact_value ?? "",
          is_primary: contact?.is_primary ?? false,
          verified: contact?.verified ?? false,
          contact_info: contact?.contact_info ?? "",
          metadata: contact?.metadata ?? {},
        })),
      };
    },

    getRegionText(regionValue) {
      if (!regionValue) return "";
      const region = this.regionOptions.find((r) => r.value === regionValue);
      return region ? region.text : regionValue;
    },

    addContact() {
      this.userData.contacts.push({
        contact_type: "",
        contact_value: "",
        is_primary: false,
        verified: false,
        contact_info: "",
        metadata: {},
      });
    },

    removeContact(index) {
      this.userData.contacts.splice(index, 1);
    },

    onRegionSelect(region) {
      this.selectedRegion = region;
      this.userData.region = region.value;
      this.showRegionSelector = false;
    },

    onRegionClear() {
      this.selectedRegion = null;
      this.userData.region = null;
      this.showRegionSelector = false;
    },

    close() {
      this.$emit("update:modelValue", false);
    },

    async save() {
      if (!this.$refs.editForm.validate()) return;

      this.saving = true;
      try {
        await this.$emit("save", this.userData);
        this.close();
      } finally {
        this.saving = false;
      }
    },

    // 初始化连接数据
    initConnectionData() {
      return {
        contact_type: "",
        contact_value: "",
        contact_info: "",
        metadata: {},
        verified: false,
      };
    },

    // 加载用户连接
    async loadConnections() {
      if (!this.userData.id) return;

      this.loadingConnections = true;
      try {
        const { data } = await axios.get(
          `/admin/users/${this.userData.id}/connections`
        );
        this.connections = data;
      } catch (error) {
        console.error("Error loading connections:", error);
        // 显示错误提示
      } finally {
        this.loadingConnections = false;
      }
    },

    // 显示添加连接对话框
    showAddConnectionDialog() {
      this.connectionDialog.isEdit = false;
      this.connectionDialog.data = this.initConnectionData();
      this.connectionDialog.infoKeys = [];
      this.connectionDialog.metadataKeys = [];
      this.connectionDialog.show = true;
    },

    // 显示编辑连接对话框
    editConnection(connection) {
      this.connectionDialog.isEdit = true;
      this.connectionDialog.data = {
        ...connection,
        metadata: { ...connection.metadata },
      };
      // 初始化键数组
      this.connectionDialog.metadataKeys = Object.keys(
        connection.metadata || {}
      );
      this.connectionDialog.show = true;
    },

    // 添加元数据字段
    addMetadataField() {
      const newKey = `field_${this.connectionDialog.metadataKeys.length + 1}`;
      this.$set(this.connectionDialog.data.metadata, newKey, "");
      this.connectionDialog.metadataKeys.push(newKey);
    },

    // 更新元数据字段的键
    updateMetadataKey(index, oldKey, newKey) {
      if (newKey && newKey !== oldKey) {
        const value = this.connectionDialog.data.metadata[oldKey];
        this.$delete(this.connectionDialog.data.metadata, oldKey);
        this.$set(this.connectionDialog.data.metadata, newKey, value);
        this.connectionDialog.metadataKeys[index] = newKey;
      }
    },

    // 删除元数据字段
    removeMetadataField(key) {
      this.$delete(this.connectionDialog.data.metadata, key);
      const index = this.connectionDialog.metadataKeys.indexOf(key);
      if (index > -1) {
        this.connectionDialog.metadataKeys.splice(index, 1);
      }
    },

    // 保存连接
    async saveConnection() {
      if (!this.$refs.connectionForm?.validate()) return;

      this.connectionDialog.saving = true;
      try {
        if (this.connectionDialog.isEdit) {
          await axios.put(
            `/admin/users/${this.userData.id}/connections/${this.connectionDialog.data.contact_id}`,
            {
              contact_info: this.connectionDialog.data.contact_info,
              contact_value: this.connectionDialog.data.contact_value,
              metadata: this.connectionDialog.data.metadata,
              contact_type: this.connectionDialog.data.contact_type,
              verified: this.connectionDialog.data.verified,
            }
          );
        } else {
          await axios.post(`/admin/users/${this.userData.id}/connections`, {
            contact_info: this.connectionDialog.data.contact_info,
            contact_value: this.connectionDialog.data.contact_value,
            metadata: this.connectionDialog.data.metadata,
            contact_type: this.connectionDialog.data.contact_type,
            verified: this.connectionDialog.data.verified,
          });
        }

        await this.loadConnections();
        this.connectionDialog.show = false;
      } catch (error) {
        console.error("Error saving connection:", error);
        // 显示错误提示
      } finally {
        this.connectionDialog.saving = false;
      }
    },

    // 确认删除连接
    confirmDeleteConnection(connection) {
      this.deleteConnectionDialog.connection = connection;
      this.deleteConnectionDialog.show = true;
    },

    // 删除连接
    async deleteConnection() {
      if (!this.deleteConnectionDialog.connection) return;

      this.deleteConnectionDialog.deleting = true;
      try {
        await axios.delete(
          `/admin/users/${this.userData.id}/connections/${this.deleteConnectionDialog.connection.contact_id}`
        );

        await this.loadConnections();
        this.deleteConnectionDialog.show = false;
      } catch (error) {
        console.error("Error deleting connection:", error);
        // 显示错误提示
      } finally {
        this.deleteConnectionDialog.deleting = false;
      }
    },

    // 获取连接类型显示文本
    getConnectionTypeText(type) {
      const found = this.oauthTypes.find((t) => t.value === type);
      return found ? found.title : type;
    },

    // 获取连接类型颜色
    getConnectionTypeColor(type) {
      const colors = {
        oauth_google: "red",
        oauth_github: "grey-darken-3",
        oauth_microsoft: "blue",
        oauth_40code: "purple",
        oauth_linuxdo: "green",
      };
      return colors[type] || "grey";
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-list {
  max-height: 300px;
  overflow-y: auto;
}

.custom-status {
  display: flex;
  align-items: center;
  gap: 8px;

  .emoji-picker {
    width: 80px;
  }

  .status-text {
    flex: 1;
  }
}

.gap-2 {
  gap: 8px;
}
</style>
