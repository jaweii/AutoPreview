import { createApp } from 'vue'
import App from './App.vue'
import init from 'autopreview/vue'

const app = createApp(App)
app.mount('#app')

new init('#app')