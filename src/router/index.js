import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Home from "@/views/Home.vue";
import Detail from "@/views/Detail.vue";
import PetSitter from "@/views/PetSitter.vue";
import PetSitterRegistration from "@/views/PetSitterRegistration.vue";
import PetSitterProfile from "@/views/PetSitterProfile.vue";
import PaymentsTest from "@/views/PaymentsTest.vue";
import CodeManagement from "@/views/CodeManagement.vue";
import ServiceDetail from "@/views/ServiceDetail.vue";
import MyServices from "@/views/MyServices.vue";
import UserRequest from "@/views/UserRequest.vue";
import ServiceRegistration from "@/views/ServiceRegistration.vue";

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
      path: "/sitter/services/:id",
      name: "sitter_services",
      component: ServiceDetail,
      props: true,
    },
    {
      path: "/sitter/request/user",
      name: "sitter_request_user",
      component: UserRequest,
    },
    {
      path: "/sitter/my-services",
      name: "my_services",
      component: MyServices,
    },
    {
      path: "/sitter/my-services/register",
      name: "my_services_register",
      component: ServiceRegistration,
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
    {
      path: "/codes",
      name: "codes",
      component: CodeManagement,
    },
  ],
});

export default router;
