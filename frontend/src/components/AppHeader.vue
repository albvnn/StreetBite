<template>
  <header class="header">
    <div class="logo-container">
      <span class="logo-icon">🌮</span>
      <h1 class="logo-text">StreetBite</h1>
    </div>
    <nav class="navigation">
      <button class="nav-button" @click="$emit('home')">
        Home
      </button>
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
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    currentPage: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      dropdownOpen: false,
      pages: [
        { label: 'Users', value: 'users' },
        { label: 'Food Stands', value: 'foodStands' },
        { label: 'Menu Items', value: 'menuItems' }
      ]
    };
  },
  computed: {
    currentPageLabel() {
      if (this.currentPage === 'home') return 'Tables';
      const page = this.pages.find(p => p.value === this.currentPage);
      return page ? page.label : 'Select Page';
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectPage(page) {
      this.$emit('page-change', page);
      this.dropdownOpen = false;
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        this.dropdownOpen = false;
      }
    });
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
}

.nav-button:hover {
  background-color: #f57c00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background-color: #f5f5f5;
  color: #333;
  padding: 10px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 150px;
  justify-content: space-between;
}

.dropdown-toggle:hover {
  background-color: #eeeeee;
}

.dropdown-arrow {
  font-size: 0.75em;
  transition: transform 0.2s ease;
}

.dropdown-toggle:hover .dropdown-arrow {
  transform: translateY(2px);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.95em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #fff3e0;
  color: #ff9800;
  font-weight: 600;
}
</style>

