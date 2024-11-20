<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  p_disabled: { type: Boolean, default: false },
  p_btnName: String,
  p_type: String,
  p_headerTitle: String,
  p_title: String,
  p_okBtnName: { type: String, default: "Mentés" },
  p_cancelBtnName: { type: String, default: "Mégsem" },
  p_rounded: { type: String, default: "lg" },
  p_color: { type: String, default: "primary" }, 
  p_icon: String,
  // p_colpadding: String,
  p_colpadding: { type: String, default: "padding: 0px 0px 0px 0px" },
  p_textFieldLabel: String,
  // p_withSnackbar: { type: Boolean, default: true },
  // p_snackbarTitle: String
  // pLocation: String = "top"
  p_required: { type: Boolean, default: "false" },
  // p_rules: { type: String, default: "" },
  // p_errorMessages: { type: String, default: "" },
  // p_clickClear: { type: String, default: "" },
  // p_updateModelValue: { type: String, default: "" },
})

const snackbar = ref(false)
const res = ref("OK")
const fieldTextValue = ref(null)
const errorMsg = ref("")
// const isActive = ref(true)

defineExpose( {
  res,
  fieldTextValue,
  close() {$emit('close')}
})

function onEnter() {
  console.log("fieldTextValue: ", fieldTextValue.value)
  if ( fieldTextValue.value != "" && fieldTextValue.value != null ) {
    console.log("fieldTextValue: ", fieldTextValue.value)
    isActive = false
  }
}

</script>

<template>
  <v-card-actions>
    <!-- <v-snackbar  v-model="snackbar" v-if="p_withSnackbar == true"
      :timeout="2000"
      color="blue-grey"
      rounded="pill"
      location="top"
    >
      {{ p_snackbarTitle }}
    </v-snackbar> -->
    <v-col cols="auto" :style = "(p_colpadding)">
      <v-dialog persistent transition="dialog-top-transition" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn v-if = "!p_btnName"
            :icon = "(p_icon)"
            :rounded = "(p_rounded)" 
            elevation="16" 
            :color = "(p_color)" 
            v-bind="props"
            :disabled = "(p_disabled)"
          ></v-btn>
          <v-btn v-else
            :rounded = "(p_rounded)" 
            elevation="16" 
            :color = "(p_color)" 
            v-bind="props"
            :disabled = "(p_disabled)"
          > {{ p_btnName }}
          </v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card
            rounded="lg"
            elevation="16"
            color = "#e3d19f"
          >
            <v-toolbar v-if="p_headerTitle"
              rounded="lg"
              elevation="16"
              density="compact"
              :color = "(p_type)"
              :title = "(p_headerTitle)"
            ></v-toolbar>
            <v-card-text>
              <v-text-field v-if = "p_textFieldLabel"
                autofocus
                style="min-width: 250px;"
                v-model="fieldTextValue"
                clearable 
                :label = "(p_textFieldLabel)" 
                variant="solo-filled"
                :required = " p_required "
                :rules = " [v => !!v]"
                :error-messages = " errorMsg "
                @update:modelValue = " fieldTextValue ? errorMsg = '' : errorMsg = 'Kötelező mező' "
                @keydown.enter = "onEnter()"
                @keydown.esc = "isActive.value = false"
              ></v-text-field>
              <div v-if = "p_title" class="text-h6 pa-2"> {{ p_title }} </div>
            </v-card-text>
            <!-- height="40px" -->
            <v-card
              variant="tonal" 
              >
              <v-card-actions 
                class="justify-end"
                style="min-height: auto;"
              >
                <v-btn      
                  :disabled = " ( errorMsg != '' || fieldTextValue == '' || fieldTextValue == null ) && p_textFieldLabel"
                  variant="tonal" 
                  density="compact"
                  :color = "(p_color)" 
                  v-bind="props"
                  @click="isActive.value = false; 
                  res = 'OK'; 
                  snackbar = true; 
                  $emit('close'); fieldTextValue = ''"
                  >{{ p_okBtnName }}
                </v-btn>

                <v-btn variant="tonal" density="compact" @click="isActive.value = false; res = 'CANCEL'; fieldTextValue = ''"
                  >{{ p_cancelBtnName }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-card-actions>
</template>