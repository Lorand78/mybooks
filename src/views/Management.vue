<script setup>
  console.log("Karbantartás!!!")
  import { onMounted, ref, nextTick } from 'vue'
  import { VDataTable } from 'vuetify/labs/VDataTable'
  import axios from 'axios'
  import { useRouter } from "vue-router";
  import { loggedIn, user } from '../components/sidebar/state';
  import MyDialog from '../components/myDialog/MyDialog.vue'
  import SnackBar from '../components/snackbar/Snackbar.vue'
  import * as xlsx from '../../node_modules/xlsx/xlsx.mjs';
  import { title } from 'process';
  import { nationality } from '../main';
  import { useManagementUtils } from '@/utils/useManagementUtils'

  const route = useRouter()
  const data = ref(null)
  const cat = route.currentRoute.value.params.type
  var isAutocomplete = cat == 'AT'
  const loading = ref(false)
  const search = ref("")
  // const titlevalue = ref("")
  // const keyvalue = ref("")
  // const keyID = ref(null)
  const acKeyID = ref(null)
  // const newtitle = ref("")
  // const modifytitle = ref("")
  // const deletetitle = ref("")
  const xlsxFilename = ref("")
  const xlsxSheetname = ref("")
  const myNewDialog = ref(null)
  const myModifyDialog = ref(null)
  const myDeleteDialog = ref(null)
  const selectedItem = ref(null)
  const isModifyDialog = ref(false)
  const isDeleteDialog = ref(false)
  const isSnackbarActive = ref(false)
  const snackbarTitle = ref(null)
  const snackbarColor = ref("green")

  const {
    titlevalue, keyvalue, keyID, newtitle, modifytitle, deletetitle,
    setMetaByCat, setItem
  } = useManagementUtils()

  const fetchData = async (cat) => {
    loading.value = true
    try {
      // console.log('https://myownbooks.000webhostapp.com/getData.php?cat='+cat)
      // const response = await axios('getData.php?cat=' + cat + '&user=' + user.value)
      const response = await axios.get('/api/data/' + cat + '/-1/' + user.value)      
      console.log("response: ", response.data)
      data.value = response.data
      console.log("data: ", data.value)
    } catch (error) {
      console.log("error: ", error.response)
    }
    loading.value = false
  }

  onMounted( async () => {
    console.log('onMounted, cat: ', route.currentRoute.value.params.type)
    if ( loggedIn.value == true ) {
      setMetaByCat(route.currentRoute.value.params.type)
      await fetchData(cat)
    }
    console.log('onMounted után')
    // console.log("data: ", data.value.data[0])
  })

  // switch (cat) {
  //   case 'AT':
  //     console.log("Szerzők!!!")
  //     titlevalue.value = 'Szerző'
  //     keyvalue.value = 'AT_AUTHORNAME'
  //     keyID.value = 'AT_ID'
  //     acKeyID.value = 'AT_NN_ID'
  //     newtitle.value = 'Új szerző'
  //     modifytitle.value = 'Szerző módosítása'
  //     deletetitle.value = "Biztos végleg törli a szerzőt?"
  //     xlsxFilename.value = 'authors.xlsx'
  //     xlsxSheetname.value = 'Szerzők'
  //     break;
  //   case 'CG':
  //     console.log("Műfajok!!!")
  //     titlevalue.value = 'Műfaj'
  //     keyvalue.value = 'CG_CATEGORY'
  //     keyID.value = 'CG_ID'
  //     newtitle.value = 'Új műfaj'
  //     modifytitle.value = 'Műfaj módosítása'
  //     deletetitle.value = "Biztos végleg törli a műfajt?"
  //     xlsxFilename.value = 'category.xlsx'
  //     xlsxSheetname.value = 'Műfajok'
  //     break;
  //   case 'BT':
  //     console.log("Kategóriák!!!")
  //     titlevalue.value = 'Kategória'
  //     keyvalue.value = 'BT_TYPENAME'
  //     keyID.value = 'BT_ID'
  //     newtitle.value = 'Új kategória'
  //     modifytitle.value = 'Kategória módosítása'
  //     deletetitle.value = "Biztos végleg törli a kategóriát?"
  //     xlsxFilename.value = 'booktype.xlsx'
  //     xlsxSheetname.value = 'Kategóriák'
  //     break;
  //   case 'OS':
  //     console.log("Státuszok!!!")
  //     titlevalue.value = 'Státusz'
  //     keyvalue.value = 'OS_NAME'
  //     keyID.value = 'OS_ID'
  //     newtitle.value = 'Új státusz'
  //     modifytitle.value = 'Státusz módosítása'
  //     deletetitle.value = "Biztos végleg törli a státuszt?"
  //     xlsxFilename.value = 'ownershipstatus.xlsx'
  //     xlsxSheetname.value = 'Státuszok'
  //     break;
  //   case 'PS':
  //     console.log("Kiadók!!!")
  //     titlevalue.value = 'Kiadó'
  //     keyvalue.value = 'PS_PUBLISHERNAME'
  //     keyID.value = 'PS_ID'
  //     newtitle.value = 'Új kiadó'
  //     modifytitle.value = 'Kiadó módosítása'
  //     deletetitle.value = "Biztos végleg törli a kiadót?"
  //     xlsxFilename.value = 'publisher.xlsx'
  //     xlsxSheetname.value = 'Kiadók'
  //     break;
  
  //   default:
  //     break;
  // }

  const headers = ref([])
  if (cat === 'AT') {
    headers.value = [
      { title: titlevalue, key: keyvalue },
      { title: 'Nemzetiség', key: 'NN_COUNTRYCODE' },
      { title: 'Műveletek', key: 'actions', sortable: false },
    ]
  } else {
    headers.value = [
      { title: titlevalue, key: keyvalue },
      { title: 'Műveletek', key: 'actions', sortable: false },
    ]

  }
  console.log('head: ', headers )

  async function exportXlsxBtnClick() {
    const XLSX = xlsx
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data.value)
    XLSX.utils.book_append_sheet(workbook, worksheet, xlsxSheetname.value)
    XLSX.writeFile(workbook, xlsxFilename.value)

  }

  // async function setItem(action, newValue) {
  //   const myDialog = action == 'add' ? myNewDialog : action == 'upd' ? myModifyDialog : myDeleteDialog
  //   console.log("setItem!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  //   console.log("myDialog.value.autocompleteValue: ", myDialog.value.autocompleteValue)
  //   const txt = ref("")
  //   const actiontxt = action == 'add' ? 'felvitele' : action == 'upd' ? 'módosítása' : 'törlése'
  //   snackbarColor.value = 'red'
  //   // console.log("selectedItem.value[KEYid]: ", selectedItem.value[keyID.value])
  //   console.log('keyID: ', keyID.value)
  //   console.log('cat: ', cat)
  //   console.log('action: ', action)
  //   try {
  //     // const res = await axios("setData.php?cat=INSAT&name=" + refMyDialogNewAuthor.value.fieldTextValue)
  //     const res = await axios.post('/' + action + '/' + cat, 
  //       { name: myDialog.value.fieldTextValue, 
  //         id: action == 'add' ? -1 : selectedItem.value[keyID.value], 
  //         nationalityid: cat == 'AT' && myDialog.value.autocompleteValue ? myDialog.value.autocompleteValue.NN_ID : null
  //       }
  //     )
  //     // const res = await axios.post('/' + action + '/' + cat, { name: 'myDialog.value.fieldTextValue', id: selectedItem.value[keyID.value], nationalityid: '2' })
  //     console.log(res)
  //     if (res && res.status == "200") {
  //       txt.value = 'A ' + titlevalue.value.toLowerCase() + ' ' + actiontxt + ' sikeresen megtörtént!'
  //       snackbarColor.value = "green"
  //       await fetchData(cat)
  //     } else {
  //       txt.value = 'Hiba történt a ' + titlevalue.value.toLowerCase() + ' ' + actiontxt + ' közben!'
  //     }
  //   } catch (error) {
  //     console.log('error.response: ', error.response)
  //     if (error.response.status == "400") { 
  //       txt.value = 'Nem törölhető, mert van hozzárendelve könyv!'
  //     } else { 
  //       txt.value = 'Hiba történt a ' + titlevalue.value.toLowerCase() + ' ' + actiontxt + ' közben!'
  //     }
  //   }
  //   snackbarTitle.value = txt.value
  //   isSnackbarActive.value = true
  //   setTimeout(() => { isSnackbarActive.value = false }, 5000)
  //   selectedItem = null
  // }

  function goToTop() {
    window.scrollTo(0,0)
  }

  function openDialog( item, action ) {
    selectedItem.value = item
    console.log("selectedItem: ", selectedItem.value)
    nextTick(() => {
      action == 'upd' ? isModifyDialog.value = true : isDeleteDialog.value = true
    })  
  }

  async function saveItem(action, myDialog) {
    await setItem({
      action,
      myDialog,
      selectedItem,
      cat: route.currentRoute.value.params.type,
      fetchData,
      snackbarState: {
        color: snackbarColor,
        message: snackbarTitle,
        active: isSnackbarActive
      }
    })
  }

