<script setup>
  import { ref } from 'vue'
  import { loggedIn, user } from "../components/sidebar/state"
  import axios from 'axios'
  import { useRouter } from "vue-router";
  import { fetchDefaultDatas } from "../main"
  const route = useRouter()
  const username = ref("")
  const password = ref("")
  const errorMsgUsername = ref("Kötelező mező!")
  const errorMsgPassword = ref("Kötelező mező!")
  const showpw = ref(false)
	const badLogin = ref("")

  async function login() {
    console.log("login")
    try {
      const response = await axios('getData.php?cat=US&username=' + username.value + '&password=' + password.value)      
      console.log("response: ", response)
      if ( response.data.length > 0 ) {
        console.log("if")
        loggedIn.value = !loggedIn.value
        user.value = username.value
        badLogin.value = ""
        console.log("fetchDefaultDatas")
        fetchDefaultDatas()
        await route.replace("/")
      } else {
        badLogin.value = 'Hibás felhsználónév vagy jelszó!'
      }
    } catch (error) {
      console.log("error: ", error)      
    }
    console.log(response)
    
  }
</script>

<template>
  <v-card-actions>
    <v-col cols="3"/>
    <v-col cols="6">
      <v-card
        rounded="lg"
        elevation="16"
        color = "#e3d19f"
      >
        <v-toolbar
          rounded="lg"
          elevation="16"
          density="compact"
          color = "brown"
          title = Bejelentkezés
        ></v-toolbar>
        <v-card-text>
          <v-text-field
            autofocus
            style="min-width: 250px;"
            v-model="username"
            :maxlength = 20
            clearable 
            label = "Felhasználó" 
            variant="solo-filled"
            required = true
            :rules = " [v => !!v]"
            :error-messages = " errorMsgUsername "
            @keyup=" username == '' || username == null ?  errorMsgUsername = 'Kötelező mező!' : errorMsgUsername = '' "
            @click:clear = " errorMsgUsername = 'Kötelező mező!' "
          ></v-text-field>
          <v-text-field
            style="min-width: 250px;"
            v-model="password"
            :type="showpw ? 'text' : 'password'"
            :append-inner-icon="showpw ? 'mdi-eye' : 'mdi-eye-off'"
            clearable 
            label = "Jelszó" 
            variant="solo-filled"
            required = true
            :rules = " [v => !!v]"
            :error-messages = " errorMsgPassword "
            @keyup=" password == '' || password == null ?  errorMsgPassword = 'Kötelező mező!' : errorMsgPassword = '' "
            @click:clear = " errorMsgPassword = 'Kötelező mező!' "
            @click:append-inner="showpw = !showpw"
          ></v-text-field>
          <v-text v-if = " badLogin != '' "
            class="font-weight-black"
            style = "color: red"
          >
            {{ badLogin }}
          </v-text>
        </v-card-text>
        <v-card
          class = "text-center"
          variant="tonal" 
          >
          <v-btn      
            :disabled = " username == '' || username == null || password == '' || password == null "
            variant="tonal" 
            rounded="lg"
            class="ma-1"
            prepend-icon = "mdi-lock"
            size = "x-large"
            @click="login()"
            >Belépés
          </v-btn>
        </v-card>
      </v-card>
    </v-col>
  </v-card-actions>
</template>
