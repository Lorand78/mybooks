import './assets/main.css'

import { createApp, ref } from 'vue'
import app from './App.vue'
import router from './router'
import "@mdi/font/css/materialdesignicons.css"
import '@fortawesome/fontawesome-free/js/all'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import '@mdi/js'
// Vuetify
// import { mdiAccount } from '@mdi/js'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import axios from 'axios'
import "./components/axios"
import cors from 'cors'
import { loggedIn } from './components/sidebar/state';


export const firstLoad = ref(true)
console.log('main firstLoad: ', firstLoad.value)

// if (!author) {
//   const author = ref(null)
// }
export const author = ref(null)
export const category = ref(null)
export const booktype = ref(null)
export const osstatus = ref(null)
export const publisher = ref(null)
export const nationality = ref(null)

export const fetchData = async (cat) => {
  // console.log("route: ", route.currentRoute.value.params.type)
  // console.log("route: ", route.currentRoute.value.params.type)
  try {
    // console.log(mdiHome)
    // console.log("currroute: ", route.currentRoute.value.query.id)
    // console.log('https://myownbooks.000webhostapp.com/getData.php?cat='+cat)
    // const response = await axios('getData.php?cat='+cat)///?id=1')
    const response = await axios.get('/api/data/' + cat + '/-1/NULL')      
    console.log('response: ', response.data)

    switch (cat) {
      case 'AT': 
        author.value = response.data
        console.log("author: " + author)
        break
      case 'CG': 
        category.value = response.data
        console.log("category: " + category)
        break
      case 'BT': 
        booktype.value = response.data
        console.log(" booktype: " + booktype)
        break
      case 'OS': 
        osstatus.value = response.data
        console.log("osstatus: ", osstatus)
        break
      case 'PS': 
        publisher.value = response.data
        console.log("publisher: ", publisher)
        break
      case 'NN': 
        nationality.value = response.data
        console.log("nationality: ", nationality)
        break
      // default:
      //   title.value = response.data[0].BK_BOOKTITLE   
      //   readstatus.value = response.data[0].BK_READED       
      //   atindex.value = findIndex( author, 'AT_ID', response.data[0].BK_AT )
      //   cgindex.value = findIndex( category, 'CG_ID', response.data[0].BK_CG_ID )
      //   btindex.value = findIndex( booktype, 'BT_ID', response.data[0].BK_BT )
      //   osindex.value = findIndex( osstatus, 'OS_ID', response.data[0].BK_OS_ID )
      //   psindex.value = findIndex( publisher, 'PS_ID', response.data[0].BK_PS_ID )
      //   yop.value = response.data[0].BK_YEAR_OF_PUBLICATION
      //   rating.value = response.data[0].BK_RATE
      //   description.value = response.data[0].BK_DESCRIPTION
    }
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

export const fetchDefaultDatas = async () => {
  console.log("firstLoad: ", firstLoad.value)
  console.log("loggedIn: ", loggedIn.value)
  if ( firstLoad.value == true & loggedIn.value == true ) {
    await fetchData('AT')
    await fetchData('CG')
    await fetchData('BT')
    await fetchData('OS')
    await fetchData('PS')
    await fetchData('NN')
    firstLoad.value = false
  }
}

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      // aliases,
      // sets: {
      //   mdi,
      // },
    },
  })
  
  await router.replace("/Login")
  // library.add(fas)
  createApp(app)
    // .component('fas', FontAwesomeIcon)
    .use(vuetify)
    .use(router)
    .use(cors)
    .mount('#app')    