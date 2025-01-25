<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="标题"
          required
          v-model="project.title"
          hint="将会在首页展示"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          hint="介绍作品类型，玩法，并向对这个作品有帮助的人致谢！"
          label="简介"
          v-model="project.description"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          :items="['scratch', 'python', 'text']"
          label="类型"
          required
          hint="不建议你改"
          v-model="project.type"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="project.state"
          :items="states"
          item-title="state"
          item-value="abbr"
          label="项目状态"
          hint="我们鼓励开源"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="tags.chips"
          :items="tags.items"
          label="标签"
          prepend-icon="mdi-tag"
          variant="solo"
          chips
          multiple
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :model-value="selected"
              closable
              @click="select"
              @click:close="removeTag(item)"
            >
              <strong>{{ item.name }}</strong
              >&nbsp;
              <span>(interest)</span>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>详细数据</v-expansion-panel-title>
          <v-expansion-panel-text>
            {{ project }}
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        color="error"
        text="删除"
        variant="tonal"
        @click="confirmDelete = true"
      ></v-btn>
      <v-spacer></v-spacer>
      <v-btn text="取消" variant="plain" @click="cancel"></v-btn>
      <v-btn
        color="primary"
        text="保存"
        variant="tonal"
        @click="saveProject"
      ></v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="项目名称"
          required
          v-model="newProjectName"
          hint="修改项目名称"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          color="primary"
          text="修改名称"
          variant="tonal"
          @click="renameProject"
        ></v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="confirmDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">确认删除</v-card-title>
        <v-card-text>你确定要删除这个项目吗？此操作无法撤销。</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="confirmDelete = false"
            >取消</v-btn
          >
          <v-btn color="error" text @click="deleteProject">删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import request from "../../../axios/axios";
import { localuser } from "@/middleware/userMiddleware";
import { useHead } from "@unhead/vue";
import { getProjectInfoByNamespace } from "@/stores/cache/project";

export default {
  data() {
    return {
      localuser,
      states: [
        { state: "私密", abbr: "private" },
        { state: "开源", abbr: "public" },
      ],
      projectID: this.$route.params.id,
      project: {},
      newProjectName: "",
      tags: {
        items: ["动画", "故事", "音乐", "硬核", "艺术", "水"],
        chips: [],
      },
      confirmDelete: false,
    };
  },
  async created() {
    if (!this.localuser.isLogin) {
      this.$router.push("/app/account/login");
    }
    await this.fetchProject();
  },
  setup() {
    useHead({ title: "项目设置" });
  },
  methods: {
    removeTag(item) {
      this.tags.chips.splice(this.tags.chips.indexOf(item), 1);
    },
    async fetchProject() {
      try {
        const { username, projectname } = this.$route.params;
        this.project = await getProjectInfoByNamespace(username, projectname);
        this.projectID = this.project.id;
        this.newProjectName = this.project.name;
        this.tags.chips = this.project.tags.map((tag) => tag.name);
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "无法获取项目数据",
          life: 3000,
        });
      }
    },
    async deleteProject() {
      try {
        await request.delete(`/project/${this.projectID}`);
        this.$toast.add({
          severity: "info",
          summary: "成功",
          detail: "项目已删除",
          life: 3000,
        });
        this.$router.push("/explore");
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "删除项目失败",
          life: 3000,
        });
      }
    },
    async saveProject() {
      this.project.tags = this.tags.chips.map((name) => name);
      try {
        const response = (
          await request.put(`/project/id/${this.projectID}`, this.project)
        ).data;
        this.$toast.add({
          severity: response.status,
          summary: response.message,
          detail: response.message,
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "保存项目失败",
          life: 3000,
        });
      }
    },
    async renameProject() {
      try {
        const response = (
          await request.put(`/project/rename/${this.projectID}`, {
            newName: this.newProjectName,
          })
        ).data;
        this.$toast.add({
          severity: response.status,
          summary: response.message,
          detail: response.message,
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "修改项目名称失败",
          life: 3000,
        });
      }
    },
    cancel() {
      this.$router.push("/explore/my");
    },
  },
};
</script>
