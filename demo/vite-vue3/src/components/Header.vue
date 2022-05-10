<template>
  <header>
    <a-page-header>
      <template #title>
        <span style="color: white">TODO LIST</span>
      </template>
      <template #extra>
        <slot name="actions"> </slot>
      </template>
    </a-page-header>
  </header>
</template>


<script lang="tsx">
import { defineComponent, h } from "vue";

const Header = defineComponent({
  data() {
    return {};
  },
});

export default Header;

export function AutoPreview_Header() {
  return <Header />;
}
</script>

<style lang="less" scoped>
header {
  padding: 0 10px;
  background: lightblue;
}
</style>