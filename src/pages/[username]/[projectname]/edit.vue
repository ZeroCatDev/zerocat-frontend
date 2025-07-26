<template>

  <!-- 左侧活动栏 -->
  <v-navigation-drawer permanent rail>
    <v-list>
      <v-list-item
        v-for="(item, i) in navigationItems"
        :key="i"
        :value="item.value"
        :active="activeTab === item.value"
        @click="activeTab = item.value"
      >
        <template v-slot:prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- 左侧边栏 -->
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item :title="sidebarTitle" :prepend-icon="sidebarIcon" />
    </v-list>

    <v-divider></v-divider>

    <!-- 文件浏览器 -->
    <template v-if="activeTab === 'files'">
      <v-list>
        <v-list-item>
          <v-text-field
            density="compact"
            hide-details
            placeholder="搜索文件..."
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
          ></v-text-field>
        </v-list-item>
      </v-list>
    </template>

    <!-- Git 面板 -->
    <template v-if="activeTab === 'git'">
      <v-list>
        <v-list-item>
          <v-select
            v-model="currentBranch"
            :items="branches.map((b) => b.name)"
            density="compact"
            hide-details
            label="当前分支"
            prepend-inner-icon="mdi-source-branch"
            variant="solo-filled"
            @update:model-value="switchBranch"
          ></v-select>
        </v-list-item>

        <v-list-item
          v-if="codeChanged"
          prepend-icon="mdi-source-commit"
          title="更改"
          subtitle="有未保存的更改"
        >
          <template v-slot:append>
            <v-btn color="primary" size="small" @click="saveAndCommitCode">
              提交
            </v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-subheader>提交历史</v-list-subheader>
        <v-list-item
          v-for="commit in commits"
          :key="commit.hash"
          :subtitle="formatCommitInfo(commit)"
          :title="commit.message || '无提交信息'"
          lines="two"
        >
          <template v-slot:prepend>
            <v-icon size="small">mdi-source-commit</v-icon>
          </template>
          <template v-slot:append>
            <v-menu location="end">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                  v-bind="props"
                ></v-btn>
              </template>
              <v-list>
                <v-list-item @click="viewCommit(commit)">
                  <v-list-item-title>查看</v-list-item-title>
                </v-list-item>
                <v-list-item @click="restoreCommit(commit)">
                  <v-list-item-title>恢复</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
