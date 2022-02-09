import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import { loadFonts } from "./plugins/webfontloader";

createApp(App).use(router).use(store).use(vuetify).mount("#app");

if (process.env.NODE_ENV === "development") {
  import("autopreview/vue3").then(({ default: AutoPreview }) => {
    new AutoPreview("#app", (app) => {
      app.use(router).use(store).use(vuetify);
    });
  });
}
