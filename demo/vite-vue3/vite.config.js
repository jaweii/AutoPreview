"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_vue_1 = require("@vitejs/plugin-vue");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_vue_1.default)()],
    server: {
        watch: {
            ignored: ["!**/node_modules/autopreview/**"],
        },
    },
    // The watched package must be excluded from optimization,
    // so that it can appear in the dependency graph and trigger hot reload.
    optimizeDeps: {
        exclude: ["autopreview"],
    },
    esbuild: {
        jsxFactory: "h",
        jsxFragment: "Fragment",
    },
});
//# sourceMappingURL=vite.config.js.map