// vite.config.mjs
import AutoImport from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.0_vue@3.5.13_typescript@5.7.2___rollup@4.18.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/unplugin-vue-components@0.27.2_@babel+parser@7.26.5_rollup@4.18.1_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/vite.js";
import Fonts from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/unplugin-fonts@1.1.1_vite@5.3.3_@types+node@20.14.12_sass@1.77.6_/node_modules/unplugin-fonts/dist/vite.mjs";
import Layouts from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/vite-plugin-vue-layouts@0.11.0_vite@5.3.3_@types+node@20.14.12_sass@1.77.6__vue-router@4.4.0__7bpygi2xrcfcndntsv5t64bebq/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Vue from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/@vitejs+plugin-vue@5.0.5_vite@5.3.3_@types+node@20.14.12_sass@1.77.6__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/unplugin-vue-router@0.10.0_rollup@4.18.1_vue-router@4.4.0_vue@3.5.13_typescript@5.7.2___vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-router/dist/vite.js";
import Vuetify, { transformAssetUrls } from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/vite-plugin-vuetify@2.0.3_vite@5.3.3_@types+node@20.14.12_sass@1.77.6__vue@3.5.13_typescript@5.7.2__vuetify@3.6.12/node_modules/vite-plugin-vuetify/dist/index.mjs";
import { PrimeVueResolver } from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/@primevue+auto-import-resolver@4.0.0/node_modules/@primevue/auto-import-resolver/index.mjs";
import { defineConfig, loadEnv } from "file:///D:/ZeroCat/zerocat-frontend/node_modules/.pnpm/vite@5.3.3_@types+node@20.14.12_sass@1.77.6/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///D:/ZeroCat/zerocat-frontend/vite.config.mjs";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss"
      }
    }),
    Components(),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900"
          }
        ]
      }
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      eslintrc: {
        enabled: true
      },
      vueTemplate: true
    }),
    PrimeVueResolver()
    /*copyPlugin(
      {
        targets: [{ src: "scratch-gui/build", dest: "dist" }],
        verbose: true,
        hook: "writeBundle",
      },
      {
        targets: [{ src: "scratch-gui/build", dest: "dist" }],
        verbose: true,
        hook: "buildEnd",
      }
    ),*/
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
  server: {
    port: 3e3
  },
  base: "/"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcWmVyb0NhdFxcXFx6ZXJvY2F0LWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxaZXJvQ2F0XFxcXHplcm9jYXQtZnJvbnRlbmRcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9aZXJvQ2F0L3plcm9jYXQtZnJvbnRlbmQvdml0ZS5jb25maWcubWpzXCI7Ly8gUGx1Z2luc1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgRm9udHMgZnJvbSBcInVucGx1Z2luLWZvbnRzL3ZpdGVcIjtcclxuaW1wb3J0IExheW91dHMgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzXCI7XHJcbmltcG9ydCBWdWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gXCJ1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGVcIjtcclxuaW1wb3J0IFZ1ZXRpZnksIHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZXRpZnlcIjtcclxuaW1wb3J0IHsgUHJpbWVWdWVSZXNvbHZlciB9IGZyb20gXCJAcHJpbWV2dWUvYXV0by1pbXBvcnQtcmVzb2x2ZXJcIjtcclxuLy9pbXBvcnQgY29weVBsdWdpbiBmcm9tIFwicm9sbHVwLXBsdWdpbi1jb3B5XCI7XHJcblxyXG4vLyBVdGlsaXRpZXNcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIFZ1ZVJvdXRlcigpLFxyXG4gICAgTGF5b3V0cygpLFxyXG4gICAgVnVlKHtcclxuICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0sXHJcbiAgICB9KSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS1sb2FkZXIvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdml0ZS1wbHVnaW4jcmVhZG1lXHJcbiAgICBWdWV0aWZ5KHtcclxuICAgICAgYXV0b0ltcG9ydDogdHJ1ZSxcclxuICAgICAgc3R5bGVzOiB7XHJcbiAgICAgICAgY29uZmlnRmlsZTogXCJzcmMvc3R5bGVzL3NldHRpbmdzLnNjc3NcIixcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cygpLFxyXG4gICAgRm9udHMoe1xyXG4gICAgICBnb29nbGU6IHtcclxuICAgICAgICBmYW1pbGllczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiBcIlJvYm90b1wiLFxyXG4gICAgICAgICAgICBzdHlsZXM6IFwid2dodEAxMDA7MzAwOzQwMDs1MDA7NzAwOzkwMFwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogW1widnVlXCIsIFwidnVlLXJvdXRlclwiXSxcclxuICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgUHJpbWVWdWVSZXNvbHZlcigpLFxyXG4gICAgLypjb3B5UGx1Z2luKFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFyZ2V0czogW3sgc3JjOiBcInNjcmF0Y2gtZ3VpL2J1aWxkXCIsIGRlc3Q6IFwiZGlzdFwiIH1dLFxyXG4gICAgICAgIHZlcmJvc2U6IHRydWUsXHJcbiAgICAgICAgaG9vazogXCJ3cml0ZUJ1bmRsZVwiLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFyZ2V0czogW3sgc3JjOiBcInNjcmF0Y2gtZ3VpL2J1aWxkXCIsIGRlc3Q6IFwiZGlzdFwiIH1dLFxyXG4gICAgICAgIHZlcmJvc2U6IHRydWUsXHJcbiAgICAgICAgaG9vazogXCJidWlsZEVuZFwiLFxyXG4gICAgICB9XHJcbiAgICApLCovXHJcbiAgXSxcclxuICBkZWZpbmU6IHsgXCJwcm9jZXNzLmVudlwiOiB7fSB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgIH0sXHJcbiAgICBleHRlbnNpb25zOiBbXCIuanNcIiwgXCIuanNvblwiLCBcIi5qc3hcIiwgXCIubWpzXCIsIFwiLnRzXCIsIFwiLnRzeFwiLCBcIi52dWVcIl0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgfSxcclxuICBiYXNlOiAnLycsXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sV0FBVywwQkFBMEI7QUFDNUMsU0FBUyx3QkFBd0I7QUFJakMsU0FBUyxjQUFjLGVBQWU7QUFDdEMsU0FBUyxlQUFlLFdBQVc7QUFiaUksSUFBTSwyQ0FBMkM7QUFnQnJOLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUE7QUFBQSxJQUVELFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsSUFDWCxNQUFNO0FBQUEsTUFDSixRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsVUFDUjtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sUUFBUTtBQUFBLFVBQ1Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLE9BQU8sWUFBWTtBQUFBLE1BQzdCLFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxpQkFBaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWFuQjtBQUFBLEVBQ0EsUUFBUSxFQUFFLGVBQWUsQ0FBQyxFQUFFO0FBQUEsRUFDNUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLElBQ0EsWUFBWSxDQUFDLE9BQU8sU0FBUyxRQUFRLFFBQVEsT0FBTyxRQUFRLE1BQU07QUFBQSxFQUNwRTtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE1BQU07QUFDUixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