<!-- 顶部工具栏 -->
<v-app-bar class="editor-app-bar" density="compact" flat>
    <v-row align="center" no-gutters>
      <v-col class="mr-4" cols="auto">
        <div v-if="project">
          <v-chip class="mr-2" color="primary" size="small">
            <v-icon size="small" start>mdi-source-repository</v-icon>
            {{ project.title }}
          </v-chip>
          <span class="text-caption"
            >{{ project.author.username }}/{{ project.name }}</span
          >
        </div>
        <v-progress-circular
          v-else
          indeterminate
          size="20"
          width="2"
        ></v-progress-circular>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="auto">
        <v-select
          v-model="currentBranch"
          :items="branches.map((b) => b.name)"
          class="branch-selector"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-source-branch"
          style="max-width: 150px"
          variant="outlined"
          @update:model-value="switchBranch"
        ></v-select>
      </v-col>

      <v-col class="d-flex" cols="auto">
        <v-btn
          class="ml-2"
          color="info"
          prepend-icon="mdi-code-tags"
          size="small"
          variant="text"
          @click="showLanguageDialog = true"
        >
          {{ editorOptions.language }}
        </v-btn>

        <!-- 修改保存按钮部分 -->
        <v-btn
          class="ml-2"
          :color="codeChanged ? 'warning' : 'success'"
          prepend-icon="mdi-source-commit"
          size="small"
          variant="text"
          @click="showCommitDialog"
        >
          {{ codeChanged ? "有更改待提交" : "无更改" }}
          <v-icon end size="small">{{
            codeChanged ? "mdi-circle-medium" : "mdi-check"
          }}</v-icon>
        </v-btn>

        <v-btn
          class="ml-2"
          prepend-icon="mdi-arrow-left"
          size="small"
          variant="text"
          @click="goToProjectPage"
        >
          项目页面
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
  <!-- 主编辑器区域 -->


  <!-- 编辑器容器 -->
  <div
    v-if="fileContent !== null"
    style="height: 100% !important; width: 100% !important"
  >
    <MonacoEditorComponent
      v-model="fileContent"
      :language="editorOptions.language"
      :options="editorOptions"
      :project-type="project?.type || ''"
      @change="codeChanged = true"
      @monaco-ready="handleMonacoReady"
    />
  </div>

  <v-sheet v-else class="d-flex align-center justify-center">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
    <span class="ml-2">加载中...</span>
  </v-sheet>

  <!-- 语言选择对话框 -->
  <v-dialog v-model="showLanguageDialog" max-width="400">
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="languageSearch"
          ref="languageSearchInput"
          append-inner-icon="mdi-magnify"
          label="选择编程语言"
          placeholder="搜索语言..."
          variant="outlined"
          density="compact"
          hide-details
          @keydown.esc="showLanguageDialog = false"
        ></v-text-field>
      </v-card-title>

      <v-card-text>
        <v-list density="compact">
          <v-list-item
            v-for="lang in filteredLanguages"
            :key="lang.id"
            :active="editorOptions.language === lang.id"
            :title="lang.aliases?.[0] || lang.id"
            :subtitle="lang.id"
            @click="selectLanguage(lang.id)"
          >
            <template v-slot:prepend>
              <v-icon size="small">mdi-code-braces</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- 修改提交对话框 -->
  <v-dialog v-model="showSaveDialog" max-width="500">
    <v-card>
      <v-card-text class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon color="primary" class="mr-2">mdi-source-repository</v-icon>
          <span class="text-h6">{{ project?.title || "项目" }}</span>
        </div>

        <div v-if="codeChanged" class="mb-4">
          <div class="text-subtitle-2 mb-2">更改</div>
          <v-card variant="outlined" class="pa-2">
            <div class="d-flex align-center">
              <v-icon size="small" color="warning" class="mr-2"
                >mdi-file-document</v-icon
              >
              <span class="text-body-2">已修改: {{ project?.name }}</span>
            </div>
          </v-card>
        </div>

        <v-text-field
          v-model="commitMessage"
          label="提交信息 (按 Ctrl+Enter 提交)"
          placeholder="输入提交信息..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="mb-2"
          @keydown.ctrl.enter="confirmCommit"
        ></v-text-field>

        <v-expand-transition>
          <div v-show="showCommitDetails">
            <v-textarea
              v-model="commitDescription"
              label="详细描述"
              placeholder="输入详细的提交说明（可选）..."
              variant="outlined"
              density="comfortable"
              rows="3"
              hide-details
              class="mt-2"
            ></v-textarea>
          </div>
        </v-expand-transition>

        <v-btn
          variant="text"
          density="comfortable"
          class="mt-2"
          @click="showCommitDetails = !showCommitDetails"
        >
          {{ showCommitDetails ? "隐藏详细信息" : "添加详细信息..." }}
        </v-btn>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="showSaveDialog = false"> 取消 </v-btn>
        <v-btn
          color="primary"
          :disabled="!commitMessage.trim()"
          :loading="committing"
          @click="confirmCommit"
        >
          提交更改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 确认对话框 -->
  <v-dialog v-model="showConfirmDialog" max-width="400">
    <v-card>
      <v-card-text class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
          <span class="text-h6">确认提交</span>
        </div>
        <p>确定要提交以下更改吗？</p>
        <v-card variant="outlined" class="pa-2 mt-2">
          <p class="text-body-1 mb-2">{{ commitMessage }}</p>
          <p v-if="commitDescription" class="text-body-2 text-grey">
            {{ commitDescription }}
          </p>
        </v-card>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="showConfirmDialog = false"> 取消 </v-btn>
        <v-btn
          color="primary"
          :loading="committing"
          @click="saveAndSubmitCommit"
        >
          确认提交
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 加载遮罩 -->
  <v-overlay v-model="loading" class="align-center justify-center" persistent>
    <v-card width="300">
      <v-card-text class="text-center">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
        <div class="text-body-1 mt-4">{{ loadingMessage }}</div>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script>
import axios from "@/axios/axios";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";

