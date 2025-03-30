<template>
  <!-- 顶部工具栏 -->
  <v-app-bar flat density="compact" class="editor-app-bar">
    <v-row no-gutters align="center">
      <v-col cols="auto" class="mr-4">
        <div v-if="project">
          <v-chip size="small" color="primary" class="mr-2">
            <v-icon size="small" start>mdi-source-repository</v-icon>
            {{ project.title }}
          </v-chip>
          <span class="text-caption">{{ project.author.username }}/{{ project.name }}</span>
        </div>
        <v-progress-circular v-else indeterminate size="20" width="2"></v-progress-circular>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="auto">
        <v-select v-model="currentBranch" :items="branches.map(b => b.name)" @update:model-value="switchBranch"
          density="compact" hide-details variant="outlined" class="branch-selector"
          prepend-inner-icon="mdi-source-branch" style="max-width: 150px"></v-select>
      </v-col>

      <v-col cols="auto" class="d-flex">
        <v-btn prepend-icon="mdi-content-save" variant="text" size="small" color="success" @click="saveAndCommitCode"
          class="ml-2">
          保存
        </v-btn>

        <v-btn prepend-icon="mdi-history" variant="text" size="small" @click="toggleHistorySidebar" class="ml-2"
          disabled>
          历史
        </v-btn>

        <v-btn prepend-icon="mdi-arrow-left" variant="text" size="small" @click="goToProjectPage" class="ml-2">
          项目页面
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>

  <!-- 主要内容区域 -->
  <!-- 左侧历史面板 -->
  <v-navigation-drawer v-model="showHistorySidebar" location="left" border>
    <v-toolbar density="compact">
      <v-toolbar-title class="text-subtitle-1">提交历史</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon size="small" @click="showHistorySidebar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-list v-if="commits.length > 0">
      <v-list-item v-for="commit in commits" :key="commit.hash" :title="commit.message || '无提交信息'"
        :subtitle="formatCommitInfo(commit)" lines="two" @click="viewCommit(commit)">
        <template v-slot:prepend>
          <v-avatar size="36">
            <v-icon>mdi-source-commit</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn icon size="small" v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
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

    <v-sheet v-else class="d-flex align-center justify-center fill-height">
      <div class="text-center">
        <v-progress-circular v-if="loadingHistory" indeterminate></v-progress-circular>
        <p v-else class="text-body-2">暂无提交历史</p>
      </div>
    </v-sheet>
  </v-navigation-drawer>

  <!-- 代码编辑器区域 -->
  <v-alert v-if="errorMessage" type="error" closable title="加载错误" :text="errorMessage" class="ma-4">
    <template v-slot:append>
      <v-btn color="error" variant="text" @click="retryLoading">
        重试
      </v-btn>
    </template>
  </v-alert>

  <div v-else-if="fileContent !== null" style="height: 100%!important; width: 100%!important;">
    <MonacoEditorComponent v-model="fileContent" :language="editorOptions.language" :options="editorOptions"
      @change="codeChanged = true" />
  </div>

  <v-sheet v-else class="d-flex align-center justify-center fill-height">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <span class="ml-2">加载中...</span>
  </v-sheet>

  <!-- 保存对话框 -->
  <v-dialog v-model="showSaveDialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h5">
        保存更改
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field v-model="commitMessage" label="提交信息" placeholder="简短描述您的更改" variant="outlined"
            required></v-text-field>

          <v-textarea v-model="commitDescription" label="详细描述 (可选)" placeholder="详细描述您的更改" variant="outlined"
            rows="4"></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="showSaveDialog = false">
          取消
        </v-btn>
        <v-btn color="primary" variant="flat" @click="saveAndSubmitCommit">
          保存并提交
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 历史对话框 -->
  <v-dialog v-model="showHistoryDialog" max-width="800px">
    <v-card>
      <v-card-title class="text-h5">
        提交历史
      </v-card-title>

      <v-card-text class="pa-0">
        <v-list lines="two">
          <v-list-item v-for="commit in commits" :key="commit.hash" :title="commit.message || '无提交信息'"
            :subtitle="formatCommitInfo(commit)">
            <template v-slot:prepend>
              <v-avatar size="36">
                <v-icon>mdi-source-commit</v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <div class="d-flex">
                <v-chip size="small" variant="flat" class="mr-2 monospace">
                  {{ commit.hash ? commit.hash.substring(0, 7) : 'unknown' }}
                </v-chip>
                <v-btn size="small" color="primary" variant="text" @click="viewCommit(commit)">
                  查看
                </v-btn>
                <v-btn size="small" variant="text" @click="restoreCommit(commit)">
                  恢复
                </v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="showHistoryDialog = false">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 加载遮罩 -->
  <v-overlay v-model="loading" class="align-center justify-center" persistent>
    <v-card width="300">
      <v-card-text class="text-center pa-4">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="text-body-1 mt-4">{{ loadingMessage }}</div>
      </v-card-text>
    </v-card>
  </v-overlay>

