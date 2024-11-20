<script setup>
  import { useRouter } from "vue-router";
  import axios from 'axios'
  import { onMounted, readonly, ref, watch } from 'vue';
  import SnackBar from '../components/snackbar/Snackbar.vue'
  import MyDialog from '../components/myDialog/MyDialog.vue'
  import { author, category, booktype, osstatus, publisher, fetchData } from '../main'
  import { loggedIn, user } from '../components/sidebar/state';
  // import Home from './Home.vue'
  
  
  // const props = defineProps({
  //   modtype: { type: String, default: "ins" }
  // })
  
  const route = useRouter()
  const modetype = route.currentRoute.value.params.type
  const disabled = modetype == 'details'
  const loading = ref(false)
  // console.log('disabled: ', disabled)
  // const author = ref(null)
  // const category = ref(null)
  // const booktype = ref(null)
  // const osstatus = ref(null)
  // const publisher = ref(null)
  const issaveBook = ref(false)
  const readstatus = ref("N")
  // const snackbarActivate = ref(false)
  const title = ref("")
  // const isActiveNewAuthor = ref(false)
  const isSnackbarActive = ref(false)
  const refMyDialogNewAuthor = ref(null)
  const refMyDialogNewPublisher = ref(null)
  const refMyDialog = ref(null)
  const snackbarTitle = ref(null)
  const snackbarColor = ref("green")
  const newAuthorname = ref(null)
  const yop = ref("2023")
  const rating = ref(2.5)
  const description = ref("")
  const selectedItem = ref(null)
  // const atindex = ref(0)
  // const cgindex = ref(0)
  // const btindex = ref(0)
  // const osindex = ref(0)
  // const psindex = ref(0)
  const saveMsg = ref("")
  const actauthor = ref(null)
  const actcategory = ref(null)
  const actbooktype = ref(null)
  const actownership = ref({ OS_ID: null, OS_NAME: null })
  const actpublisher = ref({ PS_ID: null, PS_PUBLISHERNAME: null })

  const errorMsgTitle = ref("")
  const errorMsgAuthor = ref("")
  const errorMsgCategory = ref("")
  const errorMsgBooktype = ref("")
  const errorMsgNewAuthor = ref("")

  function findIndex( obj, key, val) {
    const foundedIndex = ref(-1)
    for (let index = 0; index < obj.value.length && foundedIndex.value == -1; index++) {
      // console.log('obj: ', obj.value[index][key]) 
      if ( obj.value[index][key] == val ) {
        foundedIndex.value = index
      }
    }    
    // console.log('foundedIndex: ', foundedIndex.value)
    return foundedIndex.value
  }

  const fetchBookData = async (cat) => {
    // console.log("route: ", route.currentRoute.value.params.type)
    console.log("route: ", route.currentRoute.value.params.type)
    try {
      // console.log(mdiHome)
      console.log("currroute: ", route.currentRoute.value.query.id)
      // console.log('https://myownbooks.000webhostapp.com/getData.php?cat='+cat)
      // const response = await axios('getData.php?cat='+cat)
      const response = await axios.get('/api/data/' + cat + '/NULL')      
      console.log('response: ', response.data)

      // switch (cat) {
      //   case 'AT': 
      //     author.value = response.data
      //     console.log("author: " + author)
      //     break
      //   case 'CG': 
      //     category.value = response.data
      //     console.log("category: " + category)
      //     break
      //   case 'BT': 
      //     booktype.value = response.data
      //     console.log(" booktype: " + booktype)
      //     break
      //   case 'OS': 
      //     osstatus.value = response.data
      //     console.log("osstatus: ", osstatus)
      //     break
      //   case 'PS': 
      //     publisher.value = response.data
      //     console.log("publisher: ", publisher)
      //     break
      //   default:
          title.value = response.data[0].BK_BOOKTITLE   
          readstatus.value = response.data[0].BK_READED       
          // atindex.value = findIndex( author, 'AT_ID', response.data[0].BK_AT )
          // actauthor.value = modetype == 'new' ? 0 : response.data[findIndex( author, 'AT_ID', response.data[0].BK_AT )].BK_AT
          actauthor.value = author.value[findIndex( author, 'AT_ID', response.data[0].BK_AT )].AT_AUTHORNAME
          console.log('actauthor: ', actauthor.value)
          // author.value.selected = response.data[0].BK_AT 
          // console.log('actauthor: ', actauthor)
          // cgindex.value = findIndex( category, 'CG_ID', response.data[0].BK_CG_ID )
          actcategory.value = category.value[findIndex( category, 'CG_ID', response.data[0].BK_CG_ID )].CG_CATEGORY          
          // btindex.value = findIndex( booktype, 'BT_ID', response.data[0].BK_BT )
          actbooktype.value = booktype.value[findIndex( booktype, 'BT_ID', response.data[0].BK_BT )].BT_TYPENAME
          // osindex.value = findIndex( osstatus, 'OS_ID', response.data[0].BK_OS_ID )
          if ( response.data[0].BK_OS_ID != null ) {
            actownership.value.OS_ID = response.data[0].BK_OS_ID
            actownership.value.OS_NAME = osstatus.value[findIndex( osstatus, 'OS_ID', response.data[0].BK_OS_ID )].OS_NAME
          }
          // psindex.value = findIndex( publisher, 'PS_ID', response.data[0].BK_PS_ID )
          if ( response.data[0].BK_PS_ID != null ) {
            actpublisher.value.PS_ID = response.data[0].BK_PS_ID
            actpublisher.value.PS_PUBLISHERNAME = publisher.value[findIndex( publisher, 'PS_ID', response.data[0].BK_PS_ID )].PS_PUBLISHERNAME
          }
          yop.value = response.data[0].BK_YEAR_OF_PUBLICATION
          rating.value = response.data[0].BK_RATE
          description.value = response.data[0].BK_DESCRIPTION
      // }
      // response.data.forEach(e => {
      //   console.log(e.AT_AUTHORNAME)
      //   author.push(e)
      //   // author.push(e.AT_AUTHORNAME)
      // });
      //author.value = response.data
      //console.log(author.value[0].AT_AUTHORNAME)
    } catch (error) {
      console.log(error.response)
    }
  }

  onMounted( async () => {
    console.log('onMounted')
    loading.value = true
    if ( modetype == "new" ) {
      saveMsg.value = "Biztos menti az új könyvet?"
      errorMsgTitle.value = "Kötelező mező!"
      errorMsgAuthor.value = "Kötelező mező!"
      errorMsgBooktype.value = "Kötelező mező!"
      errorMsgCategory.value = "Kötelező mező!"
    } else if ( modetype == "modify" ) {
      saveMsg.value = "Biztos menti a könyv módosítását?"
    }
    // await fetchData('AT')
    // await fetchData('CG')
    // await fetchData('BT')
    // await fetchData('OS')
    // await fetchData('PS')
    if ( modetype != "new" ) {
      // await fetchBookData('BK&id=' + route.currentRoute.value.query.id)
      await fetchBookData('BK/' + route.currentRoute.value.query.id)
    }
    loading.value = false
  })

  watch( 
    () => route.currentRoute.value.params.type,
    () => {
        console.log(route.currentRoute.value.params.type)
        location.reload()
    }
  )

  async function saveBook() {
    console.log("saveBook!!!")

    if ( !( errorMsgTitle.value == "" && errorMsgAuthor.value == "" && errorMsgCategory.value == "" && errorMsgBooktype.value == "" ) ) {
      snackbarTitle.value = " Vannak kitöltetlen kötelező mezők! "
      snackbarColor.value = "red"
      isSnackbarActive.value = true
      setTimeout(() => { isSnackbarActive.value = false }, 2000)
    } else {

      issaveBook.value = true
      console.log(refMyDialog.value.res)

      const txt = ref("") 

      let tempMsg = ref("")
      let res = ref(null)
      try {
        if ( modetype == 'new' ) {
          var sqlFields = "INSERT INTO BOOK (BK_BOOKTITLE, BK_READED, BK_USER";
          var sqlValues = " VALUES ('" + title.value + "', '" + readstatus.value + "', '" + user.value + "'";

          if ( actauthor.value.AT_ID ) { 
            sqlFields = sqlFields + ", BK_AT"
            sqlValues = sqlValues + ", " + actauthor.value.AT_ID
          }
          if ( actcategory.value.CG_ID ) { 
            sqlFields = sqlFields + ", BK_CG_ID"
            sqlValues = sqlValues + ", " + actcategory.value.CG_ID
          }
          if ( actbooktype.value.BT_ID ) { 
            sqlFields = sqlFields + ", BK_BT"
            sqlValues = sqlValues + ", " + actbooktype.value.BT_ID
          }
          sqlFields = sqlFields + ", BK_OS_ID"
          if ( actownership.value != null ) { 
            sqlValues = sqlValues + ", " + actownership.value.OS_ID
          } else {
            sqlValues = sqlValues + ", NULL"
          }
          sqlFields = sqlFields + ", BK_PS_ID"
          if ( actpublisher.value != null ) {
            sqlValues = sqlValues + ", " + actpublisher.value.PS_ID 
          } else {
            sqlValues = sqlValues + ", NULL"
          }
          if ( yop.value != null ) { 
            sqlFields = sqlFields + ", BK_YEAR_OF_PUBLICATION"
            sqlValues = sqlValues + ", " + yop.value
          }
          if ( rating.value != null ) { 
            sqlFields = sqlFields + ", BK_RATE"
            sqlValues = sqlValues + ", " + rating.value
          }
          if ( description.value != null ) { 
            sqlFields = sqlFields + ", BK_DESCRIPTION"
            sqlValues = sqlValues + ", '" + description.value + "'"
          }
          res = await axios.post("/book", { query: sqlFields + ")" + sqlValues + ")" })
          tempMsg.value = "felvitele"

        } else {  //modtype == 'modify'
          var sql = "UPDATE BOOK SET BK_BOOKTITLE = '" + title.value + "', BK_READED = '" + readstatus.value + "'";
          if ( actauthor.value.AT_ID ) { 
            sql = sql + ", BK_AT = " + actauthor.value.AT_ID
          }
          if ( actcategory.value.CG_ID ) { 
            sql = sql + ", BK_CG_ID = " + actcategory.value.CG_ID
          }
          if ( actbooktype.value.BT_ID ) { 
            sql = sql + ", BK_BT = " + actcategory.value.BT_ID
          }
          if ( actownership.value != null ) { 
            sql = sql + ", BK_OS_ID = " + actownership.value.OS_ID 
          } else {
            sql = sql + ", BK_OS_ID = NULL" 
          }
          if ( actpublisher.value != null ) {
            sql = sql + ", BK_PS_ID = " + actpublisher.value.PS_ID 
          } else {
            sql = sql + ", BK_PS_ID = NULL" 
          }
          if ( yop.value != null ) { 
            sql = sql + ", BK_YEAR_OF_PUBLICATION = " + yop.value
          }
          if ( rating.value != null ) { 
            sql = sql + ", BK_RATE = " + rating.value
          }
          if ( description.value != null ) { 
            sql = sql + ", BK_DESCRIPTION = '" + description.value + "'"
          }
          sql = sql + " WHERE BK_ID = " + route.currentRoute.value.query.id
          res = await axios.post("/book", { query: sql })
          tempMsg.value = "módosítása"
        }

        console.log("res: ", res)
        if (res && res.status == "200") {
          txt.value = "A könyv " + tempMsg.value + " sikeresen megtörtént!"
        } else {
          txt.value = "Hiba történt a könyv " + tempMsg.value + " közben!"
        }
      } catch (error) {
        console.log(error.response)
        txt.value = "Hiba történt a könyv " + tempMsg.value + " közben!"
        snackbarTitle.value = txt.value
        snackbarColor.value = "red"
        isSnackbarActive.value = true
        setTimeout(() => { isSnackbarActive.value = false }, 2000)
      }
      snackbarTitle.value = txt.value
      snackbarColor.value = "green"
      isSnackbarActive.value = true
      setTimeout(() => { isSnackbarActive.value = false }, 2000)
      
      await route.replace("/")
    }
  }

  // PHP-s megoldás
  // async function saveBook() {
  //   console.log("saveBook!!!")

  //   if ( !( errorMsgTitle.value == "" && errorMsgAuthor.value == "" && errorMsgCategory.value == "" && errorMsgBooktype.value == "" ) ) {
  //     snackbarTitle.value = " Vannak kitöltetlen kötelező mezők! "
  //     snackbarColor.value = "red"
  //     isSnackbarActive.value = true
  //     setTimeout(() => { isSnackbarActive.value = false }, 2000)
  //   } else {

  //     issaveBook.value = true
  //     console.log(refMyDialog.value.res)

  //     const txt = ref("") 
  //     const params = ref("&title=" + title.value)
  //     params.value = params.value + "&readed=" + readstatus.value
  //     if ( actauthor.value.AT_ID ) { params.value = params.value + "&at=" + actauthor.value.AT_ID }
  //     if ( actcategory.value.CG_ID ) { params.value = params.value + "&cg=" + actcategory.value.CG_ID }
  //     if ( actbooktype.value.BT_ID) { params.value = params.value + "&bt=" + actbooktype.value.BT_ID }
  //     console.log('actownership: ', actownership)
  //     if ( actownership.value != null ) { 
  //       params.value = params.value + "&os=" + actownership.value.OS_ID 
  //     } else {
  //       params.value = params.value + "&os=NULL" 
  //     }
  //     if ( actpublisher.value != null ) {
  //       params.value = params.value + "&ps=" + actpublisher.value.PS_ID 
  //     } else {
  //       params.value = params.value + "&ps=NULL" 
  //     }
  //     if ( yop.value != null ) { params.value = params.value + "&yop=" + yop.value }
  //     if ( rating.value ) { params.value = params.value + "&rate=" + rating.value }
  //     if ( description.value ) { params.value = params.value + "&desc=" + description.value }
  //     params.value = params.value + "&user=" + user.value
  //     console.log("params: ", params.value)
  //     let tempMsg = ref("")
  //     let res = ref(null)
  //     try {
  //       if ( modetype == 'new' ) {
  //         console.log("new: ", params.value)
  //         res = await axios("setData.php?cat=INSBK" + params.value)
  //         tempMsg.value = "felvitele"
  //       } else {
  //         res = await axios("setData.php?cat=MODBK" + params.value + "&id=" + route.currentRoute.value.query.id)
  //         tempMsg.value = "módosítása"
  //       }
  //       console.log("res: ", res)
  //       if (res && res.status == "200") {
  //         txt.value = "A könyv " + tempMsg.value + " sikeresen megtörtént!"
  //       } else {
  //         txt.value = "Hiba történt a könyv " + tempMsg.value + " közben!"
  //       }
  //     } catch (error) {
  //       console.log(error.response)
  //       txt.value = "Hiba történt a könyv " + tempMsg.value + " közben!"
  //       snackbarTitle.value = txt.value
  //       snackbarColor.value = "red"
  //       isSnackbarActive.value = true
  //       setTimeout(() => { isSnackbarActive.value = false }, 2000)
  //     }
  //     snackbarTitle.value = txt.value
  //     snackbarColor.value = "green"
  //     isSnackbarActive.value = true
  //     setTimeout(() => { isSnackbarActive.value = false }, 2000)
      
  //     await route.replace("/")
  //   }
  // }

  async function newAuthor() {
    console.log("refMyDialogNewAuthor.value.fieldTextValue: ", refMyDialogNewAuthor.value.fieldTextValue)
    const txt = ref("")
    snackbarColor.value = "red"
    try {
      // const res = await axios("setData.php?cat=INSAT&name=" + refMyDialogNewAuthor.value.fieldTextValue)
      const res = await axios.post('/add/AT', { name: refMyDialogNewAuthor.value.fieldTextValue })
      console.log(res)
      if (res && res.status == "200") {
        txt.value = 'A szerző felvitele sikeresen megtörtént!'
        snackbarColor.value = "green"
        await fetchData('AT')
      } else {
        txt.value = "Hiba történt a szerző felvitele közben!"
      }
    } catch (error) {
      console.log(error.response)
      txt.value = "Hiba történt a szerző felvitele közben!"
    }
    snackbarTitle.value = txt.value
    isSnackbarActive.value = true
    setTimeout(() => { isSnackbarActive.value = false }, 2000)
  }

  async function newPublisher() {
    const txt = ref("")
    snackbarColor.value = "red"
    try {
      // const res = await axios("setData.php?cat=INSPS&name=" + refMyDialogNewPublisher.value.fieldTextValue)
      const res = await axios.post('/add/PS', { name: refMyDialogNewPublisher.value.fieldTextValue })
      console.log(res)
      if (res && res.status == "200") {
        txt.value = 'A kiadó felvitele sikeresen megtörtént!'
        snackbarColor.value = "green"
        await fetchData('PS')
      } else {
        txt.value = "Hiba történt a kiadó felvitele közben!"
      }
    } catch (error) {
      console.log(error.response)
      txt.value = "Hiba történt a kiadó felvitele közben!"
    }
    snackbarTitle.value = txt.value
    isSnackbarActive.value = true
    setTimeout(() => { isSnackbarActive.value = false }, 2000)
  }

