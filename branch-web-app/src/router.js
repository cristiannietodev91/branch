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
                /* webpackChunkName: "dashboards" */ "./views/app/dashboards/workshop-dashboard"
              )
          }
        ]
      },
      {
        path: "app/taller",
        component: () =>
          import(/* webpackChunkName: "workshop" */ "./views/app/taller"),
        redirect: "/app/taller/listTalleres",
        children: [
          {
            path: "listTalleres",
            component: () =>
              import(
                /* webpackChunkName: "workshop" */ "./views/app/taller/ListTalleres"
              )
          },
          {
            path: "detailTaller",
            component: () =>
              import(
                /* webpackChunkName: "workshop" */ "./views/app/taller/DetailsTaller"
              ),
            props: route => ({ path: route.path }),
            redirect: "/app/taller/detailTaller/citas",
            children: [
              {
                path: "citas",
                component: () =>
                  import(
                    /* webpackChunkName: "workshop" */ "./views/app/taller/Citas"
                  )
              },
              {
                path: "mecanicos",
                component: () =>
                  import(
                    /* webpackChunkName: "workshop" */ "./views/app/taller/Mecanicos"
                  )
              },
              {
                path: "ordenes/:cita?",
                component: () =>
                  import(
                    /* webpackChunkName: "workshop" */ "./views/app/taller/Ordenes"
                  )
              },
              {
                path: "info",
                component: () =>
                  import(
                    /* webpackChunkName: "workshop" */ "./views/app/taller/InfoTaller"
                  )
              }
            ]
          },
          {
            path: "listClients",
            component: () =>
              import(
                /* webpackChunkName: "workshop" */ "./views/app/taller/ListClientes"
              )
          },
          {
            path: "listChats",
            component: () =>
              import(
                /* webpackChunkName: "workshop" */ "./views/app/taller/ListChats"
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
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "./views/user/ResetPassword")
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "error" */ "./views/Error")
  }
];

const router = createRouter({
  linkActiveClass: "active",
  routes,
  history: createWebHistory(),
});

export default router;
