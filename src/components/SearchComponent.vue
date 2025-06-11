<template>
  <div class="search-component">

    <v-form @submit.prevent="handleSearch">
      <div class="d-flex align-center gap-2">
        <v-text-field
          v-model="searchQuery"
          clearable
          label="键入以搜索"
          variant="outlined"
          hide-details
          class="search-input"
          @keyup.enter="handleSearch"
          :loading="isLoading"
        >
          <template v-slot:prepend-inner>
            <v-icon icon="mdi-magnify"></v-icon>
          </template>
        </v-text-field>
        <v-btn
          color="primary"
          :loading="isLoading"
          @click="handleSearch"
          class="search-button"
          height="56"
          min-width="56"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div>
    </v-form>

    <!-- 搜索历史和热门搜索 -->
    <v-expand-transition style="padding-top: 16px !important">
      <v-card v-if="!searchQuery" flat class="suggestions-card">
        <v-card-text>
          <div v-if="searchHistory.length > 0">
            <div class="text-subtitle-2">搜索历史</div>
            <v-chip-group>
              <v-chip
                v-for="(term, index) in searchHistory"
                :key="index"
                size="small"
                @click="handleHistoryClick(term)"
                class="history-chip"
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
                size="small"
                @click="handleHistoryClick(term)"
                class="hot-chip"
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
            indeterminate
            color="primary"
            class="mt-4"
          ></v-progress-linear>

          <!-- 搜索结果展示 -->
          <v-fade-transition group>
            <template v-if="!isLoading">
              <v-row v-if="searchResults.length > 0">
                <v-col
                  cols="12"
                  xs="12"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                  xxl="2"
                  v-for="item in searchResults"
                  :key="item.id"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :to="urlMap[item.id]"
                      :elevation="isHovering ? 8 : 2"
                      style="aspect-ratio: 4/3"
                      rounded="lg"
                      class="result-card"
                    >
                      <v-img
                        :src="s3BucketUrl + '/scratch_slt/' + item.id"
                        class="align-end"
                        lazy-src="../assets/43-lazyload.png"
                        error-src="../assets/43-lazyload.png"
                        height="100%"
                        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                        cover
                      >
                        <template v-slot:placeholder>
                          <v-progress-linear
                            indeterminate
                            color="primary"
                          ></v-progress-linear>
                        </template>
                        <v-card-item>
                          <v-chip
                            size="small"
                            color="primary"
                            variant="tonal"
                            class="type-chip"
                          >
                            {{ item.type }}
                          </v-chip>
                          <v-chip
                            v-if="item.license !== 'no'"
                            size="small"
                            color="primary"
                            variant="tonal"
                            class="license-chip"
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
                <v-col cols="12" class="text-center">
                  <v-alert type="info" variant="tonal" class="no-results-alert">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-information"></v-icon>
                    </template>
                    未找到相关结果，请尝试其他关键词
                  </v-alert>
                </v-col>
              </v-row>

              <!-- 分页 -->
              <v-row class="mt-4" v-if="searchResults.length > 0">
                <v-col>
                  <div class="text-center">
                    <v-pagination
                      :length="totalPages"
                      :total-visible="7"
                      rounded="circle"
                      v-model="currentPage"
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
  <v-snackbar v-model="showError" color="error" :timeout="3000">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showError = false">
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 10;
const ITEMS_PER_PAGE = 20;
import { getProjectInfo } from "@/services/projectService";
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "SearchComponent",

  props: {
    mode: {
      type: String,
      default: 'page', // 'page' or 'dialog'
      validator: (value) => ['page', 'dialog'].includes(value)
    }
  },

  emits: ['search-submitted'],

  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const searchQuery = ref("");
    const searchResults = ref([]);
    const searchHistory = ref([]);
    const isLoading = ref(false);
    const showError = ref(false);
    const errorMessage = ref("");
    const hasSearched = ref(false);
    const currentPage = ref(1);
    const totalHits = ref(0);
    const urlMap = ref({});
    const hotSearches = ref(["Scratch", "游戏", "动画", "音乐", "艺术", "编程"]);
    const s3BucketUrl = ref(import.meta.env.VITE_APP_S3_BUCKET);

    const meilisearchConfig = computed(() => ({
      baseUrl: import.meta.env.VITE_APP_MEILISEARCH_URL,
      apiKey: import.meta.env.VITE_APP_MEILISEARCH_API_KEY,
      indexName: import.meta.env.VITE_APP_MEILISEARCH_INDEX,
    }));

    const searchParams = computed(() => ({
      q: searchQuery.value.trim(),
      offset: (currentPage.value - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      attributesToHighlight: ["title", "description"],
      highlightPreTag: '<mark class="highlight">',
      highlightPostTag: "</mark>",
    }));

    const totalPages = computed(() => {
      return Math.ceil(totalHits.value / ITEMS_PER_PAGE) || 0;
    });

    const handleError = (error) => {
      console.error("Search error:", error);
      showError.value = true;
      errorMessage.value = error.message || "发生未知错误";
    };

    const initializeUrlMap = () => {
      if (!searchResults.value) return;
      const newUrlMap = {};
      searchResults.value.forEach((result) => {
        if (result && result.id) {
          newUrlMap[result.id] = `/app/link/project/?id=${result.id}`;
        }
      });
      urlMap.value = newUrlMap;
    };

    const updateUrlMapAsync = async () => {
      try {
        if (!searchResults.value || !searchResults.value.length) return;

        const projectIds = searchResults.value
          .filter(result => result && result.id)
          .map(result => result.id);

        if (!projectIds.length) return;

        const newUrlMap = { ...urlMap.value };
        getProjectInfo(projectIds)
          .then((projectInfos) => {
            if (!projectInfos) return;
            projectInfos.forEach((info) => {
              if (info && info.author?.username) {
                newUrlMap[info.id] = `/${info.author.username}/${info.name}`;
              }
            });
            urlMap.value = newUrlMap;
          })
          .catch((error) => {
            console.error("Error updating URLs in background:", error);
          });
      } catch (error) {
        console.error("Error in background URL update:", error);
      }
    };

    const performSearch = async () => {
      try {
        isLoading.value = true;
        hasSearched.value = true;

        const { baseUrl, apiKey, indexName } = meilisearchConfig.value;
        const response = await fetch(`${baseUrl}/indexes/${indexName}/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(searchParams.value),
        });

        if (!response.ok) {
          throw new Error("搜索请求失败");
        }

        const data = await response.json();
        searchResults.value = data.hits || [];
        totalHits.value = data.estimatedTotalHits || 0;

        if (searchResults.value.length > 0) {
          initializeUrlMap();
          updateUrlMapAsync();
        }
      } catch (error) {
        handleError(error);
        searchResults.value = [];
        totalHits.value = 0;
      } finally {
        isLoading.value = false;
      }
    };

    const loadSearchHistory = () => {
      try {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);
        searchHistory.value = history ? JSON.parse(history) : [];
      } catch (error) {
        handleError(new Error("加载搜索历史失败"));
        searchHistory.value = [];
      }
    };

    const addToSearchHistory = (term) => {
      try {
        if (!searchHistory.value) searchHistory.value = [];
        const index = searchHistory.value.indexOf(term);
        if (index > -1) {
          searchHistory.value.splice(index, 1);
        }
        searchHistory.value.unshift(term);
        if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
          searchHistory.value.pop();
        }
        localStorage.setItem(
          SEARCH_HISTORY_KEY,
          JSON.stringify(searchHistory.value)
        );
      } catch (error) {
        handleError(new Error("保存搜索历史失败"));
      }
    };

    const handleSearch = async () => {
      const trimmedQuery = searchQuery.value.trim();
      if (!trimmedQuery) return;

      if (props.mode === 'dialog') {
        emit('search-submitted');
        router.push({
          path: '/app/search',
          query: { q: trimmedQuery }
        });
        return;
      }

      if (route.query.q !== trimmedQuery) {
        router.replace({
          query: { ...route.query, q: trimmedQuery }
        });
      }

      addToSearchHistory(trimmedQuery);
    };

    const handlePageChange = async (page) => {
      if (!page || page < 1) return;
      try {
        currentPage.value = page;
        await performSearch();
      } catch (error) {
        handleError(error);
      }
    };

    const handleHistoryClick = (term) => {
      if (!term) return;
      searchQuery.value = term;
      handleSearch();
    };

    // 监听路由参数变化
    watch(() => route.query.q, (newQuery) => {
      if (props.mode === 'page' && newQuery !== undefined) {
        searchQuery.value = newQuery || '';
        if (newQuery) {
          performSearch();
        } else {
          searchResults.value = [];
          totalHits.value = 0;
          hasSearched.value = false;
        }
      }
    }, { immediate: true });

    // 初始加载搜索历史
    loadSearchHistory();

    return {
      searchQuery,
      searchResults,
      searchHistory,
      isLoading,
      showError,
      errorMessage,
      hasSearched,
      currentPage,
      totalHits,
      urlMap,
      hotSearches,
      s3BucketUrl,
      totalPages,
      handleSearch,
      handlePageChange,
      handleHistoryClick,
      handleError,
    };
  },
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
  padding: 16px;
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
  padding-top: 0px !important;
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