</script>

<template>
  <!-- <v-form fast-fail @submit.prevent="book"> -->
    <v-container fluid>
      <SnackBar v-if="isSnackbarActive==true" :p_title="snackbarTitle" :p_color="snackbarColor" />
      <v-row>
        <v-col cols = 2></v-col>
        <v-col cols = 8>
          <v-card
            rounded="lg"
            elevation="16"            
            color="black"
            variant="tonal"
            style="padding: 10px; background-color: antiquewhite;"
            :loading = " loading "
          >
            <v-row v-if="author && category && booktype && osstatus && publisher">   
              <v-col cols="8">
                <v-text-field 
                  v-model="title"                  
                  :clearable = "!disabled"                  
                  label="Cím" 
                  variant="solo-filled"
                  :readonly = " disabled "
                  :class="{ 'disabledback': disabled }"
                  density="compact"
                  :required = " true "
                  :rules = " [v => !!v]"
                  :error-messages = " errorMsgTitle "
                  @keyup=" title == '' ?  errorMsgTitle = 'Kötelező mező!' : errorMsgTitle = '' "
                  @click:clear = " errorMsgTitle = 'Kötelező mező!' "
                  @update:modelValue = " errorMsgTitle = '' "
                ></v-text-field>
              </v-col>    
              <v-col cols="1" style="padding: 10px 0px 0px 0px">
                <v-switch
                  class="text-center grey d-flex flex-column align-center justify-center"
                  v-model="readstatus"
                  color="blue"
                  hide-details
                  true-value="Y"
                  false-value="N"
                  :readonly = " disabled "
                ></v-switch>
              </v-col>
              <v-col cols="1" style="padding: 15px 0px 0px 0px">
                <v-card class="text-center grey d-flex flex-column align-center justify-center" height="50%" width="50%">
                  <div v-if="readstatus == 'Y'">       
                    <v-icon icon="fa fa-book"></v-icon>
                  </div>
                  <div v-else>       
                    <v-icon icon="mdi-book-open-page-variant-outline"></v-icon>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="4">  
                <v-autocomplete
                  style="min-width: 250px;"
                  :clearable = "!disabled"
                  v-model="actauthor"
                  label="Szerző"
                  :items="author"
                  :key="AT_ID"
                  item-title="AT_AUTHORNAME"
                  item-value="AT_ID"
                  variant="solo-filled"
                  return-object
                  :readonly = " disabled "
                  density="compact"
                  no-data-text = "Nincs a keresésnek megfelelő adat"
                  :required = " true "
                  :rules = " [v => !!v]"
                  :error-messages = " errorMsgAuthor "
                  @keyup=" actauthor == '' || actauthor == null || actauthor == undefined ?  errorMsgAuthor = 'Kötelező mező!' : errorMsgAuthor = '' "
                  @click:clear = " errorMsgAuthor = 'Kötelező mező!' "
                  @update:modelValue = " actauthor != '' || actauthor != null || actauthor != undefined ? errorMsgAuthor = '' : null"
                ></v-autocomplete>
              </v-col>
              <MyDialog ref = "refMyDialogNewAuthor"
                p_type="brown"
                p_icon = "fa fa-pencil"
                p_headerTitle = "Új szerző felvitele" 
                p_rounded = "xl"
                p_colpadding = "padding: 0px 0px 20px 0px"
                p_textFieldLabel = "Új szerző"
                @close = "newAuthor()"
                :p_disabled = " disabled "
                p_required = " true "
                p_color="black"
              />
              <v-col cols="2">              
                <v-autocomplete         
                  style="min-width: 150px;"
                  v-model="actcategory"
                  :clearable = "!disabled"
                  label="Műfaj"
                  :items="category"
                  :key="AT_ID"
                  item-title="CG_CATEGORY"
                  item-value="CG_ID"
                  variant="solo-filled"
                  return-object
                  :readonly = " disabled "
                  density="compact"
                  :required = " true "
                  :rules = " [v => !!v]"
                  :error-messages = " errorMsgCategory "
                  @keyup=" actcategory == '' || actcategory == null ?  errorMsgCategory = 'Kötelező mező!' : errorMsgCategory = '' "
                  @click:clear = " errorMsgCategory = 'Kötelező mező!' "
                  @update:modelValue = " errorMsgCategory = '' "
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">  
                <v-autocomplete
                  style="min-width: 150px;"
                  v-model="actbooktype"                      
                  :clearable = "!disabled"
                  label="Kategória"
                  :items="booktype"
                  :key="BT_ID"
                  item-title="BT_TYPENAME"
                  item-value="BT_ID"
                  variant="solo-filled"
                  return-object
                  :readonly = " disabled "
                  density="compact"
                  :required = " true "
                  :rules = " [v => !!v]"
                  :error-messages = " errorMsgBooktype "
                  @keyup=" actbooktype == '' || actbooktype == null ?  errorMsgBooktype = 'Kötelező mező!' : errorMsgBooktype = '' "
                  @click:clear = " errorMsgBooktype = 'Kötelező mező!' "
                  @update:modelValue = " errorMsgBooktype = '' "
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">  
                <v-autocomplete
                  style="min-width: 150px;"
                  v-model="actownership"                      
                  :clearable = "!disabled"
                  label="Státusz"
                  :items="osstatus"
                  :key="OS_ID"
                  item-title="OS_NAME"
                  item-value="OS_ID"
                  variant="solo-filled"
                  return-object
                  :readonly = " disabled "
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <v-col cols="3">  
                <v-autocomplete
                  style="min-width: 150px;"
                  v-model="actpublisher"                      
                  :clearable = "!disabled"
                  label="Kiadó"
                  :items="publisher"
                  :key="PS_ID"
                  item-title="PS_PUBLISHERNAME"
                  item-value="PS_ID"
                  variant="solo-filled"
                  return-object
                  :readonly = " disabled "
                  density="compact"
                ></v-autocomplete>
              </v-col>
              <MyDialog ref = "refMyDialogNewPublisher"
                p_type="brown"
                p_icon = "fa fa-pencil"
                p_headerTitle = "Új kiadó felvitele" 
                p_rounded = "xl"
                p_colpadding = "padding: 0px 0px 20px 0px"
                p_textFieldLabel = "Új kiadó"
                @close = "newPublisher()"
                :p_disabled = " disabled "
                p_required = " true "
                p_color="antiquewhite"
              />
              <v-col cols="2">  
                <v-text-field
                  v-model="yop"
                  type="number"
                  label="Kiadás dátuma"
                  variant="solo-filled"
                  :readonly = " disabled "
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="2">  
                <v-rating
                  class="mt-3"
                  v-model="rating"
                  half-increments
                  hover
                  :length="5"
                  :size="x-large"
                  :model-value="rating"
                  color="black"
                  active-color="red"
                  empty-icon="mdi-heart-outline"
                  half-icon="mdi-heart-half-full"
                  full-icon="mdi-heart"
                  :readonly = " disabled "
                ></v-rating>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  rounded="lg" 
                  elevation="16"
                  label="Leírás"
                  variant="solo-filled"
                  :readonly = " disabled "
                  density="compact"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card v-if = "modetype != 'details'"
              rounded="lg"
              elevation="16"
              variant="tonal"
            >
              <MyDialog ref = "refMyDialog"
                p_type="brown"
                p_btnName = "Mentés" 
                :p_disabled = " !( errorMsgTitle == '' && errorMsgAuthor == '' && errorMsgCategory == '' && errorMsgBooktype == '' ) "
                modtype = "error" 
                p_headerTitle = "Mentés jóváhagyása" 
                :p_title = saveMsg
                p_color = "black"
                @close = "saveBook()"
              />
            </v-card>
          </v-card>
        </v-col>
        <v-col cols = 2></v-col>
      </v-row>
    </v-container>
  <!-- </v-form>  -->
</template>


v-text-field.disabledback {
  background-color:red;
}