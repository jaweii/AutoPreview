<template>
  <Header>
    <template #actions>
      <a-button type="text" ghost @click="dialog.show = true">Add</a-button>
    </template>
  </Header>
  <a-list :data-source="list" class="list">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a-button type="text" @click="del(item)">Delete</a-button>
        </template>
        <a-list-item-meta>
          <template #title>
            {{ item.text }}
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
  <a-modal v-model:visible="dialog.show" title="Add" @ok="add">
    <a-textarea v-model:value="dialog.value" show-count />
  </a-modal>
</template>

<script lang="tsx">
import { defineComponent, h } from "vue";
import Header from "./components/Header.vue";

const App = defineComponent({
  name: "App",
  components: {
    Header,
  },
  data() {
    return {
      list: [{ text: "Support Vue 3.0" }],
      dialog: {
        show: false,
        value: "",
      },
    };
  },
  methods: {
    add() {
      if (!this.dialog.value) return;
      this.list.push({ text: this.dialog.value });
      this.dialog.value = "";
      this.dialog.show = false;
    },
    del(item: any) {
      this.list.splice(this.list.indexOf(item), 1);
    },
  },
});

export default App;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function AutoPreview_App() {
  return <App />;
}
</script>

<style scoped>
.list {
  padding: 10px;
}

.add {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>