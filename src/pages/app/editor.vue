<template>
  <v-container fluid class="pa-0 fill-height">
    <!-- 顶部导航栏 -->
    <v-app-bar flat density="compact">
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
          <v-select
            v-model="currentBranch"
            :items="branches.map(b => b.name)"
            @update:model-value="switchBranch"
            density="compact"
            hide-details
            variant="outlined"
            class="branch-selector"
            prepend-inner-icon="mdi-source-branch"
            style="max-width: 150px"
          ></v-select>
        </v-col>
        
        <v-col cols="auto" class="d-flex">
          <v-btn
            prepend-icon="mdi-content-save"
            variant="text"
            size="small"
            color="success"
            @click="saveCode"
            class="ml-2"
          >
            保存
          </v-btn>
          
          <v-btn
            prepend-icon="mdi-source-commit"
            variant="text"
            size="small"
            color="primary"
            @click="commitCode"
            class="ml-2"
          >
            提交
          </v-btn>
          
          <v-btn
            prepend-icon="mdi-history"
            variant="text"
            size="small"
            @click="showHistory"
            class="ml-2"
          >
            历史
          </v-btn>
          
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="text"
            size="small"
            @click="goToProjectPage"
            class="ml-2"
          >
            项目页面
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <!-- 主编辑区域 -->
    <v-main>
      <!-- 左侧历史面板 -->
      <v-navigation-drawer
        v-model="showHistorySidebar"
        location="left"
        width="320"
        border
      >
        <v-toolbar density="compact">
          <v-toolbar-title class="text-subtitle-1">提交历史</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon size="small" @click="showHistorySidebar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-list v-if="commits.length > 0">
          <v-list-item
            v-for="commit in commits"
            :key="commit.hash"
            :title="commit.message || '无提交信息'"
            :subtitle="formatCommitInfo(commit)"
            lines="two"
            @click="viewCommit(commit)"
          >
            <template v-slot:prepend>
              <v-avatar size="36">
                <v-icon>mdi-source-commit</v-icon>
              </v-avatar>
            </template>
            
            <template v-slot:append>
              <v-menu location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    v-bind="props"
                  >
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

      <!-- 代码编辑器 -->
      <v-card flat class="fill-height rounded-0">
        <v-alert
          v-if="errorMessage"
          type="error"
          closable
          title="加载错误"
          :text="errorMessage"
          class="ma-4"
        >
          <template v-slot:append>
            <v-btn
              color="error"
              variant="text"
              @click="retryLoading"
            >
              重试
            </v-btn>
          </template>
        </v-alert>
        
        <v-textarea
          v-else-if="fileContent !== null"
          v-model="fileContent"
          @input="codeChanged = true"
          variant="plain"
          hide-details
          class="code-textarea fill-height"
          auto-grow
          no-resize
        ></v-textarea>
        
        <v-sheet
          v-else
          class="d-flex align-center justify-center fill-height"
        >
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <span class="ml-2">加载中...</span>
        </v-sheet>
      </v-card>
    </v-main>

    <!-- 提交对话框 -->
    <v-dialog v-model="showCommitDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5">
          提交更改
        </v-card-title>
        
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="commitMessage"
              label="提交信息"
              placeholder="简短描述您的更改"
              variant="outlined"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="commitDescription"
              label="详细描述 (可选)"
              placeholder="详细描述您的更改"
              variant="outlined"
              rows="4"
            ></v-textarea>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showCommitDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="submitCommit"
          >
            提交
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 历史对话框 - 修改为使用安全的数据访问 -->
    <v-dialog v-model="showHistoryDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5">
          提交历史
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-list lines="two">
            <v-list-item
              v-for="commit in commits"
              :key="commit.hash"
              :title="commit.message || '无提交信息'"
              :subtitle="formatCommitInfo(commit)"
            >
              <template v-slot:prepend>
                <v-avatar size="36">
                  <v-icon>mdi-source-commit</v-icon>
                </v-avatar>
              </template>
              
              <template v-slot:append>
                <div class="d-flex">
                  <v-chip
                    size="small"
                    variant="flat"
                    class="mr-2 monospace"
                  >
                    {{ commit.hash ? commit.hash.substring(0, 7) : 'unknown' }}
                  </v-chip>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                    @click="viewCommit(commit)"
                  >
                    查看
                  </v-btn>
                  <v-btn
                    size="small"
                    variant="text"
                    @click="restoreCommit(commit)"
                  >
                    恢复
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showHistoryDialog = false"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 加载遮罩 -->
    <v-overlay
      v-model="loading"
      class="align-center justify-center"
      persistent
    >
      <v-card width="300">
        <v-card-text class="text-center pa-4">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="text-body-1 mt-4">{{ loadingMessage }}</div>
        </v-card-text>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios/axios'

