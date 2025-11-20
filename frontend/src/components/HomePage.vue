<template>
  <div class="home-container">
    <SearchBar
      v-model="searchQuery"
      placeholder="Search for a restaurant..."
    />

    <div class="restaurants">
      <RestaurantCard
        v-for="restaurant in filteredRestaurants"
        :key="restaurant.stand_id"
        :restaurant="restaurant"
      />
    </div>

    <div v-if="filteredRestaurants.length === 0" class="no-results">
      No restaurants found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script>
import { enrichRestaurantData } from '../utils/restaurantData';
import { listEntities, subscribeToEntity } from '../utils/fakeCrudService';
import SearchBar from './common/SearchBar.vue';
import RestaurantCard from './common/RestaurantCard.vue';

export default {
  name: 'HomePage',
  components: {
    SearchBar,
    RestaurantCard
  },
  data() {
    return {
      searchQuery: '',
      restaurants: [],
      unsubscribeFn: null
    };
  },
  computed: {
    filteredRestaurants() {
      if (!this.searchQuery) {
        return this.restaurants;
      }
      const query = this.searchQuery.toLowerCase();
      return this.restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.location.toLowerCase().includes(query) ||
        restaurant.category.toLowerCase().includes(query)
      );
    }
  },
  created() {
    this.loadRestaurants();
    this.unsubscribeFn = subscribeToEntity('foodStands', () => {
      this.loadRestaurants();
    });
  },
  beforeUnmount() {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
    }
  },
  methods: {
    loadRestaurants() {
      this.restaurants = listEntities('foodStands').map(enrichRestaurantData);
    }
  }
};
</script>

<style scoped>
.home-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.restaurants {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  width: 100%;
}

.no-results {
  text-align: center;
  color: #999;
  font-size: 1.2em;
  padding: 60px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

@media (max-width: 768px) {
  .restaurants {
    grid-template-columns: 1fr;
  }
}
</style>

