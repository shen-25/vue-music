import { createRouter, createWebHashHistory } from "vue-router";
import SingerDetail from "@/views/SingerDetail";
const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: () =>
      import(/* webpackChunkName: "Recommend" */ "@/views/Recommend.vue"),
  },
  {
    path: "/singer",
    name: "Singer",
    component: () =>
      import(/* webpackChunkName: "Singer" */ "@/views/Singer.vue"),
    children: [
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
  {
    path: "/top-list",
    name: "TopList",
    component: () =>
      import(/* webpackChunkName: "TopList" */ "@/views/TopList.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () =>
      import(/* webpackChunkName: "Search" */ "@/views/Search.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
