<template>
  <div class="search-component">
    <v-form @submit.prevent="handleSearch"
      ><div class="d-flex align-center gap-2">
        <v-text-field
          v-model="searchQuery"
          clearable
          label="键入以搜索"
          variant="outlined"
          hide-details
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template v-slot:prepend-inner>
            <v-icon icon="mdi-magnify"></v-icon>
          </template>
        </v-text-field>
        <v-btn
          color="primary"
          :loading="status === 'stalled'"
          @click="handleSearch"
          class="search-button"
          height="56"
          min-width="56"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </div></v-form
    >

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
    <v-fade-transition>
      <ais-instant-search
        :search-client="searchClient"
        :index-name="VITE_APP_MEILISEARCH_INDEX"
        class="search-results mt-4"
      >
        <!-- 搜索结果部分 -->

        <ais-state-results class="mb-4">
          <template v-slot="{ status }">
            <v-progress-linear
              v-show="status === 'stalled'"
              indeterminate
              color="primary"
              class="mt-4"
            ></v-progress-linear>
          </template>
        </ais-state-results>
        <ais-configure :query="currentSearchTerm" />
        <ais-hits>
          <template v-slot="{ items, isSearchStalled }">
            <v-fade-transition group>
              <template v-if="isSearchStalled"></template>
              <!-- 搜索结果 -->
              <template v-else>
                <v-row v-if="items.length > 0">
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="4"
                    lg="3"
                    xl="2"
                    xxl="2"
                    v-for="item in items"
                    :key="item.objectID"
                  >
                    <v-hover v-slot="{ isHovering, props }">
                      <v-card
                        v-bind="props"
                        :to="`/app/link/project/?id=${item.id}`"
                        :elevation="isHovering ? 8 : 2"
                        style="aspect-ratio: 4/3"
                        rounded="lg"
                        class="result-card"
                      >
                        <v-img
                          :src="VITE_APP_S3_BUCKET + '/scratch_slt/' + item.id"
                          class="align-end"
                          lazy-src="../assets/43-lazyload.png"
                          height="100%"
                          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                          cover
                        >
                          <template v-slot:placeholder>
                            <v-row
                              class="fill-height ma-0"
                              align="center"
                              justify="center"
                            >
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              ></v-progress-circular>
                            </v-row>
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
                              v-if="item.license != 'no'"
                              size="small"
                              color="primary"
                              variant="tonal"
                              class="license-chip"
                            >
                              {{ item.license }}
                            </v-chip>
                            <v-card-title class="text-white">
                              <ais-highlight :hit="item" attribute="title">
                                <template v-slot="{ value }">
                                  <span v-html="value"></span>
                                </template>
                              </ais-highlight>
                            </v-card-title>
                            <v-card-subtitle class="text-white">
                              <ais-highlight :hit="item" attribute="description">
                                <template v-slot="{ value }">
                                  <span v-html="value"></span>
                                </template>
                              </ais-highlight>
                            </v-card-subtitle>
                          </v-card-item>
                        </v-img>
                      </v-card>
                    </v-hover>
                  </v-col>
                </v-row>
                <v-row v-else class="mt-4" justify="center">
                  <v-col cols="12" class="text-center">
                    <v-alert
                      type="info"
                      variant="tonal"
                      class="no-results-alert"
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi-information"></v-icon>
                      </template>
                      未找到相关结果，请尝试其他关键词
                    </v-alert>
                  </v-col>
                </v-row>
                <!-- 分页 -->
                <v-row class="mt-4" v-if="items && items.length > 0">
                  <v-col>
                    <ais-pagination>
                      <template v-slot="{ currentRefinement, nbPages, refine }">
                        <div class="text-center">
                          <v-pagination
                            :length="nbPages"
                            :total-visible="7"
                            rounded="circle"
                            :model-value="currentRefinement"
                            @update:model-value="refine($event)"
                          ></v-pagination>
                        </div>
                      </template>
                    </ais-pagination>
                  </v-col>
                </v-row>
              </template>
            </v-fade-transition>
          </template>
        </ais-hits>
      </ais-instant-search>
    </v-fade-transition>
  </div>

  <!-- 错误提示 -->
  <v-snackbar v-model="showError" color="error" timeout="3000">
    {{ errorMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showError = false">
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import {
  AisInstantSearch,
  AisHits,
  AisHighlight,
  AisConfigure,
  AisStateResults,
  AisPagination,
} from "vue-instantsearch/vue3/es";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 10;
const MIN_LOADING_TIME = 500; // 最小加载时间，确保动画流畅

export default {
  name: "SearchComponent",
  components: {
    AisInstantSearch,
    AisHits,
    AisHighlight,
    AisConfigure,
    AisStateResults,
    AisPagination,
  },

  data() {
    return {
      searchClient: instantMeiliSearch(
        import.meta.env.VITE_APP_MEILISEARCH_URL,
        import.meta.env.VITE_APP_MEILISEARCH_API_KEY,
        {
          primaryKey: "id",
          keepZeroFacets: true,
          finitePagination: true,
        }
      ).searchClient,
      VITE_APP_MEILISEARCH_INDEX: import.meta.env.VITE_APP_MEILISEARCH_INDEX,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
      searchQuery: "",
      currentSearchTerm: "",
      searchHistory: [],
      showError: false,
      errorMessage: "",
      hotSearches: ["Scratch", "游戏", "动画", "音乐", "艺术", "编程"],
    };
  },

  computed: {
    hasSearchQuery() {
      return this.currentSearchTerm.trim().length > 0;
    },
  },

  created() {
    this.loadSearchHistory();
  },

  methods: {
    handleSearch() {
      const trimmedQuery = this.searchQuery.trim();
      if (trimmedQuery) {
        this.currentSearchTerm = trimmedQuery;
        this.addToSearchHistory(trimmedQuery);
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
        console.error("Failed to load search history:", error);
        this.showError = true;
        this.errorMessage = "加载搜索历史失败";
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
        console.error("Failed to save search history:", error);
        this.showError = true;
        this.errorMessage = "保存搜索历史失败";
      }
    },
  },
};
</script>

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

/* 高亮样式 */
:deep(.ais-Highlight-highlighted) {
  background-color: rgba(var(--v-theme-primary), 0.8);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: bold;
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
