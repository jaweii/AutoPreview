<template>
  <v-layout>
    <v-app-bar style="position: relative">
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
  </v-layout>
</template>

<script lang="tsx">
import { defineComponent, FunctionalComponent, h } from "vue";

const Header = defineComponent({
  props: {
    title: String,
  },
});
export default Header;

export function AutoPreview_Header() {
  return <Header title="Title" />;
}
</script>

<style scoped>
.header {
  height: 60px;
}
</style>