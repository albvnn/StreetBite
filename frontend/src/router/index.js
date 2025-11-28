import { createRouter, createWebHistory } from 'vue-router';
import { hasAdminAccess, revokeAdminAccess } from '../utils/adminAccess';

import HomePage from '../components/HomePage.vue';
import RestaurantDetail from '../components/RestaurantDetail.vue';
import AdminGate from '../components/AdminGate.vue';
import AdminPanel from '../components/AdminPanel.vue';
import UsersTable from '../components/UsersTable.vue';
import FoodStandsTable from '../components/FoodStandsTable.vue';
import MenuItemsTable from '../components/MenuItemsTable.vue';
import ReviewsTable from '../components/ReviewsTable.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { title: 'Home' }
  },
  {
    path: '/restaurant/:id',
    name: 'restaurantDetail',
    component: RestaurantDetail,
    meta: { title: 'Restaurant' }
  },
  {
    path: '/admin/gate',
    name: 'adminGate',
    component: AdminGate,
    meta: { title: 'Admin Access' }
  },
  {
    path: '/admin',
    component: AdminPanel,
    meta: { title: 'Admin' },
    children: [
      {
        path: 'users',
        name: 'adminUsers',
        component: UsersTable,
        meta: { title: 'Admin · Users' }
      },
      {
        path: 'food-stands',
        name: 'adminFoodStands',
        component: FoodStandsTable,
        meta: { title: 'Admin · Food Stands' }
      },
      {
        path: 'menu-items',
        name: 'adminMenuItems',
        component: MenuItemsTable,
        meta: { title: 'Admin · Menu Items' }
      },
      {
        path: 'reviews',
        name: 'adminReviews',
        component: ReviewsTable,
        meta: { title: 'Admin · Reviews' }
      },
      {
        path: '',
        redirect: '/admin/users'
      }
    ]
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

router.beforeEach((to, from, next) => {
  if (to.path === '/admin/gate') {
    revokeAdminAccess();
    next();
  } else if (to.path.startsWith('/admin')) {
    if (hasAdminAccess()) {
      next();
    } else {
      next('/admin/gate');
    }
  } else {
    next();
  }
});

router.afterEach(to => {
  const titleSegment = to.meta?.title;
  const baseTitle = 'StreetBite';
  document.title = titleSegment ? `${baseTitle} - ${titleSegment}` : baseTitle;
});

export default router;

