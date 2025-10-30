<template>
  <div class="app">
    <header class="header">
      <h1 class="title">🌮 StreetBite</h1>
      <nav class="navigation">
        <div class="dropdown">
          <button class="dropdown-toggle" @click="toggleDropdown">
            {{ currentPageLabel }}
            <span class="dropdown-arrow">▼</span>
          </button>
          <div v-if="dropdownOpen" class="dropdown-menu">
            <button 
              v-for="page in pages" 
              :key="page.value"
              @click="selectPage(page.value)"
              :class="['dropdown-item', { active: currentPage === page.value }]"
            >
              {{ page.label }}
            </button>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <component :is="currentComponent" />
    </div>

    <footer class="footer">
      <p>&copy; 2025 StreetBite - All rights reserved</p>
    </footer>
  </div>
</template>

<script>
import UsersTable from './components/UsersTable.vue';
import FoodStandsTable from './components/FoodStandsTable.vue';
import MenuItemsTable from './components/MenuItemsTable.vue';

export default {
  name: 'App',
  components: {
    UsersTable,
    FoodStandsTable,
    MenuItemsTable
  },
  data() {
    return {
      currentPage: 'users',
      dropdownOpen: false,
      pages: [
        { label: 'Users', value: 'users' },
        { label: 'Food Stands', value: 'foodStands' },
        { label: 'Menu Items', value: 'menuItems' }
      ]
    };
  },
  computed: {
    currentComponent() {
      const componentMap = {
        users: 'UsersTable',
        foodStands: 'FoodStandsTable',
        menuItems: 'MenuItemsTable'
      };
      return componentMap[this.currentPage] || 'UsersTable';
    },
    currentPageLabel() {
      const page = this.pages.find(p => p.value === this.currentPage);
      return page ? page.label : 'Select Page';
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectPage(page) {
      this.currentPage = page;
      this.dropdownOpen = false;
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        this.dropdownOpen = false;
      }
    });
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff9800 100%);
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.title {
  color: white;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
}

.navigation {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 12px 24px;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  justify-content: center;
}

.dropdown-toggle:hover {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.dropdown-arrow {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.dropdown-toggle:hover .dropdown-arrow {
  transform: translateY(2px);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  min-width: 180px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.95em;
  font-family: inherit;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #fff3e0;
  color: #ff9800;
  font-weight: 600;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: auto;
}

.footer p {
  font-size: 0.95em;
}
</style>
