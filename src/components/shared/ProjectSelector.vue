<template>
  <div>
    <v-card class="cursor-pointer" @click="openDialog" elevation="1" rounded="lg">
      <v-card-text class="d-flex align-center justify-space-between">
        <div class="flex-grow-1">
          <div v-if="!hasSelection" class="text-grey-600">
            {{ multiple ? '选择项目...' : '选择一个项目...' }}
          </div>
          <div v-else-if="!multiple && selectedProject" class="d-flex align-center">
            <v-avatar size="32" class="me-2">
              <img :src="selectedProject.author.avatar" :alt="selectedProject.author.display_name">
            </v-avatar>
            <div>
              <div class="text-subtitle-2">{{ selectedProject.title }}</div>
              <div class="text-caption text-grey-600">by {{ selectedProject.author.display_name }}</div>
            </div>
          </div>
          <div v-else-if="multiple" class="flex-grow-1">
            <div class="text-subtitle-2 mb-1">已选择 {{ selectedProjects.length }} 个项目</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="project in selectedProjects.slice(0, 3)"
                :key="project.id"
                size="small"
                variant="outlined"
                color="primary"
              >
                {{ project.title }}
              </v-chip>
              <v-chip
                v-if="selectedProjects.length > 3"
                size="small"
                variant="outlined"
                color="grey"
              >
                +{{ selectedProjects.length - 3 }}
              </v-chip>
            </div>
          </div>
        </div>
        <v-icon>mdi-chevron-down</v-icon>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialog"
      :max-width="$vuetify.display.mobile ? undefined : '1200px'"
      :fullscreen="$vuetify.display.mobile"
      scrollable
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <span class="text-h6">{{ multiple ? '选择项目' : '选择一个项目' }}</span>
          <v-btn icon variant="text" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-container fluid class="pa-0">
          <v-row no-gutters>
            <!-- 项目列表区域 -->
            <v-col
              :cols="multiple && selectedProjects.length > 0 ? ($vuetify.display.mobile ? 12 : 8) : 12"
              :order="$vuetify.display.mobile ? 2 : 1"
            >
              <div class="pa-4">
                <v-text-field
                  v-model="searchQuery"
                  label="搜索项目"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  @input="searchProjects"
                />

                <v-row class="mb-4">
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="sortBy"
                      :items="sortOptions"
                      label="排序"
                      variant="outlined"
                      density="compact"
                      @update:model-value="loadProjects"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="searchState"
                      :items="stateOptions"
                      label="状态"
                      variant="outlined"
                      density="compact"
                      @update:model-value="loadProjects"
                    />
                  </v-col>
                </v-row>

                <!-- 加载指示条 -->
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                  color="primary"
                  class="mb-4"
                />

                <div v-if="loading && projects.length === 0" class="text-center py-8">
                  <v-progress-circular indeterminate size="48" />
                  <div class="mt-4 text-h6">加载中...</div>
                </div>

                <div v-else-if="projects.length === 0" class="text-center py-8 text-grey-600">
                  <v-icon size="64" class="mb-4">mdi-folder-open-outline</v-icon>
                  <div class="text-h6">未找到项目</div>
                </div>

                <v-row v-else>
                  <v-col
                    v-for="project in projects"
                    :key="project.id"
                    cols="6"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card
                      :class="[
                        'project-card',
                        { 'selected': isProjectSelected(project.id) }
                      ]"
                      rounded="lg"
                      elevation="2"
                      @click="selectProject(project)"
                    >
                      <v-card
                        rounded="lg"
                        style="aspect-ratio: 4/3"
                      >
                        <v-img
                          :src="s3BucketUrl + '/scratch_slt/' + project.id"
                          class="align-end"
                          cover
                          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                          height="100%"
                          lazy-src="/src/assets/43-lazyload.png"
                        >
                          <v-card-item>
                            <v-card-title class="text-white">{{ project.title }}</v-card-title>
                            <v-card-subtitle class="text-white">{{ project.description }}</v-card-subtitle>
                          </v-card-item>
                        </v-img>
                      </v-card>

                      <!-- 作者信息区域 -->
                      <v-card-item
                        :append-avatar="project.author?.avatar ? s3BucketUrl + '/user/' + project.author.avatar : ''"
                      >
                        <v-card-title>{{ project.author?.display_name || project.author?.username || "未知用户" }}</v-card-title>
                        <v-card-subtitle>@{{ project.author?.username || "" }}</v-card-subtitle>

                        <template v-slot:append>
                          <div class="d-flex align-center gap-2">
                            <v-chip
                              :color="project.state === 'public' ? 'success' : 'warning'"
                              size="small"
                              variant="outlined"
                            >
                              {{ project.state === 'public' ? '公开' : '私有' }}
                            </v-chip>
                            <v-icon
                              v-if="isProjectSelected(project.id)"
                              color="primary"
                              size="24"
                            >
                              mdi-check-circle
                            </v-icon>
                          </div>
                        </template>
                      </v-card-item>

                      <!-- 项目统计信息 -->
                      <v-card-item class="pt-0">
                        <div class="d-flex align-center justify-space-between text-caption text-grey-600">
                          <div class="d-flex align-center gap-3">
                            <div class="d-flex align-center">
                              <v-icon size="16" class="me-1">mdi-eye</v-icon>
                              {{ project.view_count }}
                            </div>
                            <div class="d-flex align-center">
                              <v-icon size="16" class="me-1">mdi-star</v-icon>
                              {{ project.star_count }}
                            </div>
                          </div>
                          <div>{{ formatDate(project.time) }}</div>
                        </div>

                        <div v-if="project.tags" class="mt-2">
                          <v-chip
                            v-for="tag in project.tags.split(',')"
                            :key="tag"
                            size="x-small"
                            variant="outlined"
                            class="me-1"
                          >
                            {{ tag.trim() }}
                          </v-chip>
                        </div>
                      </v-card-item>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- 分页组件 -->
                <div v-if="totalCount > 0" class="d-flex justify-center mt-6">
                  <v-pagination
                    v-model="page"
                    :length="Math.ceil(totalCount / limit)"
                    :total-visible="7"
                    @update:model-value="onPageChange"
                  />
                </div>
              </div>
            </v-col>

            <!-- 已选择区域 - 桌面端显示为右侧栏，移动端显示为chip列表 -->
            <v-col
              v-if="multiple && selectedProjects.length > 0"
              :cols="$vuetify.display.mobile ? 12 : 4"
              :class="{
                'border-s': !$vuetify.display.mobile,
                'border-b': $vuetify.display.mobile,

              }"
              :order="$vuetify.display.mobile ? 1 : 2"
            >
              <!-- 移动端 Chip 展示 -->
              <div v-if="$vuetify.display.mobile" class="pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="text-h6">已选择</div>
                  <v-chip color="primary" size="small">{{ selectedProjects.length }}</v-chip>
                </div>

                <div class="d-flex flex-wrap gap-2 mb-4">
                  <v-chip
                    v-for="project in selectedProjects"
                    :key="project.id"
                    closable
                    color="primary"
                    variant="elevated"
                    @click:close="removeProject(project.id)"
                  >
                    <v-avatar start size="24" class="me-2">
                      <v-img
                        :src="s3BucketUrl + '/user/' + project.author.avatar"
                        cover
                      >
                        <template v-slot:placeholder>
                          <v-icon size="12">mdi-image</v-icon>
                        </template>
                      </v-img>
                    </v-avatar>
                    {{ project.title }}
                  </v-chip>
                </div>

                <!-- 移动端确认按钮 -->
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  size="large"
                  @click="confirmSelection"
                >
                  <v-icon start>mdi-check</v-icon>
                  确认选择 ({{ selectedProjects.length }})
                </v-btn>
              </div>

              <!-- 桌面端卡片展示 -->
              <div v-else class="pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="text-h6">已选择</div>
                  <v-chip color="primary" size="small">{{ selectedProjects.length }}</v-chip>
                </div>

                <div>
                  <v-row>
                    <v-col
                      v-for="project in selectedProjects"
                      :key="project.id"
                      cols="12"
                      sm="6"
                    >
                      <v-card
                        class="selected-item"
                        rounded="lg"
                        elevation="2"
                        variant="outlined"
                        color="primary"
                      >
                        <v-card rounded="lg" style="aspect-ratio: 4/3">
                          <v-img
                            :src="s3BucketUrl + '/scratch_slt/' + project.id"
                            class="align-end"
                            cover
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            height="100%"
                            lazy-src="/src/assets/43-lazyload.png"
                          >
                            <v-card-item>
                              <v-card-title class="text-white">{{ project.title }}</v-card-title>
                              <v-card-subtitle class="text-white">{{ project.description }}</v-card-subtitle>
                            </v-card-item>

                            <!-- 删除按钮 -->
                            <div class="position-absolute" style="top: 8px; right: 8px;">
                              <v-btn
                                icon
                                size="small"
                                variant="elevated"
                                color="error"
                                @click.stop="removeProject(project.id)"
                              >
                                <v-icon size="16">mdi-close</v-icon>
                              </v-btn>
                            </div>
                          </v-img>
                        </v-card>

                        <!-- 作者信息区域 -->
                        <v-card-item
                          :append-avatar="project.author?.avatar ? s3BucketUrl + '/user/' + project.author.avatar : ''"
                        >
                          <v-card-title>{{ project.author?.display_name || project.author?.username || "未知用户" }}</v-card-title>
                          <v-card-subtitle>@{{ project.author?.username || "" }}</v-card-subtitle>

                          <template v-slot:append>
                            <div class="d-flex align-center gap-2">
                              <v-chip
                                :color="project.state === 'public' ? 'success' : 'warning'"
                                size="small"
                                variant="outlined"
                              >
                                {{ project.state === 'public' ? '公开' : '私有' }}
                              </v-chip>
                            </div>
                          </template>
                        </v-card-item>

                        <!-- 项目统计信息 -->
                        <v-card-item class="pt-0">
                          <div class="d-flex align-center justify-space-between text-caption text-grey-600">
                            <div class="d-flex align-center gap-3">
                              <div class="d-flex align-center">
                                <v-icon size="16" class="me-1">mdi-eye</v-icon>
                                {{ project.view_count }}
                              </div>
                              <div class="d-flex align-center">
                                <v-icon size="16" class="me-1">mdi-star</v-icon>
                                {{ project.star_count }}
                              </div>
                            </div>
                            <div>{{ formatDate(project.time) }}</div>
                          </div>

                          <div v-if="project.tags" class="mt-2">
                            <v-chip
                              v-for="tag in project.tags.split(',')"
                              :key="tag"
                              size="x-small"
                              variant="outlined"
                              class="me-1"
                            >
                              {{ tag.trim() }}
                            </v-chip>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- 桌面端确认按钮 -->
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  class="mt-3"
                  size="large"
                  @click="confirmSelection"
                >
                  <v-icon start>mdi-check</v-icon>
                  确认选择 ({{ selectedProjects.length }})
                </v-btn>
              </div>
            </v-col>


          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from '@/axios/axios'
