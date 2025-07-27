/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const vscodeTheme = {
  dark: true,
  colors: {
    background: '#1e1e1e',
    surface: '#252526',
    'surface-bright': '#2c2c2d',
    primary: '#0098ff',
    secondary: '#89d185',
    error: '#f14c4c',
    info: '#3794ff',
    success: '#89d185',
    warning: '#cca700',
    'sidebar-background': '#252526',
    'activity-bar-background': '#333333',
    'editor-background': '#1e1e1e',
    'status-bar-background': '#007acc',
    'tab-active-background': '#1e1e1e',
    'tab-inactive-background': '#2d2d2d',
    'panel-background': '#252526',
    'title-bar-background': '#3c3c3c',
    'border-color': '#474747'
  },
  variables: {
    'border-color': '#474747',
    'border-opacity': 1,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.50,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#343434',
    'theme-on-code': '#CCCCCC'
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'vscodeTheme',
    themes: {
      vscodeTheme,
    },
  },
  defaults: {
    VList: {
      bgColor: 'surface',
    },
    VNavigationDrawer: {
      bgColor: 'surface',
    },
    VToolbar: {
      bgColor: 'surface',
    },
    VCard: {
      bgColor: 'surface',
    },

  },
})
