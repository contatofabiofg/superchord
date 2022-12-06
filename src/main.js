import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { polyfill } from 'mobile-drag-drop'
import App from './App.vue'
import router from './router'
import './style.css'

// polyfill({})
// window.addEventListener('touchmove', function () {})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
