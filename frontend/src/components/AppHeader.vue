<template>
  <header class="header">
    <div class="header-shell">
      <div class="logo-container">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">🌮</span>
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
        <button v-else class="nav-button" @click="showLogin = true">
          Login
        </button>
        <button class="nav-button admin-btn" @click="openAdmin">
          🔧 Admin
        </button>
      </nav>
    </div>
    <div v-if="showUserMenu" class="user-menu">
      <button class="user-menu-item" @click="handleLogout">Logout</button>
    </div>
    <LoginModal :show="showLogin" @close="showLogin = false" @success="handleLoginSuccess" />
  </header>
</template>

<script>
import { getCurrentUser, logoutAndNotify, subscribeToAuth } from '../utils/authService';
import LoginModal from './LoginModal.vue';

export default {
  name: 'AppHeader',
  components: {
    LoginModal
  },
  data() {
    return {
      currentUser: null,
      showLogin: false,
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
    handleLoginSuccess(user) {
      this.currentUser = user;
      this.showLogin = false;
    },
    handleLogout() {
      logoutAndNotify();
      this.showUserMenu = false;
      if (this.$route.path.startsWith('/admin') || this.$route.path.startsWith('/restaurant')) {
        this.$router.push('/');
      }
    },
    openAdmin() {
      this.$router.push('/admin/gate');
    }
  }
};
</script>

<style scoped>
.header {
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.85), rgba(248, 245, 239, 0.95));
  padding: 18px 32px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.header-shell {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 24px;
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
  gap: 12px;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.nav-button {
  background: transparent;
  color: #0f172a;
  padding: 10px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}
.nav-button.active {
  background: #0f172a;
  color: #fff;
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.2);
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
  top: calc(100% - 12px);
  right: 40px;
  background: rgba(255, 255, 255, 0.95);
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
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: #fff;
  box-shadow: 0 12px 25px rgba(168, 85, 247, 0.35);
}

.admin-btn:hover {
  background: linear-gradient(135deg, #9333ea, #db2777);
}

@media (max-width: 768px) {
  .header {
    padding: 16px;
  }

  .header-shell {
    flex-direction: column;
    align-items: flex-start;
  }

  .navigation {
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
  }

  .user-menu {
    right: 16px;
  }
}
</style>

