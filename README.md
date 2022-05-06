# [AutoPreview](https://github.com/jaweii/AutoPreview)

[中文](https://github.com/jaweii/AutoPreview/blob/main/README-zh.md) | [English](https://github.com/jaweii/AutoPreview/blob/main/README.md)

Preview React/Vue components in VS Code.

![](https://raw.githubusercontent.com/jaweii/AutoPreview/main/demo/img/webpack5_react.gif)

## Usage

1. Download and enable AutoPreview extension in VS Code, after enabling, you can import `autopreview` package in your React/Vue project;

2. import `autopreview` package and initialize it;

React project:

```
// main.ts
if (process.env.NODE_ENV === "development") {
  import("autopreview/react").then(({ default: AutoPreview }) => {
    new AutoPreview("#root")
  })
}
```

Vue 3 project:

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

Vue 2 project:

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

> Other projects refer to the implementation of `autopreview/react` or `autopreview/vue2`, that is, call `getActiveFilePath()` method exported by `autopreview/index` to get the file path in active text editor, and pass it to `import(filepath)` to get components exported in the file, those components can be previewed by mounting to page.

3. Export functional components whose names start with `autopreview_`(Not case sensitive);

Preview React component:

```
// component_list.tsx
import React from "react";
import { Button } from "antd";

export function AutoPreview_Button() {
  return (<Button onClick={() => console.log("click")}> CLICK </Button>);
}

export function AutoPreview_Button_primary() {
  return (<Button type="primary" > PRIMARY </Button>);
}
```

Preview Vue3 component:

```
// Header.vue
<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
  </v-layout>
</template>
<script lang="tsx">
// Vite 2 uses React JSX by default, to use Vue JSX, you need to configure jsx in esbuild, and explicitly import h `import { h } from 'vue'`
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

Preview Vue2 component:

```
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
export function AutoPreview_Test(h) {
  return <Header title="Title" />;
}
</script>
```

4. Refer to **Webpack/Vite Configuration** to configure Webpack/Vite, then start project, and save localhost address in preview panel;

## Web Component

`autopreview` package registers some web components that you can use them directly:

- `autopreview-list`: Display as a column list;

Example:

```
<autopreview-list>
  <Button type="primary">Primary Button</Button>
  <Button>Default Button</Button>
  <Button type="dashed">Dashed Button</Button>
  <Button type="text">Text Button</Button>
  <Button type="link">Link Button</Button>
<autopreview-list>
```

![](https://raw.githubusercontent.com/jaweii/AutoPreview/main/demo/img/autopreview-list.png)

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

webpack5 Configuration:

Initialization:

Export preview:

Refer to [demo/webpack5+react](/demo)

### Webpack5+Vue3 (Vue CLI)

webpack5 Configuration:

Initialization:

Export preview:

Refer to [demo/webpack5+vue3](/demo)

### Vite+React (Vite CLI)

Vite：

Initialization

Export preview:

Refer to [vite+vue3](/demo)

### Webpack4+Vue2 (Vue CLI)

Webpack4 Configuration:

Initialization:

Export preview:

Refer to [webpack4+vue2](/demo)

### Vite+Vue3 (Vite CLI)

Vite：

Initialization

Export preview:

Refer to [Vite+vue3](/demo)

### Welcome PR

## TODO

· ~~English Doc~~

· Copy component code to clipboard in preview panel

· Complete popular CLI Demo

· Integrate VS Code Debug

· Test on Windows

· Extension logo

## Q&A

1. "`autopreview` is not installed"

Restart VS Code, and then restart your project.

2. In Vue 3, components using `Provide` or `Reject` may not be previewed.

3. Will it make project bigger?

Webpack and Vite have tree shaking feature, unused components will not be bundled to production.

4. Preview panel is not updated after switch active text editor

Make sure your Webpack/Vite is Watching `node_modules/autopreview` directory, and exclude `node_modules/autopreview` directory from Cache.

5. Preview panel shows "Access failed"

Check `AutoPreview.serverURL` in `.vscode/setting.json` is the same as your dev server address.

---
