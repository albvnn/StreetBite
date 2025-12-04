<template>
  <div class="crud-page">
    <div class="crud-header">
      <div>
        <h2>Food Stands</h2>
        <p class="subtitle">Create, explore, edit or delete street food stands.</p>
      </div>
      <button class="primary-btn" @click="openCreateForm">
        + New Stand
      </button>
    </div>

    <div class="crud-body">
      <div class="list-panel">
        <div class="list-toolbar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search stands by name, location or category..."
          />
        </div>

        <DataTable
          :data="filteredFoodStands"
          :columns="columns"
          :title="''"
          row-key="stand_id"
        >
          <template #cell-name="{ value }">
            <strong>{{ value }}</strong>
          </template>
          <template #cell-category="{ value }">
            <CategoryBadge :category="value" />
          </template>
          <template #cell-is_active="{ value }">
            <StatusBadge
              :is-active="value"
              active-text="Active"
              inactive-text="Inactive"
            />
          </template>
          <template #cell-actions="{ row }">
            <div class="table-actions">
              <button class="link-btn" @click="selectStand(row)">Details</button>
              <button class="link-btn" @click="startEdit(row)">Edit</button>
              <button class="link-btn danger" @click="confirmDelete(row)">Delete</button>
            </div>
          </template>
        </DataTable>
      </div>

      <div class="side-panel">
        <div v-if="showForm" class="panel-card">
          <h3>{{ formMode === 'create' ? 'Create Food Stand' : 'Edit Food Stand' }}</h3>
          <form class="form-grid" @submit.prevent="submitForm">
            <label>
              Name
              <input v-model="formData.name" type="text" required placeholder="Stand name" />
            </label>
            <label>
              Location
              <input
                v-model="formData.location"
                type="text"
                required
                placeholder="Street and city"
              />
            </label>
            <label>
              Category
              <input
                v-model="formData.category"
                type="text"
                required
                placeholder="Cuisine type"
              />
            </label>
            <label>
              Owner ID
              <input
                v-model.number="formData.owner_id"
                type="number"
                required
                min="1"
                placeholder="Owner user id"
              />
            </label>
            <label class="full-width">
              Opening Hours
              <input
                v-model="formData.opening_hours"
                type="text"
                required
                placeholder="Mon-Sun: 10:00-22:00"
              />
            </label>
            <label class="checkbox-field full-width">
              <input v-model="formData.is_active" type="checkbox" />
              <span>Stand is active</span>
            </label>
            <div class="form-actions full-width">
              <button class="primary-btn" type="submit">
                {{ formMode === 'create' ? 'Create Stand' : 'Save Changes' }}
              </button>
              <button class="secondary-btn" type="button" @click="cancelForm">Cancel</button>
            </div>
          </form>
        </div>

        <div v-else-if="selectedStand" class="panel-card">
          <div class="detail-header">
            <div>
              <h3>{{ selectedStand.name }}</h3>
              <p class="detail-location">{{ selectedStand.location }}</p>
            </div>
            <StatusBadge
              :is-active="selectedStand.is_active"
              active-text="Active"
              inactive-text="Inactive"
            />
          </div>
          <div class="detail-grid">
            <div>
              <span class="label">Category</span>
              <p>{{ selectedStand.category }}</p>
            </div>
            <div>
              <span class="label">Owner ID</span>
              <p>#{{ selectedStand.owner_id }}</p>
            </div>
            <div>
              <span class="label">Opening Hours</span>
              <p>{{ selectedStand.opening_hours }}</p>
            </div>
            <div>
              <span class="label">Created</span>
              <p>{{ formatDate(selectedStand.created_at) }}</p>
            </div>
          </div>
          <div class="detail-actions">
            <button class="secondary-btn" @click="startEdit(selectedStand)">Edit</button>
            <button class="danger-btn" @click="confirmDelete(selectedStand)">Delete</button>
          </div>
        </div>

        <div v-else class="panel-card empty-state">
          <p>Select a stand to see its details or create a new one.</p>
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
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  subscribeToEntity
} from '../utils/apiService';
import DataTable from './common/DataTable.vue';
import StatusBadge from './common/StatusBadge.vue';
import CategoryBadge from './common/CategoryBadge.vue';

