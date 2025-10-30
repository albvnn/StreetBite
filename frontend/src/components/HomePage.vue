<template>
  <div class="home-container">
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for a restaurant..."
        class="search-bar"
      />
    </div>

    <div class="restaurants">
      <div 
        v-for="restaurant in filteredRestaurants" 
        :key="restaurant.stand_id" 
        class="restaurant-card"
      >
        <img
          :src="restaurant.image"
          :alt="restaurant.name"
          class="restaurant-image"
        />
        <div class="restaurant-content">
          <h2 class="restaurant-name">{{ restaurant.name }}</h2>
          <p class="restaurant-description">
            {{ restaurant.description }}
          </p>
          <div class="restaurant-info">
            <div class="info-item">
              <span class="info-label">📍</span>
              <span>{{ restaurant.location }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🕐</span>
              <span>{{ restaurant.opening_hours }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🍽️</span>
              <span>{{ restaurant.category }}</span>
            </div>
          </div>
          <div class="restaurant-footer">
            <span :class="['status-badge', restaurant.is_active ? 'active' : 'inactive']">
              {{ restaurant.is_active ? 'Open' : 'Closed' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredRestaurants.length === 0" class="no-results">
      No restaurants found for "{{ searchQuery }}"
    </div>
  </div>
</template>

<script>
import foodStandsData from '../data/foodStands.json';

export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: '',
      restaurants: foodStandsData.map(stand => ({
        ...stand,
        image: this.getRestaurantImage(stand.name),
        description: this.getRestaurantDescription(stand.name, stand.category)
      }))
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
  methods: {
    getRestaurantImage(name) {
      const images = {
        'Tokyo Street': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop',
        'El Taco Loco': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=400&fit=crop',
        'Burger District': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop',
        'Pizza Corner': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop',
        'Asian Fusion Express': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
        'Healthy Bites': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop'
      };
      return images[name] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop';
    },
    getRestaurantDescription(name, category) {
      const descriptions = {
        'Tokyo Street': 'Freshly prepared sushi and rich ramen broth, served in an authentic Japanese vibe.',
        'El Taco Loco': 'Homemade tacos, quesadillas, and nachos! The perfect spot to enjoy bold Mexican street food flavors.',
        'Burger District': 'Handcrafted burgers, crispy fries, and house sauces. A classic reimagined for real food lovers.',
        'Pizza Corner': 'Authentic Italian pizzas with fresh ingredients and traditional recipes. Perfect for pizza enthusiasts.',
        'Asian Fusion Express': 'A delightful mix of Asian flavors featuring dishes from Thailand, China, and more.',
        'Healthy Bites': 'Fresh, nutritious, and delicious plant-based meals for a healthy lifestyle.'
      };
      return descriptions[name] || `Delicious ${category} cuisine served with passion and care.`;
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

.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-bar {
  width: 100%;
  padding: 16px 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.05em;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-bar:focus {
  border-color: #ff9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
}

.restaurants {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  width: 100%;
}

.restaurant-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.restaurant-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.restaurant-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.restaurant-name {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.restaurant-description {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #666;
  font-size: 0.95em;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex: 1;
}

.restaurant-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.9em;
  color: #555;
}

.info-label {
  font-size: 1.1em;
}

.restaurant-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-badge.active {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #ffcdd2;
  color: #c62828;
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

