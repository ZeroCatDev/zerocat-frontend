import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { localuser } from '@/services/localAccount';
import { get } from '@/services/serverConfig';

/**
 * 统一侧边栏内容提供者
 * 为Twitter模式和Vuetify模式提供一致的导航内容
 */
export function useSidebarContent() {
  const route = useRoute();
  const router = useRouter();
  const theme = useTheme();

  // 响应式状态
  const proxyEnabled = ref(false);

  // 初始化配置
  const initConfig = () => {
    proxyEnabled.value = get('scratchproxy.enabled') || false;
  };

  // 用户状态
  const isLogin = computed(() => localuser.isLogin.value);
  const user = computed(() => localuser.user.value);

  // 用户头像
  const userAvatar = computed(() => {
    try {
      if (!isLogin.value) return '/default-avatar.png';
      return localuser.getUserAvatar(user.value?.avatar);
    } catch {
      return '/default-avatar.png';
    }
  });

  // 主题状态
  const isDark = computed(() => theme.global.name.value === 'dark');

  // 切换主题
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark';
    theme.global.name.value = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // 检测路由是否激活
  const isRouteActive = (path) => {
    if (path === '/') {
      return route.path === '/' || route.path === '/index.html';
    }
    return route.path.startsWith(path);
  };

  // 是否为管理员路由
  const isAdminRoute = computed(() => route.path.startsWith('/app/admin'));

  // 主导航项
  const mainNavItems = computed(() => {
    const items = [
      {
        name: 'home',
        label: '首页',
        icon: 'mdi-home',
        iconActive: 'mdi-home',
        to: '/',
        requireLogin: false
      },
      {
        name: 'explore',
        label: '探索',
        icon: 'mdi-compass-outline',
        iconActive: 'mdi-compass',
        to: '/app/explore',
        requireLogin: false
      },
    ];

    if (isLogin.value) {
      items.push(
        {
          name: 'dashboard',
          label: '仪表盘',
          icon: 'mdi-view-dashboard-outline',
          iconActive: 'mdi-view-dashboard',
          to: '/app/dashboard',
          requireLogin: true
        },

      );
    }

    return items;
  });

  // 镜像导航项
  const proxyNavItems = computed(() => {
    if (!proxyEnabled.value) return [];

    return [
      {
        name: 'proxy-home',
        label: 'Scratch 官网',
        icon: 'mdi-home-outline',
        to: '/app/proxy',
        requireLogin: false
      },

    ];
  });

  // 工具导航项
  const toolsNavItems = computed(() => [
    {
      name: 'asdm',
      label: '桌面版镜像',
      icon: 'mdi-download',
      to: '/app/tools/asdm',
      requireLogin: false
    },
    {
      name: 'comparer',
      label: '项目比较器',
      icon: 'mdi-compare',
      to: '/app/tools/comparer',
      requireLogin: false
    },
    {
      name: 'extensions',
      label: 'Scratch扩展',
      icon: 'mdi-puzzle',
      to: '/app/extensions',
      requireLogin: false
    },
  ]);

  // 管理员导航项
  const adminNavItems = computed(() => [
    {
      name: 'admin-back',
      label: '返回',
      icon: 'mdi-arrow-left',
      to: '/',
      requireLogin: false
    },
    {
      name: 'admin-users',
      label: '用户管理',
      icon: 'mdi-account-group',
      to: '/app/admin/users',
      requireLogin: true
    },
    {
      name: 'admin-project',
      label: '项目管理',
      icon: 'mdi-xml',
      to: '/app/admin/project',
      requireLogin: true
    },
    {
      name: 'admin-config',
      label: '系统设置',
      icon: 'mdi-cog',
      to: '/app/admin/config',
      requireLogin: true
    },
    {
      name: 'admin-sitemap',
      label: '站点地图',
      icon: 'mdi-sitemap',
      to: '/app/admin/sitemap',
      requireLogin: true
    },
    {
      name: 'admin-extensions',
      label: '扩展管理',
      icon: 'mdi-puzzle',
      to: '/app/admin/extensions',
      requireLogin: true
    },
    {
      name: 'admin-oauth-applications',
      label: 'OAuth应用',
      icon: 'mdi-shield-key',
      to: '/app/admin/oauth/applications',
      requireLogin: true
    },
  ]);

  // Twitter模式的简化导航项
  const twitterNavItems = computed(() => {
    const items = [
      { name: 'home', label: '首页', icon: 'mdi-home', to: '/' },
      { name: 'explore', label: '探索项目', icon: 'mdi-compass', to: '/app/explore' },
    ];

    if (isLogin.value) {
      items.push(
        { name: 'notifications', label: '通知', icon: 'mdi-bell-outline', to: '/app/notifications' },
        { name: 'mentions', label: '提及', icon: 'mdi-at', to: '/app/mentions' },
        { name: 'profile', label: '个人主页', icon: 'mdi-account-outline', to: user.value ? `/${user.value.username}` : '/app/account' },
        { name: 'settings', label: '设置', icon: 'mdi-cog-outline', to: '/app/account' }
      );
    } else {
      items.push(
        { name: 'login', label: '登录', icon: 'mdi-login', to: '/app/account/login' },
        { name: 'register', label: '注册', icon: 'mdi-account-plus-outline', to: '/app/account/register' }
      );
    }

    return items;
  });

  // 所有导航组
  const navGroups = computed(() => {
    if (isAdminRoute.value) {
      return [
        { title: '管理', icon: 'mdi-shield', items: adminNavItems.value }
      ];
    }

    const groups = [
      { title: '导航', icon: 'mdi-menu', items: mainNavItems.value }
    ];

    if (proxyEnabled.value) {
      groups.push({ title: '镜像', icon: 'mdi-link-variant', items: proxyNavItems.value });
    }

    groups.push({ title: '工具', icon: 'mdi-tools', items: toolsNavItems.value });

    return groups;
  });

  // 导航到指定路由
  const navigateTo = (path) => {
    router.push(path);
  };

  // 返回首页
  const goHome = () => {
    if (route.path === '/') {
      window.location.reload();
    } else {
      router.push('/');
    }
  };

  return {
    // 状态
    isLogin,
    user,
    userAvatar,
    isDark,
    proxyEnabled,
    isAdminRoute,

    // 导航项
    mainNavItems,
    proxyNavItems,
    toolsNavItems,
    adminNavItems,
    twitterNavItems,
    navGroups,

    // 方法
    initConfig,
    toggleTheme,
    isRouteActive,
    navigateTo,
    goHome,
  };
}
