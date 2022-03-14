import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import App from './App.vue';

const app = createApp(App)
console.log(app)
app.use(Antd)
app.mount('#app');

if (process.env.NODE_ENV === "development") {
  import("autopreview/vue3").then(({ default: AutoPreview }) => {
    new AutoPreview("#app", (app) => {
      app.use(Antd)
    });
  });
}