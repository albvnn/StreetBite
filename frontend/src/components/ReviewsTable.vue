<template>
  <div class="crud-page">
    <div class="crud-header">
      <div>
        <h2>Reviews</h2>
        <p class="subtitle">Track every customer review for stands and menu items.</p>
      </div>
      <button class="primary-btn" @click="openCreateForm">
        + New Review
      </button>
    </div>

    <div class="crud-body">
      <div class="list-panel">
        <div class="list-toolbar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search reviews by user, stand, item or comment..."
          />
        </div>

        <DataTable
          :data="filteredReviews"
          :columns="columns"
          :title="''"
          row-key="review_id"
        >
          <template #cell-userName="{ value }">
            <strong>{{ value }}</strong>
          </template>
          <template #cell-standName="{ value }">
            <span class="stand-pill">{{ value }}</span>
          </template>
          <template #cell-itemName="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-rating="{ value }">
            <StarRating :rating="value" />
          </template>
          <template #cell-actions="{ row }">
            <div class="table-actions">
              <button class="link-btn" @click="selectReview(row)">Details</button>
              <button class="link-btn" @click="startEdit(row)">Edit</button>
              <button class="link-btn danger" @click="confirmDelete(row)">Delete</button>
            </div>
          </template>
        </DataTable>
      </div>

      <div class="side-panel">
        <div v-if="showForm" class="panel-card">
          <h3>{{ formMode === 'create' ? 'Create Review' : 'Edit Review' }}</h3>
          <form class="form-grid" @submit.prevent="submitForm">
            <label>
              Stand
              <select v-model="formData.stand_id" required>
                <option disabled value="">Select a stand</option>
                <option v-for="stand in foodStands" :key="stand.stand_id" :value="stand.stand_id">
                  {{ stand.name }}
                </option>
              </select>
            </label>
            <label>
              Menu Item
              <select v-model="formData.item_id" required>
                <option disabled value="">Select a menu item</option>
                <option
                  v-for="item in filteredItemsForStand"
                  :key="item.item_id"
                  :value="item.item_id"
                >
                  {{ item.name }}
                </option>
              </select>
            </label>
            <label>
              User
              <select v-model="formData.user_id" required>
                <option disabled value="">Select a user</option>
                <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                  {{ user.name }}
                </option>
              </select>
            </label>
            <label>
              Rating
              <select v-model.number="formData.rating" required>
                <option v-for="rating in ratings" :key="rating" :value="rating">
                  {{ rating }}
                </option>
              </select>
            </label>
            <label class="full-width">
              Comment
              <textarea
                v-model="formData.comment"
                rows="4"
                placeholder="Share the customer feedback"
                required
              ></textarea>
            </label>
            <div class="form-actions full-width">
              <button class="primary-btn" type="submit">
                {{ formMode === 'create' ? 'Create Review' : 'Save Changes' }}
              </button>
              <button class="secondary-btn" type="button" @click="cancelForm">Cancel</button>
            </div>
          </form>
        </div>

        <div v-else-if="selectedReview" class="panel-card">
          <div class="detail-header">
            <div>
              <h3>{{ getUserName(selectedReview.user_id) }}</h3>
              <p class="detail-location">
                {{ getStandName(selectedReview.stand_id) }} • {{ getItemName(selectedReview.item_id) }}
              </p>
            </div>
            <StarRating :rating="selectedReview.rating" />
          </div>
          <p class="review-comment">"{{ selectedReview.comment }}"</p>
          <div class="detail-grid">
            <div>
              <span class="label">Submitted</span>
              <p>{{ formatDate(selectedReview.created_at) }}</p>
            </div>
            <div v-if="selectedReview.updated_at">
              <span class="label">Updated</span>
              <p>{{ formatDate(selectedReview.updated_at) }}</p>
            </div>
          </div>
          <div class="detail-actions">
            <button class="secondary-btn" @click="startEdit(selectedReview)">Edit</button>
            <button class="danger-btn" @click="confirmDelete(selectedReview)">Delete</button>
          </div>
        </div>

        <div v-else class="panel-card empty-state">
          <p>Select a review to inspect it or create a new one.</p>
        </div>
      </div>
    </div>

    <p v-if="statusMessage" class="status-message">
      {{ statusMessage }}
    </p>
  </div>
