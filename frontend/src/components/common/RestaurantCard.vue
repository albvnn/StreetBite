<template>
  <router-link :to="`/restaurant/${restaurant.stand_id}`" class="restaurant-card-link">
    <div class="restaurant-card">
      <div class="card-media">
        <img
          :src="restaurant.image"
          :alt="restaurant.name"
          class="restaurant-image"
        />
        <div class="media-overlays">
          <span class="category-chip">{{ restaurant.category }}</span>
          <StatusBadge class="status-pill" :is-active="restaurant.is_active" />
        </div>
      </div>
      <div class="restaurant-content">
        <div class="card-header">
          <div>
            <p class="location-label">📍 {{ restaurant.location }}</p>
            <h2 class="restaurant-name">{{ restaurant.name }}</h2>
          </div>
          <div v-if="restaurant.averageRating > 0" class="rating-display">
            <StarRating :rating="Math.round(restaurant.averageRating)" />
            <div class="rating-copy">
              <span class="rating-text">{{ restaurant.averageRating.toFixed(1) }}</span>
              <span class="review-count">({{ restaurant.reviewCount }})</span>
            </div>
          </div>
        </div>
        <p class="restaurant-description">
          {{ restaurant.description }}
        </p>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">🕐</span>
            <div>
              <p class="info-title">Hours</p>
              <p class="info-value">{{ restaurant.opening_hours }}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">🍽️</span>
            <div>
              <p class="info-title">Category</p>
              <p class="info-value">{{ restaurant.category }}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">📍</span>
            <div>
              <p class="info-title">Location</p>
              <p class="info-value">{{ restaurant.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import StatusBadge from './StatusBadge.vue';
import StarRating from './StarRating.vue';

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
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.restaurant-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.16);
}

.card-media {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.restaurant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.restaurant-card:hover .restaurant-image {
  transform: scale(1.08);
}

.media-overlays {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
}

.category-chip {
  background: rgba(255, 255, 255, 0.9);
  color: #ff6b6b;
  padding: 6px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85em;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
}

.status-pill {
  pointer-events: all;
}

.restaurant-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.location-label {
  margin: 0;
  font-size: 0.9em;
  color: #94a3b8;
}

.restaurant-name {
  margin: 4px 0 0;
  font-size: 1.6em;
  font-weight: 700;
  color: #0f172a;
}

.restaurant-description {
  margin: 0;
  color: #475569;
  line-height: 1.6;
  font-size: 0.98em;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.04);
  border-radius: 999px;
  padding: 6px 14px;
}

.rating-copy {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.rating-text {
  font-weight: 700;
  color: #0f172a;
}

.review-count {
  color: #94a3b8;
  font-size: 0.85em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.05);
}

.info-label {
  font-size: 1.3em;
}

.info-title {
  margin: 0;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}

.info-value {
  margin: 2px 0 0;
  font-weight: 600;
  color: #0f172a;
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
  }

  .rating-display {
    align-self: flex-start;
  }
}
</style>

