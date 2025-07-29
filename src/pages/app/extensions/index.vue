<template>
  <v-container>
    <!-- 页面标题 -->
    <v-row>
      <v-col cols="12">
        <v-card  class="mb-4"><v-card-item prepend-icon="mdi-puzzle">
          <v-card-title>

            扩展市场
          </v-card-title>
          <v-card-subtitle>
            发现和使用社区开发的扩展来增强您的项目功能
          </v-card-subtitle>
        </v-card-item>
        <v-card-actions>
          <v-btn color="primary"  to="/app/extensions/my">
            我的扩展
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 筛选器 -->
    <v-card variant="flat" class="mb-4">
      <v-card-text>
        <v-row>
          <!-- 搜索框 -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="搜索扩展"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="compact"
              @input="handleSearch"
              @clear="handleSearch"
            ></v-text-field>
          </v-col>

          <!-- Scratch兼容性筛选 -->
          <v-col cols="12" md="2">
            <v-select
              v-model="scratchCompatibleFilter"
              :items="scratchCompatibleOptions"
              label="Scratch兼容性"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="handleFilterChange"
            ></v-select>
          </v-col>

          <!-- 排序方式 -->
          <v-col cols="12" md="3">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="排序方式"
              variant="outlined"
              density="compact"
              @update:model-value="handleSortChange"
            ></v-select>
          </v-col>

          <!-- 排序方向 -->
          <v-col cols="12" md="3">
            <v-select
              v-model="sortOrder"
              :items="orderOptions"
              label="排序方向"
              variant="outlined"
              density="compact"
              @update:model-value="handleSortChange"
            ></v-select>
          </v-col>
        </v-row>

        <!-- 重置筛选 -->
        <v-row>
          <v-col cols="12" class="text-center">
            <v-btn
              variant="outlined"
              color="grey"
              size="small"
              @click="resetFilters"
              class="mr-2"
            >
              <v-icon start>mdi-refresh</v-icon>
              重置筛选
            </v-btn>

            <v-chip
              v-if="activeFiltersCount > 0"
              color="primary"
              variant="outlined"
              size="small"
            >
              {{ activeFiltersCount }} 个筛选条件
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 统计信息 -->
    <v-row v-if="!loading && extensions.length > 0">
      <v-col cols="12">
        <v-card variant="flat" class="mb-4">
          <v-card-text class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-information</v-icon>
              <span class="text-body-2">
                共找到 <strong>{{ totalCount }}</strong> 个扩展
                <span v-if="activeFilters.search" class="ml-2">
                  (搜索: "{{ activeFilters.search }}")
                </span>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 扩展列表 -->
    <v-row>
      <v-col cols="12">
        <!-- 加载状态 -->
        <v-row v-if="loading">
          <v-col v-for="i in 12" :key="i" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="card" class="extension-skeleton"></v-skeleton-loader>
          </v-col>
        </v-row>

        <!-- 空状态 -->
        <v-row v-else-if="extensions.length === 0">
          <v-col cols="12" class="text-center py-16">
            <v-icon size="80" color="grey-lighten-1">mdi-puzzle-outline</v-icon>
            <h2 class="text-h5 mt-4 text-grey-darken-1">暂无扩展</h2>
            <p class="text-body-1 text-grey mt-2">
              {{ hasActiveFilters ? '没有找到匹配的扩展' : '扩展市场暂时为空' }}
            </p>
            <v-btn
              v-if="hasActiveFilters"
              variant="outlined"
              color="primary"
              class="mt-4"
              @click="resetAllFilters"
            >
              清除所有筛选条件
            </v-btn>
          </v-col>
        </v-row>

        <!-- 扩展网格 -->
        <v-row v-else>
          <v-col
            v-for="extension in extensions"
            :key="extension.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ExtensionCard
              :extension="extension"
              :s3-bucket-url="s3BucketUrl"
              @view-extension="viewExtension"
              @open-docs="openDocs"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- 分页 -->
    <v-row v-if="!loading && extensions.length > 0">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="handlePageChange"
        ></v-pagination>

        <div class="mt-2 text-caption text-grey-darken-1">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
          <span v-if="totalCount > 0">
            (每页 {{ limit }} 条，共 {{ totalCount }} 条)
          </span>
        </div>
      </v-col>
    </v-row>

    <!-- 扩展详情对话框 -->
    <v-dialog v-model="showDetailDialog" max-width="900" persistent>
      <v-card v-if="selectedExtension">
        <v-card-title class="d-flex align-center">
          <v-avatar class="mr-3" size="56">
            <v-img
              v-if="selectedExtension.image"
              :src="s3BucketUrl + '/extension/' + selectedExtension.image"
            ></v-img>
            <v-icon v-else size="28" color="primary">mdi-puzzle</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-h5 font-weight-bold">{{ selectedExtension.name }}</div>
            <div class="text-subtitle-1 text-grey-darken-1">
              by {{ selectedExtension.author?.display_name || selectedExtension.author?.username || '未知开发者' }}
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="showDetailDialog = false"></v-btn>
        </v-card-title>

        <v-card-text>
          <p class="text-body-1 mb-4">{{ selectedExtension.description }}</p>

          <!-- 统计信息 -->
          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <div class="text-center">
                <div class="text-h6 font-weight-bold text-amber">
                  {{ selectedExtension.project?.star_count || 0 }}
                </div>
                <div class="text-caption text-grey-darken-1">星标</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-center">
                <div class="text-h6 font-weight-bold text-green">
                  {{ selectedExtension.project?.view_count || 0 }}
                </div>
                <div class="text-caption text-grey-darken-1">查看</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-center">
                <div class="text-h6 font-weight-bold text-red">
                  {{ selectedExtension.project?.like_count || 0 }}
                </div>
                <div class="text-caption text-grey-darken-1">点赞</div>
              </div>
            </v-col>
          </v-row>

          <!-- 标签 -->
          <div v-if="selectedExtensionTags.length > 0" class="mb-4">
            <h3 class="text-subtitle-1 mb-2">标签</h3>
            <v-chip
              v-for="tag in selectedExtensionTags"
              :key="tag"
              class="mr-2 mb-2"
              variant="outlined"
              color="primary"
            >
              {{ tag }}
            </v-chip>
          </div>

          <!-- Scratch兼容性 -->
          <div class="mb-4">
            <h3 class="text-subtitle-1 mb-2">兼容性</h3>
            <v-chip
              :color="selectedExtension?.scratchCompatible ? 'orange' : 'grey'"
              variant="outlined"
              prepend-icon="mdi-puzzle"
            >
              {{ selectedExtension?.scratchCompatible ? '兼容原版Scratch' : '不兼容原版Scratch' }}
            </v-chip>
            <p class="text-caption text-grey mt-1">
              {{ selectedExtension?.scratchCompatible ? '此扩展可以在Scratch项目中使用' : '此扩展仅适用于其他平台' }}
            </p>
          </div>

          <!-- 示例项目 -->
          <div v-if="selectedExtension.sample_project" class="mb-4">
            <h3 class="text-subtitle-1 mb-2">示例项目</h3>
            <v-chip
              class="mr-2 mb-2"
              variant="outlined"
              color="blue"
            >
              {{ selectedExtension.sample_project }}
            </v-chip>
          </div>

          <!-- 操作按钮 -->
          <div class="d-flex justify-center gap-4">
            <v-btn
              color="primary"
              size="large"
              :href="selectedExtension.project?.url"
              target="_blank"
            >
              <v-icon start>mdi-open-in-new</v-icon>
              查看扩展项目
            </v-btn>

            <v-btn
              v-if="selectedExtension.has_docs"
              color="orange"
              size="large"
              variant="outlined"
              @click="openDocs(selectedExtension)"
            >
              <v-icon start>mdi-book-open-variant</v-icon>
              查看文档
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 文档对话框 -->
    <v-dialog v-model="showDocsDialog" max-width="1000" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="orange">mdi-book-open-variant</v-icon>
          扩展文档
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="showDocsDialog = false"></v-btn>
        </v-card-title>

        <v-card-text style="max-height: 600px; overflow-y: auto;">
          <div v-if="docsLoading" class="text-center py-8">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p class="mt-4 text-grey-darken-1">加载文档中...</p>
          </div>

          <div v-else-if="docsContent" v-html="docsContent"></div>

          <div v-else class="text-center py-8 text-grey">
            <v-icon size="64" color="grey-lighten-1">mdi-file-document-outline</v-icon>
            <p class="text-h6 mt-4 text-grey-darken-1">无法加载文档内容</p>
            <p class="text-body-2 text-grey">请访问扩展项目页面查看完整文档</p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDocsDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useHead } from "@unhead/vue";
