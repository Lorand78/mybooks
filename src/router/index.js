import { createRouter, createWebHistory } from "vue-router";
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Teszt from '../views/Teszt.vue'
// import Login from "../account/login/login-form.vue";
// import Dashboard from "../views/Dashboard.vue";
// import { useAuthStore } from "@/stores/authStore";
// import { checkLoggedIn } from "@/account/account-service";
// import Dynreport from "@/views/dynreport/Dynreport.vue";
// import { ref } from 'vue'
// export const firstLoad = ref(true)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    // component: () => import('../views/Home.vue'),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    // meta: {
    //   public: true,
    // },
  },
  {
    path: "/book/:type",
    name: "Book",
    component: () => import('../views/Book.vue'),
  },
  {
    path: "/management/:type",
    name: "Management",
    component: () => import('../views/Management.vue'),
  },
  {
    path: "/teszt",
    name: "Teszt",
    component: () => import('../views/Teszt.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

// router.beforeEach(async (to, from) => {
//   //console.log("router beforEach", to);
// });

// router.beforeResolve(async (to, from) => {
//   console.log("router.before from:" + from.fullPath);
//   const authStore = useAuthStore();
//   // console.log("router.before to:" + to.fullPath);
//   //  console.log("router.before authenticated:" + authStore.authenticated);
//   //  console.log("router.before to.meta:", to);
//   if (!authStore.authenticated) {
//     await checkLoggedIn();
//     console.log("after load", authStore.authenticated);
//     if (authStore.authenticated) {
//       if (to.name === "login") return { path: "/" };
//       else {
//         if (authStore.userDetails.changePassword) return { name: "pwdchange" };
//       }
//     } else {
//       if (!to.meta.public) return { name: "login" };
//       else return true;
//     }
//     return to.fullPath;
//   } else {
//     if (authStore.userDetails.changePassword && to.name != "pwdchange")
//       return { name: "pwdchange" };
//   }
// });
