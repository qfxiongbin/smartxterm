import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import MainPage from '../views/MainPage.vue';
import TerminalPage from '../views/TerminalPage.vue';

const routes = [
  {
    path: '/',
    name: 'router',
    redirect: "/home",
    component: MainPage,
    children: [
      {
        path: 'home',
        name: 'home_index',
        title: '首页',
        component: HomePage
      },
      {
        path: 'terminal',
        name: 'terminal_index',
        title: '终端',
        component: TerminalPage
      }

    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;