import request from "@/axios/axios";
import { get } from "@/services/serverConfig";
import ExtensionCard from "@/components/extensions/ExtensionCard.vue";

export default {
  name: "ExtensionsMarket",
  components: {
    ExtensionCard
  },
  setup() {
    useHead({
      title: "扩展市场 - ZeroCat",
    });
  },
  data() {
    return {
      loading: false,
      extensions: [],

      // 分页
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: 20,

      // 筛选条件
      searchQuery: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      activeFilters: {
        search: '',
        sort: 'created_at',
        order: 'desc',
        scratchCompatible: null
      },

      // S3配置
      s3BucketUrl: '',

      // 对话框
      showDetailDialog: false,
      selectedExtension: null,
      showDocsDialog: false,
      docsLoading: false,
      docsContent: '',

      // 筛选选项
      sortOptions: [
        { title: '最新发布', value: 'created_at' },
        { title: '最近更新', value: 'updated_at' },
        { title: '星标数', value: 'stars' },
        { title: '查看数', value: 'views' },
        { title: '点赞数', value: 'likes' },
        { title: '综合排序', value: 'popularity' },
        { title: '名称排序', value: 'name' },
        { title: '作者排序', value: 'author' }
      ],

      orderOptions: [
        { title: '降序', value: 'desc' },
        { title: '升序', value: 'asc' }
      ],

      // 防抖
      searchTimeout: null,

      // Scratch兼容性筛选
      scratchCompatibleFilter: null,
      scratchCompatibleOptions: [
        { title: '所有', value: null },
        { title: '兼容原版Scratch', value: true },
        { title: '不兼容原版Scratch', value: false }
      ]
    };
  },
  computed: {
    hasActiveFilters() {
      return Object.values(this.activeFilters).some(value =>
        value !== '' && value !== null && value !== undefined
      );
    },

    selectedExtensionTags() {
      if (!this.selectedExtension?.project?.tags) return [];
      if (Array.isArray(this.selectedExtension.project.tags)) {
        return this.selectedExtension.project.tags;
      }
      return [];
    },

    activeFiltersCount() {
      let count = 0;
      if (this.searchQuery) count++;
      if (this.scratchCompatibleFilter !== null) count++;
      return count;
    }
  },
  async created() {
    this.s3BucketUrl = await get('s3.staticurl');
    await this.fetchExtensions();
  },
  methods: {
    async fetchExtensions() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          limit: this.limit,
          ...this.activeFilters
        };

        const response = await request.get('/extensions/marketplace', { params });

        if (response.data?.data) {
          this.extensions = response.data.data.extensions || [];
          this.totalCount = response.data.data.pagination?.total || 0;
          this.totalPages = response.data.data.pagination?.total_pages || 1;
          this.currentPage = response.data.data.pagination?.page || 1;
        }
      } catch (error) {
        console.error('Failed to fetch extensions:', error);
        this.extensions = [];
        this.totalCount = 0;
        this.totalPages = 1;
      } finally {
        this.loading = false;
      }
    },

    handleSearch() {
      this.activeFilters.search = this.searchQuery;
      this.currentPage = 1;
      this.fetchExtensions();
    },

    handleFilterChange() {
      this.activeFilters.scratchCompatible = this.scratchCompatibleFilter;
      this.currentPage = 1;
      this.fetchExtensions();
    },

    handleSortChange() {
      this.activeFilters.sort = this.sortBy;
      this.activeFilters.order = this.sortOrder;
      this.currentPage = 1;
      this.fetchExtensions();
    },

    resetFilters() {
      this.searchQuery = '';
      this.scratchCompatibleFilter = null;
      this.sortBy = 'created_at';
      this.sortOrder = 'desc';
      this.activeFilters = {
        search: '',
        sort: 'created_at',
        order: 'desc',
        scratchCompatible: null
      };
      this.currentPage = 1;
      this.fetchExtensions();
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.fetchExtensions();
    },

    resetAllFilters() {
      this.activeFilters = {
        search: '',
        sort: 'created_at',
        order: 'desc',
        scratchCompatible: null
      };
      this.currentPage = 1;
      this.fetchExtensions();
    },

    viewExtension(extension) {
      this.selectedExtension = extension;
      this.showDetailDialog = true;
    },

    async openDocs(extension) {
      this.showDocsDialog = true;
      this.docsLoading = true;
      this.docsContent = '';

      try {
        // 这里需要根据实际的API来获取文档内容
        // 暂时显示一个占位符
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟加载

        this.docsContent = `
          <div class="docs-content">
            <h2>${extension.name} 扩展文档</h2>
            <p>这里是 <strong>${extension.name}</strong> 扩展的使用文档。</p>
            <p><strong>文档路径:</strong> ${extension.docs_url || '暂无'}</p>
            <p>要查看完整文档，请访问扩展的项目页面。</p>

            <h3>使用说明</h3>
            <p>1. 下载扩展文件</p>
            <p>2. 将扩展文件放入项目的扩展目录</p>
            <p>3. 在项目中使用扩展功能</p>

            <h3>示例代码</h3>
            <pre><code>// 示例代码将在这里显示
// 请访问项目页面查看完整示例</code></pre>
          </div>
        `;
      } catch (error) {
        console.error('Failed to load docs:', error);
        this.docsContent = '';
      } finally {
        this.docsLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.extension-skeleton {
  border-radius: 12px;
}

.docs-content {
  line-height: 1.6;
}

.docs-content h2 {
  color: rgb(var(--v-theme-primary));
  margin-bottom: 1rem;
}

.docs-content h3 {
  color: rgb(var(--v-theme-secondary));
  margin: 1.5rem 0 0.5rem 0;
}

.docs-content pre {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.docs-content code {
  font-family: 'Courier New', monospace;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .v-container {
    padding: 8px;
  }
}
</style>