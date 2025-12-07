<template>
  <header class="header">
    <div class="logo-container">
      <router-link to="/" class="logo-link">
        <img src="/logo.png" alt="StreetBite" class="logo-icon" />
        <h1 class="logo-text">StreetBite</h1>
      </router-link>
    </div>
    <nav class="navigation">
      <router-link to="/" class="nav-button" :class="{ active: $route.name === 'home' }">
        Home
      </router-link>
      <button v-if="currentUser" class="nav-button user-info" @click="showUserMenu = !showUserMenu">
        👤 {{ currentUser.name }}
        <span class="user-role">({{ currentUser.role === 'owner' ? 'Owner' : 'Customer' }})</span>
      </button>
      <router-link v-else to="/login" class="nav-button">
        Login
      </router-link>
      <button class="nav-button admin-btn" @click="openAdmin">
        🔧 Admin
      </button>
    </nav>
    <div v-if="showUserMenu" class="user-menu">
      <button class="user-menu-item" @click="handleLogout">Logout</button>
    </div>
  </header>
</template>

<script>
import { getCurrentUser, logoutAndNotify, subscribeToAuth } from '../utils/authService';

export default {
  name: 'AppHeader',
  data() {
    return {
      currentUser: null,
      showUserMenu: false,
      unsubscribeAuth: null
    };
  },
  created() {
    this.currentUser = getCurrentUser();
    this.unsubscribeAuth = subscribeToAuth(user => {
      this.currentUser = user;
      this.showUserMenu = false;
    });
  },
  beforeUnmount() {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
    }
  },
  methods: {
    handleLogout() {
      logoutAndNotify();
      this.showUserMenu = false;
      // Rediriger vers la page de login après déconnexion
      this.$router.push('/login');
    },
    openAdmin() {
      this.$router.push('/admin/gate');
    }
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
  width: 48px;
  height: 48px;
  object-fit: contain;
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

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.user-info {
  position: relative;
}

.user-role {
  font-size: 0.85em;
  opacity: 0.9;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 32px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  overflow: hidden;
  z-index: 2000;
}

.user-menu-item {
  display: block;
  width: 100%;
  padding: 12px 20px;
  background: none;
  border: none;
  text-align: left;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.95em;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-item:hover {
  background-color: #f5f5f5;
}

.admin-btn {
  background-color: #9c27b0 !important;
}

.admin-btn:hover {
  background-color: #7b1fa2 !important;
}
</style>

