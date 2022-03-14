import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  plugins: [
    vue(),
    vueJsx()
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
  server: {
    watch: {
      ignored: ["!**/node_modules/autopreview/**"],
    },
  },
  optimizeDeps: {
    exclude: ["autopreview"],
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
