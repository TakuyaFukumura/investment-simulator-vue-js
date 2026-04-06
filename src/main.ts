import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#5C6BC0',
          secondary: '#7E57C2',
          accent: '#42A5F5',
          background: '#0D1117',
          surface: '#161B22',
          'surface-variant': '#1E2430',
        },
      },
    },
  },
})

createApp(App).use(pinia).use(vuetify).mount('#app')
