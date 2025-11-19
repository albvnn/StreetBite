<template>
  <header class="header">
    <div class="logo-container">
      <span class="logo-icon">🌮</span>
      <h1 class="logo-text">StreetBite</h1>
    </div>
    <nav class="navigation">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="nav-button"
        :class="{ active: $route.name === link.name }"
      >
        {{ link.label }}
      </router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      navLinks: [
        { label: 'Home', path: '/', name: 'home' },
        { label: 'Users', path: '/tables/users', name: 'users' },
        { label: 'Food Stands', path: '/tables/food-stands', name: 'foodStands' },
        { label: 'Menu Items', path: '/tables/menu-items', name: 'menuItems' }
      ]
    };
  }
};
</script>

<style scoped>
.header {
  background-color: #ffffff;
  padding: 16px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2.5em;
}

.logo-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-button {
  background-color: #ff9800;
  color: white;
  padding: 10px 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background-color: #f57c00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}
.nav-button.active {
  background-color: #f57c00;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}
</style>

