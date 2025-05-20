<script setup>
// import { nextTick } from 'process';
import { readonly, ref, watch, nextTick } from 'vue';

const props = defineProps({
  p_visible: Boolean,
  p_defvalue: String,
  p_readonly: { type: Boolean, default: false },
  p_disabled: { type: Boolean, default: false },  
  p_btnName: String,
  p_type: String,
  p_headerTitle: String,
  p_title: String,
  p_size: { type: String, default: "default" },
  p_variant: { type: String, default: "elevated" },
  p_elevation: { type: String, default: "0" },
  p_okBtnName: { type: String, default: "Mentés" },
  p_cancelBtnName: { type: String, default: "Mégsem" },
  p_rounded: { type: String, default: "lg" },
  p_color: { type: String, default: "primary" }, 
  p_icon: String,
  p_prependicon: String,
  // p_colpadding: String,
  p_colpadding: { type: String, default: "padding: 0px 0px 0px 0px" },
  p_textFieldLabel: String,
  // p_withSnackbar: { type: Boolean, default: true },
  // p_snackbarTitle: String
  // pLocation: String = "top"
  p_required: { type: Boolean, default: false },
  p_action: { type: String, default: "" },  //ha át kell adni egy módot, pl.: 'ins', 'upd', 'del'
  p_tooltipText: { type: String, default: "" },
  p_tooltipLocation: { type: String, default: "end"},
  // p_rules: { type: String, default: "" },
  // p_errorMessages: { type: String, default: "" },
  // p_clickClear: { type: String, default: "" },
  // p_updateModelValue: { type: String, default: "" },

//innentől az autocomlete mezőhöz tartozó paraméterek vannak  
  p_autocomplete: { type: Boolean, default: false},
  p_acDefaultValue: { type: String, default: ""},
  p_acLabel: { type: String, default: ""},
  p_acItems: { type: String, default: ""},
  p_acKey: { type: String, default: ""},
  p_acTitle: { type: String, default: ""},
  p_acValue: { type: String, default: ""},
  p_acErrorMsg: { type: String, default: ""}
})

const snackbar = ref(false)
const res = ref("X")
const fieldTextValue = ref("")
const autocompleteValue = ref("")
const errorMsg = ref("")
const isActive = ref(true)

const dialogVisible = ref(false)
const emit = defineEmits(['update:p_visible', 'close', 'save'])

watch(() => props.p_visible, (val) => {
  console.log("props.p_visible changed to:", val) // debug
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  if (dialogVisible && props.p_defvalue) {
    fieldTextValue.value = props.p_defvalue
  } else {
    fieldTextValue.value = ''
  }
  if (autocompleteValue && props.p_acDefaultValue) {
    autocompleteValue.value = props.p_acDefaultValue
  }
  if (dialogVisible && props.p_autocomplete && !props.p_acDefaultValue) {
    autocompleteValue.value = null
  }
  console.log("autocomplete: ", autocompleteValue)
  emit('update:p_visible', val)
  console.log("dialogVisible watch")
  if (!val && res.value != 'CANCEL') {
    console.log('res: ', res.value, val)
    emit('close')
  }
})

function close() {
  emit('close')
  nextTick(() => {
    emit('save', 'upd', fieldTextValue.value, autocompleteValue.value)
  })
}

defineExpose(
   {
  res,
  fieldTextValue,
  autocompleteValue,
  close
})

function onEnter() {
  if ( fieldTextValue.value != "" && fieldTextValue.value != null ) {
    console.log("fieldTextValue: ", fieldTextValue.value)
    // isActive.value = p_btnName || p_icon
    // console.log("isActive: " + isActive)
  }
}

function onClose(resVal) {
  isActive.value = false
  console.log("resVal: ", resVal) 
  res.value = resVal
  dialogVisible.value = false 
  console.log("fieldTextValue onClose: ", fieldTextValue.value)
  autocompleteValue.value = ''
  // fieldTextValue.value = ''
}

</script>

