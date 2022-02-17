# AutoPreview

在VS Code中实时预览React/Vue组件

![](https://github.com/jaweii/AutoPreview/blob/main/demo/img/vite_react_gif.gif)


## 使用方式

1、VS Code下载并启用AutoPreview插件，启用后项目便可以引入`node_modules/autopreview`模块；

2、在项目中引入`autopreview`模块，并初始化；

React项目：
```
// main.ts
if (process.env.NODE_ENV === "development") {
  import("autopreview/react").then(({ default: AutoPreview }) => {
    new AutoPreview("#root")
  })
}
```

Vue 3项目：
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

Vue 2项目：
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

> 其他项目参考`autopreview/react`和`autopreview/vue2`的实现，即通过`autopreview/index`导出的`getActiveFilePath()`方法拿到当前窗口文件路径，传给`import(PATH)`拿到当前窗口导出的组件，将目标组件挂载到页面，即可实现预览。


3、导出`AutoPreview_`开头的函数组件：


React组件示例：
```
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
export default function Input() {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 200 }}
    >
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Phone" />
    </Paper>
  );
}

export function AutoPreview_Input() {
  return (  <div style=“background:blue;width:100%;”>  <Input />  </div> );
}
```

Vue3组件示例：
```
<template>
  <v-layout>
    <v-app-bar>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
  </v-layout>
</template>
<script lang="tsx">
// Vite2默认使用React JSX， 要使用Vue JSX，需要在esbuild中配置jsx，并在组件中显性引入h :`import { h } from "vue" `
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

Vue2组件示例

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

export function AutoPreview_Test(h) {
  return <Header title="Title" />;
}
</script>
```

4、参考**配置要求**配置好Webpack/Vite，然后启动项目，在VS Code预览窗口输入localhost地址即可。


## 配置要求

### Vite 2

1、Vite 服务器默认会忽略对 `.git/` 和 `node_modules/` 目录的监听，必须对`node_mdules/autopreview`模块也进行监听；

2、被监听的包必须被排除在优化之外， 以便它能出现在依赖关系图中并触发热更新；

3、Vite2默认使用React JSX， 要使用Vue JSX，需要在esbuild中配置jsx，并在组件中显性引入h : `import { h } from "vue" `;

示例
```
// vite.config.js
export default defineConfig({
  server: {
    watch: {
      // 对autopreview模块进行监听
      ignored: ["!**/node_modules/autopreview/**"],
    },
  },
  optimizeDeps: {
    // 被监听的包必须被排除在优化之外
    exclude: ["autopreview"],
  },
  esbuild: {   // Vue项目要使用Vue JSX，需要在esbuild中配置jsx
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
```

### Webpack 5
1、Webpack 5 需要禁用对`autopreview`模块缓存快照；

2、如果你的webpack配置忽略了对`node_modules/`目录的监听，请排除`autopreview`模块；

3、如果你的webpack配置对`node_modules/`目录做了缓存处理，请排除`autopreview`模块；


示例：
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
暂无

## CLI DEMO

### Webpack5+React (create-react-app)

webpack5配置：

初始化：

导出预览：

参考demo目录下的webpack5+react项目

### Webpack5+Vue3 (Vue CLI)

webpack5配置：

初始化：

导出预览：

参考demo目录下的webpack5+vue3项目

### Vite+React (Vite CLI)

Vite：

初始化：

导出预览：

参考demo目录下的vite+vue3项目

### Webpack4+Vue2 (Vue CLI)

Webpack4配置：

初始化：

导出预览：

参考demo目录下的webpack4+vue2项目

### Vite+Vue3 (Vite CLI)

Vite：

初始化：

导出预览：

参考demo目录下的Vite+vue3项目

### 欢迎补充


## 常见问题
1、提示autopreview模块未安装

尝试在预览窗口点击刷新图标，然后重启服务。

2、Vue 3.0中跨文件的Provide、Reject引用可能会不支持预览。

3、是否会让项目体积变大？

Webpack和Vite的tree shaking功能会在打包时过滤掉没有使用的代码，所以AutoPreview_的代码不会影响项目体积。

4、切换编辑窗口后预览窗口没有相应更新

检查Webpack/Vite是不是没有监控(Watch) `node_modules/autopreview` 变化，以及缓存(Cache)是否没有排除掉`node_modules/autopreview`。

5、项目启动后预览窗口显示”项目未启动“

检查.vscode/setting.json中配置的`AutoPreview.serverURL`是否与服务地址一致。


----

如遇到其他问题，可通过VS Code-Help-Toggle Developer Tools打开调试，查看报错，欢迎提交issue，欢迎提PR！