</script>

<template>
  <v-container fluid> 
    <SnackBar v-if="isSnackbarActive" :p_title="snackbarTitle" :p_color="snackbarColor" />
    <v-row  v-if="loggedIn">
        <v-col cols = 2></v-col>
        <v-col cols = 8>
          <!-- @close = "() => nextTick(() => setItem('upd'))" -->
          <MyDialog v-if = "selectedItem"
                      v-model:p_visible="isModifyDialog"
                      ref = "myModifyDialog"
                      :p_defvalue = "selectedItem ? selectedItem[keyvalue] : ''"
                      p_type="brown"
                      :p_headerTitle = modifytitle
                      p_colpadding = "padding: 0px 7px 0px 0px"
                      p_color = "black"
                      p_variant="tonal"
                      :p_textFieldLabel = titlevalue
                      p_required = " true "
                      p_action = "upd"
                      @save = "saveItem('upd', myModifyDialog)"
                      :p_autocomplete = "isAutocomplete"
                      :p_acDefaultValue = "selectedItem ? selectedItem[acKeyID] : ''"
                      p_acLabel = "Nemzetiség"
                      :p_acItems = nationality
                      p_acKey = "NN_ID"
                      p_acTitle = "NN_NATIONALITY"
                      p_acValue = "NN_ID"
                      />
          <MyDialog v-if = "selectedItem"
                      v-model:p_visible="isDeleteDialog"
                      ref = "myDeleteDialog"
                      :p_defvalue = "selectedItem ? selectedItem[keyvalue] : ''"
                      p_type="brown"
                      :p_headerTitle = deletetitle
                      p_colpadding = "padding: 0px 7px 0px 0px"
                      p_color = "black"
                      p_variant="tonal"
                      :p_textFieldLabel = deletetitle
                      @close = "saveItem('del', myDeleteDialog)"
                      p_required = " true "
                      p_disabled = " true "
                      p_readonly = " true "
                      p_okBtnName = "Igen"
                      p_cancelBtnName = "Nem"
          />
          <v-card
            rounded="lg"
            style="padding: 15px; background-color: antiquewhite;"
          >
            <v-data-table v-if="data"
              style="background-color: antiquewhite;"
              v-model = "selectedRow"
              density="compact"
              :headers="headers"
              :items="data"
              :item-value="keyvalue"
              :item-key="keyvalue"
              class="elevation-1"
              :search="search"
              hover="true"
              multi-sort="true"
              :items-per-page-text = "titlevalue + ' oldalanként'"
              select-strategy="page"
              :no-data-text = "'Nincs a keresésnek megfelelő ' + titlevalue.toLowerCase() + '...'"
              :loading = " loading "
              loading-text = "Betöltés... Kérem várjon"
              show-current-page="true"
              page-text=""
              @update:page="goToTop()"
            >
            <!-- @click:row="btnClick(selectedRow)" -->
            <!-- fixed-header="true" -->
              <template v-slot:top>
                <v-card
                  rounded="lg"
                  elevation="6"            
                  color="black"
                  variant="tonal"
                  style="margin: 10px 10px 10px 10px"
                >
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model = "search"
                        label = "Keresés"
                        class = "mx-auto"
                        clearable
                        append-inner-icon="fas fa-magnifying-glass"
                        style="padding: 10px 10px 0px 10px; margin-top: 10px;"
                        rounded="lg"
                        elevation="10"            
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2"></v-col>                  
                    <v-col cols="3">
                      <MyDialog ref = "myNewDialog"
                        p_defvalue = ""
                        :p_btnName = newtitle
                        p_type="brown"
                        p_prependicon = "fa fa-square-plus"
                        :p_headerTitle = newtitle
                        p_colpadding = "padding: 30px 0px 0px 0px"
                        p_color = "black"
                        p_size = "default"
                        p_rounded = "lg"
                        p_elevation = 10
                        p_variant="tonal"
                        :p_textFieldLabel = titlevalue
                        @save = "saveItem('add', myNewDialog)"
                        p_required = " true "
                        p_tooltipText = "Új"
                        p_tooltipLocation = "start"
                        :p_autocomplete = "isAutocomplete"
                        :p_acDefaultValue = "''"
                        p_acLabel = "Nemzetiség"
                        :p_acItems = nationality
                        p_acKey = "NN_ID"
                        p_acTitle = "NN_NATIONALITY"
                        p_acValue = "NN_ID"
                      />
                    </v-col>
                    <v-col cols="1" style="padding-right: 20px;">
                      <v-btn 
                        v-model="exportXlsxBtn"
                        icon
                        style="margin: 30px 0px 0px 0px;height: 36px;"                        
                        rounded="lg"
                        elevation="10"            
                        variant="tonal"
                        @click="exportXlsxBtnClick()"
                      >
                        <v-icon>mdi-export</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </template>
              <template v-slot:item.NN_COUNTRYCODE="{ item }">
                <img 
                  :src="`https://flagcdn.com/w40/${item.NN_COUNTRYCODE || 'un'}.png`" alt="zászló" :title="item.NN_NATIONALITY || 'Nincs megadva'" 
                  style="vertical-align: middle;"
                />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-row dense no-gutters align="center">
                  <v-btn
                    icon
                    style="margin-right: 10px;"
                    variant="tonal"
                    size="x-small"
                    color="black"                    
                    @click="openDialog(item, 'upd')"
                  >
                    <v-icon>fa fa-pen-to-square</v-icon>
                    <v-tooltip 
                      activator = "parent"
                      text = "Módosítás" 
                      location = "left" 
                    />
                  </v-btn>
                  <v-btn
                    icon
                    variant="tonal"
                    size="x-small"
                    color="black"
                    @click="openDialog(item, 'del')"
                  >
                    <v-icon>fa fa-trash</v-icon>
                    <v-tooltip 
                      activator = "parent"
                      text = "Törlés" 
                      location = "right" 
                    />
                  </v-btn>
                </v-row>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols = 2></v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-card v-if="!loggedIn"
          rounded="lg"
          elevation="16"
          color = "#e3d19f"
          width = 600 px
        >        
          <h1 
            style="color: red; font-weight: bold; text-align: center;"
          >
            Nincs bejelentkezve!
          </h1>
        </v-card>
      </v-row>
    </v-container>
</template>