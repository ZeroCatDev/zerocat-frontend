<template>
  <v-container>
    <ais-instant-search :search-client="searchClient" :index-name="VITE_APP_MEILISEARCH_INDEX">
      <!-- 搜索框部分 -->
      <ais-search-box>
        <template v-slot="{ isSearchStalled, refine, currentRefinement }">
          <v-form @submit.prevent="handleSearch">
            <v-text-field
              v-model="searchQuery"
              clearable
              label="键入以搜索"
              variant="solo-filled"
              :loading="isSearchStalled"
              hide-details
              @input="handleInput"
              @keyup.enter="handleSearch"
              class="mb-2"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-magnify"></v-icon>
              </template>
              <template v-slot:append>
                <v-fade-transition leave-absolute>
                  <v-progress-circular
                    v-if="isSearchStalled"
                    size="24"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-form>

          <!-- 搜索历史和热门搜索 -->
          <v-expand-transition>
            <v-card
              v-if="showSuggestions && !currentRefinement"
              flat
              class="mb-3"
            >
              <v-card-text>
                <div v-if="searchHistory.length > 0">
                  <div class="text-subtitle-2 mb-2">搜索历史</div>
                  <v-chip-group>
                    <v-chip
                      v-for="(term, index) in searchHistory"
                      :key="index"
                      size="small"
                      @click="handleHistoryClick(term)"
                    >
                      {{ term }}
                    </v-chip>
                  </v-chip-group>
                </div>
                <v-divider
                  v-if="searchHistory.length > 0"
                  class="my-3"
                ></v-divider>
                <div>
                  <div class="text-subtitle-2 mb-2">热门搜索</div>
                  <v-chip-group>
                    <v-chip
                      v-for="(term, index) in hotSearches"
                      :key="index"
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
        </template>
      </ais-search-box>

      <!-- 搜索结果 -->
      <ais-hits>
        <template v-slot="{ items }">
          <v-fade-transition group>
            <v-row>
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
                    class="transition-swing"
                  >
                    <v-img
                      :src="VITE_APP_S3_BUCKET + '/scratch_slt/' + item.id"
                      class="align-end"
                      lazy-src="../../assets/43-lazyload.png"
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
                        >
                          {{ item.type }}
                        </v-chip>
                        <v-chip
                          v-if="item.license!='no'"
                          size="small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ item.license }}
                        </v-chip>
                        <v-card-title class="text-white">{{
                          item.title
                        }}</v-card-title>
                        <v-card-subtitle class="text-white">{{
                          item.description
                        }}</v-card-subtitle>

                      </v-card-item>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-fade-transition>
        </template>
      </ais-hits>

      <!-- 分页 -->
      <v-row class="mt-4">
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

      <!-- 无搜索结果提示 -->
      <ais-stats>
        <template v-slot="{ nbHits }">
          <v-fade-transition>
            <v-alert
              v-if="nbHits === 0"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-information"></v-icon>
              </template>
              未找到相关结果，请尝试其他关键词
            </v-alert>
          </v-fade-transition>
        </template>
      </ais-stats>
    </ais-instant-search>

    <!-- 错误提示 -->
    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showError = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useHead } from "@unhead/vue";
import { ref } from "vue";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 10;

export default {
  setup() {
    useHead({
      title: "搜索 - ZeroCat",
    });
  },

  data() {
    return {
      searchClient: instantMeiliSearch(
        import.meta.env.VITE_APP_MEILISEARCH_URL,
        import.meta.env.VITE_APP_MEILISEARCH_API_KEY
      ).searchClient,
      VITE_APP_MEILISEARCH_INDEX: import.meta.env.VITE_APP_MEILISEARCH_INDEX,
      VITE_APP_S3_BUCKET: import.meta.env.VITE_APP_S3_BUCKET,
      searchQuery: "",
      showSuggestions: true,
      searchHistory: [],
      showError: false,
      errorMessage: "",
      hotSearches: ["Scratch", "游戏", "动画", "音乐", "艺术", "编程"],
      searchDebounce: null,
    };
  },

  created() {
    this.loadSearchHistory();
  },

  methods: {
    handleInput(event) {
      if (this.searchDebounce) {
        clearTimeout(this.searchDebounce);
      }

      this.searchDebounce = setTimeout(() => {
        const value = event.target.value;
        this.showSuggestions = !value;
        if (value) {
          this.refine(value);
        }
      }, 300);
    },

    handleSearch() {
      if (this.searchQuery.trim()) {
        this.addToSearchHistory(this.searchQuery.trim());
        this.showSuggestions = false;
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
</style>
