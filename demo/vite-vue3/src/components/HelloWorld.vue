<script setup lang="tsx">
import { ref } from "vue";
defineProps<{ msg: string }>();
</script>

<template>
  <div>
    <h1>
      {{ msg }}
    </h1>
  </div>
</template>

<style>
#app {
  background-color: white !important;
}
</style>

<script lang="tsx"> 
import { h, resolveDynamicComponent,FunctionalComponent } from "vue";

export function AutoPreview_Test() {
  const HelloWorld = resolveDynamicComponent("HelloWorld") as FunctionalComponent<{msg:string}>;
  if(!HelloWorld) {
    throw new Error("Could not resolve HelloWorld");  
  }
  return <HelloWorld msg="Happy new year!" />;
};

export function AutoPreview_Test2 () {
  const HelloWorld = resolveDynamicComponent("HelloWorld") as FunctionalComponent<{msg:string}>;
  return <HelloWorld msg="新年快乐" />;
};
</script>