<template>
    <div>
      <v-app-bar short dense color="rgb(8, 12, 19)" app>
        <div class="app-bar-content">
          <h2 class="transition-default">Köszöntelek a myBooks-ban!</h2>
          <v-btn ripple color="rgb(0,255,255)" @click="drawer = !drawer">
            <v-icon title="Menu">mdi-menu</v-icon>
            <div>Menu</div>
          </v-btn>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        :temporary="false"
        disable-resize-watcher
        :mini-variant="!menuCompact.hidden"
        mini-variant-width="100"
        app
      >
        <div id="sidebar">
          <div class="sidebar-toggle">
            <div @click="changeToggleState()" id="btn-toggle">
              <v-icon id="btn-toggle-icon" x-large>mdi-chevron-left</v-icon>
            </div>
          </div>
          <div class="sidebar-body">
            <!-- <font-awesome-icon icon="fa-regular fa-envelope"></font-awesome-icon> -->
            <div class="sidebar-profile" v-show="memberActive">
              <!-- <img
                :src="require('../../assets/' + profileInfo.photo.file)"
                :alt="profileInfo.photo.title"
              /> -->
              <v-slide-x-transition mode="in-out" leave-absolute>
                <div v-show="menuCompact.hidden" id="profile-name">
                  {{ profileInfo.name }}
                </div>
              </v-slide-x-transition>
            </div>
            <div class="sidebar-links">
              <small>Menu</small>
              <hr class="divider" />
              <div class="links">
                <!-- <i class="fa-regular fa-envelope"/> -->
                <a
                  v-for="link in menuLinks"
                  :key="link.title"
                  :href="link.path"
                >
                  <!-- <v-icon :title="link.title" class="icon"
                    >mdi-{{ link.icon }}</v-icon -->
                  <!-- <v-icon>!</v-icon> -->
                  >
  
                  <v-slide-x-transition mode="in-out" leave-absolute>
                    <div class="link-title" v-show="menuCompact.hidden">
                      {{ link.title }}
                    </div>
                  </v-slide-x-transition>
                </a>
              </div>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
    </div>
  </template>
  
  <script>
  import "./style.css";
  import "@fortawesome/fontawesome-free/js/all"
  
  export default {
    name: "Sidebar",
    data: () => {
      return {
        drawer: true,
        menuCompact: {
          hidden: true,
        },
        profileInfo: {
          name: "Nincs bejelentkezve",
          photo: {
            file: "me.jpg",
            title: "Foto do Klinger",
          },
        },
        memberActive: true,
        menuLinks: [
          { path: "login", title: "Új elem felvitel", icon: "home" },
          { path: "#", title: "Módosítás", icon: "information-variant" },
          { path: "#", title: "Kölcsönzés - Kivezetés", icon: "email" },
          { path: "#", title: "Keresés", icon: "handshake" },
          { path: "#", title: "Kijelentkezés", icon: "logout-variant" },
        ],
      };
    },
    methods: {
      changeToggleState() {
        let btnToggleIcon = document.getElementById("btn-toggle-icon");
        this.menuCompact.hidden = !this.menuCompact.hidden;
  
        if (this.menuCompact.hidden) {
          return (btnToggleIcon.style.transform = "rotateY(0deg)");
        } else {
          return (btnToggleIcon.style.transform = "rotateY(180deg)");
        }
      },
    },
  };
  </script>