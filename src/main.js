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

// 使用 Vercel Speed Insights 观测网站性能
import { injectSpeedInsights } from '@vercel/speed-insights';
injectSpeedInsights();

registerPlugins(app);
app.mount("#app");
