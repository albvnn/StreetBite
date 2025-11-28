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
import { listEntities, subscribeToEntity } from '../utils/apiService';
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
      reviews: [],
      unsubscribeFn: null,
      unsubscribeReviews: null
    };
  },
  computed: {
    filteredRestaurants() {
      const restaurants = this.restaurants.map(restaurant => {
        const standReviews = this.reviews.filter(r => r.stand_id === restaurant.stand_id);
        const averageRating = standReviews.length > 0
          ? standReviews.reduce((sum, r) => sum + r.rating, 0) / standReviews.length
          : 0;
        return {
          ...restaurant,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: standReviews.length
        };
      });

      if (!this.searchQuery) {
        return restaurants;
      }
      const query = this.searchQuery.toLowerCase();
      return restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.location.toLowerCase().includes(query) ||
        restaurant.category.toLowerCase().includes(query)
      );
    }
  },
  async created() {
    await this.loadRestaurants();
    await this.loadReviews();
    this.unsubscribeFn = subscribeToEntity('foodStands', (data) => {
      this.restaurants = data.map(enrichRestaurantData);
    });
    this.unsubscribeReviews = subscribeToEntity('reviews', (data) => {
      this.reviews = data;
    });
  },
  beforeUnmount() {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
    }
    if (this.unsubscribeReviews) {
      this.unsubscribeReviews();
    }
  },
  methods: {
    async loadRestaurants() {
      try {
        const stands = await listEntities('foodStands');
        this.restaurants = stands.map(enrichRestaurantData);
      } catch (error) {
        console.error('Failed to load restaurants', error);
        this.restaurants = [];
      }
    },
    async loadReviews() {
      try {
        this.reviews = await listEntities('reviews');
      } catch (error) {
        console.error('Failed to load reviews', error);
        this.reviews = [];
      }
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

