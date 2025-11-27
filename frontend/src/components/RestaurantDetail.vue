<template>
  <div v-if="stand" class="restaurant-detail">
    <div class="detail-hero">
      <img :src="standImage" :alt="stand.name" class="hero-image" />
      <div class="hero-content">
        <h1>{{ stand.name }}</h1>
        <p class="hero-location">📍 {{ stand.location }}</p>
        <div class="hero-meta">
          <CategoryBadge :category="stand.category" />
          <StatusBadge :is-active="stand.is_active" active-text="Open" inactive-text="Closed" />
        </div>
        <p class="hero-hours">🕐 {{ stand.opening_hours }}</p>
      </div>
    </div>

    <div class="detail-body">
      <div class="main-content">
        <!-- Menu Section -->
        <section class="menu-section">
          <div class="section-header">
            <h2>Menu</h2>
            <button
              v-if="canManage"
              class="primary-btn small"
              @click="showMenuForm = true"
            >
              + Add Item
            </button>
          </div>

          <div v-if="showMenuForm" class="form-card">
            <h3>{{ editingMenuItem ? 'Edit' : 'New' }} Menu Item</h3>
            <form @submit.prevent="saveMenuItem" class="form-grid">
              <label>
                Name
                <input v-model="menuForm.name" type="text" required />
              </label>
              <label class="full-width">
                Description
                <textarea v-model="menuForm.description" rows="3" required></textarea>
              </label>
              <label>
                Price (€)
                <input v-model.number="menuForm.price" type="number" min="0" step="0.1" required />
              </label>
              <label class="checkbox-field">
                <input v-model="menuForm.is_vegan" type="checkbox" />
                <span>Vegan</span>
              </label>
              <label class="checkbox-field">
                <input v-model="menuForm.available" type="checkbox" />
                <span>Available</span>
              </label>
              <div class="form-actions full-width">
                <button type="submit" class="primary-btn">Save</button>
                <button type="button" class="secondary-btn" @click="cancelMenuForm">Cancel</button>
              </div>
            </form>
          </div>

          <div v-if="menuItems.length === 0" class="empty-state">
            <p>No items on the menu at the moment.</p>
          </div>
          <div v-else class="menu-grid">
            <div
              v-for="item in menuItems"
              :key="item.item_id"
              class="menu-item-card"
              :class="{ unavailable: !item.available }"
            >
              <div class="menu-item-header">
                <h3>{{ item.name }}</h3>
                <div class="menu-item-badges">
                  <VeganBadge v-if="item.is_vegan" :is-vegan="true" />
                  <span v-if="!item.available" class="unavailable-badge">Unavailable</span>
                </div>
              </div>
              <p class="menu-item-description">{{ item.description }}</p>
              <div class="menu-item-footer">
                <span class="menu-item-price">{{ formatPrice(item.price) }}</span>
                <div v-if="canManage" class="menu-item-actions">
                  <button class="link-btn" @click="editMenuItem(item)">Edit</button>
                  <button class="link-btn danger" @click="deleteMenuItem(item)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Reviews Section -->
        <section class="reviews-section">
          <div class="section-header">
            <h2>Customer Reviews</h2>
            <button
              v-if="canReview"
              class="review-btn"
              @click="showReviewForm = true"
            >
              <span class="btn-icon">⭐</span>
              <span>Leave a Review</span>
            </button>
          </div>

          <div v-if="showReviewForm" class="form-card">
            <h3>Your Review</h3>
            <form @submit.prevent="saveReview" class="form-grid">
              <label>
                Menu Item
                <select v-model.number="reviewForm.item_id" required>
                  <option disabled value="">Select an item</option>
                  <option v-for="item in menuItems" :key="item.item_id" :value="item.item_id">
                    {{ item.name }}
                  </option>
                </select>
              </label>
              <label>
                Rating
                <select v-model.number="reviewForm.rating" required>
                  <option v-for="r in [5, 4, 3, 2, 1]" :key="r" :value="r">{{ r }}/5</option>
                </select>
              </label>
              <label class="full-width">
                Comment
                <textarea v-model="reviewForm.comment" rows="4" required></textarea>
              </label>
              <div class="form-actions full-width">
                <button type="submit" class="publish-btn">
                  <span class="btn-icon">📝</span>
                  <span>Publish Review</span>
                </button>
                <button type="button" class="secondary-btn" @click="cancelReviewForm">Cancel</button>
              </div>
            </form>
          </div>

          <div v-if="reviews.length === 0" class="empty-state">
            <p>No reviews at the moment.</p>
          </div>
          <div v-else class="reviews-list">
            <div v-for="review in reviews" :key="review.review_id" class="review-card">
              <div class="review-header">
                <div>
                  <strong>{{ getUserName(review.user_id) }}</strong>
                  <span class="review-item">{{ getItemName(review.item_id) }}</span>
                </div>
                <StarRating :rating="review.rating" />
              </div>
              <p class="review-comment">{{ review.comment }}</p>
              <p class="review-date">{{ formatDate(review.reviewed_at || review.created_at) }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
  </div>
  <div v-else class="loading-state">
    <p>Loading...</p>
  </div>
</template>

<script>
import { formatDate, formatPrice } from '../utils/formatters';
import { getCurrentUser, isOwner } from '../utils/authService';
import { listEntities, createEntity, updateEntity, deleteEntity, getEntityById } from '../utils/apiService';
import { enrichRestaurantData } from '../utils/restaurantData';
import CategoryBadge from './common/CategoryBadge.vue';
import StatusBadge from './common/StatusBadge.vue';
import VeganBadge from './common/VeganBadge.vue';
import StarRating from './common/StarRating.vue';

export default {
  name: 'RestaurantDetail',
  components: {
    CategoryBadge,
    StatusBadge,
    VeganBadge,
    StarRating
  },
  data() {
    return {
      stand: null,
      menuItems: [],
      reviews: [],
      users: [],
      showMenuForm: false,
      showReviewForm: false,
      editingMenuItem: null,
      menuForm: {
        name: '',
        description: '',
        price: 0,
        is_vegan: false,
        available: true
      },
      reviewForm: {
        item_id: '',
        rating: 5,
        comment: ''
      },
      statusMessage: '',
      statusTimeout: null
    };
  },
  computed: {
    standImage() {
      return this.stand?.image || '';
    },
    currentUser() {
      return getCurrentUser();
    },
    canManage() {
      if (!this.currentUser || !this.stand) return false;
      return isOwner() && this.currentUser.user_id === this.stand.owner_id;
    },
    canReview() {
      return this.currentUser && this.currentUser.role === 'customer';
    }
  },
  async created() {
    await this.loadUsers();
    await this.loadStand();
    await this.loadMenuItems();
    await this.loadReviews();
  },
  watch: {
    async '$route.params.id'() {
      await this.loadStand();
      await this.loadMenuItems();
      await this.loadReviews();
    }
  },
  methods: {
    formatDate,
    formatPrice,
    async loadUsers() {
      try {
        this.users = await listEntities('users');
      } catch (error) {
        console.error('Failed to load users', error);
        this.users = [];
      }
    },
    async loadStand() {
      try {
        const standId = Number(this.$route.params.id);
        const stand = await getEntityById('foodStands', standId);
        if (stand) {
          this.stand = enrichRestaurantData(stand);
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Failed to load stand', error);
        this.$router.push('/');
      }
    },
    async loadMenuItems() {
      if (!this.stand) return;
      try {
        const allItems = await listEntities('menuItems');
        this.menuItems = allItems.filter(item => item.stand_id === this.stand.stand_id);
      } catch (error) {
        console.error('Failed to load menu items', error);
        this.menuItems = [];
      }
    },
    async loadReviews() {
      if (!this.stand) return;
      try {
        const allReviews = await listEntities('reviews');
        this.reviews = allReviews
          .filter(review => review.stand_id === this.stand.stand_id)
          .sort((a, b) => new Date(b.reviewed_at || b.created_at) - new Date(a.reviewed_at || a.created_at));
      } catch (error) {
        console.error('Failed to load reviews', error);
        this.reviews = [];
      }
    },
    editMenuItem(item) {
      this.editingMenuItem = item;
      this.menuForm = {
        name: item.name,
        description: item.description,
        price: item.price,
        is_vegan: item.is_vegan,
        available: item.available
      };
      this.showMenuForm = true;
    },
    cancelMenuForm() {
      this.showMenuForm = false;
      this.editingMenuItem = null;
      this.menuForm = {
        name: '',
        description: '',
        price: 0,
        is_vegan: false,
        available: true
      };
    },
    async saveMenuItem() {
      if (!this.canManage) return;
      const payload = {
        stand_id: this.stand.stand_id,
        name: this.menuForm.name.trim(),
        description: this.menuForm.description.trim(),
        price: Number(this.menuForm.price),
        is_vegan: Boolean(this.menuForm.is_vegan),
        available: Boolean(this.menuForm.available)
      };
      try {
        if (this.editingMenuItem) {
          await updateEntity('menuItems', this.editingMenuItem.item_id, payload);
          this.setStatusMessage(`"${payload.name}" updated successfully.`);
        } else {
          await createEntity('menuItems', payload);
          this.setStatusMessage(`"${payload.name}" added to menu.`);
        }
        this.cancelMenuForm();
        await this.loadMenuItems();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Error saving item.');
      }
    },
    async deleteMenuItem(item) {
      if (!this.canManage) return;
      if (!confirm(`Delete "${item.name}"?`)) return;
      try {
        await deleteEntity('menuItems', item.item_id);
        const allReviews = await listEntities('reviews');
        const itemReviews = allReviews.filter(r => r.item_id === item.item_id);
        for (const review of itemReviews) {
          await deleteEntity('reviews', review.review_id);
        }
        this.setStatusMessage(`"${item.name}" deleted.`);
        await this.loadMenuItems();
        await this.loadReviews();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Error deleting item.');
      }
    },
    cancelReviewForm() {
      this.showReviewForm = false;
      this.reviewForm = {
        item_id: '',
        rating: 5,
        comment: ''
      };
    },
    async saveReview() {
      if (!this.canReview) return;
      const payload = {
        stand_id: this.stand.stand_id,
        item_id: Number(this.reviewForm.item_id),
        user_id: this.currentUser.user_id,
        rating: Number(this.reviewForm.rating),
        comment: this.reviewForm.comment.trim()
      };
      try {
        await createEntity('reviews', payload);
        this.setStatusMessage('Your review has been published!');
        this.cancelReviewForm();
        await this.loadReviews();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Error publishing review.');
      }
    },
    getUserName(userId) {
      const user = this.users.find(u => u.user_id === Number(userId));
      return user ? user.name : `User #${userId}`;
    },
    getItemName(itemId) {
      const item = this.menuItems.find(i => i.item_id === Number(itemId));
      return item ? item.name : `Item #${itemId}`;
    },
    setStatusMessage(message) {
      this.statusMessage = message;
      if (this.statusTimeout) {
        clearTimeout(this.statusTimeout);
      }
      this.statusTimeout = setTimeout(() => {
        this.statusMessage = '';
        this.statusTimeout = null;
      }, 4000);
    }
  },
  beforeUnmount() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
  }
};
</script>

<style scoped>
.restaurant-detail {
  min-height: 100vh;
  background-color: #fafafa;
}

.detail-hero {
  position: relative;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  padding: 60px 32px 40px;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content h1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 3em;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.hero-location {
  font-size: 1.2em;
  margin-bottom: 16px;
  opacity: 0.95;
}

.hero-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.hero-hours {
  font-size: 1em;
  opacity: 0.9;
}

.detail-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.review-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff9800 0%, #ff6f00 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4);
  background: linear-gradient(135deg, #ff6f00 0%, #ff9800 100%);
}

.review-btn .btn-icon {
  font-size: 1.1em;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.publish-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
}

.publish-btn .btn-icon {
  font-size: 1.1em;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.menu-item-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item-card.unavailable {
  opacity: 0.6;
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.menu-item-header h3 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.3em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.menu-item-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.unavailable-badge {
  background-color: #ffcdd2;
  color: #c62828;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 600;
}

.menu-item-description {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.menu-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item-price {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.3em;
  font-weight: 700;
  color: #ff9800;
}

.menu-item-actions {
  display: flex;
  gap: 12px;
}

.form-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-card h3 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  color: #333;
}

.form-grid label.full-width {
  grid-column: 1 / -1;
}

.form-grid input,
.form-grid textarea,
.form-grid select {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
}

.form-grid input:focus,
.form-grid textarea:focus,
.form-grid select:focus {
  outline: none;
  border-color: #ff9800;
}

.checkbox-field {
  flex-direction: row !important;
  align-items: center;
  gap: 8px !important;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.secondary-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  cursor: pointer;
}

.link-btn {
  background: none;
  border: none;
  color: #ff9800;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.link-btn.danger {
  color: #c62828;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-header strong {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.1em;
  color: #333;
}

.review-item {
  color: #666;
  font-size: 0.9em;
  margin-left: 8px;
}


.review-comment {
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.review-date {
  color: #999;
  font-size: 0.85em;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-message {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #4caf50;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 1000;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #666;
}
</style>

