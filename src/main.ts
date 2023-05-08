import { createPinia } from 'pinia'
import { createApp } from 'vue'

import VueLazyLoad from 'vue3-lazyload'
import App from './App.vue'
import router from './router'

import './assets/iconfont/iconfont.css'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueLazyLoad, {})

app.mount('#app')
