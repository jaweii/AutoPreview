<template>
  <Header title="Todo list" />
  <item
    v-for="(item, i) in list"
    :key="i"
    :text="item.text"
    @remove="list.splice(i, 1)"
  >
  </item>
  <v-btn
    icon="mdi-plus"
    color="primary"
    class="add"
    @click="this.dialog.show = true"
  ></v-btn>
  <v-dialog v-model="dialog.show">
    <v-card>
      <v-card-text>
        <v-text-field
          width="80vw"
          label="Add to-do"
          v-model="dialog.value"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog.show = false"> Close </v-btn>
        <v-btn text @click="add"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="tsx">
import { defineComponent, h } from "vue";
import Header from "./components/Header.vue";
import Item from "./components/Item.vue";

const App = defineComponent({
  name: "App",
  components: {
    Header,
    Item,
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
      this.list.push({ text: this.dialog.value });
      this.dialog.value = "";
      this.dialog.show = false;
    },
  },
});

export default App;

export function AutoPreview_App() {
  return <App />;
}

export function AutoPreview_App2() {
  return (
    <div style="background:lightgray;height:100vh;">
      <App />
    </div>
  );
}
</script>

<style scoped>
.add {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>