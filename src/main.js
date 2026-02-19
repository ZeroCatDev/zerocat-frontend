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

// 导入 Sentry
import * as Sentry from "@sentry/vue";
import router from "./router";

const app = createApp(App);

// 初始化 Sentry
Sentry.init({
  app,
  dsn: "https://d34afb22fb34abcb4ef556512f2f2672@report.houlang.cloud/3",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration({ router }),
    Sentry.replayIntegration()
  ],
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/zerocat\.dev\//,
    /^https:\/\/zerocat\.houlangs\.com\//,
    /^https:\/\/zerocat\.houlang\.cloud\//
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  // Logs
  enableLogs: true
});

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
