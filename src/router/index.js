import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Home from "@/views/Home.vue";
import Detail from "@/views/Detail.vue";
import PetSitter from "@/views/PetSitter.vue";
import PetSitterRegistration from "@/views/PetSitterRegistration.vue";
import PetSitterProfile from "@/views/PetSitterProfile.vue";
import PaymentsTest from "@/views/PaymentsTest.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/detail",
      name: "detail",
      component: Detail,
    },
    {
      path: "/sitter",
      name: "sitter",
      component: PetSitter,
    },
    {
      path: "/sitter/registration",
      name: "sitter_registration",
      component: PetSitterRegistration,
    },
    {
      path: "/sitter/profile",
      name: "sitter_profile",
      component: PetSitterProfile,
    },
    {
      path: "/payments",
      name: "payments",
      component: PaymentsTest,
    },
  ],
});

export default router;
