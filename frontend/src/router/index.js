import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../components/HomePage.vue';
import UsersTable from '../components/UsersTable.vue';
import FoodStandsTable from '../components/FoodStandsTable.vue';
import MenuItemsTable from '../components/MenuItemsTable.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/tables/users',
    name: 'users',
    component: UsersTable
  },
  {
    path: '/tables/food-stands',
    name: 'foodStands',
    component: FoodStandsTable
  },
  {
    path: '/tables/menu-items',
    name: 'menuItems',
    component: MenuItemsTable
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;