</template>

<script>
import { formatDate } from '../utils/formatters';
import usersData from '../data/users.json';
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  subscribeToEntity
} from '../utils/fakeCrudService';
import DataTable from './common/DataTable.vue';
import StarRating from './common/StarRating.vue';

export default {
  name: 'ReviewsTable',
  components: {
    DataTable,
    StarRating
  },
  data() {
    return {
      reviews: [],
      foodStands: [],
      menuItems: [],
      users: usersData,
      columns: [
        { key: 'review_id', label: 'ID' },
        { key: 'userName', label: 'User' },
        { key: 'standName', label: 'Stand' },
        { key: 'itemName', label: 'Menu Item' },
        { key: 'rating', label: 'Rating' },
        { key: 'comment', label: 'Comment' },
        { key: 'created_at', label: 'Created At', formatter: formatDate },
        { key: 'actions', label: 'Actions' }
      ],
      ratings: [5, 4, 3, 2, 1],
      searchQuery: '',
      selectedReview: null,
      showForm: false,
      formMode: 'create',
      formData: {
        stand_id: '',
        item_id: '',
        user_id: usersData[0]?.user_id || '',
        rating: 5,
        comment: ''
      },
      statusMessage: '',
      statusTimeout: null,
      unsubscribeReviews: null,
      unsubscribeStands: null,
      unsubscribeMenu: null
    };
  },
  computed: {
    tableRows() {
      return this.reviews.map(review => ({
        ...review,
        standName: this.getStandName(review.stand_id),
        itemName: this.getItemName(review.item_id),
        userName: this.getUserName(review.user_id)
      }));
    },
    filteredReviews() {
      const query = this.searchQuery.trim().toLowerCase();
      const ordered = [...this.tableRows].sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );
      if (!query) {
        return ordered;
      }
      return ordered.filter(review => {
        const haystack = `${review.userName} ${review.standName} ${review.itemName} ${review.comment}`.toLowerCase();
        return haystack.includes(query);
      });
    },
    filteredItemsForStand() {
      if (!this.formData.stand_id) {
        return [];
      }
      return this.menuItems.filter(item => item.stand_id === Number(this.formData.stand_id));
    }
  },
  watch: {
    'formData.stand_id'(newValue) {
      if (!newValue) {
        this.formData.item_id = '';
        return;
      }
      const availableItems = this.menuItems.filter(item => item.stand_id === Number(newValue));
      if (availableItems.length === 0) {
        this.formData.item_id = '';
        return;
      }
      const hasSelected = availableItems.some(item => item.item_id === Number(this.formData.item_id));
      if (!hasSelected) {
        this.formData.item_id = availableItems[0].item_id;
      }
    }
  },
  created() {
    this.refreshReviews();
    this.refreshFoodStands();
    this.refreshMenuItems();
    this.unsubscribeReviews = subscribeToEntity('reviews', data => {
      this.reviews = data;
      this.syncSelection();
    });
    this.unsubscribeStands = subscribeToEntity('foodStands', data => {
      this.foodStands = data;
    });
    this.unsubscribeMenu = subscribeToEntity('menuItems', data => {
      this.menuItems = data;
    });
  },
  beforeUnmount() {
    [this.unsubscribeReviews, this.unsubscribeStands, this.unsubscribeMenu].forEach(unsub => {
      if (typeof unsub === 'function') {
        unsub();
      }
    });
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
  },
  methods: {
    formatDate,
    refreshReviews() {
      this.reviews = listEntities('reviews');
      if (!this.selectedReview && this.reviews.length) {
        this.selectedReview = this.reviews[0];
      } else {
        this.syncSelection();
      }
    },
    refreshFoodStands() {
      this.foodStands = listEntities('foodStands');
    },
    refreshMenuItems() {
      this.menuItems = listEntities('menuItems');
    },
    syncSelection() {
      if (!this.selectedReview) {
        return;
      }
      this.selectedReview =
        this.reviews.find(review => review.review_id === this.selectedReview.review_id) || null;
    },
    getStandName(standId) {
      const stand = this.foodStands.find(entry => entry.stand_id === Number(standId));
      return stand ? stand.name : `Stand #${standId}`;
    },
    getItemName(itemId) {
      const item = this.menuItems.find(entry => entry.item_id === Number(itemId));
      return item ? item.name : `Item #${itemId}`;
    },
    getUserName(userId) {
      const user = this.users.find(entry => entry.user_id === Number(userId));
      return user ? user.name : `User #${userId}`;
    },
    openCreateForm() {
      this.formMode = 'create';
      this.formData = {
        stand_id: this.foodStands[0]?.stand_id || '',
        item_id: '',
        user_id: this.users[0]?.user_id || '',
        rating: 5,
        comment: ''
      };
      const items = this.filteredItemsForStand;
      if (items.length) {
        this.formData.item_id = items[0].item_id;
      }
      this.showForm = true;
    },
    selectReview(row) {
      this.selectedReview =
        this.reviews.find(review => review.review_id === row.review_id) || row;
      this.showForm = false;
    },
    startEdit(review) {
      this.formMode = 'edit';
      this.formData = {
        stand_id: review.stand_id,
        item_id: review.item_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment
      };
      this.selectedReview = review;
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.formMode = 'create';
    },
    validateForm() {
      const required = ['stand_id', 'item_id', 'user_id', 'comment'];
      const missing = required.some(field => !this.formData[field]);
      if (missing) {
        this.setStatusMessage('Please fill in all fields.');
        return false;
      }
      if (this.formData.rating < 1 || this.formData.rating > 5) {
        this.setStatusMessage('Rating must be between 1 and 5.');
        return false;
      }
      return true;
    },
    buildPayload() {
      return {
        stand_id: Number(this.formData.stand_id),
        item_id: Number(this.formData.item_id),
        user_id: Number(this.formData.user_id),
        rating: Number(this.formData.rating),
        comment: this.formData.comment.trim()
      };
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }
      const payload = this.buildPayload();
      try {
        if (this.formMode === 'create') {
          const created = createEntity('reviews', payload);
          this.selectedReview = created;
          this.setStatusMessage('Review created successfully.');
        } else if (this.selectedReview) {
          const updated = updateEntity('reviews', this.selectedReview.review_id, payload);
          this.selectedReview = updated;
          this.setStatusMessage('Review updated successfully.');
        }
        this.showForm = false;
        this.refreshReviews();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Something went wrong. Please try again.');
      }
    },
    confirmDelete(review) {
      const confirmed = window.confirm('Delete this review permanently?');
      if (!confirmed) {
        return;
      }
      try {
        deleteEntity('reviews', review.review_id);
        if (this.selectedReview && this.selectedReview.review_id === review.review_id) {
          this.selectedReview = null;
        }
        this.setStatusMessage('Review deleted.');
        this.refreshReviews();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Failed to delete the review.');
      }
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
  }
};
</script>

