<template>
  <v-container
    >
    <v-row>
      <v-col cols="12"><h1>常规</h1></v-col>
      <v-col cols="7">
        <v-text-field
          label="项目名称"
          required
          v-model="newProjectName"
          hint="修改项目名称"
          variant="outlined"
        >
          <template v-slot:append>
            <v-btn
              color="primary"
              text="修改名称"
              variant="tonal"
              @click="renameProject"
            ></v-btn> </template></v-text-field
      ></v-col>
      <v-col cols="12"><v-divider></v-divider></v-col>
      <v-col cols="7">
        <v-text-field
          label="项目标题"
          required
          v-model="project.title"
          hint="可读性更好的标题"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          hint="介绍作品类型，玩法，并向对这个作品有帮助的人致谢！"
          label="简介"
          v-model="project.description"
          variant="outlined"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="6">
        <LanguageSelector
          v-model="project.type"
          label="类型"
          required
          hint="不建议你改"
        />
      </v-col>

      <v-col cols="12" sm="6">
        <LicenseSelector v-model="project.license" />
      </v-col>

      <v-col cols="12">
        <v-combobox
          v-model="tags.chips"
          :items="tags.items"
          label="标签"
          prepend-icon="mdi-tag"
          variant="outlined"
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
      <v-col cols="12">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="cancel"></v-btn>
          <v-btn
            color="primary"
            text="保存"
            variant="tonal"
            @click="saveProject"
          ></v-btn> </v-card-actions
      ></v-col>
      <v-col cols="12"><h1>图片</h1></v-col>
      <v-col cols="12">
        <v-file-input
          ref="fileInput"
          label="上传封面"
          variant="outlined"
          accept="image/*"
          prepend-icon="mdi-image"
          @change="onFileChange"
        ></v-file-input>
        <v-img v-if="thumbnail" :src="thumbnail" max-width="200"></v-img>
        <v-btn
          color="primary"
          text="上传封面"
          variant="tonal"
          @click="uploadThumbnail"
          :disabled="!thumbnail"
        ></v-btn>
      </v-col>
      <v-col cols="12"><h1>危险</h1></v-col>
      <v-col cols="12"
        ><v-card>
          <v-list>
            <v-list-item title="删除此项目" subtitle="删除此项目后无法恢复。">
              <template v-slot:append>
                <v-btn
                  color="error"
                  text="删除此项目"
                  variant="tonal"
                  @click="confirmDelete = true"
                ></v-btn> </template
            ></v-list-item>
            <v-list-item
              title="更改项目可见性"
              subtitle="选择项目的可见性，公开或私密。"
            >
              <template v-slot:append>
                <v-btn
                  color="error"
                  text="更改项目可见性"
                  variant="tonal"
                  @click="changeVisibility = true"
                ></v-btn> </template
            ></v-list-item>
          </v-list> </v-card
      ></v-col>
    </v-row>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>详细数据</v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ project }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog v-model="confirmDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">删除 {{ project.title }}</v-card-title>
        <v-card-text
          >你确定要删除这个项目吗？此操作无法撤销。<br />这将永久删除
          {{ project.title }}
          项目、推送、Star、评论、和其他所有数据，移除Fork对此项目的关联（但不会删除Fork）。<br />要确认，请在下面的框中输入提示的小字以确认您的操作。
          <br /><br />
          <v-text-field
            variant="outlined"
            :label="`${localuser.user.username}/${project.name}`"
            v-model="confirmDeleteText"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              confirmDelete = false;
              confirmDeleteText = '';
            "
            >取消</v-btn
          >
          <v-btn
            color="error"
            text
            @click="deleteProject"
            :disabled="
              confirmDeleteText !==
              `${localuser.user.username}/${project.name}`
            "
            >删除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="changeVisibility" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ project.state==='public'?'私密':'公开' }} {{ project.title }}</v-card-title>
        <v-card-text>
          <v-if v-if="project.state === 'public'">
            将此仓库设为私有将删除不再有权访问此仓库的用户的 star。如果您决定在将来公开此存储库，则无法恢复这些 star ，这将影响项目的排名。<br/>
            此项目的Fork将保持公开，且不再与此项目有任何关联。
          </v-if>
          <v-if v-if="project.state === 'private'">
            该项目将对可以访问ZeroCat的每个人都可见<br/>
            任何人都可以复制或下载您的仓库。<br/>
            您的操作历史记录和日志将对所有人可见。
          </v-if>
          <br/><br/>
          要确认，请在下面的框中输入提示的小字以确认您的操作。
          <br /><br />
          <v-text-field
            variant="outlined"
            :label="`${localuser.user.username}/${project.name}`"
            v-model="changeVisibilityText"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="changeVisibility = false"
            >取消</v-btn
          >
          <v-btn
            color="error"
            text
            @click="changeProjectVisibility"
            :disabled="
              changeVisibilityText !==
              `${localuser.user.username}/${project.name}`
            "
            >{{ project.state==='public'?'设置为私密':'设置为公开' }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import request from "../../../axios/axios";
import { localuser } from "@/services/localAccount";
import { useHead } from "@unhead/vue";
import { getProjectInfoByNamespace } from "@/services/projectService";
import LicenseSelector from "@/components/LicenseSelector.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";

export default {
  components: {
    LicenseSelector,
    LanguageSelector
  },
  data() {
    return {
      localuser,
      states: [
        { state: "私密", abbr: "private" },
        { state: "公开", abbr: "public" },
      ],
      projectID: this.$route.params.id,
      project: {},
      newProjectName: "",
      tags: {
        items: ["动画", "故事", "音乐", "硬核", "艺术", "水"],
        chips: [],
      },
      changeVisibility: false,
      changeVisibilityText: "",
      confirmDelete: false,
      confirmDeleteText: "",
      thumbnail: null,
    };
  },
  async created() {
    if (!localuser.isLogin.value) {
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
          await request.put(
            `/project/id/${this.projectID}`,

            {
              id: this.project.id,
              title: this.project.title,
              description: this.project.description,
              type: this.project.type,
              tags: this.project.tags,
              license: this.project.license,
            }
          )
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
    async changeProjectVisibility() {
      try {
        const response = (
          await request.put(`/project/changevisibility/${this.projectID}`, {
            newState: this.project.state === "public" ? "private" : "public",
          })
        ).data;
        this.$toast.add({
          severity: response.status,
          summary: response.message,
          detail: response.message,
          life: 3000,
        });
this.$router.push(`/explore/${localuser.user.value.username}/${this.project.name}`);
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "修改项目状态失败",
          life: 3000,
        });
      }
    },
    cancel() {
      this.$router.push("/explore/my");
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.thumbnail = URL.createObjectURL(file);
      }
    },
    async uploadThumbnail() {
      const formData = new FormData();
      formData.append("file", this.$refs.fileInput.$el.querySelector('input').files[0]);
      try {
        await request.post(
          `/scratch/thumbnail/${this.projectID}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localuser.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.$toast.add({
          severity: "success",
          summary: "成功",
          detail: "封面上传成功",
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "封面上传失败",
          life: 3000,
        });
      }
    },
  },
};
</script>
