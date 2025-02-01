<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="loadData">加载配置</v-btn>
        <v-btn @click="openCreateDialog">创建配置</v-btn>
      </v-col> </v-row
    ><v-divider></v-divider>
    <div v-for="item in configs">
      <v-card
        :key="item.id"
        class="d-flex justify-space-between align-center"
        :title="infomation[item.key] || item.key"
        :subtitle="item.key"
      >
        <div class="d-flex align-center">
          <v-card-text>{{ item.value }}</v-card-text>
          <v-card-actions>
            <v-btn @click="editItem(item)" color="primary">编辑</v-btn>
            <!-- <v-btn @click="deleteItem(item)" color="error">删除</v-btn>-->
          </v-card-actions>
        </div> </v-card
      >
  <v-divider></v-divider>
    </div>
    <!-- 单个编辑对话框 -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>编辑配置</v-card-title>
        <v-card-text>
          <v-text-field v-model="editItemData.key" label="名称"></v-text-field>
          <v-text-field v-model="editItemData.value" label="值"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmDeleteItem(editItemData)" color="error"
            >删除</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="editDialog = false">取消</v-btn>
          <v-btn @click="saveEdit" color="primary">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 创建配置对话框 -->
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card>
        <v-card-title>创建配置</v-card-title>
        <v-card-text>
          <v-text-field v-model="newConfig.key" label="名称"></v-text-field>
          <v-text-field v-model="newConfig.value" label="值"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="createDialog = false">取消</v-btn>
          <v-btn @click="createConfig" color="primary">创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>确认删除</v-card-title>
        <v-card-text
          >您确定要删除此配置吗？
          <v-list
            ><v-list-item
              border
              :title="deleteItemData.key"
              :subtitle="deleteItemData.value"
            ></v-list-item
          ></v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="deleteDialog = false" color="primary">取消</v-btn>
          <v-btn
            @click="
              deleteItem(deleteItemId);
              editDialog = false;
            "
            color="error"
            >确认</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import request from "@/axios/axios";

export default {
  data() {
    return {
      configs: [],
      editDialog: false,
      createDialog: false,
      deleteDialog: false,
      editItemData: {},
      newConfig: {
        key: "",
        value: "",
      },
      deleteItemData: {},
      deleteItemId: null,
      loading: false,
      infomation: {
        "s3.bucket": "S3桶名称",
        "s3.region": "S3地区",
        "s3.endpoint": "S3端点",
        "s3.AWS_ACCESS_KEY_ID": "S3访问密钥ID",
        "s3.AWS_SECRET_ACCESS_KEY": "S3访问秘钥",
        "s3.staticurl": "S3静态文件路径",
        cors: "跨域",
        "mail.from": "发件人",
        "mail.host": "SMTP主机",
        "mail.port": "SMTP端口",
        "mail.user": "SMTP用户名",
        "mail.pass": "SMTP密码",
        "mail.service": "SMTP服务商",
        "mail.fromname": "发件人名称",
        "site.tos": "用户服务协议",
        "site.privacy": "隐私政策",
        "site.name": "网站名称",
        "site.email": "网站邮箱",
        "site.domain": "网站域名",
        "site.slogan": "网站标语",
        "urls.editor": "编辑器URL",
        "urls.static": "静态文件URL",
        "waline.url": "Waline URL",
        "captcha.GEE_API_SERVER": "GEE API SERVER",
        "captcha.GEE_CAPTCHA_ID": "GEE CAPTCHA ID",
        "captcha.GEE_CAPTCHA_KEY": "GEE CAPTCHA KEY",
        "feedback.txcid": "兔小巢ID",
        "feedback.txckey": "兔小巢KEY",
        "security.jwttoken": "令牌签发密钥",
        "security.SessionSecret": "保持与令牌签发密钥相同",
        "security.adminuser": "管理员邮箱(无效)",
        "urls.frontend": "前端URL",
        "urls.backend": "后端URL",
        "feedback.qq.link": "QQ群链接",
        "feedback.qq.group": "QQ群号",
        "feedback.qq.description": "QQ群描述",
        "theme.mdui.color.primary": "MDUI主题颜色",
      },
    };
  },
  methods: {
    async loadData() {
      try {
        const response = await request.get("/api/admin/config/all");
        if (response.data.status === "success") {
          this.configs = response.data.data;
        }
      } catch (error) {
        console.error("加载配置失败", error);
      }
    },
    editItem(item) {
      this.editItemData = { ...item };
      this.editDialog = true;
    },
    async saveEdit() {
      try {
        const response = await request.put(
          `/api/admin/config/${this.editItemData.id}`,
          this.editItemData
        );
        if (response.data.status === "success") {
          this.loadData();
          this.editDialog = false;
        }
      } catch (error) {
        console.error("保存配置失败", error);
      }
    },
    confirmDeleteItem(item) {
      this.deleteItemId = item.id;
      this.deleteItemData = item;
      this.deleteDialog = true;
    },
    async deleteItem(id) {
      try {
        const response = await request.delete(`/api/admin/config/${id}`);
        if (response.data.status === "success") {
          this.loadData();
          this.deleteDialog = false;
        }
      } catch (error) {
        console.error("删除配置失败", error);
      }
    },
    openCreateDialog() {
      this.newConfig = { key: "", value: "" };
      this.createDialog = true;
    },
    async createConfig() {
      try {
        const response = await request.post(
          "/api/admin/config",
          this.newConfig
        );
        if (response.data.status === "success") {
          this.loadData();
          this.createDialog = false;
        }
      } catch (error) {
        console.error("创建配置失败", error);
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 0;
}
.v-divider {
  height: auto;
}
</style>
