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
import { createMetaManager } from 'vue-meta'; // Pf95b

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(ToastService);
app.use(InstantSearch);

const metaManager = createMetaManager(); // Pde41
app.use(metaManager); // Pde41

// 使用 Vercel Speed Insights 观测网站性能
import { injectSpeedInsights } from "@vercel/speed-insights";
injectSpeedInsights();
// 使用 Vercel Analytics 收集数据
import { inject } from "@vercel/analytics";
inject();

registerPlugins(app);
app.mount("#app");
