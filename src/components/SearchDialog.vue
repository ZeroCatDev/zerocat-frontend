<template>
  <v-dialog
    v-if="!isMobileOrTablet"
    v-model="dialog"
    width="80%"
    :scrim="false"
    transition="dialog-bottom-transition"
    class="search-dialog"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-magnify"
        variant="text"
        class="search-trigger"
      ></v-btn>
    </template>
    <v-card max-height="90vh" class="d-flex flex-column search-dialog-card bg-surface-light" border hover>
      <v-card-text class="pa-0 flex-grow-0" style="margin: 8px;">
        <SearchComponent :dialog-mode="true" />
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-btn
    v-else
    icon="mdi-magnify"
    variant="text"
    class="search-trigger"
    @click="navigateToSearch"
  ></v-btn>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchComponent from './SearchComponent.vue'

export default {
  name: 'SearchDialog',
  components: {
    SearchComponent
  },
  setup() {
    const dialog = ref(false)
    const router = useRouter()

    const isMobileOrTablet = ref(false)

    // 检测设备类型
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
      isMobileOrTablet.value = isMobile
    }

    // 导航到搜索页面
    const navigateToSearch = () => {
      router.push('/app/search')
    }

    // 在组件挂载时检测设备类型
    if (typeof window !== 'undefined') {
      checkDevice()
      // 监听窗口大小变化
      window.addEventListener('resize', checkDevice)
    }

    return {
      dialog,
      isMobileOrTablet,
      navigateToSearch
    }
  }
}
</script>

<style scoped>
.search-dialog {
  animation: dialogFadeIn 0.3s ease;
}

.search-trigger {
  transition: transform 0.3s ease;
}

.search-trigger:hover {
  transform: scale(1.1);
}

.search-dialog-card {
  animation: slideInFromTop 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.v-overlay__content) {
  transition: transform 0.3s ease !important;
}

:deep(.dialog-bottom-transition-enter-active),
:deep(.dialog-bottom-transition-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease !important;
}

:deep(.dialog-bottom-transition-enter-from),
:deep(.dialog-bottom-transition-leave-to) {
  transform: translateY(-20px) !important;
  opacity: 0;
}
</style>
