<script setup>
  import SidebarLink from './SidebarLink.vue'
  import './style.css' 
  import { loggedIn, user, collapsed, toggleSidebar, sidebarWidth } from './state'

// export components: { SidebarLink }
  async function Logout() {
    console.log("logout")
    console.log("loggedIn: ", loggedIn)
    loggedIn.value = false
    user.value = null
  }
</script>

<template>
  <!-- <div class="sidebar-body" :style="{ width: sidebarWidth }"> -->
    <div class="sidebar" :style="{ width: sidebarWidth }">
      <h1>
        <span v-if="collapsed">
          <div>
            <i class="fas fa-book" font-size="x-large"/>
          </div>
          <!-- <div>B</div> -->
        </span>
        <span v-else>
          <i class="fas fa-book" font-size="x-large"/>
          myBooks</span>
      </h1>
      <div class="sidebar-profile" v-show="loggedIn">
              <!-- <img
                :src="require('../../assets/' + profileInfo.photo.file)"
                :alt="profileInfo.photo.title"
              /> -->
        <v-slide-x-transition mode="in-out" leave-absolute>
          <div v-show="!collapsed" id="profile-name">
            <!-- {{ profileInfo.name }} -->
            {{ user }}
          </div>
        </v-slide-x-transition>
      </div>
      <hr class="divider" />

      <!-- to="/..... az index.js-ben van konfigurálva" -->
      <SidebarLink v-if="loggedIn" to="/" icon="fas fa-home" title="Fő oldal">Fő oldal</SidebarLink>
      <!-- <SidebarLink to="/book/readonly" icon="fas fa-pen-to-square" title="Módosítás">Módosítás</SidebarLink> -->
      <!-- <SidebarLink to="/analytics" icon="fas fa-left-right" title="Kölcsönzés - Kivezetés">Kölcsönzés - Kivezetés</SidebarLink> -->
      <!-- <SidebarLink to="/friends" icon="fas fa-magnifying-glass" title="Keresés">Keresés</SidebarLink> -->
      <SidebarLink v-if="!loggedIn" to="/Login" icon="fas fa-unlock" title="Bejelentkezés">Bejelentkezés</SidebarLink>
      <SidebarLink v-if="loggedIn" to="/Login" icon="fas fa-lock" title="Kijelentkezés" @click="Logout()">Kijelentkezés</SidebarLink>

      <span
        class="collapse-icon"
        :class="{ 'rotate-180': collapsed }"
        @click="toggleSidebar"
      >
        <i class="fa fa-backward" />
      </span>
    </div>
  <!-- </div> -->
</template>

<style>
:root {
  /* --sidebar-bg-color: #2f855a; */
  --sidebar-bg-color: #121312;
  --sidebar-item-hover: #444746;
  --sidebar-item-active: #969e9a;
}
</style>

<style scoped>
.sidebar {
  color: rgb(229, 241, 48);
  background-color: var(--sidebar-bg-color);
  /* font-weight: bold; */

  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  height: 2.5em;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;

  color: rgba(255, 255, 255, 0.7);

  transition: 0.2s linear;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}

.sidebar-profile img {
    max-width: 60px;
    border-radius: 100%;
    border: 4px inset rgba(255,255,255,0.25);
}

</style>