export default {
  name: "ProjectEditor",
  components: {
    MonacoEditorComponent,
  },
  data() {
    return {
      // 状态变量
      project: null,
      fileContent: null,
      fileSha256: null,
      branches: [],
      currentBranch: "main",
      commits: [],
      accessFileToken: "",
      loading: true,
      loadingMessage: "加载项目信息...",
      codeChanged: false,
      errorMessage: "",

      // 对话框状态
      showSaveDialog: false,
      showHistoryDialog: false,
      showHistorySidebar: false,
      commitMessage: "",
      commitDescription: "",
      loadingHistory: false,
      showConfirmDialog: false,
      showCommitDetails: false,
      committing: false,

      // Monaco 编辑器配置
      editorOptions: {
        theme: "vs-dark",
        language: "javascript", // 默认语言，可以根据文件类型动态设置
        fontSize: 14,
        tabSize: 2,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        lineNumbers: "on",
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
      },

      // 语言选择相关
      showLanguageDialog: false,
      languageSearch: "",
      availableLanguages: [],

      // Monaco 相关
      monacoInstance: null,
      editorInstance: null,
      showSidebar: true,
      activeTab: "files",
      navigationItems: [
        { icon: "mdi-file-document-outline", title: "文件", value: "files" },
        { icon: "mdi-source-branch", title: "源代码管理", value: "git" },
        { icon: "mdi-magnify", title: "搜索", value: "search" },
        { icon: "mdi-cog", title: "设置", value: "settings" },
      ],
    };
  },
  computed: {
    projectId() {
      return this.$route.query.id;
    },
    projectNamespace() {
      // 从路由参数中获取用户名和项目名
      const username =
        this.$route.params.username || this.$route.query.username;
      const projectname =
        this.$route.params.projectname || this.$route.query.projectname;
      if (username && projectname) {
        return `${username}/${projectname}`;
      }
      return null;
    },

    filteredLanguages() {
      if (!this.languageSearch) {
        return this.availableLanguages;
      }
      const search = this.languageSearch.toLowerCase();
      return this.availableLanguages.filter((lang) => {
        return (
          lang.id.toLowerCase().includes(search) ||
          (lang.aliases &&
            lang.aliases.some((alias) => alias.toLowerCase().includes(search)))
        );
      });
    },
    sidebarTitle() {
      switch (this.activeTab) {
        case "files":
          return "资源管理器";
        case "git":
          return "源代码管理";
        case "search":
          return "搜索";
        case "settings":
          return "设置";
        default:
          return "";
      }
    },
    sidebarIcon() {
      switch (this.activeTab) {
        case "files":
          return "mdi-file-document-outline";
        case "git":
          return "mdi-source-branch";
        case "search":
          return "mdi-magnify";
        case "settings":
          return "mdi-cog";
        default:
          return "";
      }
    },
  },
  watch: {
    currentBranch: async function () {
      if (this.showHistorySidebar) {
        await this.loadCommitHistory();
      }
    },
    project: async function (newProject) {
      if (newProject && newProject.id) {
        await this.loadCommitHistory();
      }
    },
    showLanguageDialog(val) {
      if (val) {
        // 当对话框打开时，等待 DOM 更新后聚焦搜索框
        this.$nextTick(() => {
          this.$refs.languageSearchInput?.focus();
        });
      } else {
        // 当对话框关闭时，清空搜索内容
        this.languageSearch = "";
      }
    },
  },
  mounted() {
    this.loadProject();
  },
  methods: {
    async loadProject() {
      try {
        this.loading = true;
        this.loadingMessage = "加载项目信息...";

        let response;
        if (this.projectId) {
          console.log("通过ID加载项目:", this.projectId);
          response = await axios.get(`/project/id/${this.projectId}`);
        } else if (this.projectNamespace) {
          console.log("通过命名空间加载项目:", this.projectNamespace);
          const [username, projectname] = this.projectNamespace.split("/");
          response = await axios.get(
            `/project/namespace/${username}/${projectname}`
          );
        } else {
          throw new Error("未提供项目ID或命名空间");
        }

        console.log("项目加载响应:", response.data);

        if (response.data.status === "success" || response.data.id) {
          this.project = response.data.data || response.data;

          if (!this.project || !this.project.id) {
            throw new Error("项目数据无效: " + JSON.stringify(this.project));
          }

          await this.loadBranches();
          await this.loadLatestCommit();
        } else {
          throw new Error(
            response.data.message || "加载项目失败: 服务器未返回有效数据"
          );
        }
      } catch (error) {
        console.error("加载项目失败:", error);
        const errMsg = error.response
          ? `服务器错误 (${error.response.status}): ${
              error.response.data?.message || "未知错误"
            }`
          : error.message || "网络错误或服务器无响应";
        this.loadingMessage = `加载失败: ${errMsg}`;
        this.errorMessage = errMsg;
        this.loading = false;
      }
    },

    async loadBranches() {
      try {
        this.loadingMessage = "加载分支信息...";
        console.log("加载分支, 项目ID:", this.project.id);

        const response = await axios.get(
          `/project/branches?projectid=${this.project.id}`
        );
        console.log("分支加载响应:", response.data);

        if (response.data.status === "success") {
          this.branches = response.data.data || [];
          if (this.branches.length > 0) {
            this.currentBranch = this.branches[0].name;
          } else {
            throw new Error("项目没有任何分支");
          }
        } else {
          throw new Error(
            response.data.message || "加载分支失败: 服务器未返回有效数据"
          );
        }
      } catch (error) {
        console.error("加载分支失败:", error);
        const errorMsg = error.response
          ? `服务器错误 (${error.response.status}): ${
              error.response.data?.message || "未知错误"
            }`
          : error.message || "网络错误或服务器无响应";
        this.loadingMessage = `加载分支失败: ${errorMsg}`;
        this.errorMessage = errorMsg;
        this.loading = false;
      }
    },

    async loadLatestCommit() {
      try {
        this.loadingMessage = "加载最新代码...";
        console.log(
          "加载最新提交, 项目ID:",
          this.project.id,
          "分支:",
          this.currentBranch
        );

        const response = await axios.get(
          `/project/${this.project.id}/${this.currentBranch}/latest`
        );
        console.log("最新提交响应:", response.data);

        if (response.data.status === "success") {
          if (!response.data.accessFileToken) {
            throw new Error("服务器未返回文件访问令牌");
          }

          this.accessFileToken = response.data.accessFileToken;

          if (!response.data.commit) {
            throw new Error("服务器返回的提交数据无效");
          }

          // 获取提交文件信息
          const commitFile = response.data.commit.commit_file;
          console.log(`获取提交文件: ${commitFile}`);

          if (!commitFile) {
            console.log("没有提交文件，创建新文件");
            this.fileContent = "";
            this.loading = false;
            return;
          }

          try {
            const commitFileResponse = await axios.get(
              `/project/files/${commitFile}?accessFileToken=${this.accessFileToken}&content=true`
            );
            console.log("提交文件响应:", commitFileResponse);

            if (commitFileResponse.status === 200) {
              // 直接使用文件内容
              let content = commitFileResponse.data;

              if (!content) {
                console.log("文件内容为空，创建新文件");
                this.fileContent = "";
              } else {
                if (typeof content === "object") {
                  content = JSON.stringify(content, null, 2);
                }
                console.log("获取到文件内容，长度:", content.length);
                this.fileContent = content;
                // 保存文件SHA256
                this.fileSha256 = commitFile;

                // 设置编辑器语言
                const filename = this.project.name || "file.js";
                this.editorOptions.language = this.detectLanguage(
                  content,
                  filename
                );
              }

              this.loading = false;
            } else {
              const errorMsg = commitFileResponse.data?.message || "未知错误";
              console.error(
                `获取提交文件失败: ${commitFile}`,
                commitFileResponse.data
              );
              // 创建空文件
              this.fileContent = "";
              this.loading = false;
            }
          } catch (fileError) {
            console.error("获取提交文件请求失败:", fileError);
            // 创建空文件
            this.fileContent = "";
            this.loading = false;
          }
        } else {
          throw new Error(
            response.data.message || "加载最新提交失败: 服务器未返回有效数据"
          );
        }
      } catch (error) {
        console.error("加载最新提交失败:", error);
        const errorMsg = error.response
          ? `服务器错误 (${error.response.status}): ${
              error.response.data?.message || "未知错误"
            }`
          : `${error.message || "网络错误或服务器无响应"} [${
              error.stack?.split("\n")[1]?.trim() || "未知位置"
            }]`;
        this.loadingMessage = `加载最新提交失败: ${errorMsg}`;
        this.errorMessage = errorMsg;
        // 即使出错，也创建空文件让用户可以开始编辑
        this.fileContent = "";
        this.loading = false;
      }
    },

    async saveAndCommitCode() {
      if (this.fileContent === null) {
        alert("文件内容未加载");
        return;
      }

      this.showSaveDialog = true;
    },

    showCommitDialog() {
      this.commitMessage = "";
      this.commitDescription = "";
      this.showCommitDetails = false;
      this.showSaveDialog = true;
    },
    confirmCommit() {
      if (!this.commitMessage.trim()) {
        return;
      }
      this.showSaveDialog = false;
      this.showConfirmDialog = true;
    },
    async saveAndSubmitCommit() {
      try {
        this.committing = true;
        if (!this.commitMessage.trim()) {
          alert("请输入提交信息");
          return;
        }

        // 准备要保存的内容
        let contentToSave = this.fileContent;
        let isValidJson = false;

        // 检查是否为JSON格式
        try {
          JSON.parse(contentToSave);
          isValidJson = true;
          console.log("内容已经是有效的JSON格式");
        } catch (e) {
          // 如果不是有效的JSON，则直接发送原始内容
          console.log("内容不是有效的JSON格式，将直接发送");
          isValidJson = false;
        }

        console.log("准备保存文件，内容长度:", contentToSave.length);

        // 保存文件 - 使用不同的方式处理JSON和非JSON内容
        const saveResponse = await axios.post(
          "/project/savefile?json=false&source=index",
          isValidJson
            ? contentToSave
            : JSON.stringify({ index: this.fileContent }),
          {
            headers: {
              "Content-Type": "application/json",
              "X-Project-ID": this.project.id,
            },
          }
        );

        console.log("保存文件响应:", saveResponse.data);

        if (saveResponse.data.status !== "success") {
          throw new Error(saveResponse.data.message || "保存文件失败");
        }

        // 更新访问令牌和文件SHA256
        this.accessFileToken = saveResponse.data.accessFileToken;
        this.fileSha256 = saveResponse.data.sha256; // 从响应中获取新的SHA256

        if (!this.fileSha256) {
          console.error("服务器未返回文件SHA256");
          throw new Error("服务器未返回文件SHA256，无法完成提交");
        }

        console.log("文件保存成功，使用SHA256:", this.fileSha256);
        console.log("准备提交代码，分支:", this.currentBranch);

        // 提交代码
        const commitData = {
          branch: this.currentBranch,
          projectid: this.project.id,
          accessFileToken: this.accessFileToken,
          message: this.commitMessage,
          commit_description: this.commitDescription,
          commit_file: this.fileSha256,
        };

        console.log("提交数据:", commitData);

        const commitResponse = await axios.put(
          `/project/commit/id/${this.project.id}`,
          commitData
        );

        console.log("提交响应:", commitResponse.data);

        if (commitResponse.data.status === "success") {
          this.commitMessage = "";
          this.commitDescription = "";
          this.codeChanged = false;

          // 刷新提交历史
          await this.loadCommitHistory();

          alert(
            "代码保存并提交成功" + (!isValidJson ? " (已转换为JSON格式)" : "")
          );
        } else {
          throw new Error(commitResponse.data.message || "提交代码失败");
        }
        this.showConfirmDialog = false;
        this.committing = false;
      } catch (error) {
        console.error("提交失败:", error);
        alert(
          "提交失败: " +
            (error.response?.data?.message || error.message || "未知错误")
        );
        this.committing = false;
      }
    },

    async loadCommitHistory() {
      if (!this.project || !this.project.id) {
        console.error("项目未加载，无法获取提交历史");
        return;
      }

      try {
        this.loadingHistory = true;

        const response = await axios.get(
          `/project/commits?projectid=${this.project.id}&branch=${this.currentBranch}`
        );
        if (response.data.status === "success") {
          this.commits = response.data.data || [];

          // 确保每个提交对象都有必要的属性，防止undefined错误
          this.commits = this.commits.map((commit) => {
            return {
              ...commit,
              hash: commit.hash || "unknown",
              message: commit.message || "无提交信息",
              date: commit.date || new Date().toISOString(),
              author: commit.author || { username: "未知用户" },
            };
          });
        } else {
          console.error("加载提交历史失败:", response.data.message);
        }
      } catch (error) {
        console.error("加载提交历史失败:", error);
      } finally {
        this.loadingHistory = false;
      }
    },

    async showHistory() {
      try {
        await this.loadCommitHistory();
        this.showHistoryDialog = true;
      } catch (error) {
        console.error("显示历史对话框失败:", error);
        alert("加载提交历史失败: " + (error.message || "未知错误"));
      }
    },

    async toggleHistorySidebar() {
      this.showHistorySidebar = !this.showHistorySidebar;

      if (this.showHistorySidebar && this.commits.length === 0) {
        await this.loadCommitHistory();
      }
    },

    formatCommitInfo(commit) {
      if (!commit) return "未知提交信息";

      const username = commit.author?.username || "未知用户";
      const date = commit.date ? this.formatDate(commit.date) : "未知时间";

      return `${username} · ${date}`;
    },

    async viewCommit(commit) {
      if (!commit || !commit.hash) {
        alert("无效的提交信息");
        return;
      }

      try {
        this.loading = true;
        this.loadingMessage = "加载提交详情...";

        const response = await axios.get(
          `/project/commit?projectid=${this.project.id}&commitid=${commit.hash}`
        );
        if (response.data.status === "success") {
          this.accessFileToken = response.data.accessFileToken;

          // 获取提交文件信息
          const commitFile = response.data.commit.commit_file;
          console.log(`获取提交文件: ${commitFile}`);

          if (!commitFile) {
            console.log("没有提交文件，创建空文件");
            this.fileContent = "";
            this.showHistoryDialog = false;
            this.loading = false;
            return;
          }

          try {
            const commitFileResponse = await axios.get(
              `/project/files/${commitFile}?accessFileToken=${this.accessFileToken}&content=true`
            );

            if (commitFileResponse.status === 200) {
              // 直接使用文件内容
              let content = commitFileResponse.data;

              if (!content) {
                console.log("文件内容为空，创建新文件");
                this.fileContent = "";
              } else {
                if (typeof content === "object") {
                  content = JSON.stringify(content, null, 2);
                }
                console.log("获取到文件内容，长度:", content.length);
                this.fileContent = content;
                // 保存文件SHA256
                this.fileSha256 = commitFile;

                // 设置编辑器语言
                const filename = this.project.name || "file.js";
                this.editorOptions.language = this.detectLanguage(
                  content,
                  filename
                );
              }

              this.showHistoryDialog = false;
              this.loading = false;
            } else {
              const errorMsg = commitFileResponse.data?.message || "未知错误";
              console.error(
                `获取提交文件失败: ${commitFile}`,
                commitFileResponse.data
              );
              // 创建空文件
              this.fileContent = "";
              this.showHistoryDialog = false;
              this.loading = false;
            }
          } catch (fileError) {
            console.error("获取提交文件请求失败:", fileError);
            // 创建空文件
            this.fileContent = "";
            this.showHistoryDialog = false;
            this.loading = false;
          }
        } else {
          throw new Error(response.data.message || "加载提交详情失败");
        }
      } catch (error) {
        console.error("加载提交详情失败:", error);
        const errorMsg = error.response
          ? `服务器错误 (${error.response.status}): ${
              error.response.data?.message || "未知错误"
            }`
          : `${error.message || "网络错误或服务器无响应"} [${
              error.stack?.split("\n")[1]?.trim() || "未知位置"
            }]`;
        alert("加载提交详情失败: " + errorMsg);
        this.loading = false;
      }
    },

    async restoreCommit(commit) {
      if (!commit || !commit.hash) {
        alert("无效的提交信息");
        return;
      }

      const commitId = commit.hash.substring(0, 7);

      if (confirm(`确定要恢复到提交 ${commitId} 的状态吗？`)) {
        try {
          this.loading = true;
          this.loadingMessage = "恢复提交...";

          await this.viewCommit(commit);

          // 保存并提交恢复的代码
          const response = await axios.put(
            `/project/commit/id/${this.project.id}`,
            {
              branch: this.currentBranch,
              projectid: this.project.id,
              accessFileToken: this.accessFileToken,
              message: `恢复到提交 ${commitId}`,
              commit_description: `恢复到提交 ${commit.hash}，原提交信息: ${
                commit.message || "无提交信息"
              }`,
              commit_file: this.fileSha256, // 添加提交文件的SHA256
            }
          );

          if (response.data.status === "success") {
            alert("代码恢复成功");
            // 刷新提交历史
            await this.loadCommitHistory();
          } else {
            throw new Error(response.data.message || "恢复代码失败");
          }
        } catch (error) {
          console.error("恢复代码失败:", error);
          alert(
            "恢复代码失败: " +
              (error.response?.data?.message || error.message || "未知错误")
          );
        } finally {
          this.loading = false;
        }
      }
    },

    async switchBranch() {
      if (this.codeChanged) {
        if (confirm("您有未保存的更改，是否切换分支？")) {
          await this.loadLatestCommit();
          this.codeChanged = false;
        } else {
          // 恢复选择
          this.currentBranch = this.branches.find(
            (b) => b.name === this.currentBranch
          ).name;
        }
      } else {
        await this.loadLatestCommit();
      }
    },

    goToProjectPage() {
      if (this.project) {
        this.$router.push(
          `/${this.project.author.username}/${this.project.name}`
        );
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },

    async retryLoading() {
      this.errorMessage = "";
      this.loading = true;
      this.loadingMessage = "重新加载项目...";
      try {
        await this.loadProject();
      } catch (error) {
        this.errorMessage = error.message || "加载失败，请稍后再试";
      }
    },

    handleMonacoReady({ monaco, editor, availableLanguages }) {
      console.log("Monaco editor ready");
      this.monacoInstance = monaco;
      this.editorInstance = editor;
      this.availableLanguages = availableLanguages;

      // 如果项目类型存在，设置对应的语言
      if (this.project?.type) {
        const projectType = this.project.type.split("-")[0].toLowerCase();
        const matchedLang = this.availableLanguages.find(
          (lang) => lang.id === projectType
        );
        if (matchedLang) {
          console.log("根据项目类型设置语言:", matchedLang.id);
          this.editorOptions.language = matchedLang.id;
          if (this.editorInstance.getModel()) {
            this.monacoInstance.editor.setModelLanguage(
              this.editorInstance.getModel(),
              matchedLang.id
            );
          }
        }
      }
    },

    // 更新 detectLanguage 方法
    detectLanguage(content, filename) {
      // 如果项目类型已经指定了语言，优先使用项目类型
      if (this.project?.type && this.availableLanguages?.length > 0) {
        const projectType = this.project.type.split("-")[0].toLowerCase();
        const matchedLang = this.availableLanguages.find(
          (lang) => lang.id === projectType
        );
        if (matchedLang) {
          return matchedLang.id;
        }
      }

      // 如果内容是JSON格式，设置为json
      try {
        JSON.parse(content);
        return "json";
      } catch (e) {
        // 不是JSON，根据文件扩展名判断
        if (filename) {
          const ext = filename.split(".").pop().toLowerCase();
          const langMap = {
            js: "javascript",
            ts: "typescript",
            html: "html",
            css: "css",
            scss: "scss",
            less: "less",
            vue: "html",
            json: "json",
            md: "markdown",
            py: "python",
            java: "java",
            c: "c",
            cpp: "cpp",
            cs: "csharp",
            go: "go",
            php: "php",
            rb: "ruby",
            rs: "rust",
            sh: "shell",
            sql: "sql",
            xml: "xml",
            yaml: "yaml",
            yml: "yaml",
          };
          return langMap[ext] || "plaintext";
        }
      }

      // 默认为纯文本
      return "plaintext";
    },

    selectLanguage(languageId) {
      if (this.monacoInstance && this.editorInstance) {
        const model = this.editorInstance.getModel();
        if (model) {
          this.monacoInstance.editor.setModelLanguage(model, languageId);
          this.editorOptions.language = languageId;
          this.showLanguageDialog = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.editor-app-bar {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.branch-selector {
  min-width: 120px;
}

:deep(.v-navigation-drawer--rail) {
  width: 56px !important;
}




.monospace {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.language-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.language-dialog {
  border-radius: 4px;
}

.language-search {
  width: 100%;
}

.language-list {
  max-height: 400px;
  overflow-y: auto;
}

.language-list::-webkit-scrollbar {
  width: 8px;
}

.language-list::-webkit-scrollbar-track {
  background: transparent;
}

.language-list::-webkit-scrollbar-thumb {
  background: rgba(127, 127, 127, 0.4);
  border-radius: 4px;
}

.language-list::-webkit-scrollbar-thumb:hover {
  background: rgba(127, 127, 127, 0.6);
}

.language-list-item {
  transition: background-color 0.2s ease;
  border-radius: 2px;
  margin: 1px 4px;
}

.language-list-item:hover {
  background-color: rgba(127, 127, 127, 0.1);
}

.language-list-item.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.language-list-item.v-list-item--active:hover {
  background-color: rgba(var(--v-theme-primary), 0.15);
}
</style>
