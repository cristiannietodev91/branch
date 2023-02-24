import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

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
          },
          {
            path: "detailTaller",
            component: () =>
              import(
                /* webpackChunkName: "product" */ "./views/app/taller/DetailsTaller"
              ),
            redirect: "/app/taller/detailTaller/citas",
            children: [
              {
                path: "citas",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/taller/Citas"
                  )
              },
              {
                path: "mecanicos",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/taller/Mecanicos"
                  )
              },
              {
                path: "ordenes/:cita?",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/taller/Ordenes"
                  )
              },
              {
                path: "info",
                component: () =>
                  import(
                    /* webpackChunkName: "forms" */ "./views/app/taller/InfoTaller"
                  )
              }
            ]
          },
          {
            path: "listClients",
            component: () =>
              import(
                /* webpackChunkName: "product" */ "./views/app/taller/ListClientes"
              )
          },
          {
            path: "listChats",
            component: () =>
              import(
                /* webpackChunkName: "product" */ "./views/app/taller/ListChats"
              )
          }
        ]
      },
      {
        path: "app/blank-page",
        component: () =>
          import(/* webpackChunkName: "blank-page" */ "./views/app/blank-page")
      }
    ]
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
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
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      }
    ]
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