export default {
  name: 'ProjectEditor',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 状态变量
    const project = ref(null)
    const fileContent = ref(null)
    const fileSha256 = ref(null)
    const branches = ref([])
    const currentBranch = ref('main')
    const commits = ref([])
    const accessFileToken = ref('')
    const loading = ref(true)
    const loadingMessage = ref('加载项目信息...')
    const codeChanged = ref(false)
    const errorMessage = ref('')
    
    // 对话框状态
    const showCommitDialog = ref(false)
    const showHistoryDialog = ref(false)
    const showHistorySidebar = ref(false)
    const commitMessage = ref('')
    const commitDescription = ref('')
    const loadingHistory = ref(false)
    
    // 计算属性
    const projectId = computed(() => {
      return route.query.id
    })
    
    const projectNamespace = computed(() => {
      const username = route.query.username
      const projectname = route.query.projectname
      if (username && projectname) {
        return `${username}/${projectname}`
      }
      return null
    })

    // 方法
    const loadProject = async () => {
      try {
        loading.value = true
        loadingMessage.value = '加载项目信息...'
        
        let response
        if (projectId.value) {
          console.log('通过ID加载项目:', projectId.value)
          response = await axios.get(`/project/id/${projectId.value}`)
        } else if (projectNamespace.value) {
          console.log('通过命名空间加载项目:', projectNamespace.value)
          const [username, projectname] = projectNamespace.value.split('/')
          response = await axios.get(`/project/namespace/${username}/${projectname}`)
        } else {
          throw new Error('未提供项目ID或命名空间')
        }
        
        console.log('项目加载响应:', response.data)
        
        if (response.data.status === 'success' || response.data.id) {
          project.value = response.data.data || response.data
          
          if (!project.value || !project.value.id) {
            throw new Error('项目数据无效: ' + JSON.stringify(project.value))
          }
          
          await loadBranches()
          await loadLatestCommit()
        } else {
          throw new Error(response.data.message || '加载项目失败: 服务器未返回有效数据')
        }
      } catch (error) {
        console.error('加载项目失败:', error)
        const errMsg = error.response 
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : error.message || '网络错误或服务器无响应'
        loadingMessage.value = `加载失败: ${errMsg}`
        errorMessage.value = errMsg
        loading.value = false
      }
    }
    
    const loadBranches = async () => {
      try {
        loadingMessage.value = '加载分支信息...'
        console.log('加载分支, 项目ID:', project.value.id)
        
        const response = await axios.get(`/project/branches?projectid=${project.value.id}`)
        console.log('分支加载响应:', response.data)
        
        if (response.data.status === 'success') {
          branches.value = response.data.data || []
          if (branches.value.length > 0) {
            currentBranch.value = branches.value[0].name
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
        loadingMessage.value = `加载分支失败: ${errorMsg}`
        errorMessage.value = errorMsg
        loading.value = false
      }
    }
    
    const loadLatestCommit = async () => {
      try {
        loadingMessage.value = '加载最新代码...'
        console.log('加载最新提交, 项目ID:', project.value.id, '分支:', currentBranch.value)
        
        const response = await axios.get(`/project/${project.value.id}/${currentBranch.value}/latest`)
        console.log('最新提交响应:', response.data)
        
        if (response.data.status === 'success') {
          if (!response.data.accessFileToken) {
            throw new Error('服务器未返回文件访问令牌')
          }
          
          accessFileToken.value = response.data.accessFileToken
          
          if (!response.data.commit) {
            throw new Error('服务器返回的提交数据无效')
          }
          
          // 获取提交文件信息
          const commitFile = response.data.commit.commit_file;
          console.log(`获取提交文件: ${commitFile}`);
          
          try {
            const commitFileResponse = await axios.get(`/project/files/${commitFile}?accessFileToken=${accessFileToken.value}&content=true`)
            console.log('提交文件响应:', commitFileResponse.data)
            console.log(commitFileResponse)
            if (commitFileResponse.status === 200) {
              // 直接使用文件内容
              let content = commitFileResponse.data;
              
              if (!content) {
                console.log('文件内容为空，创建新文件')
                fileContent.value = ''
              } else {
                if (typeof content === 'object') {
                  content = JSON.stringify(content)
                }
                console.log('获取到文件内容，长度:', content.length)
                fileContent.value = content
                // 保存文件SHA256
                fileSha256.value = commitFile
              }
              
              loading.value = false
            } else {
              const errorMsg = commitFileResponse.data.message || '未知错误';
              console.error(`获取提交文件失败: ${commitFile}`, commitFileResponse.data)
              // 创建空文件
              fileContent.value = ''
              loading.value = false
            }
          } catch (fileError) {
            console.error('获取提交文件请求失败:', fileError)
            // 创建空文件
            fileContent.value = ''
            loading.value = false
          }
        } else {
          throw new Error(response.data.message || '加载最新提交失败: 服务器未返回有效数据')
        }
      } catch (error) {
        console.error('加载最新提交失败:', error)
        const errorMsg = error.response 
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : `${error.message || '网络错误或服务器无响应'} [${error.stack?.split('\n')[1]?.trim() || '未知位置'}]`
        loadingMessage.value = `加载最新提交失败: ${errorMsg}`
        errorMessage.value = errorMsg
        // 即使出错，也创建空文件让用户可以开始编辑
        fileContent.value = ''
        loading.value = false
      }
    }
    
    const loadSingleFile = async (file) => {
      try {
        loadingMessage.value = '加载文件内容...'
        console.log('加载文件:', file.path)
        
        // 保存文件SHA256用于后续操作
        fileSha256.value = file.sha256
        
        // 获取文件内容
        const fileResponse = await axios.get(`/project/files/${file.sha256}?accessFileToken=${accessFileToken.value}&content=true`)
        
        if (fileResponse.data.status === 'success') {
          let content = fileResponse.data.file.content;
          
          // 如果没有获取到内容，记录错误并返回空内容
          if (!content) {
            console.error(`文件内容为空: ${file.path} (SHA256: ${file.sha256})`)
            content = '';
          }
          
          fileContent.value = content
        } else {
          const errorMsg = fileResponse.data.message || '未知错误';
          console.error(`加载文件失败: ${file.path} - ${errorMsg}`)
          throw new Error(`加载文件失败: ${file.path} - ${errorMsg}`)
        }
        
        loading.value = false
      } catch (error) {
        console.error('加载文件内容失败:', error)
        const errorMsg = error.response 
          ? `服务器错误 (${error.response.status}): ${error.response.data?.message || '未知错误'}`
          : `${error.message || '网络错误或服务器无响应'} [${error.stack?.split('\n')[1]?.trim() || '未知位置'}]`
        loadingMessage.value = `加载文件失败: ${errorMsg}`
        errorMessage.value = errorMsg
        loading.value = false
        alert('加载文件内容失败: ' + errorMsg)
      }
    }
    
    const saveCode = async () => {
      if (fileContent.value === null) {
        alert('文件内容未加载')
        return
      }
      
      try {
        loading.value = true
        loadingMessage.value = '保存文件...'
        
        // 尝试将内容解析为JSON格式
        let contentToSave
        let isValidJson = false
        
        try {
          // 检查内容是否已经是有效的JSON
          JSON.parse(fileContent.value)
          contentToSave = fileContent.value
          isValidJson = true
          console.log('内容已经是有效的JSON格式')
        } catch (e) {
          // 如果不是有效的JSON，则包装为简单的JSON对象
          console.log('内容不是有效的JSON格式，将包装为{index:content}格式')
          contentToSave = JSON.stringify({ "index": fileContent.value })
        }
        
        // 直接发送文件内容
        const response = await axios.post('/project/savefile', contentToSave, {
          headers: {
            'Content-Type': 'application/json',
            'X-Project-ID': project.value.id
          }
        })
        
        if (response.data.status === 'success') {
          accessFileToken.value = response.data.accessFileToken
          // 更新文件SHA256
          if (response.data.sha256) {
            fileSha256.value = response.data.sha256
          }
          codeChanged.value = false
          alert('文件保存成功' + (!isValidJson ? ' (已转换为JSON格式)' : ''))
        } else {
          throw new Error(response.data.message || '保存文件失败')
        }
      } catch (error) {
        console.error('保存文件失败:', error)
        alert('保存文件失败: ' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }
    
    const commitCode = async () => {
      if (codeChanged.value) {
        if (confirm('您有未保存的更改，是否先保存？')) {
          await saveCode()
        } else {
          return
        }
      }
      
      showCommitDialog.value = true
    }
    
    const loadCommitHistory = async () => {
      if (!project.value || !project.value.id) {
        console.error('项目未加载，无法获取提交历史')
        return
      }
      
      try {
        loadingHistory.value = true
        
        const response = await axios.get(`/project/commits?projectid=${project.value.id}&branch=${currentBranch.value}`)
        if (response.data.status === 'success') {
          commits.value = response.data.data || []
          
          // 确保每个提交对象都有必要的属性，防止undefined错误
          commits.value = commits.value.map(commit => {
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
        loadingHistory.value = false
      }
    }
    
    const showHistory = async () => {
      try {
        await loadCommitHistory()
        showHistoryDialog.value = true
      } catch (error) {
        console.error('显示历史对话框失败:', error)
        alert('加载提交历史失败: ' + (error.message || '未知错误'))
      }
    }
    
    const toggleHistorySidebar = async () => {
      showHistorySidebar.value = !showHistorySidebar.value
      
      if (showHistorySidebar.value && commits.value.length === 0) {
        await loadCommitHistory()
      }
    }
    
    const formatCommitInfo = (commit) => {
      if (!commit) return '未知提交信息'
      
      const username = commit.author?.username || '未知用户'
      const date = commit.date ? formatDate(commit.date) : '未知时间'
      
      return `${username} · ${date}`
    }
    
    // 监听分支变化，重新加载提交历史
    watch(currentBranch, async () => {
      if (showHistorySidebar.value) {
        await loadCommitHistory()
      }
    })
    
    // 在项目加载完成后自动加载提交历史
    watch(project, async (newProject) => {
      if (newProject && newProject.id) {
        await loadCommitHistory()
      }
    })
    
    // 修改原有的viewCommit方法，确保安全访问属性
    const viewCommit = async (commit) => {
      if (!commit || !commit.hash) {
        alert('无效的提交信息')
        return
      }
      
      try {
        loading.value = true
        loadingMessage.value = '加载提交详情...'
        
        const response = await axios.get(`/project/commit?projectid=${project.value.id}&commitid=${commit.hash}`)
        if (response.data.status === 'success') {
          accessFileToken.value = response.data.accessFileToken
          
          // 获取提交文件信息
          const commitFile = response.data.commit.commit_file;
          console.log(`获取提交文件: ${commitFile}`);
          
          try {
            const commitFileResponse = await axios.get(`/project/files/${commitFile}?accessFileToken=${accessFileToken.value}&content=true`)
            
            if (commitFileResponse.status === 200) {
              // 直接使用文件内容
              let content = commitFileResponse.data;
              
              if (!content) {
                console.log('文件内容为空，创建新文件')
                fileContent.value = ''
              } else {
                if (typeof content === 'object') {
                  content = JSON.stringify(content)
                }
                console.log('获取到文件内容，长度:', content.length)
                fileContent.value = content
                // 保存文件SHA256
                fileSha256.value = commitFile
              }
              
              showHistoryDialog.value = false
              loading.value = false
            } else {
              const errorMsg = commitFileResponse.data?.message || '未知错误';
              console.error(`获取提交文件失败: ${commitFile}`, commitFileResponse.data)
              // 创建空文件
              fileContent.value = ''
              showHistoryDialog.value = false
              loading.value = false
            }
          } catch (fileError) {
            console.error('获取提交文件请求失败:', fileError)
            // 创建空文件
            fileContent.value = ''
            showHistoryDialog.value = false
            loading.value = false
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
        loading.value = false
      }
    }
    
    // 修改原有的restoreCommit方法，确保安全访问属性
    const restoreCommit = async (commit) => {
      if (!commit || !commit.hash) {
        alert('无效的提交信息')
        return
      }
      
      const commitId = commit.hash.substring(0, 7)
      
      if (confirm(`确定要恢复到提交 ${commitId} 的状态吗？`)) {
        try {
          loading.value = true
          loadingMessage.value = '恢复提交...'
          
          await viewCommit(commit)
          
          // 保存并提交恢复的代码
          const response = await axios.put(`/project/commit/id/${project.value.id}`, {
            branch: currentBranch.value,
            projectid: project.value.id,
            accessFileToken: accessFileToken.value,
            message: `恢复到提交 ${commitId}`,
            commit_description: `恢复到提交 ${commit.hash}，原提交信息: ${commit.message || '无提交信息'}`
          })
          
          if (response.data.status === 'success') {
            alert('代码恢复成功')
            // 刷新提交历史
            await loadCommitHistory()
          } else {
            throw new Error(response.data.message || '恢复代码失败')
          }
        } catch (error) {
          console.error('恢复代码失败:', error)
          alert('恢复代码失败: ' + (error.message || '未知错误'))
        } finally {
          loading.value = false
        }
      }
    }
    
    // 修改原有的submitCommit方法，提交后刷新历史记录
    const submitCommit = async () => {
      if (!commitMessage.value.trim()) {
        alert('请输入提交信息')
        return
      }
      
      try {
        loading.value = true
        loadingMessage.value = '提交代码...'
        
        const response = await axios.put(`/project/commit/id/${project.value.id}`, {
          branch: currentBranch.value,
          projectid: project.value.id,
          accessFileToken: accessFileToken.value,
          message: commitMessage.value,
          commit_description: commitDescription.value
        })
        
        if (response.data.status === 'success') {
          showCommitDialog.value = false
          commitMessage.value = ''
          commitDescription.value = ''
          alert('代码提交成功')
          
          // 刷新提交历史
          await loadCommitHistory()
        } else {
          throw new Error(response.data.message || '提交代码失败')
        }
      } catch (error) {
        console.error('提交代码失败:', error)
        alert('提交代码失败: ' + (error.message || '未知错误'))
      } finally {
        loading.value = false
      }
    }
    
    const switchBranch = async () => {
      if (codeChanged.value) {
        if (confirm('您有未保存的更改，是否切换分支？')) {
          await loadLatestCommit()
          codeChanged.value = false
        } else {
          // 恢复选择
          currentBranch.value = branches.value.find(b => b.name === currentBranch.value).name
        }
      } else {
        await loadLatestCommit()
      }
    }
    
    const goToProjectPage = () => {
      if (project.value) {
        router.push(`/${project.value.author.username}/${project.value.name}`)
      }
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }
    
    const retryLoading = async () => {
      errorMessage.value = ''
      loading.value = true
      loadingMessage.value = '重新加载项目...'
      try {
        await loadProject()
      } catch (error) {
        errorMessage.value = error.message || '加载失败，请稍后再试'
      }
    }
    
    // 生命周期钩子
    onMounted(() => {
      loadProject()
    })
    
    return {
      project,
      fileContent,
      branches,
      currentBranch,
      commits,
      loading,
      loadingMessage,
      codeChanged,
      errorMessage,
      showCommitDialog,
      showHistoryDialog,
      showHistorySidebar,
      commitMessage,
      commitDescription,
      loadingHistory,
      saveCode,
      commitCode,
      submitCommit,
      showHistory,
      viewCommit,
      restoreCommit,
      switchBranch,
      goToProjectPage,
      formatDate,
      retryLoading,
      toggleHistorySidebar,
      formatCommitInfo
    }
  }
}
</script>

<style scoped>
.code-textarea {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 16px;
}

.monospace {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* 确保编辑器占满整个高度 */
.fill-height {
  height: 100%;
}
</style>
