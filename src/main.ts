import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createVuetify} from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

const pinia = createPinia()

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
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
