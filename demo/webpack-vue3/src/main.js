"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const App_vue_1 = require("./App.vue");
const router_1 = require("./router");
const store_1 = require("./store");
const vue_2 = require("autopreview/vue");
(0, vue_1.createApp)(App_vue_1.default).use(store_1.default).use(router_1.default).mount("#app");
new vue_2.default("#app");
//# sourceMappingURL=main.js.map