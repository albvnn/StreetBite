<template>
  <div class="app">
    <AppHeader :current-page="currentPage" @home="goHome" @page-change="changePage" />
    <div class="container">
      <component :is="currentComponent" />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import HomePage from './components/HomePage.vue';
import UsersTable from './components/UsersTable.vue';
import FoodStandsTable from './components/FoodStandsTable.vue';
import MenuItemsTable from './components/MenuItemsTable.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    HomePage,
    UsersTable,
    FoodStandsTable,
    MenuItemsTable
  },
  data() {
    return {
      currentPage: 'home'
    };
  },
  computed: {
    currentComponent() {
      const componentMap = {
        home: 'HomePage',
        users: 'UsersTable',
        foodStands: 'FoodStandsTable',
        menuItems: 'MenuItemsTable'
      };
      return componentMap[this.currentPage] || 'HomePage';
    }
  },
  methods: {
    goHome() {
      this.currentPage = 'home';
    },
    changePage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
}
</style>
