import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './style.css'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-amber//theme.css'

createApp(App).use(router).use(PrimeVue).mount('#app')
