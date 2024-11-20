<script setup>
  console.log('Home!!!')
  import { onMounted, ref } from 'vue'
  import { VDataTable } from 'vuetify/labs/VDataTable'
  import axios from 'axios'
  import { useRouter } from "vue-router";
  import { loggedIn, user } from '../components/sidebar/state';
  import * as xlsx from '../../node_modules/xlsx/xlsx.mjs';

  const route = useRouter()
  const data = ref(null)
  const error = ref(null)
  // const refresh = ref(false)
  const itemsPerPage = ref(10)
  const selectedRow = ref(null)
  const readed = ref(null)
  const search = ref("")
  const loading = ref(false)
  const headers = ref([
          { title: 'Könyv címe', key: 'BK_BOOKTITLE' },
          { title: 'Szerző', key: 'AT_AUTHORNAME' },
          { title: 'Kategória', key: 'BT_TYPENAME' },
          { title: 'Műfaj', key: 'CG_CATEGORY' },
          { title: 'Olvasott', key: 'BK_READED' },
          // { title: 'Olvasott', key: 'readed', value: item => `${ data.value.BK_READED }` == 'Y' ? true : false },
          { title: 'Műveletek', key: 'actions', sortable: false },
          // { title: 'Olvasott', key: 'readed' },
        ])  

  // components: {VDataTable}

  const fetchData = async (cat) => {
    loading.value = true
    try {
      // console.log('https://myownbooks.000webhostapp.com/getData.php?cat='+cat)
      // const response = await axios('getData.php?cat=' + cat + '&user=' + user.value)
      const response = await axios.get('/api/data/' + cat + '/-1/' + user.value)      
      console.log("response: ", response.data)
      data.value = response.data
      console.log("data: ", data.value)
      // response.data.forEach(e => {
      //   console.log(e.AT_AUTHORNAME)
      //   author.push(e)
      //   // author.push(e.AT_AUTHORNAME)
      // });
      //author.value = response.data
      //console.log(author.value[0].AT_AUTHORNAME)
    } catch (error) {
      console.log("error: ", error.response)
    }
    loading.value = false
  }

  onMounted( async () => {
    console.log('onMounted')
    if ( loggedIn.value == true ) {
      await fetchData('BK')
    }
    console.log('onMounted után')
    // console.log("data: ", data.value.data[0])
  })

  function btnClick( item, to ) {
    // console.log("BK_ID: ", item.BK_ID)
    // console.log("item: ", item)
    if ( item ) {
      route.replace(to + '?id=' + item.BK_ID)
    } else {
      route.replace(to)
    }
  }

  function goToTop() {
    window.scrollTo(0,0)
  }

  const xlsdata = [
    {name: "Jack", birthday: "1978-09-30"},
    {name: "Joe", birthday: "1978-03-06"}
  ]

  async function exportXlsxBtnClick() {
    const XLSX = xlsx
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data.value)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Könyvek')
    XLSX.writeFile(workbook, 'books.xlsx')

  }
</script>

<template>
  <!-- style = "width: 2000px"             -->
  <v-container fluid> 
      <v-row  v-if="loggedIn">
        <v-col cols = 2></v-col>
        <v-col cols = 8>
          <v-card
            rounded="lg"
            style="padding: 15px; background-color: antiquewhite;"
          >
          <!-- <v-label>
            {{ title }}
          </v-label> -->
            <v-data-table v-if="data"
              style="background-color: antiquewhite;"
              v-model = "selectedRow"
              density="compact"
              :headers="headers"
              :items="data"
              item-value="BK_ID"
              item-key="BK_ID"
              class="elevation-1"
              :search="search"
              hover="true"
              multi-sort="true"
              items-per-page-text = "Könyv oldalanként"
              select-strategy="page"
              no-data-text = "Nincs a keresésnek megfelelő könyv..."
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
                      <!-- style="width: 200px;" -->
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
                    <v-col cols="3"></v-col>                  
                    <v-col cols="2">
                      <v-btn 
                        v-model="newBookBtn"
                        style="margin: 30px 10px 0px 10px"
                        prepend-icon="fas fa-square-plus"
                        rounded="lg"
                        elevation="10"            
                        variant="tonal"
                        @click="btnClick(null, '/book/new')"
                      >Új Könyv
                      </v-btn>
                    </v-col>
                    <v-col cols="1">
                      <v-btn 
                        v-model="exportXlsxBtn"
                        style="margin: 30px 0px 0px 0px;"
                        prepend-icon="mdi-export"
                        rounded="lg"
                        elevation="10"            
                        variant="tonal"
                        @click="exportXlsxBtnClick()"
                      >
                      </v-btn>
                    </v-col>
                    <!-- <v-col cols="2">
                      <v-btn 
                        v-model="bookModifyBtn"
                        style="margin: 30px 10px 0px 10px"
                        prepend-icon="fas fa-pen-to-square"
                        @click="refresh = true"
                      >Módosítás
                      </v-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-btn 
                        v-model="bookDetailBtn"
                        style="margin: 30px 10px 10px 10px;"
                        prepend-icon="fas fa-info-circle"
                        @click="btnClick('/book/readonly')"
                      >Részletek
                      </v-btn>
                    </v-col> -->
                  </v-row>
                </v-card>
              </template>
              <template v-slot:item.BK_READED="{ item }">
                <v-checkbox
                  v-model = "item.BK_READED"
                  true-value = "Y"
                  false-value = "N"
                  readonly
                  hide-details
                ></v-checkbox>
              </template>
              <template v-slot:item.actions="{ item }">
                    <v-btn v-blind="props"
                      size="x-small"
                      class="mr-2"
                      variant="tonal"
                      icon="fas fa-pen-to-square"
                      @click="btnClick(item, '/book/modify')"                  
                    >
                      <v-tooltip 
                        activator="parent"
                        location="start"
                        text="Módosítás"
                      >
                      </v-tooltip>
                      <v-icon>
                        fas fa-pen-to-square
                      </v-icon>
                    </v-btn>
                <v-btn
                  size="x-small"
                  class="mr-2"
                  variant="tonal"
                  icon="fas fa-info-circle"
                  @click="btnClick(item, '/book/details')"
                >
                  <v-tooltip 
                    activator="parent"
                    location="end"
                    text="Részletek"
                  >
                  </v-tooltip>
                    <v-icon>
                      fas fa-info-circle
                    </v-icon>
                </v-btn>
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

<!-- <style lang="scss">
  main { 
    background-color: blue($color: #000000);
    // background-image: url("./components/icons/bookself.jpg")
  }
</style> -->
