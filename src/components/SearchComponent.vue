<template>
  <div class="search-component">
    <v-form @submit.prevent="handleSearch">
      <div class="search-input-row">
        <v-text-field
          v-model="searchQuery"
          :loading="isLoading"
          class="search-input"
          clearable
          hide-details
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @keyup.enter="handleSearch"
        />
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

    <v-card v-if="!searchQuery.trim()" class="suggestions-card mt-3" flat>
      <v-card-text>
        <div v-if="searchHistory.length">
          <div class="text-subtitle-2 mb-2">搜索历史</div>
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="(term, index) in searchHistory"
              :key="`${term}-${index}`"
              size="small"
              @click="handleHistoryClick(term)"
            >
              {{ term }}
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <template v-if="mode === 'page' && hasSearched">
      <div class="mt-4">
        <v-tabs
          v-model="activeScope"
          color="primary"
          density="comfortable"
          @update:model-value="handleScopeChange"
        >
          <v-tab v-for="scopeItem in scopeOptions" :key="scopeItem.value" :value="scopeItem.value">
            {{ scopeItem.label }}

          </v-tab>
        </v-tabs>

        <v-card class="mt-3" variant="tonal">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.perPage"
                  :items="[8, 16, 32, 64, 100]"
                  hide-details
                  label="每页"
                  variant="outlined"
                />
              </v-col>

              <template v-if="activeScope === 'projects'">
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filters.orderBy"
                    :items="projectOrderOptions"
                    clearable
                    hide-details
                    item-title="label"
                    item-value="value"
                    label="排序"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="filters.state"
                    :items="projectStateOptions"
                    clearable
                    hide-details
                    item-title="label"
                    item-value="value"
                    label="状态"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field v-model="filters.type" clearable hide-details label="项目类型" variant="outlined" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="userIdInput" clearable hide-details label="用户ID(逗号分隔)" variant="outlined" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="tagsInput" clearable hide-details label="标签(逗号分隔)" variant="outlined" />
                </v-col>
              </template>

              <template v-else-if="activeScope === 'users'">
                <v-col cols="12" md="4">
                  <v-text-field v-model="filters.userStatus" clearable hide-details label="用户状态" variant="outlined" />
                </v-col>
              </template>

              <template v-else-if="activeScope === 'posts'">
                <v-col cols="12" md="4">
                  <v-text-field v-model="filters.postType" clearable hide-details label="帖子类型" variant="outlined" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="userIdInput" clearable hide-details label="用户ID(逗号分隔)" variant="outlined" />
                </v-col>
              </template>

              <template v-else-if="activeScope === 'lists'">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="filters.state"
                    :items="projectStateOptions"
                    clearable
                    hide-details
                    item-title="label"
                    item-value="value"
                    label="状态"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="userIdInput" clearable hide-details label="用户ID(逗号分隔)" variant="outlined" />
                </v-col>
              </template>

              <template v-else-if="activeScope === 'project_files'">
                <v-col cols="12" md="6">
                  <v-text-field v-model="userIdInput" clearable hide-details label="用户ID(逗号分隔)" variant="outlined" />
                </v-col>
              </template>
            </v-row>

            <div class="mt-3 d-flex justify-end ga-2">
              <v-btn variant="text" @click="resetFilters">重置筛选</v-btn>
              <v-btn color="primary" @click="applyFilters">应用筛选</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-progress-linear v-if="isLoading" class="mt-4" color="primary" indeterminate />

        <div v-if="!isLoading" class="mt-4">
          <template v-if="activeScope === 'projects'">
            <v-row v-if="results.projects.length">
              <v-col
                v-for="project in results.projects"
                :key="`project-${project.id}`"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <ProjectCard :project="project" :author="project.author" :show-author="true" />
              </v-col>
            </v-row>
            <v-alert v-else type="info" variant="tonal">未找到项目结果</v-alert>
          </template>

          <template v-else-if="activeScope === 'posts'">
            <PostList
              :items="results.posts"
              :includes="{ posts: {} }"
              :loading="false"
              :loading-more="false"
              :has-more="false"
              empty-title="暂无帖子"
              empty-text="未找到匹配帖子"
              :infinite-scroll="false"
              @deleted="onPostDeleted"
            />
          </template>

          <template v-else-if="activeScope === 'users'">
            <v-row v-if="results.users.length">
              <v-col
                v-for="user in results.users"
                :key="`user-${user.id || user.username}`"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="user-result-card" :to="`/${user.username || user.name}`" variant="outlined">
                  <v-card-item>
                    <template #prepend>
                      <v-avatar size="56">
                        <v-img :src="getUserAvatar(user.avatar)" :alt="user.display_name || user.username" />
                      </v-avatar>
                    </template>
                    <v-card-title>{{ user.display_name || user.username || `用户 #${user.id}` }}</v-card-title>
                    <v-card-subtitle>@{{ user.username || user.name || user.id }}</v-card-subtitle>
                  </v-card-item>
                  <v-card-text>
                    <div class="text-body-2 text-medium-emphasis mb-3">{{ user.bio || user.description || '这个用户还没有简介。' }}</div>
                    <div class="d-flex ga-4 text-caption">
                      <span>关注 {{ user.following_count || 0 }}</span>
                      <span>粉丝 {{ user.followers_count || 0 }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-alert v-else type="info" variant="tonal">未找到用户结果</v-alert>
          </template>

          <template v-else-if="activeScope === 'lists'">
            <v-list v-if="results.lists.length" lines="two">
              <v-list-item
                v-for="list in results.lists"
                :key="`list-${list.id}`"
                :to="`/app/projectlist/${list.id}`"
              >
                <v-list-item-title>{{ list.title || list.name || `列表 #${list.id}` }}</v-list-item-title>
                <v-list-item-subtitle>{{ list.description || '暂无描述' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info" variant="tonal">未找到列表结果</v-alert>
          </template>

          <template v-else-if="activeScope === 'project_files'">
            <v-list v-if="results.projectFiles.length" lines="two">
              <v-list-item
                v-for="file in results.projectFiles"
                :key="`file-${file.id || file.sha256 || file.path}`"
                :href="file.url || file.downloadUrl"
                :target="file.url || file.downloadUrl ? '_blank' : undefined"
              >
                <v-list-item-title>{{ file.filename || file.path || file.name || '项目文件' }}</v-list-item-title>
                <v-list-item-subtitle>{{ file.projectTitle || file.projectName || file.sha256 || '' }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-alert v-else type="info" variant="tonal">未找到项目文件结果</v-alert>
          </template>

          <template v-else-if="activeScope === 'tags'">
            <div v-if="results.tags.length" class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="tag in results.tags"
                :key="`tag-${tag.name}`"
                color="primary"
                variant="tonal"
                @click="searchByTag(tag.name)"
              >
                #{{ tag.name }} ({{ tag.count || 0 }})
              </v-chip>
            </div>
            <v-alert v-else type="info" variant="tonal">未找到标签结果</v-alert>
          </template>

          <div v-if="totalPages > 1" class="mt-4 d-flex justify-center">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="7"
              rounded="circle"
              @update:model-value="handlePageChange"
            />
          </div>
        </div>
      </div>
    </template>
  </div>

  <v-snackbar v-model="showError" :timeout="3000" color="error">
    {{ errorMessage }}
    <template #actions>
      <v-btn color="white" variant="text" @click="showError = false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { localuser } from '@/services/localAccount';
import ProjectCard from '@/components/project/ProjectCard.vue';
import PostList from '@/components/posts/PostList.vue';
import { SEARCH_SCOPES, addToSearchHistory, loadSearchHistory, normalizeSearchQuery, performSearch } from '@/services/searchService';

const SCOPE_LABELS = {
  projects: '项目',
  users: '用户',
  posts: '帖子',
  project_files: '文件',
  lists: '列表',
  tags: '标签'
};

export default {
  name: 'SearchComponent',
  components: {
    ProjectCard,
    PostList
  },
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
      activeScope: 'projects',
      currentPage: 1,
      isLoading: false,
      hasSearched: false,
      showError: false,
      errorMessage: '',
      totalCount: 0,
      searchHistory: [],
      scopeTotals: {
        projects: 0,
        users: 0,
        posts: 0,
        project_files: 0,
        lists: 0,
        tags: 0
      },
      filters: {
        perPage: 16,
        orderBy: '',
        state: '',
        type: '',
        postType: '',
        userStatus: ''
      },
      userIdInput: '',
      tagsInput: '',
      results: {
        projects: [],
        users: [],
        posts: [],
        projectFiles: [],
        lists: [],
        tags: []
      }
    };
  },
  computed: {
    scopeOptions() {
      return SEARCH_SCOPES.map((scope) => ({ value: scope, label: SCOPE_LABELS[scope] }));
    },
    totalPages() {
      const perPage = Number(this.filters.perPage || 10);
      return Math.max(1, Math.ceil((this.totalCount || 0) / perPage));
    },
    projectOrderOptions() {
      return [
        { label: '观看量升序', value: 'view_up' },
        { label: '观看量降序', value: 'view_down' },
        { label: '时间升序', value: 'time_up' },
        { label: '时间降序', value: 'time_down' },
        { label: 'ID 升序', value: 'id_up' },
        { label: 'ID 降序', value: 'id_down' },
        { label: '收藏升序', value: 'star_up' },
        { label: '收藏降序', value: 'star_down' }
      ];
    },
    projectStateOptions() {
      return [
        { label: '公开', value: 'public' },
        { label: '私有', value: 'private' },
        { label: '草稿', value: 'draft' }
      ];
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(query) {
        if (this.mode !== 'page') return;
        const normalized = normalizeSearchQuery(query || {});
        this.applyQueryState(normalized);
        const hasKeywordParam = Object.prototype.hasOwnProperty.call(query || {}, 'keyword')
          || Object.prototype.hasOwnProperty.call(query || {}, 'q');
        if (normalized.keyword || hasKeywordParam) {
          this.performSearch();
        } else {
          this.hasSearched = false;
        }
      }
    }
  },
  created() {
    this.searchHistory = loadSearchHistory();
  },
  methods: {
    parseCommaList(input) {
      return String(input || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    },
    applyQueryState(normalized) {
      this.searchQuery = normalized.keyword || '';
      this.activeScope = normalized.scope || 'projects';
      this.currentPage = Number(normalized.page || 1);
      this.filters.perPage = Number(normalized.perPage || 10);
      this.filters.orderBy = normalized.orderBy || '';
      this.filters.state = normalized.state || '';
      this.filters.type = normalized.type || '';
      this.filters.postType = normalized.postType || '';
      this.filters.userStatus = normalized.userStatus || '';
      this.userIdInput = Array.isArray(normalized.userId) ? normalized.userId.join(',') : '';
      this.tagsInput = Array.isArray(normalized.tags) ? normalized.tags.join(',') : '';
    },
    buildPayload() {
      return {
        keyword: this.searchQuery.trim(),
        scope: this.activeScope,
        page: this.currentPage,
        perPage: this.filters.perPage,
        orderBy: this.filters.orderBy,
        state: this.filters.state,
        type: this.filters.type,
        postType: this.filters.postType,
        userStatus: this.filters.userStatus,
        userId: this.parseCommaList(this.userIdInput),
        tags: this.parseCommaList(this.tagsInput)
      };
    },
    buildRouteQuery(payload) {
      const query = {
        keyword: payload.keyword,
        scope: payload.scope,
        page: String(payload.page),
        perPage: String(payload.perPage)
      };
      if (payload.orderBy) query.orderBy = payload.orderBy;
      if (payload.state) query.state = payload.state;
      if (payload.type) query.type = payload.type;
      if (payload.postType) query.postType = payload.postType;
      if (payload.userStatus) query.userStatus = payload.userStatus;
      if (payload.userId.length) query.userId = payload.userId;
      if (payload.tags.length) query.tags = payload.tags;
      return query;
    },
    async performSearch() {
      const payload = this.buildPayload();

      this.isLoading = true;
      this.hasSearched = true;
      try {
        const data = await performSearch(payload);
        this.totalCount = Number(data.totalCount || 0);
        this.results.projects = data.projects || [];
        this.results.users = data.users || [];
        this.results.posts = data.posts || [];
        this.results.projectFiles = data.projectFiles || [];
        this.results.lists = data.lists || [];
        this.results.tags = data.tags || [];
        this.scopeTotals = {
          projects: Number(data.totals?.projects || 0),
          users: Number(data.totals?.users || 0),
          posts: Number(data.totals?.posts || 0),
          project_files: Number(data.totals?.projectFiles || 0),
          lists: Number(data.totals?.lists || 0),
          tags: Number(data.totals?.tags || 0)
        };
      } catch (error) {
        this.errorMessage = error?.message || '搜索失败';
        this.showError = true;
      } finally {
        this.isLoading = false;
      }
    },
    async handleSearch() {
      const keyword = this.searchQuery.trim();
      this.currentPage = 1;
      if (keyword) {
        this.searchHistory = addToSearchHistory(keyword, this.searchHistory);
      }
      const payload = this.buildPayload();
      payload.page = 1;

      if (this.mode === 'dialog') {
        this.$emit('search-submitted');
        await this.$router.push({ path: '/app/search', query: this.buildRouteQuery(payload) });
        return;
      }

      await this.$router.replace({ path: this.$route.path, query: this.buildRouteQuery(payload) });
    },
    async handleScopeChange(scope) {
      this.activeScope = scope;
      this.currentPage = 1;
      if (this.mode !== 'page' || (!this.searchQuery.trim() && !this.hasSearched)) return;
      const payload = this.buildPayload();
      payload.scope = scope;
      payload.page = 1;
      await this.$router.replace({ path: this.$route.path, query: this.buildRouteQuery(payload) });
    },
    async handlePageChange(page) {
      this.currentPage = Number(page || 1);
      if (this.mode !== 'page' || (!this.searchQuery.trim() && !this.hasSearched)) return;
      const payload = this.buildPayload();
      payload.page = this.currentPage;
      await this.$router.replace({ path: this.$route.path, query: this.buildRouteQuery(payload) });
    },
    async applyFilters() {
      this.currentPage = 1;
      if (this.mode !== 'page' || (!this.searchQuery.trim() && !this.hasSearched)) return;
      const payload = this.buildPayload();
      payload.page = 1;
      await this.$router.replace({ path: this.$route.path, query: this.buildRouteQuery(payload) });
    },
    async resetFilters() {
      this.filters.orderBy = '';
      this.filters.state = '';
      this.filters.type = '';
      this.filters.postType = '';
      this.filters.userStatus = '';
      this.filters.perPage = 16;
      this.userIdInput = '';
      this.tagsInput = '';
      await this.applyFilters();
    },
    handleHistoryClick(term) {
      this.searchQuery = term;
      this.handleSearch();
    },
    searchByTag(tagName) {
      this.tagsInput = tagName;
      if (this.activeScope !== 'projects') {
        this.activeScope = 'projects';
      }
      this.applyFilters();
    },
    getUserAvatar(avatar) {
      if (!avatar) return '/default-avatar.png';
      return localuser.getUserAvatar(avatar);
    },
    onPostDeleted(postId) {
      this.results.posts = this.results.posts.filter((post) => (post?.id ?? post?.postId) !== postId);
    }
  }
};
</script>

<style scoped>
.search-component {
  display: flex;
  flex-direction: column;
}

.search-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  flex: 1;
}

.search-button {
  flex-shrink: 0;
}

.suggestions-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px;
}

.user-result-card {
  height: 100%;
}
</style>