</template>

<script>
import axios from '@/axios/axios'
import MonacoEditorComponent from '@/components/MonacoEditorComponent'

export default {
  name: 'ProjectEditor',
  components: {
    MonacoEditorComponent
  },
  data() {
    return {
      // 状态变量
      project: null,
      fileContent: null,
      fileSha256: null,
      branches: [],
      currentBranch: 'main',
      commits: [],
      accessFileToken: '',
      loading: true,
      loadingMessage: '加载项目信息...',
      codeChanged: false,
      errorMessage: '',

      // 对话框状态
      showSaveDialog: false,
      showHistoryDialog: false,
      showHistorySidebar: false,
      commitMessage: '',
      commitDescription: '',
      loadingHistory: false,

      // Monaco 编辑器配置
      editorOptions: {
        theme: 'vs-dark',
        language: 'javascript', // 默认语言，可以根据文件类型动态设置
        fontSize: 14,
        tabSize: 2,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3
      }
    }
  },
  computed: {
    projectId() {
      return this.$route.query.id
    },
    projectNamespace() {
      const username = this.$route.query.username
      const projectname = this.$route.query.projectname
      if (username && projectname) {
        return `${username}/${projectname}`
      }
      return null
    }
  },
  watch: {
    currentBranch: async function () {
      if (this.showHistorySidebar) {
        await this.loadCommitHistory()
      }
    },
    project: async function (newProject) {
      if (newProject && newProject.id) {
        await this.loadCommitHistory()
      }
    }
  },
  mounted() {
    this.loadProject()
  },
  methods: {
    async loadProject() {
      try {
        this.loading = true
        this.loadingMessage = '加载项目信息...'

        let response
        if (this.projectId) {
          console.log('通过ID加载项目:', this.projectId)
          response = await axios.get(`/project/id/${this.projectId}`)
        } else if (this.projectNamespace) {
          console.log('通过命名空间加载项目:', this.projectNamespace)
          const [username, projectname] = this.projectNamespace.split('/')
          response = await axios.get(`/project/namespace/${username}/${projectname}`)
        } else {
          throw new Error('未提供项目ID或命名空间')
        }

        console.log('项目加载响应:', response.data)

        if (response.data.status === 'success' || response.data.id) {
          this.project = response.data.data || response.data

          if (!this.project || !this.project.id) {
            throw new Error('项目数据无效: ' + JSON.stringify(this.project))
          }

          await this.loadBranches()
          await this.loadLatestCommit()
        } else {
          throw new Error(response.data.message || '加载项目失败: 服务器未返回有效数据')
        }
      } catch (error) {
        console.error('加载项目失败:', error)
        const errMsg = error.response
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : error.message || '网络错误或服务器无响应'
        this.loadingMessage = `加载失败: ${errMsg}`
        this.errorMessage = errMsg
        this.loading = false
      }
    },

    async loadBranches() {
      try {
        this.loadingMessage = '加载分支信息...'
        console.log('加载分支, 项目ID:', this.project.id)

        const response = await axios.get(`/project/branches?projectid=${this.project.id}`)
        console.log('分支加载响应:', response.data)

        if (response.data.status === 'success') {
          this.branches = response.data.data || []
          if (this.branches.length > 0) {
            this.currentBranch = this.branches[0].name
          } else {
            throw new Error('项目没有任何分支')
          }
        } else {
          throw new Error(response.data.message || '加载分支失败: 服务器未返回有效数据')
        }
      } catch (error) {
        console.error('加载分支失败:', error)
        const errorMsg = error.response
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : error.message || '网络错误或服务器无响应'
        this.loadingMessage = `加载分支失败: ${errorMsg}`
        this.errorMessage = errorMsg
        this.loading = false
      }
    },

    async loadLatestCommit() {
      try {
        this.loadingMessage = '加载最新代码...'
        console.log('加载最新提交, 项目ID:', this.project.id, '分支:', this.currentBranch)

        const response = await axios.get(`/project/${this.project.id}/${this.currentBranch}/latest`)
        console.log('最新提交响应:', response.data)

        if (response.data.status === 'success') {
          if (!response.data.accessFileToken) {
            throw new Error('服务器未返回文件访问令牌')
          }

          this.accessFileToken = response.data.accessFileToken

          if (!response.data.commit) {
            throw new Error('服务器返回的提交数据无效')
          }

          // 获取提交文件信息
          const commitFile = response.data.commit.commit_file;
          console.log(`获取提交文件: ${commitFile}`);

          if (!commitFile) {
            console.log('没有提交文件，创建新文件')
            this.fileContent = ''
            this.loading = false
            return
          }

          try {
            const commitFileResponse = await axios.get(`/project/files/${commitFile}?accessFileToken=${this.accessFileToken}&content=true`)
            console.log('提交文件响应:', commitFileResponse)

            if (commitFileResponse.status === 200) {
              // 直接使用文件内容
              let content = commitFileResponse.data;

              if (!content) {
                console.log('文件内容为空，创建新文件')
                this.fileContent = ''
              } else {
                if (typeof content === 'object') {
                  content = JSON.stringify(content, null, 2)
                }
                console.log('获取到文件内容，长度:', content.length)
                this.fileContent = content
                // 保存文件SHA256
                this.fileSha256 = commitFile

                // 设置编辑器语言
                const filename = this.project.name || 'file.js'
                this.editorOptions.language = this.detectLanguage(content, filename)
              }

              this.loading = false
            } else {
              const errorMsg = commitFileResponse.data?.message || '未知错误';
              console.error(`获取提交文件失败: ${commitFile}`, commitFileResponse.data)
              // 创建空文件
              this.fileContent = ''
              this.loading = false
            }
          } catch (fileError) {
            console.error('获取提交文件请求失败:', fileError)
            // 创建空文件
            this.fileContent = ''
            this.loading = false
          }
        } else {
          throw new Error(response.data.message || '加载最新提交失败: 服务器未返回有效数据')
        }
      } catch (error) {
        console.error('加载最新提交失败:', error)
        const errorMsg = error.response
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : `${error.message || '网络错误或服务器无响应'} [${error.stack?.split('\n')[1]?.trim() || '未知位置'}]`
        this.loadingMessage = `加载最新提交失败: ${errorMsg}`
        this.errorMessage = errorMsg
        // 即使出错，也创建空文件让用户可以开始编辑
        this.fileContent = ''
        this.loading = false
      }
    },

    async saveAndCommitCode() {
      if (this.fileContent === null) {
        alert('文件内容未加载')
        return
      }

      this.showSaveDialog = true
    },

    async saveAndSubmitCommit() {
      if (!this.commitMessage.trim()) {
        alert('请输入提交信息')
        return
      }

      try {
        this.loading = true
        this.loadingMessage = '保存并提交代码...'
        this.showSaveDialog = false

        // 准备要保存的内容
        let contentToSave = this.fileContent
        let isValidJson = false

        // 检查是否为JSON格式
        try {
          JSON.parse(contentToSave)
          isValidJson = true
          console.log('内容已经是有效的JSON格式')
        } catch (e) {
          // 如果不是有效的JSON，则直接发送原始内容
          console.log('内容不是有效的JSON格式，将直接发送')
          isValidJson = false
        }

        console.log('准备保存文件，内容长度:', contentToSave.length)

        // 保存文件 - 使用不同的方式处理JSON和非JSON内容
        const saveResponse = await axios.post('/project/savefile',
          isValidJson ? contentToSave : JSON.stringify({ "index": this.fileContent }),
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Project-ID': this.project.id
            }
          }
        )

        console.log('保存文件响应:', saveResponse.data)

        if (saveResponse.data.status !== 'success') {
          throw new Error(saveResponse.data.message || '保存文件失败')
        }

        // 更新访问令牌
        this.accessFileToken = saveResponse.data.accessFileToken

        // 从accessFileToken中提取sha256或使用本地记录的sha256
        // 注意：这里我们使用本地记录的sha256，因为服务器没有直接返回
        // 如果需要从token中解析，需要额外的逻辑

        if (!this.fileSha256) {
          console.error('没有文件SHA256信息')
          throw new Error('没有文件SHA256信息，无法完成提交')
        }

        console.log('文件保存成功，使用SHA256:', this.fileSha256)
        console.log('准备提交代码，分支:', this.currentBranch)

        // 提交代码
        const commitData = {
          branch: this.currentBranch,
          projectid: this.project.id,
          accessFileToken: this.accessFileToken,
          message: this.commitMessage,
          commit_description: this.commitDescription,
          commit_file: this.fileSha256
        }

        console.log('提交数据:', commitData)

        const commitResponse = await axios.put(`/project/commit/id/${this.project.id}`, commitData)

        console.log('提交响应:', commitResponse.data)

        if (commitResponse.data.status === 'success') {
          this.commitMessage = ''
          this.commitDescription = ''
          this.codeChanged = false

          // 刷新提交历史
          await this.loadCommitHistory()

          alert('代码保存并提交成功' + (!isValidJson ? ' (已转换为JSON格式)' : ''))
        } else {
          throw new Error(commitResponse.data.message || '提交代码失败')
        }
      } catch (error) {
        console.error('保存并提交代码失败:', error)
        alert('保存并提交代码失败: ' + (error.response?.data?.message || error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },

    async loadCommitHistory() {
      if (!this.project || !this.project.id) {
        console.error('项目未加载，无法获取提交历史')
        return
      }

      try {
        this.loadingHistory = true

        const response = await axios.get(`/project/commits?projectid=${this.project.id}&branch=${this.currentBranch}`)
        if (response.data.status === 'success') {
          this.commits = response.data.data || []

          // 确保每个提交对象都有必要的属性，防止undefined错误
          this.commits = this.commits.map(commit => {
            return {
              ...commit,
              hash: commit.hash || 'unknown',
              message: commit.message || '无提交信息',
              date: commit.date || new Date().toISOString(),
              author: commit.author || { username: '未知用户' }
            }
          })
        } else {
          console.error('加载提交历史失败:', response.data.message)
        }
      } catch (error) {
        console.error('加载提交历史失败:', error)
      } finally {
        this.loadingHistory = false
      }
    },

    async showHistory() {
      try {
        await this.loadCommitHistory()
        this.showHistoryDialog = true
      } catch (error) {
        console.error('显示历史对话框失败:', error)
        alert('加载提交历史失败: ' + (error.message || '未知错误'))
      }
    },

    async toggleHistorySidebar() {
      this.showHistorySidebar = !this.showHistorySidebar

      if (this.showHistorySidebar && this.commits.length === 0) {
        await this.loadCommitHistory()
      }
    },

    formatCommitInfo(commit) {
      if (!commit) return '未知提交信息'

      const username = commit.author?.username || '未知用户'
      const date = commit.date ? this.formatDate(commit.date) : '未知时间'

      return `${username} · ${date}`
    },

    async viewCommit(commit) {
      if (!commit || !commit.hash) {
        alert('无效的提交信息')
        return
      }

      try {
        this.loading = true
        this.loadingMessage = '加载提交详情...'

        const response = await axios.get(`/project/commit?projectid=${this.project.id}&commitid=${commit.hash}`)
        if (response.data.status === 'success') {
          this.accessFileToken = response.data.accessFileToken

          // 获取提交文件信息
          const commitFile = response.data.commit.commit_file;
          console.log(`获取提交文件: ${commitFile}`);

          if (!commitFile) {
            console.log('没有提交文件，创建空文件')
            this.fileContent = ''
            this.showHistoryDialog = false
            this.loading = false
            return
          }

          try {
            const commitFileResponse = await axios.get(`/project/files/${commitFile}?accessFileToken=${this.accessFileToken}&content=true`)

            if (commitFileResponse.status === 200) {
              // 直接使用文件内容
              let content = commitFileResponse.data;

              if (!content) {
                console.log('文件内容为空，创建新文件')
                this.fileContent = ''
              } else {
                if (typeof content === 'object') {
                  content = JSON.stringify(content, null, 2)
                }
                console.log('获取到文件内容，长度:', content.length)
                this.fileContent = content
                // 保存文件SHA256
                this.fileSha256 = commitFile

                // 设置编辑器语言
                const filename = this.project.name || 'file.js'
                this.editorOptions.language = this.detectLanguage(content, filename)
              }

              this.showHistoryDialog = false
              this.loading = false
            } else {
              const errorMsg = commitFileResponse.data?.message || '未知错误';
              console.error(`获取提交文件失败: ${commitFile}`, commitFileResponse.data)
              // 创建空文件
              this.fileContent = ''
              this.showHistoryDialog = false
              this.loading = false
            }
          } catch (fileError) {
            console.error('获取提交文件请求失败:', fileError)
            // 创建空文件
            this.fileContent = ''
            this.showHistoryDialog = false
            this.loading = false
          }
        } else {
          throw new Error(response.data.message || '加载提交详情失败')
        }
      } catch (error) {
        console.error('加载提交详情失败:', error)
        const errorMsg = error.response
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : `${error.message || '网络错误或服务器无响应'} [${error.stack?.split('\n')[1]?.trim() || '未知位置'}]`
        alert('加载提交详情失败: ' + errorMsg)
        this.loading = false
      }
    },

    async restoreCommit(commit) {
      if (!commit || !commit.hash) {
        alert('无效的提交信息')
        return
      }

      const commitId = commit.hash.substring(0, 7)

      if (confirm(`确定要恢复到提交 ${commitId} 的状态吗？`)) {
        try {
          this.loading = true
          this.loadingMessage = '恢复提交...'

          await this.viewCommit(commit)

          // 保存并提交恢复的代码
          const response = await axios.put(`/project/commit/id/${this.project.id}`, {
            branch: this.currentBranch,
            projectid: this.project.id,
            accessFileToken: this.accessFileToken,
            message: `恢复到提交 ${commitId}`,
            commit_description: `恢复到提交 ${commit.hash}，原提交信息: ${commit.message || '无提交信息'}`,
            commit_file: this.fileSha256 // 添加提交文件的SHA256
          })

          if (response.data.status === 'success') {
            alert('代码恢复成功')
            // 刷新提交历史
            await this.loadCommitHistory()
          } else {
            throw new Error(response.data.message || '恢复代码失败')
          }
        } catch (error) {
          console.error('恢复代码失败:', error)
          alert('恢复代码失败: ' + (error.response?.data?.message || error.message || '未知错误'))
        } finally {
          this.loading = false
        }
      }
    },

    async switchBranch() {
      if (this.codeChanged) {
        if (confirm('您有未保存的更改，是否切换分支？')) {
          await this.loadLatestCommit()
          this.codeChanged = false
        } else {
          // 恢复选择
          this.currentBranch = this.branches.find(b => b.name === this.currentBranch).name
        }
      } else {
        await this.loadLatestCommit()
      }
    },

    goToProjectPage() {
      if (this.project) {
        this.$router.push(`/${this.project.author.username}/${this.project.name}`)
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    },

    async retryLoading() {
      this.errorMessage = ''
      this.loading = true
      this.loadingMessage = '重新加载项目...'
      try {
        await this.loadProject()
      } catch (error) {
        this.errorMessage = error.message || '加载失败，请稍后再试'
      }
    },

    // 根据文件内容或名称推断语言
    detectLanguage(content, filename) {
      // 如果内容是JSON格式，设置为json
      try {
        JSON.parse(content)
        return 'json'
      } catch (e) {
        // 不是JSON，根据文件扩展名判断
        if (filename) {
          const ext = filename.split('.').pop().toLowerCase()
          const langMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'html': 'html',
            'css': 'css',
            'scss': 'scss',
            'less': 'less',
            'vue': 'html',
            'json': 'json',
            'md': 'markdown',
            'py': 'python',
            'java': 'java',
            'c': 'c',
            'cpp': 'cpp',
            'cs': 'csharp',
            'go': 'go',
            'php': 'php',
            'rb': 'ruby',
            'rs': 'rust',
            'sh': 'shell',
            'sql': 'sql',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml'
          }
          return langMap[ext] || 'plaintext'
        }
      }

      // 默认为纯文本
      return 'plaintext'
    }
  }
}
</script>

<style>
.monospace {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>
