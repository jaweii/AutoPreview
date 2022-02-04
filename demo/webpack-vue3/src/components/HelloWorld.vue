<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="tsx">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String,
  },
})
export default class HelloWorld extends Vue {
  msg!: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AutoPreview_Test(h) {
  return <HelloWorld msg="Hello World!" />;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
  color: white;
}
</style>
