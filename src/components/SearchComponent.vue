<template>
  <div class="search-component">
    <v-form @submit.prevent="handleSearch">
      <div class="d-flex align-center gap-2">
        <v-text-field
          v-model="searchQuery"
          :loading="isLoading"
          class="search-input"
          clearable
          hide-details
          label="键入以搜索"
          variant="outlined"
          @keyup.enter="handleSearch"
        >
          <template v-slot:prepend-inner>
            <v-icon icon="mdi-magnify"></v-icon>
          </template>
        </v-text-field>
        <v-btn
          :loading="isLoading"
          class="search-button"
          color="primary"
          height="56"
          min-width="56"
          @click="handleSearch"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
    </v-form>

    <!-- 搜索历史和热门搜索 -->
    <v-expand-transition style="padding-top: 16px !important">
      <v-card v-if="!searchQuery" class="suggestions-card" flat>
        <v-card-text>
          <div v-if="searchHistory.length > 0">
            <div class="text-subtitle-2">搜索历史</div>
            <v-chip-group>
              <v-chip
                v-for="(term, index) in searchHistory"
                :key="index"
                class="history-chip"
                size="small"
                @click="handleHistoryClick(term)"
              >
                {{ term }}
              </v-chip>
            </v-chip-group>
          </div>
          <v-divider v-if="searchHistory.length > 0" class="my-3"></v-divider>
          <div>
            <div class="text-subtitle-2">热门搜索</div>
            <v-chip-group>
              <v-chip
                v-for="(term, index) in hotSearches"
                :key="index"
                class="hot-chip"
                size="small"
                @click="handleHistoryClick(term)"
              >
                {{ term }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- 搜索结果 - 仅在页面模式显示 -->
    <template v-if="mode === 'page'">
      <v-fade-transition>
        <div v-if="hasSearched" class="search-results mt-4">
          <!-- 加载进度条 -->
          <v-progress-linear
            v-if="isLoading"
            class="mt-4"
            color="primary"
            indeterminate
          ></v-progress-linear>

          <!-- 搜索结果展示 -->
          <v-fade-transition group>
            <template v-if="!isLoading">
              <v-row v-if="searchResults.length > 0">
                <v-col
                  v-for="item in searchResults"
                  :key="item.id"
                  cols="12"
                  lg="3"
                  md="4"
                  sm="6"
                  xl="2"
                  xs="12"
                  xxl="2"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      :elevation="isHovering ? 8 : 2"
                      :to="urlMap[item.id]"
                      class="result-card"
                      rounded="lg"
                      style="aspect-ratio: 4/3"
                      v-bind="props"
                    >
                      <v-img
                        :src="getS3staticurl(item.thumbnail)"
                        class="align-end"
                        cover
                        error-src="../assets/43-lazyload.png"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        height="100%"
                        lazy-src="../assets/43-lazyload.png"
                      >
                        <template v-slot:placeholder>
                          <v-progress-linear
                            color="primary"
                            indeterminate
                          ></v-progress-linear>
                        </template>
                        <v-card-item>
                          <v-chip
                            class="type-chip"
                            color="primary"
                            size="small"
                            variant="tonal"
                          >
                            {{ item.type }}
                          </v-chip>
                          <v-chip
                            v-if="item.license !== 'no'"
                            class="license-chip"
                            color="primary"
                            size="small"
                            variant="tonal"
                          >
                            {{ item.license }}
                          </v-chip>
                          <v-card-title
                            class="text-white"
                            v-html="item._formatted.title"
                          ></v-card-title>
                          <v-card-subtitle
                            class="text-white"
                            v-html="item._formatted.description"
                          ></v-card-subtitle>
                        </v-card-item>
                      </v-img>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
              <v-row v-else class="mt-4" justify="center">
                <v-col class="text-center" cols="12">
                  <v-alert class="no-results-alert" type="info" variant="tonal">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-information"></v-icon>
                    </template>
                    未找到相关结果，请尝试其他关键词
                  </v-alert>
                </v-col>
              </v-row>

              <!-- 分页 -->
              <v-row v-if="searchResults.length > 0" class="mt-4">
                <v-col>
                  <div class="text-center">
                    <v-pagination
                      v-model="currentPage"
                      :length="totalPages"
                      :total-visible="7"
                      rounded="circle"
                      @update:model-value="handlePageChange"
                    ></v-pagination>
                  </div>
                </v-col>
              </v-row>
            </template>
          </v-fade-transition>
        </div>
      </v-fade-transition>
    </template>
  </div>

  <!-- 错误提示 -->
  <v-snackbar v-model="showError" :timeout="3000" color="error">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showError = false">
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import {getS3staticurl} from '@/services/projectService';
import {
  loadSearchHistory,
  addToSearchHistory,
  performSearch,
  generateUrlMap,
  updateUrlMap
} from '@/services/searchService';

export default {
  name: 'SearchComponent',

  props: {
    mode: {
      type: String,
      default: 'page',
      validator: (value) => ['page', 'dialog'].includes(value)
    }
  },

  emits: ['search-submitted'],

  data() {
    return {
      searchQuery: '',
      searchResults: [],
      searchHistory: [],
      isLoading: false,
      showError: false,
      errorMessage: '',
      hasSearched: false,
      currentPage: 1,
      totalHits: 0,
      totalPages: 0,
      urlMap: {},
      getS3staticurl: getS3staticurl,
      hotSearches: ['Scratch', '游戏', '动画', '音乐', '艺术', '编程'],
    };
  },

  watch: {
    '$route.query.q': {
      immediate: true,
      handler(newQuery) {
        if (this.mode === 'page' && newQuery !== undefined) {
          this.searchQuery = newQuery || '';
          if (newQuery) {
            this.performSearch();
          } else {
            this.searchResults = [];
            this.totalHits = 0;
            this.hasSearched = false;
          }
        }
      }
    }
  },

  async created() {
    this.searchHistory = loadSearchHistory();
  },

  methods: {
    handleError(error) {
      console.error('Search error:', error);
      this.showError = true;
      this.errorMessage = error.message || '发生未知错误';
    },

    async performSearch() {
      try {
        this.isLoading = true;
        this.hasSearched = true;

        const data = await performSearch(this.searchQuery, this.currentPage);
        this.searchResults = data.hits || [];
        this.totalHits = data.estimatedTotalHits || 0;
        this.totalPages = Math.ceil(this.totalHits / 20);

        if (this.searchResults.length > 0) {
          this.urlMap = generateUrlMap(this.searchResults);
          this.urlMap = await updateUrlMap(this.searchResults, this.urlMap);
        }
      } catch (error) {
        this.handleError(error);
        this.searchResults = [];
        this.totalHits = 0;
      } finally {
        this.isLoading = false;
      }
    },

    async handleSearch() {
      const trimmedQuery = this.searchQuery.trim();
      if (!trimmedQuery) return;

      if (this.mode === 'dialog') {
        this.$emit('search-submitted');
        this.$router.push({
          path: '/app/search',
          query: {q: trimmedQuery}
        });
        return;
      }

      if (this.$route.query.q !== trimmedQuery) {
        this.$router.replace({
          query: {...this.$route.query, q: trimmedQuery}
        });
      }

      this.searchHistory = addToSearchHistory(trimmedQuery, this.searchHistory);
    },

    async handlePageChange(page) {
      if (!page || page < 1) return;
      try {
        this.currentPage = page;
        await this.performSearch();
      } catch (error) {
        this.handleError(error);
      }
    },

    handleHistoryClick(term) {
      if (!term) return;
      this.searchQuery = term;
      this.handleSearch();
    }
  }
};
</script>

<style>
.highlight {
  background-color: rgba(var(--v-theme-primary), 0.8);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: bold;
  color: white;
}
</style>

<style scoped>
.v-card-item {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
}

.search-component {

  display: flex;
  flex-direction: column;
}

.search-box-container {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 16px;
  border-radius: 8px 8px 0 0;
  transition: box-shadow 0.3s ease;
}

.search-box-container:not(:only-child) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.suggestions-card {
  animation: slideDown 0.3s ease;
}

.history-chip,
.hot-chip {
  transition: all 0.3s ease;
}

.history-chip:hover,
.hot-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.result-card:hover {
  transform: translateY(-4px);
}

.type-chip,
.license-chip {
  transition: all 0.3s ease;
  opacity: 0.9;
}

.result-card:hover .type-chip,
.result-card:hover .license-chip {
  opacity: 1;
  transform: scale(1.05);
}

.search-results {
  padding-top: 0 !important;
  animation: fadeIn 0.3s ease;
}

.welcome-alert {
  animation: fadeIn 0.3s ease;
  background: rgba(var(--v-theme-primary), 0.05);
}

.no-results-alert {
  animation: slideUp 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.search-button {
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.gap-2 {
  gap: 8px;
}

.loading-card {
  background: linear-gradient(
    110deg,
    var(--v-theme-surface) 8%,
    var(--v-theme-surface-variant) 18%,
    var(--v-theme-surface) 33%
  );
  background-size: 200% 100%;
  animation: shine 1.5s linear infinite;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.loading-image {
  opacity: 0.7;
  background: linear-gradient(
    110deg,
    var(--v-theme-surface-variant) 8%,
    var(--v-theme-surface) 18%,
    var(--v-theme-surface-variant) 33%
  );
  background-size: 200% 100%;
  animation: shine 2s linear infinite;
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
