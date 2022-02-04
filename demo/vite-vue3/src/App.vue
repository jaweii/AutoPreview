<script setup lang="tsx">
import HelloWorld from "./components/HelloWorld.vue";

const components = { HelloWorld };
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <HelloWorld msg="Hello world" />
  <img alt="Vue logo" src="./assets/logo.png" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>


<script lang="tsx">
import { h, resolveDynamicComponent, FunctionalComponent } from "vue";

export function AutoPreview_App() {
  const App = resolveDynamicComponent("App") as FunctionalComponent<{}>;
  return <App />;
};
</script>