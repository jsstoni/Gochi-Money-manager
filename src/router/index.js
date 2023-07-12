import { createRouter, createWebHistory, RouterView } from "vue-router";
import store from "../store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/panel",
      name: "panel",
      component: () => import("../views/PanelView.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("../views/DashboardView.vue"),
        },
        {
          path: "finance",
          name: "finance",
          component: () => import("../views/FinanceView.vue"),
        },
        {
          path: "budget",
          name: "budget",
          component: () => import("../views/BudgetView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name == "panel") next({ name: "dashboard" });
  if (to.name != "home" && !store.getters.isAuth) next({ name: "home" });
  next();
});

export default router;
