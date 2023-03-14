import { createRouter, createWebHistory } from "vue-router";
import AuthRequired from "./utils/AuthRequired";

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "app" */ "./views/app"),
    redirect: "/app/dashboards",
    beforeEnter: AuthRequired,
    children: [
      {
        path: "app/dashboards",
        component: () =>
            import(/* webpackChunkName: "dashboards" */ "./views/app/dashboards"),
        redirect: "/app/dashboards/taller",
        children: [
          {
            path: "taller",
            component: () =>
              import(
                /* webpackChunkName: "dashboards" */ "./views/app/dashboards/TallerDash"
              )
          }
        ]
      },
      {
        path: "app/taller",
        component: () =>
          import(/* webpackChunkName: "pages" */ "./views/app/taller"),
        redirect: "/app/taller/listTalleres",
        children: [
          {
            path: "listTalleres",
            component: () =>
              import(
                /* webpackChunkName: "product" */ "./views/app/taller/ListTalleres"
              )
          }
        ]
      }
    ]
  },
  {
    path: "/user",
    component: () => import(/* webpackChunkName: "user" */ "./views/user"),
    redirect: "/user/login",
    children: [
      {
        path: "login",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ForgotPassword")
      }
    ]
  }
];

const router = createRouter({
  linkActiveClass: "active",
  routes,
  history: createWebHistory(),
});

export default router;
