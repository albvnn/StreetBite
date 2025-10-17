<template>
  <div class="app">
    <header class="header">
      <h1 class="title">🌮 StreetBite</h1>
    </header>

    <div class="container">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for a restaurant..."
          class="search-bar"
        />
      </div>

      <div class="restaurants">
        <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="restaurant-card">
          <img
            :src="restaurant.image"
            :alt="restaurant.name"
            class="restaurant-image"
          />
          <h2 class="restaurant-name">{{ restaurant.name }}</h2>
          <p class="restaurant-description">
            {{ restaurant.description }}
          </p>
          <div class="restaurant-rating">⭐ {{ restaurant.rating }} / 5</div>
        </div>
      </div>

      <div v-if="filteredRestaurants.length === 0" class="no-results">
        No restaurants found for "{{ searchQuery }}"
      </div>
    </div>

    <footer class="footer">
      <p>&copy; 2025 StreetBite - All rights reserved</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      restaurants: [
        {
          id: 1,
          name: 'Tokyo Street',
          description: 'Freshly prepared sushi and rich ramen broth, served in an authentic Japanese vibe.',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop'
        },
        {
          id: 2,
          name: 'El Taco Loco',
          description: 'Homemade tacos, quesadillas, and nachos! The perfect spot to enjoy bold Mexican street food flavors.',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=400&fit=crop'
        },
        {
          id: 3,
          name: 'Burger District',
          description: 'Handcrafted burgers, crispy fries, and house sauces. A classic reimagined for real food lovers.',
          rating: 4.4,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'
        }
      ]
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
        restaurant.description.toLowerCase().includes(query)
      );
    }
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
}

.title {
  color: white;
  font-size: 2.5em;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.search-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
}

.search-bar {
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1em;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-bar:focus {
  border-color: #ff9800;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
}

.restaurants {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.restaurant-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.restaurant-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.restaurant-name {
  margin-top: 15px;
  font-size: 1.4em;
  color: #333;
}

.restaurant-description {
  margin: 10px 0;
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

.restaurant-rating {
  font-weight: bold;
  color: #ff9800;
  font-size: 1.1em;
}

.no-results {
  text-align: center;
  color: #999;
  font-size: 1.2em;
  padding: 40px;
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
