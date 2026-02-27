<template>
  <aside class="home-right-sidebar">
    <transition name="search-scrim">
      <div v-if="showSearchOverlay" class="search-scrim" @click="closeSearchOverlay" />
    </transition>

    <div ref="searchShellRef" class="search-shell">
      <v-form class="search-box" :class="{ 'search-box-active': showSearchOverlay }" @submit.prevent="goToSearch">
        <v-text-field
          v-model="searchText"
          class="search-input"
          density="compact"
          hide-details
          placeholder="搜索帖子"
          prepend-inner-icon="mdi-magnify"
          variant="plain"
          @focus="openSearchOverlay"
          @click="openSearchOverlay"
          @keyup.enter="goToSearch"
        />
        <v-btn
          class="search-submit"
          color="primary"
          icon="mdi-magnify"
          size="small"
          variant="text"
          aria-label="搜索帖子"
          @click="goToSearch"
        />
      </v-form>

      <transition name="search-popover">
        <div v-if="showSearchOverlay" class="search-popover">
          <div class="search-history-title">搜索历史</div>
          <div v-if="searchHistory.length" class="search-history-list">
            <v-chip
              v-for="(term, index) in searchHistory"
              :key="`${term}-${index}`"
              class="search-history-chip"
              size="small"
              @click="searchFromHistory(term)"
            >
              {{ term }}
            </v-chip>
          </div>
          <div v-else class="search-history-empty">暂无搜索历史</div>
        </div>
      </transition>
    </div>

    <!-- About ZeroCat Card -->
    <div class="sidebar-card about-card">
      <h2 class="card-title">ZeroCat 零猫</h2>
      <p class="card-description">
        新一代，开源，编程社区。
      </p>
      <router-link to="/app/about" class="card-link">
        了解更多
        <v-icon size="16">mdi-arrow-right</v-icon>
      </router-link>
    </div>

    <!-- Quick Links Card -->
    <div class="sidebar-card links-card">
      <h2 class="card-title">快速链接</h2>
      <div class="quick-links">
        <router-link to="/app/explore" class="quick-link">
          <v-icon size="18">mdi-compass</v-icon>
          <span>探索项目</span>
        </router-link>
        <a href="https://github.com/ZeroCatDev" target="_blank" class="quick-link">
          <v-icon size="18">mdi-github</v-icon>
          <span>GitHub</span>
        </a>
        <a href="https://qm.qq.com/q/E3eF6xtoHe" target="_blank" class="quick-link"> <v-icon size="18">mdi-mail</v-icon>
          <span>QQ 群</span>
        </a>
         <a href="https://houlang.cloud" target="_blank" class="quick-link"> <v-icon size="18">mdi-earth</v-icon>
          <span>厚浪云</span>
        </a>
      </div>
    </div>

    <!-- Footer Links -->
    <div class="sidebar-footer">
      <div class="footer-links">
        <router-link to="/app/legal/terms" class="footer-link">服务条款</router-link>
        <router-link to="/app/legal/privacy" class="footer-link">隐私政策</router-link>
        <router-link to="/app/legal/community-guidelines" class="footer-link">社区准则</router-link>
        <router-link to="/app/about" class="footer-link">关于</router-link>
      </div>
      <div class="footer-links">
        <a href="https://t.me/zerocatdev" target="_blank" class="footer-link">Telegram</a>
        <a href="https://qm.qq.com/q/W4YRztB94q" target="_blank" class="footer-link">QQ群</a>
        <a href="https://discord.gg/YmW2JWnbdy" target="_blank" class="footer-link">Discord</a>
      </div>
      <div class="footer-links">
        <a href="https://sbox.yearnstudio.cn" target="_blank" class="footer-link">小盒子社区</a>
        <a href="https://www.40code.com/" target="_blank" class="footer-link">40code</a>
      </div>
      <div class="footer-copyright">
        &copy; {{ currentYear }} ZeroCat
        <span class="footer-separator">·</span>
        <a href="https://houlang.cloud/zh-CN/article/about/team" target="_blank" class="footer-link">厚浪开发组</a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { addToSearchHistory, loadSearchHistory } from '@/services/searchService';