import { get } from '@/services/serverConfig'
const props = defineProps({
  modelValue: {
    type: [Number, Array],
    default: () => null
  },
  multiple: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['update:modelValue'])

const dialog = ref(false)
const loading = ref(false)
const projects = ref([])
const selectedProjectsMap = ref(new Map())
const searchQuery = ref('')
const sortBy = ref('time_down')
const searchState = ref('')
const page = ref(1)
const totalCount = ref(0)

// S3 bucket URL for images
const s3BucketUrl = ref('')

const sortOptions = [
  { title: '最新发布', value: 'time_down' },
  { title: '最早发布', value: 'time_up' },
  { title: '最多观看', value: 'view_down' },
  { title: '最少观看', value: 'view_up' },
  { title: '最多点赞', value: 'star_down' },
  { title: '最少点赞', value: 'star_up' },
  { title: 'ID降序', value: 'id_down' },
  { title: 'ID升序', value: 'id_up' }
]

const stateOptions = [
  { title: '所有', value: '' },
  { title: '公开', value: 'public' },
  { title: '私有', value: 'private' }
]

const selectedProjects = computed(() => Array.from(selectedProjectsMap.value.values()))

const selectedProject = computed(() => {
  if (props.multiple || !props.modelValue) return null
  return selectedProjectsMap.value.get(props.modelValue) || null
})

const hasSelection = computed(() => {
  if (props.multiple) {
    return selectedProjects.value.length > 0
  }
  return !!props.modelValue && !!selectedProject.value
})

const isProjectSelected = (projectId) => {
  return selectedProjectsMap.value.has(projectId)
}

const loadProjects = async (reset = true) => {
  if (reset) {
    page.value = 1
  }

  loading.value = true

  try {
    const params = {
      curr: page.value,
      limit: props.limit,
      search_order: sortBy.value,
      search_state: searchState.value
    }

    if (searchQuery.value) {
      params.search_title = searchQuery.value
    }

    const response = await axios.get('/searchapi', { params })
    const data = response.data

    projects.value = data.projects
    totalCount.value = data.totalCount
  } catch (error) {
    console.error('Failed to load projects:', error)
  } finally {
    loading.value = false
  }
}

const searchProjects = () => {
  loadProjects()
}

const onPageChange = (newPage) => {
  page.value = newPage
  loadProjects(false)
}

const selectProject = (project) => {
  if (!props.multiple) {
    selectedProjectsMap.value.clear()
    selectedProjectsMap.value.set(project.id, project)
    emit('update:modelValue', project.id)
    dialog.value = false
  } else {
    if (selectedProjectsMap.value.has(project.id)) {
      selectedProjectsMap.value.delete(project.id)
    } else {
      selectedProjectsMap.value.set(project.id, project)
    }
  }
}

const removeProject = (projectId) => {
  selectedProjectsMap.value.delete(projectId)
}

const confirmSelection = () => {
  const selectedIds = Array.from(selectedProjectsMap.value.keys())
  emit('update:modelValue', selectedIds)
  dialog.value = false
}

const openDialog = () => {
  dialog.value = true
  if (projects.value.length === 0) {
    loadProjects()
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const loadProjectsDetails = async (projectIds) => {
  try {
    const response = await axios.post('/project/batch', { projectIds })
    const projects = response.data.data

    // 更新已选择项目的详细信息
    projects.forEach(project => {
      if (selectedProjectsMap.value.has(project.id)) {
        selectedProjectsMap.value.set(project.id, project)
      }
    })
  } catch (error) {
    console.error('Failed to load project details:', error)
  }
}

const initializeSelection = async () => {
  selectedProjectsMap.value.clear()

  if (props.modelValue) {
    const projectIds = []

    if (props.multiple && Array.isArray(props.modelValue)) {
      // 多选模式，先创建临时项目对象
      props.modelValue.forEach(id => {
        selectedProjectsMap.value.set(id, {
          id,
          title: `项目 ${id}`,
          loading: true,
          author: {
            display_name: '加载中...',
            username: '',
            avatar: '',
            id: 0
          },
          description: '加载中...',
          view_count: 0,
          star_count: 0,
          time: new Date().toISOString(),
          tags: '',
          state: 'public'
        })
        projectIds.push(id)
      })
    } else if (!props.multiple && typeof props.modelValue === 'number') {
      // 单选模式，同样创建临时项目对象
      selectedProjectsMap.value.set(props.modelValue, {
        id: props.modelValue,
        title: `项目 ${props.modelValue}`,
        loading: true,
        author: {
          display_name: '加载中...',
          username: '',
          avatar: '',
          id: 0
        },
        description: '加载中...',
        view_count: 0,
        star_count: 0,
        time: new Date().toISOString(),
        tags: '',
        state: 'public'
      })
      projectIds.push(props.modelValue)
    }

    // 批量获取项目详情
    if (projectIds.length > 0) {
      await loadProjectsDetails(projectIds)
    }
  }
}

watch(() => props.modelValue, (newValue, oldValue) => {
  // 深度比较，只有当值真正改变时才重新初始化
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    initializeSelection()
  }
}, { immediate: true, deep: true })

onMounted(async () => {
  initializeSelection()
  s3BucketUrl.value =await get('s3.staticurl')
})
</script>

<style scoped>
.project-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
}

.project-card.selected {
  border: 2px solid rgb(var(--v-theme-primary));
}

.selected-item:hover {
  transform: translateY(-2px);
}
</style>