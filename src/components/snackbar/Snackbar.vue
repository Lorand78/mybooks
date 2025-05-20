<script setup>
import { ref } from "vue";

const props = defineProps({
  p_activate: { type: Boolean, default: true },
  p_title: String,
  p_rounded: { type: String, default: "pill" },
  p_color: { type: String, default: "green" },
  p_location: { type: String, default: "top" }
});

console.log(props.p_activate)
const snackbar = ref(props.p_activate)

console.log("snackbar: " + snackbar.value)

</script>

<style scoped>
.centered-snackbar {
  display: flex;
  justify-content: center;
  /* text-align: center; */
}
</style>

<template>
  <!-- v-if="snackbar=='true'" -->
  <v-snackbar v-model="snackbar"
    :timeout = "2000"
    :color = "( p_color )"
    :rounded = "( p_rounded )"
    :location = "( p_location )"
    class = "centered-snackbar"
    >
    {{ p_title }}
  </v-snackbar>
</template>