const router = useRouter();
const searchText = ref('');
const searchHistory = ref([]);
const showSearchOverlay = ref(false);
const searchShellRef = ref(null);

const currentYear = computed(() => new Date().getFullYear());

const openSearchOverlay = () => {
  showSearchOverlay.value = true;
};

const closeSearchOverlay = () => {
  showSearchOverlay.value = false;
};

const goToSearch = async () => {
  const keyword = searchText.value.trim();
  if (keyword) {
    searchHistory.value = await addToSearchHistory(keyword, searchHistory.value);
  }
  closeSearchOverlay();
  await router.push({
    path: '/app/search',
    query: {
      keyword,
      scope: 'posts',
      page: '1',
      perPage: '20'
    }
  });
};

const searchFromHistory = async (term) => {
  searchText.value = term;
  await goToSearch();
};

const handleDocumentPointerDown = (event) => {
  if (!showSearchOverlay.value) return;
  const shell = searchShellRef.value;
  if (shell && shell.contains(event.target)) return;
  closeSearchOverlay();
};

const handleDocumentKeydown = (event) => {
  if (event.key === 'Escape') {
    closeSearchOverlay();
  }
};

onMounted(async () => {
  searchHistory.value = await loadSearchHistory();
  document.addEventListener('mousedown', handleDocumentPointerDown);
  document.addEventListener('keydown', handleDocumentKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentPointerDown);
  document.removeEventListener('keydown', handleDocumentKeydown);
});
</script>

<style scoped>
.home-right-sidebar {
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.search-scrim {
  position: fixed;
  inset: 0;
  background: rgba(15, 20, 25, 0.12);
  z-index: 10;
}

.search-shell {
  position: relative;
  z-index: 20;
}

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(var(--v-theme-on-surface), 0.05);
  border-radius: 9999px;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.search-box:hover {
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.search-box-active {
  background: rgba(var(--v-theme-surface), 0.98);
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.18);
}

.search-input {
  flex: 1;
}

.search-input :deep(.v-input__control) {
  min-height: 36px;
}

.search-input :deep(.v-field__input) {
  min-height: 36px;
  padding-top: 0;
  padding-bottom: 0;
}

.search-submit {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.search-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  padding: 12px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 20, 25, 0.14);
}

.search-history-title {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.65);
  margin-bottom: 8px;
}

.search-history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.search-history-chip {
  max-width: 100%;
}

.search-history-chip :deep(.v-chip__content) {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-history-empty {
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.55);
  padding: 6px 2px;
}

.search-popover-enter-active,
.search-popover-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.search-popover-enter-from,
.search-popover-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.search-scrim-enter-active,
.search-scrim-leave-active {
  transition: opacity 0.16s ease;
}

.search-scrim-enter-from,
.search-scrim-leave-to {
  opacity: 0;
}

/* Sidebar Card */
.sidebar-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 16px;
  padding: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 800;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 12px;
}

/* About Card */
.about-card .card-description {
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.8);
  line-height: 1.5;
  margin-bottom: 16px;
}

.card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.card-link:hover {
  opacity: 0.8;
}

/* Quick Links Card */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  font-size: 15px;
  transition: background-color 0.2s;
}

.quick-link:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.quick-link .v-icon {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* Footer */
.sidebar-footer {
  margin-top: auto;
  padding: 12px 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 8px;
}

.footer-link {
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: rgba(var(--v-theme-on-surface), 0.8);
  text-decoration: underline;
}

.footer-copyright {
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.5);
  margin-top: 12px;
}

.footer-separator {
  margin: 0 4px;
}

/* Scrollbar */
.home-right-sidebar::-webkit-scrollbar {
  width: 0;
}

/* Hide on medium screens */
@media (max-width: 1279px) {
  .home-right-sidebar {
    display: none;
  }
}
</style>
