/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router'
import {setupLayouts} from 'virtual:generated-layouts'
import {routes} from 'vue-router/auto-routes'
import {use404Helper} from '../composables/use404'

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  const isChunkError =
    err?.message?.includes?.('Failed to fetch dynamically imported module') ||
    err?.message?.includes?.('Failed to load') ||
    err?.message?.includes?.('Loading chunk') ||
    err?.message?.includes?.('Loading CSS chunk');

  if (isChunkError) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

// 添加路由错误处理
router.beforeEach((to, from, next) => {
  // 如果路由不存在
  if (!to.matched.length) {
    use404Helper.show404();
    next(false);
    return;
  }
  // 如果是正常路由，确保重置404状态
  use404Helper.reset404();
  next();
});

export default router
