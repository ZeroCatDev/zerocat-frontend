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

    <!-- 搜索结果 -->
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
                    :to="urlMap.value[item.id]"
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
import { ref } from "vue";
export default {
  name: "SearchComponent",

  data() {
    return {
      searchQuery: "",
      searchResults: [],
      searchHistory: [],
      isLoading: false,
      showError: false,
      errorMessage: "",
      hasSearched: false,
      currentPage: 1,
      totalHits: 0,
      hotSearches: ["Scratch", "游戏", "动画", "音乐", "艺术", "编程"],
      s3BucketUrl: import.meta.env.VITE_APP_S3_BUCKET,
      debounceTimeout: null,
      urlMap: ref({}),
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalHits / ITEMS_PER_PAGE);
    },

    searchParams() {
      return {
        q: this.searchQuery.trim(),
        offset: (this.currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        attributesToHighlight: ["title", "description"],
        highlightPreTag: '<mark class="highlight">',
        highlightPostTag: "</mark>",
      };
    },

    meilisearchConfig() {
      return {
        baseUrl: import.meta.env.VITE_APP_MEILISEARCH_URL,
        apiKey: import.meta.env.VITE_APP_MEILISEARCH_API_KEY,
        indexName: import.meta.env.VITE_APP_MEILISEARCH_INDEX,
      };
    },
  },

  created() {
    this.loadSearchHistory();
  },

  methods: {
    async handleSearch() {
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      const trimmedQuery = this.searchQuery.trim();
      if (!trimmedQuery) return;

      this.debounceTimeout = setTimeout(async () => {
        try {
          this.isLoading = true;
          this.hasSearched = true;
          this.currentPage = 1;
          await this.performSearch();
          this.addToSearchHistory(trimmedQuery);
        } catch (error) {
          this.handleError(error);
        } finally {
          this.isLoading = false;
        }
      }, 300);
    },

    async performSearch() {
      const { baseUrl, apiKey, indexName } = this.meilisearchConfig;
      const response = await fetch(`${baseUrl}/indexes/${indexName}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(this.searchParams),
      });

      if (!response.ok) {
        throw new Error("搜索请求失败");
      }

      const data = await response.json();
      this.searchResults = data.hits;
      this.totalHits = data.estimatedTotalHits;

      // Initialize urlMap with default values immediately
      this.initializeUrlMap();

      // Update URLs in the background
      this.updateUrlMapAsync();
    },

    initializeUrlMap() {
      // Reset and initialize urlMap with default values for all search results
      this.urlMap.value = {};
      this.searchResults.forEach((result) => {
        this.urlMap.value[result.id] = `/app/link/project/?id=${result.id}`;
      });
    },

    async updateUrlMapAsync() {
      try {
        // Get all project IDs
        const projectIds = this.searchResults.map((result) => result.id);

        // Batch fetch project info
        getProjectInfo(projectIds)
          .then((projectInfos) => {
            // Update urlMap with fetched info
            projectInfos.forEach((info) => {
              if (info && info.author?.username) {
                this.urlMap.value[info.id] = `/${info.author.username}/${info.name}`;
              }
            });
          })
          .catch((error) => {
            console.error("Error updating URLs in background:", error);
            // Keep default URLs in case of error
          });
      } catch (error) {
        console.error("Error in background URL update:", error);
        // Keep default URLs in case of error
      }
    },

    async handlePageChange(page) {
      try {
        this.isLoading = true;
        this.currentPage = page;
        await this.performSearch();
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },

    handleHistoryClick(term) {
      this.searchQuery = term;
      this.handleSearch();
    },

    loadSearchHistory() {
      try {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);
        this.searchHistory = history ? JSON.parse(history) : [];
      } catch (error) {
        this.handleError(new Error("加载搜索历史失败"));
      }
    },

    addToSearchHistory(term) {
      try {
        const index = this.searchHistory.indexOf(term);
        if (index > -1) {
          this.searchHistory.splice(index, 1);
        }
        this.searchHistory.unshift(term);
        if (this.searchHistory.length > MAX_HISTORY_ITEMS) {
          this.searchHistory.pop();
        }
        localStorage.setItem(
          SEARCH_HISTORY_KEY,
          JSON.stringify(this.searchHistory)
        );
      } catch (error) {
        this.handleError(new Error("保存搜索历史失败"));
      }
    },

    handleError(error) {
      console.error("Search error:", error);
      this.showError = true;
      this.errorMessage = error.message || "发生未知错误";
    },
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
