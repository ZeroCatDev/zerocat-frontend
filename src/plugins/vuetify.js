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
          background: '#ecedf5',
          surface: '#f9f9ff',
          'surface-dim': '#d8dae1',
          'surface-bright': '#f9f9ff',
          'on-surface': '#191c21',
          outline: '#717783',
          'outline-variant': '#c1c6d3',
          primary: '#005fae',
          'on-primary': '#ffffff',
          secondary: '#3c5f90',
          'on-secondary': '#ffffff',
          tertiary: '#525f74',
          'on-tertiary': '#ffffff',
          error: '#ba1a1a',
          'on-error': '#ffffff',
          'surface-light': '#e6e8ef',
        },
        dark: false,
        variables: {
          'overlay-background': '#161c25',
        },
      },
      dark: {
        colors: {
          background: '#1d2025',
          surface: '#101319',
          'surface-dim': '#101319',
          'surface-bright': '#36393f',
          'on-surface': '#e1e2ea',
          outline: '#8b919d',
          'outline-variant': '#414752',
          primary: '#1C6FC3',
          'on-primary': '#d4e3ff',
          secondary: '#a6c8ff',
          'on-secondary': '#00315f',
          tertiary: '#bac7df',
          'on-tertiary': '#243144',
          error: '#ffb4ab',
          'on-error': '#690005',
          'surface-light': '#36393f',
        },
        dark: true,
        variables: {
          'overlay-background': '#161c25',
        },
      },
    },
  },
});
