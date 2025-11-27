<template>
  <div class="crud-page">
    <div class="crud-header">
      <div>
        <h2>Menu Items</h2>
        <p class="subtitle">Manage menu entries for every street food stand.</p>
      </div>
      <button class="primary-btn" @click="openCreateForm">
        + New Menu Item
      </button>
    </div>

    <div class="crud-body">
      <div class="list-panel">
        <div class="list-toolbar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items by name, stand or description..."
          />
        </div>

        <DataTable
          :data="filteredMenuItems"
          :columns="columns"
          :title="''"
          row-key="item_id"
        >
          <template #cell-name="{ value }">
            <strong>{{ value }}</strong>
          </template>
          <template #cell-price="{ value }">
            <span class="price-cell">{{ formatPrice(value) }}</span>
          </template>
          <template #cell-standName="{ value }">
            <span class="stand-pill">{{ value }}</span>
          </template>
          <template #cell-is_vegan="{ value }">
            <VeganBadge :is-vegan="value" />
          </template>
          <template #cell-available="{ value }">
            <StatusBadge :is-active="value" active-text="Yes" inactive-text="No" />
          </template>
          <template #cell-actions="{ row }">
            <div class="table-actions">
              <button class="link-btn" @click="selectItem(row)">Details</button>
              <button class="link-btn" @click="startEdit(row)">Edit</button>
              <button class="link-btn danger" @click="confirmDelete(row)">Delete</button>
            </div>
          </template>
        </DataTable>
      </div>

      <div class="side-panel">
        <div v-if="showForm" class="panel-card">
          <h3>{{ formMode === 'create' ? 'Create Menu Item' : 'Edit Menu Item' }}</h3>
          <form class="form-grid" @submit.prevent="submitForm">
            <label>
              Stand
              <select v-model.number="formData.stand_id" required>
                <option disabled value="">Select a stand</option>
                <option v-for="stand in foodStands" :key="stand.stand_id" :value="stand.stand_id">
                  {{ stand.name }}
                </option>
              </select>
            </label>
            <label>
              Name
              <input v-model="formData.name" type="text" required placeholder="Menu item name" />
            </label>
            <label class="full-width">
              Description
              <textarea
                v-model="formData.description"
                required
                rows="3"
                placeholder="What makes this dish special?"
              ></textarea>
            </label>
            <label>
              Price (€)
              <input
                v-model.number="formData.price"
                type="number"
                min="0"
                step="0.1"
                required
              />
            </label>
            <label class="checkbox-field">
              <input v-model="formData.is_vegan" type="checkbox" />
              <span>Vegan option</span>
            </label>
            <label class="checkbox-field">
              <input v-model="formData.available" type="checkbox" />
              <span>Currently available</span>
            </label>
            <div class="form-actions full-width">
              <button class="primary-btn" type="submit">
                {{ formMode === 'create' ? 'Create Item' : 'Save Changes' }}
              </button>
              <button class="secondary-btn" type="button" @click="cancelForm">Cancel</button>
            </div>
          </form>
        </div>

        <div v-else-if="selectedItem" class="panel-card">
          <div class="detail-header">
            <div>
              <h3>{{ selectedItem.name }}</h3>
              <p class="detail-location">{{ getStandName(selectedItem.stand_id) }}</p>
            </div>
            <StatusBadge
              :is-active="selectedItem.available"
              active-text="Available"
              inactive-text="Unavailable"
            />
          </div>
          <p class="item-description">{{ selectedItem.description }}</p>
          <div class="detail-grid">
            <div>
              <span class="label">Price</span>
              <p>{{ formatPrice(selectedItem.price) }}</p>
            </div>
            <div>
              <span class="label">Vegan</span>
              <p>{{ selectedItem.is_vegan ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <span class="label">Created</span>
              <p>{{ formatDate(selectedItem.created_at) }}</p>
            </div>
          </div>
          <div class="detail-actions">
            <button class="secondary-btn" @click="startEdit(selectedItem)">Edit</button>
            <button class="danger-btn" @click="confirmDelete(selectedItem)">Delete</button>
          </div>
        </div>

        <div v-else class="panel-card empty-state">
          <p>Select a menu item to see its details or create a new one.</p>
        </div>
      </div>
    </div>

    <p v-if="statusMessage" class="status-message">
      {{ statusMessage }}
    </p>
  </div>
</template>

<script>
import { formatDate, formatPrice } from '../utils/formatters';
import {
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  subscribeToEntity
} from '../utils/apiService';
import DataTable from './common/DataTable.vue';
import StatusBadge from './common/StatusBadge.vue';
import VeganBadge from './common/VeganBadge.vue';

export default {
  name: 'MenuItemsTable',
  components: {
    DataTable,
    StatusBadge,
    VeganBadge
  },
  data() {
    return {
      menuItems: [],
      foodStands: [],
      columns: [
        { key: 'item_id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'standName', label: 'Stand' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'is_vegan', label: 'Vegan' },
        { key: 'available', label: 'Available' },
        { key: 'created_at', label: 'Created At', formatter: formatDate },
        { key: 'actions', label: 'Actions' }
      ],
      searchQuery: '',
      selectedItem: null,
      showForm: false,
      formMode: 'create',
      formData: {
        stand_id: '',
        name: '',
        description: '',
        price: 0,
        is_vegan: false,
        available: true
      },
      statusMessage: '',
      statusTimeout: null,
      unsubscribeMenu: null,
      unsubscribeStands: null
    };
  },
  computed: {
    tableRows() {
      return this.menuItems.map(item => ({
        ...item,
        standName: this.getStandName(item.stand_id)
      }));
    },
    filteredMenuItems() {
      const query = this.searchQuery.trim().toLowerCase();
      const ordered = [...this.tableRows].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!query) {
        return ordered;
      }
      return ordered.filter(item => {
        const haystack = `${item.name} ${item.description} ${item.standName}`.toLowerCase();
        return haystack.includes(query);
      });
    }
  },
  async created() {
    await this.refreshMenuItems();
    await this.refreshFoodStands();
    this.unsubscribeMenu = subscribeToEntity('menuItems', async (data) => {
      this.menuItems = data;
      this.syncSelection();
    });
    this.unsubscribeStands = subscribeToEntity('foodStands', async (data) => {
      this.foodStands = data;
    });
  },
  beforeUnmount() {
    if (this.unsubscribeMenu) {
      this.unsubscribeMenu();
    }
    if (this.unsubscribeStands) {
      this.unsubscribeStands();
    }
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
  },
  methods: {
    formatDate,
    formatPrice,
    async refreshMenuItems() {
      try {
        this.menuItems = await listEntities('menuItems');
        if (!this.selectedItem && this.menuItems.length) {
          this.selectedItem = this.menuItems[0];
        } else {
          this.syncSelection();
        }
      } catch (error) {
        console.error('Failed to load menu items', error);
        this.menuItems = [];
      }
    },
    async refreshFoodStands() {
      try {
        this.foodStands = await listEntities('foodStands');
      } catch (error) {
        console.error('Failed to load food stands', error);
        this.foodStands = [];
      }
    },
    syncSelection() {
      if (!this.selectedItem) {
        return;
      }
      this.selectedItem =
        this.menuItems.find(item => item.item_id === this.selectedItem.item_id) || null;
    },
    getStandName(standId) {
      const stand = this.foodStands.find(entry => entry.stand_id === Number(standId));
      return stand ? stand.name : `Stand #${standId}`;
    },
    openCreateForm() {
      this.formMode = 'create';
      this.formData = {
        stand_id: this.foodStands[0]?.stand_id || '',
        name: '',
        description: '',
        price: 0,
        is_vegan: false,
        available: true
      };
      this.showForm = true;
    },
    selectItem(row) {
      this.selectedItem =
        this.menuItems.find(item => item.item_id === row.item_id) || row;
      this.showForm = false;
    },
    startEdit(item) {
      this.formMode = 'edit';
      this.formData = {
        stand_id: item.stand_id,
        name: item.name,
        description: item.description,
        price: item.price,
        is_vegan: item.is_vegan,
        available: item.available
      };
      this.selectedItem = item;
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.formMode = 'create';
    },
    validateForm() {
      const required = ['stand_id', 'name', 'description'];
      const missing = required.some(field => !this.formData[field]);
      if (missing) {
        this.setStatusMessage('Please fill in all fields.');
        return false;
      }
      if (this.formData.price < 0) {
        this.setStatusMessage('Price must be positive.');
        return false;
      }
      return true;
    },
    buildPayload() {
      return {
        stand_id: Number(this.formData.stand_id),
        name: this.formData.name.trim(),
        description: this.formData.description.trim(),
        price: Number(this.formData.price),
        is_vegan: Boolean(this.formData.is_vegan),
        available: Boolean(this.formData.available)
      };
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      const payload = this.buildPayload();
      try {
        if (this.formMode === 'create') {
          const created = await createEntity('menuItems', payload);
          this.selectedItem = created;
          this.setStatusMessage(`"${created.name}" created successfully.`);
        } else if (this.selectedItem) {
          const updated = await updateEntity('menuItems', this.selectedItem.item_id, payload);
          this.selectedItem = updated;
          this.setStatusMessage(`"${updated.name}" updated successfully.`);
        }
        this.showForm = false;
        await this.refreshMenuItems();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Something went wrong. Please try again.');
      }
    },
    async confirmDelete(item) {
      const confirmed = window.confirm(`Delete "${item.name}" permanently?`);
      if (!confirmed) {
        return;
      }
      try {
        await deleteEntity('menuItems', item.item_id);
        await this.removeLinkedReviews(item.item_id);
        if (this.selectedItem && this.selectedItem.item_id === item.item_id) {
          this.selectedItem = null;
        }
        this.setStatusMessage(`"${item.name}" deleted.`);
        await this.refreshMenuItems();
      } catch (error) {
        console.error(error);
        this.setStatusMessage('Failed to delete the menu item.');
      }
    },
    async removeLinkedReviews(itemId) {
      try {
        const reviews = (await listEntities('reviews')).filter(review => review.item_id === itemId);
        for (const review of reviews) {
          await deleteEntity('reviews', review.review_id);
        }
      } catch (error) {
        console.error('Error removing linked reviews', error);
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

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
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

.price-cell {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  color: #ff9800;
  font-size: 1.05em;
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

.item-description {
  color: #555;
  margin-bottom: 16px;
  line-height: 1.5;
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

