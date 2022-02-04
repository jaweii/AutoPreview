"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const App_vue_1 = require("./App.vue");
const vue_2 = require("autopreview/vue");
const app = (0, vue_1.createApp)(App_vue_1.default);
app.mount('#app');
new vue_2.default('#app');
//# sourceMappingURL=main.js.map