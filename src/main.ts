import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createVuetify} from 'vuetify'
import {
    VApp,
    VBtn,
    VBtnToggle,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VCol,
    VContainer,
    VIcon,
    VMain,
    VRow,
    VTable,
    VTextField,
} from 'vuetify/components'
import {Ripple} from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'
import {COLORS} from './constants/colors'

const pinia = createPinia()

const vuetify = createVuetify({
    components: {
        VApp,
        VBtn,
        VBtnToggle,
        VCard,
        VCardActions,
        VCardText,
        VCardTitle,
        VCol,
        VContainer,
        VIcon,
        VMain,
        VRow,
        VTable,
        VTextField,
    },
    directives: {Ripple},
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    primary:           COLORS.primary,
                    secondary:         COLORS.secondary,
                    accent:            COLORS.accent,
                    background:        COLORS.background,
                    surface:           COLORS.surface,
                    'surface-variant': COLORS.surfaceVariant,
                },
            },
        },
    },
})

createApp(App).use(pinia).use(vuetify).mount('#app')

