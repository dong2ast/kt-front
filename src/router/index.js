import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import HomeView from "@/views/HomeView.vue";
import DetailView from "@/views/DetailView.vue";
import PetSitterView from "@/views/PetSitter.vue";
import PetSitterRegistrationView from "@/views/PetSitterRegistrationView.vue";
import PetSitterProfileView from "@/views/PetSitterProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/detail",
      name: "detail",
      component: DetailView,
    },
    {
      path: "/sitter",
      name: "sitter",
      component: PetSitterView,
    },
    {
      path: "/sitter/registration",
      name: "sitter_registration",
      component: PetSitterRegistrationView,
    },
    {
      path: "/sitter/profile",
      name: "sitter_profile",
      component: PetSitterProfileView,
    },
  ],
});

export default router;