export default {
  name: 'FoodStandsTable',
  components: {
    DataTable,
    StatusBadge,
    CategoryBadge
  },
  data() {
    return {
      foodStands: [],
      columns: [
        { key: 'stand_id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'category', label: 'Category' },
        { key: 'owner_id', label: 'Owner ID' },
        { key: 'opening_hours', label: 'Opening Hours' },
        { key: 'is_active', label: 'Status' },
        { key: 'created_at', label: 'Created At', formatter: formatDate },
        { key: 'actions', label: 'Actions' }
      ],
      searchQuery: '',
      selectedStand: null,
      showForm: false,
      formMode: 'create',
      formData: {
        name: '',
        location: '',
        category: '',
        owner_id: 1,
        opening_hours: '',
        is_active: true
      },
      statusMessage: '',
      statusTimeout: null,
      unsubscribeFn: null
    };
  },
  computed: {
    filteredFoodStands() {
      const query = this.searchQuery.trim().toLowerCase();
      const ordered = [...this.foodStands].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!query) {
        return ordered;
      }
      return ordered.filter(stand => {
        const haystack = `${stand.name} ${stand.location} ${stand.category}`.toLowerCase();
        return haystack.includes(query);
      });
    }
  },
  created() {
    // subscribeToEntity automatically loads initial data, so we don't need to call refreshFoodStands separately
    this.unsubscribeFn = subscribeToEntity('foodStands', async (data) => {
      this.foodStands = data;
      // Set initial selection if none is selected and we have data
      if (!this.selectedStand && this.foodStands.length) {
        this.selectedStand = this.foodStands[0];
      } else {
        this.syncSelection();
      }
    });
  },
  beforeUnmount() {
    if (this.unsubscribeFn) {
      this.unsubscribeFn();
    }
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
  },
  methods: {
    formatDate,
    async refreshFoodStands() {
      try {
        this.foodStands = await listEntities('foodStands');
        if (!this.selectedStand && this.foodStands.length) {
          this.selectedStand = this.foodStands[0];
        } else {
          this.syncSelection();
        }
      } catch (error) {
        console.error('Failed to load food stands', error);
        this.foodStands = [];
      }
    },
    syncSelection() {
      if (!this.selectedStand) {
        return;
      }
      this.selectedStand =
        this.foodStands.find(stand => stand.stand_id === this.selectedStand.stand_id) || null;
    },
    openCreateForm() {
      this.formMode = 'create';
      this.formData = {
        name: '',
        location: '',
        category: '',
        owner_id: 1,
        opening_hours: '',
        is_active: true
      };
      this.showForm = true;
    },
    selectStand(row) {
      this.selectedStand =
        this.foodStands.find(stand => stand.stand_id === row.stand_id) || row;
      this.showForm = false;
    },
    startEdit(stand) {
      this.formMode = 'edit';
      this.formData = {
        name: stand.name,
        location: stand.location,
        category: stand.category,
        owner_id: stand.owner_id,
        opening_hours: stand.opening_hours,
        is_active: stand.is_active
      };
      this.selectedStand = stand;
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.formMode = 'create';
      this.formData = {
        name: '',
        location: '',
        category: '',
        owner_id: 1,
        opening_hours: '',
        is_active: true
      };
    },
    validateForm() {
      const fields = ['name', 'location', 'category', 'opening_hours'];
      const missing = fields.some(field => !this.formData[field]?.trim());
      if (missing || !this.formData.owner_id) {
        this.setStatusMessage('Please fill in all required fields.');
        return false;
      }
      return true;
    },
    buildPayload() {
      return {
        name: this.formData.name.trim(),
        location: this.formData.location.trim(),
        category: this.formData.category.trim(),
        owner_id: Number(this.formData.owner_id),
        opening_hours: this.formData.opening_hours.trim(),
        is_active: Boolean(this.formData.is_active)
      };
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      const payload = this.buildPayload();
      try {
        if (this.formMode === 'create') {
          const created = await createEntity('foodStands', payload);
          this.selectedStand = created;
          this.setStatusMessage(`"${created.name}" created successfully.`);
        } else if (this.selectedStand) {
          const updated = await updateEntity('foodStands', this.selectedStand.stand_id, payload);
          this.selectedStand = updated;
          this.setStatusMessage(`"${updated.name}" updated successfully.`);
        }
        this.showForm = false;
        await this.refreshFoodStands();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Something went wrong. Please try again.');
      }
    },
    async confirmDelete(stand) {
      const confirmed = window.confirm(
        `Delete "${stand.name}"? This will also affect its menu items and reviews later.`
      );
      if (!confirmed) {
        return;
      }
      try {
        await deleteEntity('foodStands', stand.stand_id);
        await this.removeLinkedRecords(stand.stand_id);
        if (this.selectedStand && this.selectedStand.stand_id === stand.stand_id) {
          this.selectedStand = null;
        }
        this.setStatusMessage(`"${stand.name}" deleted.`);
        await this.refreshFoodStands();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Failed to delete the stand.');
      }
    },
    async removeLinkedRecords(standId) {
      try {
        const menuItems = (await listEntities('menuItems')).filter(item => item.stand_id === standId);
        for (const item of menuItems) {
          await deleteEntity('menuItems', item.item_id);
        }
        const reviews = (await listEntities('reviews')).filter(review => review.stand_id === standId);
        for (const review of reviews) {
          await deleteEntity('reviews', review.review_id);
        }
      } catch (error) {
        console.error('Error removing linked records', error);
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
.form-grid textarea {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: 'Inter', sans-serif;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
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

