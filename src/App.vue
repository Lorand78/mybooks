<script setup>
import Sidebar from "@/components/sidebar/Sidebar.vue";
</script>

<template>
    <v-app class="main" style="background: transparent;">
        <Sidebar />
        <v-container style="background: transparent;" fluid>
          <!-- <v-container style="width: 'window.screen.width'; background-color: rgb(167, 21, 21);" class="align-center justify-center"> -->
          <!-- <v-row
            align="center"
            justify="center"
          > -->
            <!-- <v-col cols="2"></v-col> -->
          <!-- <div :style="{'margin-left': sidebarWidth}"> -->
            <!-- <v-col cols="6"> -->
              <router-view :key = "$route.fullPath" to="/home"/>
            <!-- </v-col> -->
          <!-- </v-row> -->
        </v-container>
            <!-- <v-main> -->
                <!-- <v-main :style="{ 'position': sidebarWidth }"> -->
                    <!-- <v-container fluidgrid-list-md text-xs-center fluid> -->
                        
                        <!-- <v-row no-gutters>
                            <v-col cols="12"> -->
                                <!-- <router-view/> -->
                                <!-- </v-col>
                                </v-row> -->
                                <!-- </v-container> -->
                                <!-- </v-main> -->
    </v-app>
</template>

<!-- <style lang="scss">
  main { 
    background-color: blue($color: #000000);
    // background-image: url("./components/icons/bookself.jpg")
  }
</style> -->

