<template>
  <!-- Twitter Mode -->
  <nav class="sidebar-twitter" :class="{ 'sidebar-twitter--vuetify': props.mode === 'vuetify' }">
    <div class="sidebar-content">
      <!-- Logo -->
      <router-link to="/" class="sidebar-logo" @click="goHome">
        <div class="logo-icon">
          <svg
            fill="none"
            height="32"
            viewBox="0 0 200 200"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" fill="#FFFFFF" r="100"></circle>
            <path
              d="M38 162.867L100.5 100.367L100.5 162.867L38 162.867ZM163 100.367L100.5 100.367L100.5 162.867L163 100.367Z"
              fill="#415F91"
              fill-rule="evenodd"
            ></path>
            <path
              d="M38 100.367L100.5 37.8672L100.5 100.367L38 100.367ZM163 37.8672L100.5 37.8672L100.5 100.367L163 37.8672Z"
              fill="#8EACE3"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </router-link>

      <!-- Navigation Items -->
      <div class="nav-items">
        <router-link
          v-for="item in sidebarNavItems"
          :key="item.name"
          :to="item.to"
          class="nav-item"
          :class="{ 'nav-item--active': isRouteActive(item.to) }"
        >
          <v-icon class="nav-icon" :icon="item.icon" />
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>

      <!-- Post Button -->
      <v-btn
        v-if="isLogin"
        color="primary"
        :size="isSmallScreen? 'large':'x-large'"
        rounded="pill"

        class="mt-4"
        @click="handleOpenComposer"
      >
        <v-icon class="post-button-icon">mdi-pencil</v-icon>
        <span class="post-button-label">发帖</span>
      </v-btn>

      <!-- Spacer -->
      <div class="sidebar-spacer" />

      <!-- Theme Toggle -->
      <button class="theme-toggle" @click="toggleTheme">
        <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" />
        <span class="nav-label">{{ isDark ? '浅色模式' : '深色模式' }}</span>
      </button>

      <!-- User Profile (when logged in) -->
      <router-link
        v-if="isLogin && user"
        :to="`/${user.username}`"
        class="user-profile"
      >
        <v-avatar size="40" class="user-avatar">
          <v-img :src="userAvatar" alt="avatar" />
        </v-avatar>
        <div class="user-info">
          <div class="user-name">{{ user.display_name || user.username }}</div>
          <div class="user-handle">@{{ user.username }}</div>
        </div>
        <v-icon class="user-menu-icon">mdi-dots-horizontal</v-icon>
      </router-link>
    </div>
  </nav>

</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useSidebarContent } from '@/composables/useSidebarContent';
import { openFloatingPostBar } from '@/composables/useFloatingPostBar';

const props = defineProps({
  mode: {
    type: String,
    default: 'vuetify',
    validator: (v) => ['twitter', 'vuetify'].includes(v)
  }
});

const emit = defineEmits(['open-composer']);

const route = useRoute();
const display = useDisplay();

const isSmallScreen = computed(() => (display.width?.value ?? window.innerWidth) < 1024);
const isHomeOrPostsPage = computed(() => {
  const path = route.path;
  if (path === '/' || path === '/index.html') return true;
  return path === '/app/posts' || path.startsWith('/app/posts/');
});

const {
  isLogin,
  user,
  userAvatar,
  isDark,
  twitterNavItems,
  navGroups,
  initConfig,
  toggleTheme,
  isRouteActive,
  goHome,
} = useSidebarContent();

const sidebarNavItems = computed(() => {
  const twitterItems = twitterNavItems.value ?? [];
  const vuetifyItems = (navGroups.value ?? []).flatMap((group) => group?.items ?? []);

  if (props.mode !== 'vuetify') return twitterItems;

  if (isSmallScreen.value && isHomeOrPostsPage.value) {
    const existingTo = new Set(twitterItems.map((i) => i?.to).filter(Boolean));
    const existingName = new Set(twitterItems.map((i) => i?.name).filter(Boolean));

    const extraItems = vuetifyItems.filter((i) => {
      const to = i?.to;
      const name = i?.name;
      if (to && existingTo.has(to)) return false;
      if (name && existingName.has(name)) return false;
      return true;
    });

    return [...twitterItems, ...extraItems];
  }

  return vuetifyItems;
});

const handleOpenComposer = () => {
  openFloatingPostBar();
  emit('open-composer');
};

onMounted(() => {
  initConfig();
});
</script>

<style scoped>
/* ===== Twitter Mode Styles ===== */
.sidebar-twitter {
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  padding: 0 12px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 9999px;
  transition: background-color 0.2s;
  text-decoration: none;
}

.sidebar-logo:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px;
  border-radius: 9999px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  font-size: 20px;
  font-weight: 400;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.nav-item--active {
  font-weight: 700;
}

.nav-icon {
  font-size: 26px;
}

.nav-label {
  white-space: nowrap;
}

/* Post Button */
.post-button-icon {
  display: none;
}

.post-button-label {
  display: block;
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px;
  border-radius: 9999px;
  color: rgb(var(--v-theme-on-surface));
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.sidebar-spacer {
  flex: 1;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 9999px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  transition: background-color 0.2s;
  margin-top: 12px;
}

.user-profile:hover {
  background: rgba(var(--v-theme-on-surface), 0.05);
}

.user-avatar {
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-handle {
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-menu-icon {
  flex-shrink: 0;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

/* Twitter Mode - Medium screens (icon only) */
@media (max-width: 1279px) {
  .sidebar-twitter:not(.sidebar-twitter--vuetify) {
    padding: 0 4px;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .sidebar-logo {
    justify-content: center;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .nav-item {
    justify-content: center;
    padding: 12px;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .nav-label {
    display: none;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .post-button-icon {
    display: block;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .post-button-label {
    display: none;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .theme-toggle {
    justify-content: center;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .theme-toggle .nav-label {
    display: none;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .user-profile {
    justify-content: center;
    padding: 12px;
  }

  .sidebar-twitter:not(.sidebar-twitter--vuetify) .user-info,
  .sidebar-twitter:not(.sidebar-twitter--vuetify) .user-menu-icon {
    display: none;
  }
}

/* Twitter Mode - Hide on small screens */
@media (max-width: 1023px) {
  .sidebar-twitter:not(.sidebar-twitter--vuetify) {
    display: none;
  }
}
</style>
