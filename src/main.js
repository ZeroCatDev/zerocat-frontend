/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import InstantSearch from "vue-instantsearch/vue3/es";

import { createHead } from "@unhead/vue";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

import Clarity from "@microsoft/clarity";
import './styles/settings.scss'

if (!import.meta.env.VITE_APP_BASE_API.includes("localhost")) {
  const projectId = import.meta.env.VITE_APP_CLARITY_PROJECT_ID;
  Clarity.init(projectId);
}

const app = createApp(App);

const head = createHead();
app.use(head);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.use(InstantSearch);

// 使用 Vercel Speed Insights 观测网站性能
// import { injectSpeedInsights } from "@vercel/speed-insights";
// injectSpeedInsights();
// 使用 Vercel Analytics 收集数据
// import { inject } from "@vercel/analytics";
// inject();

registerPlugins(app);
app.mount("#app");
