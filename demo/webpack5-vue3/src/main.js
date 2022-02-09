"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const App_vue_1 = require("./App.vue");
const router_1 = require("./router");
const store_1 = require("./store");
const vuetify_1 = require("./plugins/vuetify");
// import { loadFonts } from "./plugins/webfontloader";
(0, vue_1.createApp)(App_vue_1.default).use(router_1.default).use(store_1.default).use(vuetify_1.default).mount("#app");
if (process.env.NODE_ENV === "development") {
    Promise.resolve().then(() => require("autopreview/vue3")).then(({ default: AutoPreview }) => {
        new AutoPreview("#app", (app) => {
            app.use(router_1.default).use(store_1.default).use(vuetify_1.default);
        });
    });
}
//# sourceMappingURL=main.js.map