import { createRouter, createWebHashHistory } from "vue-router";
import SingerDetail from "@/views/SingerDetail";
import Album from "@/views/Album";
import TopDetail from "@/views/TopDetail";

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
    children: [
      {
        path: ":id",
        component: Album,
      },
    ],
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
    children: [
      {
        path: ":id",
        component: TopDetail,
      },
    ],
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
