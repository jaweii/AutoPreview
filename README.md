# [AutoPreview](https://github.com/jaweii/AutoPreview)

[中文](https://github.com/jaweii/AutoPreview/blob/main/README-zh.md) | [English](https://github.com/jaweii/AutoPreview/blob/main/README.md)

Preview React/Vue components in your VS Code.

![](https://raw.githubusercontent.com/jaweii/AutoPreview/main/demo/img/webpack5_react.gif)

## Usage

1. Download and enable the extension from VS Code extension market, once enabled, you can import `autopreview` package in your React/Vue project;

2. import `autopreview` package and initialize it;

React:

```
// main.ts
if (process.env.NODE_ENV === "development") {
  import("autopreview/react").then(({ default: AutoPreview }) => {
    new AutoPreview("#root")
  })
}
```

Vue 3:

```
// main.ts
if (process.env.NODE_ENV === "development") {
  import("autopreview/vue3").then(({ default: AutoPreview }) => {
    new AutoPreview("#app", (app) => {
    app.use(router).use(store).use(vuetify);
    });
  });
}
```

Vue 2:

```
// main.ts
if (process.env.NODE_ENV === 'development') {
  import('autopreview/vue2').then(({ default: AutoPreview }) => {
    new AutoPreview('#app', {
      vuetify: new Vuetify({}),
      // store/router…
    })
  })
}
```

3. Export components using naming format like autopreviewButton/AutopreviewText/Autopreview_Header;

example:

```React
// component_list.tsx
import React from "react";
import { Button } from "antd";

export function AutoPreview_Button() {
  return (<Button onClick={() => console.log("click")}> CLICK </Button>);
}

export function autopreviewPrimary() {
  return (<Button type="primary" > PRIMARY </Button>);
}
```

``` Vue3
// Header.vue
<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
  </v-layout>
</template>
<script lang="tsx">
import { defineComponent, h } from "vue";
const Header = defineComponent({
  props: {  title: String }
});
export default Header;

export function AutoPreview_Header() {
  return <Header title="Title" />;
}
</script>
```

``` Vue2
<template>
  <v-app-bar>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>
<script>
const Header = {
  props: { title: String },
};
export default Header;

// Note that `h` parameter must be declared
export function autopreviewTest(h) {
  return <Header title="Title" />;
}
</script>
```

## Webpack/Vite Configuration

### Vite 2

1. Vite will not watch `node_modules` directory by default, but `node_modules/autopreview` package must be watched;

2. The watched package must be excluded from optimization, so that it can appear in the dependency graph and trigger hot reload.

3. Vite 2 use React JSX by default, to use Vue JSX, you need to configure jsx in esbuild, and explicitly import h: `import { h } from 'vue'`;

Example:

```
// vite.config.js
export default defineConfig({
  server: {
    watch: {
      // Watch autopreview package
      ignored: ["!**/node_modules/autopreview/**"],
    },
  },
  optimizeDeps: {
    // watched package must be excluded
    exclude: ["autopreview"],
  },
  esbuild: {   // If you want to use Vue JSX
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
```

### Webpack 5

1. Webpack 5 needs to disable snapshot for `autopreview` package;

2. IF your Webpack configured to cache/unwatch `node_modules` directory, you need to exclude `autopreview` package;

Example:

```
// config/webpack.config.js
module.exports = function (webpackEnv) {
  return {
    snapshot: {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!autopreview)/],
    }
  }
}
```

### Webpack 4

// 

## CLI DEMO

### Webpack5+React (create-react-app)

Refer to [demo/webpack5+react](/demo)

### Webpack5+Vue3 (Vue CLI)

Refer to [demo/webpack5+vue3](/demo)

### Vite+React (Vite CLI)

Refer to [vite+vue3](/demo)

### Webpack4+Vue2 (Vue CLI)

Refer to [webpack4+vue2](/demo)

### Vite+Vue3 (Vite CLI)

Refer to [Vite+vue3](/demo)

## Debug

The extension registered a debug adapter called AutoPreview, you can debug your component when previewing by adding the following configuration to launch.json:

``` React
// launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "AutoPreview",
      "request": "attach",
      "type": "AutoPreview"
    }
  ]
}

```

![](https://raw.githubusercontent.com/jaweii/AutoPreview/main/demo/img/debug.png)


``` Vue
// launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "AutoPreview",
      "request": "attach",
      "name": "AutoPreview",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

![](https://raw.githubusercontent.com/jaweii/AutoPreview/main/demo/img/debug-vue2.png)
