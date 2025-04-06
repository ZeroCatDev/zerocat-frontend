/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VNumberInput } from "vuetify/labs/VNumberInput";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VNumberInput,
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        colors: {
          background: '#ecedf7',
          surface: '#f9f9ff',
          'surface-dim': '#d8d9e3',
          'surface-bright': '#f9f9ff',
          'on-surface': '#181c22',
          outline: '#727785',
          'outline-variant': '#c1c6d6',
          primary: '#005cba',
          'on-primary': '#ffffff',
          secondary: '#385e9d',
          'on-secondary': '#ffffff',
          tertiary: '#525f79',
          'on-tertiary': '#ffffff',
          error: '#ba1a1a',
          'on-error': '#ffffff',
          'surface-light': '#e6e8f1',
        },
        dark: false,
        variables: {
          'overlay-background': '#161c27',
        },
      },
      dark: {
        colors: {
          background: '#212830',
          surface: '#151b23',
          'surface-dim': '#10131a',
          'surface-bright': '#363941',
          'on-surface': '#e0e2ec',
          outline: '#8b919f',
          'outline-variant': '#414753',
          primary: '#abc7ff',
          'on-primary': '#002f65',
          secondary: '#abc7ff',
          'on-secondary': '#002f66',
          tertiary: '#b9c7e5',
          'on-tertiary': '#233048',
          error: '#ffb4ab',
          'on-error': '#690005',
          'surface-light': '#363941',
        },
        dark: true,
        variables: {
          'overlay-background': '#161c27',
        },
      },
    },
  },
});
