<template>
  <aside class="home-right-sidebar">
    <!-- Search Box -->
    <v-form class="search-box" @submit.prevent="goToSearch">
      <v-text-field
        v-model="searchText"
        class="search-input"
        density="compact"
        hide-details
        placeholder="搜索帖子"
        prepend-inner-icon="mdi-magnify"
        variant="plain"
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
        <a href="https://langs.ink/article/houlangs/" target="_blank" class="footer-link">厚浪开发组</a>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchText = ref('');

const currentYear = computed(() => new Date().getFullYear());

const goToSearch = () => {
  const keyword = searchText.value.trim();
  router.push({
    path: '/app/search',
    query: {
      keyword,
      scope: 'posts',
      page: '1',
      perPage: '20'
    }
  });
};
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

/* Search Box */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(var(--v-theme-on-surface), 0.05);
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.search-box:hover {
  background: rgba(var(--v-theme-on-surface), 0.08);
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