<style scoped>
.crud-page {
  padding: 24px;
}

.crud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.crud-header h2 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  margin: 0;
  color: #333;
}

.subtitle {
  color: #666;
  margin-top: 6px;
}

.crud-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.list-toolbar {
  margin-bottom: 12px;
}

.list-toolbar input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: 'Inter', sans-serif;
}

.side-panel {
  position: sticky;
  top: 120px;
  align-self: start;
}

.panel-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
  color: #555;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.form-grid input,
.form-grid textarea,
.form-grid select {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: 'Inter', sans-serif;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.primary-btn {
  background: #ff9800;
  color: white;
}

.secondary-btn {
  background: #f0f0f0;
  color: #333;
}

.danger-btn {
  background: #f44336;
  color: white;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.link-btn {
  background: none;
  border: none;
  color: #ff9800;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.link-btn.danger {
  color: #f44336;
}

.stand-pill {
  background: #fff3e0;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85em;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-location {
  color: #777;
  margin-top: 4px;
}

.review-comment {
  font-style: italic;
  color: #555;
  margin-bottom: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.label {
  font-size: 0.75em;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  color: #888;
}

.status-message {
  margin-top: 20px;
  color: #2e7d32;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .crud-body {
    grid-template-columns: 1fr;
  }

  .side-panel {
    position: static;
  }
}
</style>

