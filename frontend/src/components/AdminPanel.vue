<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>Administration Panel</h1>
      <button class="secondary-btn" @click="handleClose">Close</button>
    </div>
    <div class="admin-nav">
      <router-link
        v-for="link in adminLinks"
        :key="link.path"
        :to="link.path"
        class="admin-nav-link"
        :class="{ active: $route.name === link.name }"
      >
        {{ link.label }}
      </router-link>
    </div>
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { revokeAdminAccess } from '../utils/adminAccess';

export default {
  name: 'AdminPanel',
  data() {
    return {
      adminLinks: [
        { label: 'Users', path: '/admin/users', name: 'adminUsers' },
        { label: 'Food Stands', path: '/admin/food-stands', name: 'adminFoodStands' },
        { label: 'Menu Items', path: '/admin/menu-items', name: 'adminMenuItems' },
        { label: 'Reviews', path: '/admin/reviews', name: 'adminReviews' }
      ]
    };
  },
  methods: {
    handleClose() {
      revokeAdminAccess();
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background-color: #fafafa;
}

.admin-header {
  background: white;
  padding: 20px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.8em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.secondary-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn:hover {
  background-color: #d0d0d0;
}

.admin-nav {
  background: white;
  padding: 0 32px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.admin-nav-link {
  padding: 16px 24px;
  text-decoration: none;
  color: #666;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.admin-nav-link:hover {
  color: #ff9800;
  background-color: #fff5e6;
}

.admin-nav-link.active {
  color: #ff9800;
  border-bottom-color: #ff9800;
}

.admin-content {
  padding: 24px;
}
</style>

