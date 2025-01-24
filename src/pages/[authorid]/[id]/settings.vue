<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="标题"
          required
          v-model="currentProject.title"
          hint="将会在首页展示"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-textarea
          hint="介绍作品类型，玩法，并向对这个作品有帮助的人致谢！"
          label="简介"
          v-model="currentProject.description"
        ></v-textarea>
      </v-col>

      <v-col cols="12" sm="6">
        <v-select
          :items="['scratch', 'python', 'text']"
          label="类型"
          required
          hint="不建议你改"
          v-model="currentProject.type"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="currentProject.state"
          :items="projectstates"
          item-title="state"
          item-value="abbr"
          label="项目状态"
          hint="我们鼓励开源"
        ></v-select>
      </v-col>

      <v-col cols="12">
        <v-combobox
          v-model="aboutTags.chips"
          :items="aboutTags.items"
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
              @click:close="removetag(item)"
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
            {{ currentProject }}
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
        @click="SaveProjectsInfo"
      ></v-btn>
    </v-card-actions>

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
import { localuser } from "@/stores/user";
import { useHead } from "@unhead/vue";
import {
  fetchProjectDetailsFromCloud,
  cacheProjectInfo,
} from "@/stores/cache/project";

export default {
  data() {
    return {
      localuser: localuser,
      projectstates: [
        { state: "私密", abbr: "private" },
        { state: "开源", abbr: "public" },
      ],
      currentProjectID: this.$route.params.id,
      currentProject: {},
      aboutTags: {
        items: ["动画", "故事", "音乐", "硬核", "艺术", "水"],
        chips: [],
      },
      confirmDelete: false,
    };
  },
  async created() {
    if (this.localuser.islogin == false) {
      this.$router.push("/app/account/login");
    }
    await this.fetchProject();
  },
  setup() {
    useHead({
      title: "项目设置",
    });
  },
  methods: {
    removetag(item) {
      this.aboutTags.chips.splice(this.aboutTags.chips.indexOf(item), 1);
    },
    async fetchProject() {
      try {
        this.currentProject = await fetchProjectDetailsFromCloud(
          this.currentProjectID
        );
        this.aboutTags.chips = this.currentProject.tags.map((tag) => tag.name);
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
        await request.delete(`/project/${this.currentProjectID}`);
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
    async SaveProjectsInfo() {
      this.currentProject.tags = this.aboutTags.chips.map((name) => name);
      try {
        const response = (await request.put(
          `/project/${this.currentProjectID}`,
          this.currentProject
        )).data;
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
    cancel() {
      this.$router.push("/explore/my");
    },
  },
};
</script>