<!-- <template style="display: inline-block;"> -->
<template>
  <v-card-actions style="padding: 0;">
    <!-- <v-snackbar  v-model="snackbar" v-if="p_withSnackbar == true"
      :timeout="2000"
      color="blue-grey"
      rounded="pill"
      location="top"
    >
      {{ p_snackbarTitle }}
    </v-snackbar> -->
    <v-col cols="auto" :style = "p_colpadding">
      <v-dialog 
        v-model = "dialogVisible"
        persistent 
        transition="dialog-top-transition" 
        width="auto">
        <template v-slot:activator="{ props }">
          <v-btn v-if = "p_btnName || p_icon"
            :icon = "p_icon"
            :size = "p_size"
            :variant = "p_variant"
            :rounded = "p_rounded" 
            :elevation = "p_elevation" 
            :color = "p_color" 
            v-bind="props"
            :disabled = "p_disabled"
            :prepend-icon = "p_prependicon"
          >
            <v-icon v-if="p_icon">{{ p_icon }}</v-icon>
            <v-tooltip v-if="p_tooltipText != ''"
              activator="parent"
              :location = "p_tooltipLocation"
              :text = "p_tooltipText"
            >
            </v-tooltip>
            {{ p_btnName }}
          </v-btn>
          <!-- <v-btn v-else
            :variant = "(p_variant)"
            :rounded = "(p_rounded)" 
            :elevation = "(p_elevation)" 
            :color = "(p_color)" 
            v-bind="props"
            :disabled = "(p_disabled)"
          > 
            <v-icon v-if="p_icon">{{ p_icon }}</v-icon>
            {{ p_btnName }} -->
          <!-- <v-tooltip 
              activator="parent"
              location="end"
              text="Részletek"
            >
            </v-tooltip> -->
          <!-- </v-btn> -->
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
              :color = "p_type"
              :title = "p_headerTitle"
            ></v-toolbar>
            <v-card-text>
              <v-text-field v-if = "p_textFieldLabel"              
                autofocus
                style="min-width: 250px;"
                v-model="fieldTextValue"
                :clearable = "!p_readonly"
                :readonly = "p_readonly"
                :label = "p_readonly ? '' : p_textFieldLabel" 
                variant="solo-filled"
                :required = " p_required "
                :rules = " [v => !!v]"
                :error-messages = " errorMsg "
                @update:modelValue = " fieldTextValue ? errorMsg = '' : errorMsg = 'Kötelező mező' "
                @keydown.enter = "onEnter()"
                @keydown.esc = "onCancel('CANCEL')"
              ></v-text-field>
              <v-autocomplete
                  v-if = "p_autocomplete"
                  style="min-width: 250px;"
                  clearable
                  v-model="autocompleteValue"
                  :label="p_acLabel"
                  :items="p_acItems"
                  :key="p_acKey"
                  :item-title="p_acTitle"
                  :item-value="p_acValue"
                  variant="solo-filled"
                  return-object
                  density="compact"
                  no-data-text = "Nincs a keresésnek megfelelő adat"
                  :required = " true "
                  :error-messages = "p_acErrorMsg "
                ></v-autocomplete>
                <!-- @keyup=" actauthor == '' || actauthor == null || actauthor == undefined ?  errorMsgAuthor = 'Kötelező mező!' : errorMsgAuthor = '' "
                  :rules = " [v => !!v]"
                  @click:clear = " errorMsgAuthor = 'Kötelező mező!' "
                  @update:modelValue = " actauthor != '' || actauthor != null || actauthor != undefined ? errorMsgAuthor = '' : null" -->
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
                  <!-- @click="isActive.value = false; 
                          res = 'OK'; 
                          snackbar = true;"  -->
              <!-- // $emit('close');  -->
                          <!-- fieldTextValue = ''" -->
                <v-btn      
                  :disabled = " ( errorMsg != '' || fieldTextValue == '' || fieldTextValue == null ) && p_textFieldLabel"
                  variant="tonal" 
                  density="compact"
                  :color = "p_color" 
                  v-bind="props"
                  @click = "emit('save', props.p_action, fieldTextValue, autocompleteValue), onClose('OK')"
                  >{{ p_okBtnName }}
                </v-btn>

                <v-btn variant="tonal" density="compact" @click="onClose('CANCEL')"
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