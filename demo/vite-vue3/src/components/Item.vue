<template>
  <v-list-item>
    <v-list-item-title v-text="text"></v-list-item-title>
    <v-list-item-avatar right>
      <v-btn
        variant="text"
        color="grey lighten-1"
        size="small"
        icon="mdi-close"
        @click="$emit('remove')"
      ></v-btn>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script lang="tsx">
import { defineComponent } from "vue";

const ListItem = defineComponent({
  props: {
    text: String,
  },
});

export default ListItem;

export function AutoPreview_ListItem() {
  return <ListItem text="List item" />;
}
</script>
