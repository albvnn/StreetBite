<template>
  <router-link :to="`/restaurant/${restaurant.stand_id}`" class="restaurant-card-link">
    <div class="restaurant-card">
      <img
        :src="restaurant.image"
        :alt="restaurant.name"
        class="restaurant-image"
      />
      <div class="restaurant-content">
        <div class="restaurant-header">
          <h2 class="restaurant-name">{{ restaurant.name }}</h2>
          <span v-if="isOwner" class="owner-badge">👑 Owner</span>
        </div>
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
          <div v-if="restaurant.averageRating > 0" class="rating-display">
            <StarRating :rating="Math.round(restaurant.averageRating)" />
            <span class="rating-text">{{ restaurant.averageRating.toFixed(1) }}</span>
            <span class="review-count">({{ restaurant.reviewCount }})</span>
          </div>
          <StatusBadge :is-active="isCurrentlyOpen" />
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import StatusBadge from './StatusBadge.vue';
import StarRating from './StarRating.vue';
import { isStandOpenNow } from '../../utils/openingHours';
import { getCurrentUser } from '../../utils/authService';

export default {
  name: 'RestaurantCard',
  components: {
    StatusBadge,
    StarRating
  },
  props: {
    restaurant: {
      type: Object,
      required: true
    }
  },
  computed: {
    currentUser() {
      return getCurrentUser();
    },
    isOwner() {
      if (!this.currentUser || !this.restaurant) {
        return false;
      }
      return this.currentUser.user_id === this.restaurant.owner_id;
    },
    isCurrentlyOpen() {
      if (!this.restaurant) {
        return false;
      }
      return Boolean(this.restaurant.is_active && isStandOpenNow(this.restaurant.opening_hours));
    }
  }
};
</script>

<style scoped>
.restaurant-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.restaurant-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
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

.restaurant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.restaurant-name {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
}

.owner-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: #fff3e0;
  color: #e65100;
  border: 1px solid #ff9800;
  border-radius: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.75em;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
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
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 700;
  font-size: 1em;
  color: #333;
}

.review-count {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.85em;
  color: #666;
}
</style>

