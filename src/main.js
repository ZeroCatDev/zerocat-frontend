/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from "@/plugins";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

import { createHead  } from "@unhead/vue/client";

// Components
import App from "./App.vue";

// Composables
import {createApp} from "vue";

import './styles/settings.scss'

// 导入 Vue DevTools
import {devtools} from '@vue/devtools'

const app = createApp(App);

// 如果是开发环境，启用 Vue DevTools
if (import.meta.env.DEV) {
  devtools.init()
}

const head = createHead();
app.use(head);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);

// 使用 Vercel Speed Insights 观测网站性能
// import { injectSpeedInsights } from "@vercel/speed-insights";
// injectSpeedInsights();
// 使用 Vercel Analytics 收集数据
// import { inject } from "@vercel/analytics";
// inject();

registerPlugins(app);
app.mount("#app");
