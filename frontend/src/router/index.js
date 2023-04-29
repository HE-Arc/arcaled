/*
ArcAled made by Lucas Perrin, Rui Marco Loureiro and Sebastien Chappuis
File's version : 1.1.0
this file is used for : set up the routes with vue router

Wrote by : Lucas Perrin
updated by : Lucas Perrin
*/

import { createRouter, createWebHistory } from "vue-router";

import { useStore as useAuthStore } from "../store/auth.store";

// Views
import AccountValidation from "../views/AccountValidation/AccountValidation.vue";
import AccountsWaiting from "../views/AccountsWaiting/AccountsWaiting.vue";
import AccountDemand from "../views/AccountDemand/AccountDemand.vue";
import AddCP from "../views/AddCP/AddCP.vue";
import CPS from "../views/CPS/CPS.vue";
import EmailVerification from "../views/EmailVerification/EmailVerification.vue";
import Login from "../views/Login/Login.vue";
import PageNotFound from "../views/PageNotFound/PageNotFound.vue";
import AddLesson from "../views/AddLesson/AddLesson.vue";

// Layouts
import AppLayout from "../layouts/AppLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "account-demand",
      component: AccountDemand,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/email-verification",
      name: "email-verification",
      component: EmailVerification,
    },
    {
      path: "/app",
      name: "app",
      // component: When empty, will use the parent layout component,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "cps",
          component: CPS,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "account-validation",
          name: "account-validation",
          component: AccountValidation,
          meta: {
            requireAdmin: true,
            requiresAuth: true,
          },
          //  the route.params will be set as the component props
          props: true,
        },
        {
          path: "accounts-waiting",
          name: "accounts-waiting",
          component: AccountsWaiting,
          meta: {
            requireAdmin: true,
            requiresAuth: true,
          },
        },
        {
          path: "add-cp",
          name: "add-cp",
          component: AddCP,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "add-lesson",
          name: "add-lesson",
          component: AddLesson,
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },

    // and finally the default route, when none of the above matches:
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      component: PageNotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requireAdmin = to.matched.some((record) => record.meta.requireAdmin);
  const authStore = useAuthStore();
  const { isAuthenticated, user } = authStore;

  // redirige / vers /auth
  // if (to.path === "/") {
  //     if (isAuthenticated) {
  //         next({ name: "items" });
  //     } else {
  //         next({ name: "auth" });
  //     }
  // }

  if (requireAdmin && !user.is_admin) {
    next({ name: "cps" });
  }

  // Redirige vers /login si l'utilisateur n'est pas authentifié
  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  }

  // Redirige vers la page voulue si l'utilisateur est authentifié
  next();
});

export default router;
