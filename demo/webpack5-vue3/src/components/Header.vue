<template>
  <v-layout>
    <v-app-bar style="position:relative;">
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
  </v-layout>
</template>

<script lang="tsx">
import { FunctionalComponent ,h as CreateElement} from 'vue'
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    title: String,
  },
})
export default class Header extends Vue {
  title!: string;
}

export function AutoPreview_Header(h:typeof CreateElement) {
  const FC:FunctionalComponent<{title:string}> = Header as any
  return <FC title="Title" />
}

</script>

<style scoped>
.header {
  height: 60px;
}
</style>