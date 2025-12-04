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
              :is-active="Boolean(value)"
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
              <select v-model="formData.category" required>
                <option disabled value="">Select a category</option>
                <option value="tacos">Tacos</option>
                <option value="noodles">Noodles</option>
                <option value="falafel">Falafel</option>
                <option value="burgers">Burgers</option>
                <option value="curry">Curry</option>
                <option value="crepe">Crêpe</option>
                <option value="kebab">Kebab</option>
                <option value="gyro">Gyro</option>
                <option value="bao">Bao</option>
                <option value="sushi">Sushi</option>
                <option value="vegan">Vegan</option>
                <option value="mexican">Mexican</option>
                <option value="dessert">Dessert</option>
                <option value="soup">Soup</option>
                <option value="arepa">Arepa</option>
              </select>
            </label>
            <label class="full-width" v-if="formData.category">
              <span>Preview Image</span>
              <img
                :src="getCategoryImage(formData.category)"
                :alt="formData.category"
                class="category-preview-image"
              />
              <p class="image-info">Image automatically selected based on category</p>
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
              Opening Days
              <div class="opening-hours-selector">
                <select v-model="formData.openingDaysStart" required>
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                  <option value="Sat">Saturday</option>
                  <option value="Sun">Sunday</option>
                  <option value="Daily">Daily</option>
                </select>
                <span v-if="formData.openingDaysStart !== 'Daily'">to</span>
                <select v-if="formData.openingDaysStart !== 'Daily'" v-model="formData.openingDaysEnd">
                  <option
                    v-for="day in availableEndDays"
                    :key="day.value"
                    :value="day.value"
                  >
                    {{ day.label }}
                  </option>
                </select>
              </div>
            </label>
            <label>
              Opening Time
              <input
                v-model="formData.openingTime"
                type="time"
                required
              />
            </label>
            <label>
              Closing Time
              <input
                v-model="formData.closingTime"
                type="time"
                :min="minClosingTime"
                required
              />
            </label>
            <label v-if="formMode === 'edit'" class="checkbox-field full-width">
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
              :is-active="Boolean(selectedStand.is_active)"
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
        openingDaysStart: 'Mon',
        openingDaysEnd: 'Sun',
        openingTime: '10:00',
        closingTime: '22:00',
        is_active: true
      },
      categoryImages: {
        tacos: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
        noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
        falafel: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
        burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        curry: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
        crepe: 'https://images.unsplash.com/photo-1519676867240-f03562e64548',
        kebab: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
        gyro: 'https://images.unsplash.com/photo-1621998604581-ebe3cb0a4de8',
        bao: 'https://images.unsplash.com/photo-1563865436874-9aef32095fad',
        sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
        vegan: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        mexican: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828',
        dessert: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32',
        soup: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1',
        arepa: 'https://images.unsplash.com/photo-1620571192144-b79c09229774'
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
    },
    dayOrder() {
      return {
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
        Sun: 7
      };
    },
    availableEndDays() {
      if (this.formData.openingDaysStart === 'Daily') {
        return [];
      }
      const days = [
        { value: 'Mon', label: 'Monday' },
        { value: 'Tue', label: 'Tuesday' },
        { value: 'Wed', label: 'Wednesday' },
        { value: 'Thu', label: 'Thursday' },
        { value: 'Fri', label: 'Friday' },
        { value: 'Sat', label: 'Saturday' },
        { value: 'Sun', label: 'Sunday' }
      ];
      const startOrder = this.dayOrder[this.formData.openingDaysStart] || 0;
      return days.filter(day => this.dayOrder[day.value] >= startOrder);
    },
    minClosingTime() {
      // Retourne l'heure minimale pour la fermeture (1 minute après l'ouverture)
      if (!this.formData.openingTime) {
        return '00:01';
      }
      const [hours, minutes] = this.formData.openingTime.split(':').map(Number);
      const nextMinute = (minutes + 1) % 60;
      const nextHour = nextMinute === 0 ? (hours + 1) % 24 : hours;
      return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
    }
  },
  watch: {
    'formData.openingDaysStart'(newVal) {
      // Si le jour de début change et que le jour de fin est maintenant invalide, le corriger
      if (newVal !== 'Daily' && this.formData.openingDaysEnd) {
        const startOrder = this.dayOrder[newVal] || 0;
        const endOrder = this.dayOrder[this.formData.openingDaysEnd] || 0;
        if (endOrder < startOrder) {
          // Le jour de fin est avant le jour de début, le mettre au même jour
          this.formData.openingDaysEnd = newVal;
        }
      }
    },
    'formData.openingTime'(newVal) {
      // Si l'heure d'ouverture change et que l'heure de fermeture est maintenant invalide, la corriger
      if (newVal && this.formData.closingTime) {
        if (this.formData.closingTime <= newVal) {
          // L'heure de fermeture est avant ou égale à l'heure d'ouverture
          // Ajouter 1 heure à l'heure d'ouverture
          const [hours, minutes] = newVal.split(':').map(Number);
          const nextHour = (hours + 1) % 24;
          this.formData.closingTime = `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
      }
    },
    'formData.closingTime'(newVal) {
      // Si l'heure de fermeture est sélectionnée et qu'elle est invalide, la corriger
      if (newVal && this.formData.openingTime) {
        if (newVal <= this.formData.openingTime) {
          // L'heure de fermeture est avant ou égale à l'heure d'ouverture
          // Utiliser l'heure minimale
          this.formData.closingTime = this.minClosingTime;
        }
      }
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
    getCategoryImage(category) {
      return this.categoryImages[category] || '';
    },
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
        openingDaysStart: 'Mon',
        openingDaysEnd: 'Sun',
        openingTime: '10:00',
        closingTime: '22:00',
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
      const parsed = this.parseOpeningHours(stand.opening_hours);
      this.formData = {
        name: stand.name,
        location: stand.location,
        category: stand.category,
        owner_id: stand.owner_id,
        opening_hours: stand.opening_hours,
        openingDaysStart: parsed.daysStart,
        openingDaysEnd: parsed.daysEnd,
        openingTime: parsed.openingTime,
        closingTime: parsed.closingTime,
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
        openingDaysStart: 'Mon',
        openingDaysEnd: 'Sun',
        openingTime: '10:00',
        closingTime: '22:00',
        is_active: true
      };
    },
    validateForm() {
      const fields = ['name', 'location', 'category'];
      const missing = fields.some(field => !this.formData[field]?.trim());
      if (missing || !this.formData.owner_id || !this.formData.openingTime || !this.formData.closingTime) {
        this.setStatusMessage('Please fill in all required fields.');
        return false;
      }
      if (this.formData.openingDaysStart !== 'Daily' && !this.formData.openingDaysEnd) {
        this.setStatusMessage('Please select an end day.');
        return false;
      }
      // Vérifier que le jour de fin n'est pas avant le jour de début
      if (this.formData.openingDaysStart !== 'Daily' && this.formData.openingDaysEnd) {
        const startOrder = this.dayOrder[this.formData.openingDaysStart] || 0;
        const endOrder = this.dayOrder[this.formData.openingDaysEnd] || 0;
        if (endOrder < startOrder) {
          this.setStatusMessage('The end day cannot be before the start day.');
          return false;
        }
      }
      // Vérifier que l'heure de fermeture n'est pas avant l'heure d'ouverture
      if (this.formData.openingTime && this.formData.closingTime) {
        if (this.formData.closingTime <= this.formData.openingTime) {
          this.setStatusMessage('The closing time must be after the opening time.');
          return false;
        }
      }
      return true;
    },
    formatOpeningHours() {
      let daysPart = '';
      if (this.formData.openingDaysStart === 'Daily') {
        daysPart = 'Daily';
      } else {
        daysPart = `${this.formData.openingDaysStart}-${this.formData.openingDaysEnd}`;
      }
      return `${daysPart} ${this.formData.openingTime}-${this.formData.closingTime}`;
    },
    parseOpeningHours(openingHours) {
      // Default values
      let daysStart = 'Mon';
      let daysEnd = 'Sun';
      let openingTime = '10:00';
      let closingTime = '22:00';

      if (!openingHours) {
        return { daysStart, daysEnd, openingTime, closingTime };
      }

      // Parse formats like "Mon-Sun 11:00-22:00", "Daily 12:00-23:00", "Mon-Sun: 10:00-22:00", etc.
      const trimmed = openingHours.trim();
      
      // Extract time pattern (HH:MM-HH:MM)
      const timeMatch = trimmed.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      if (timeMatch) {
        openingTime = timeMatch[1].padStart(5, '0'); // Ensure HH:MM format
        closingTime = timeMatch[2].padStart(5, '0');
      }
      
      // Extract days part (everything before the time)
      const daysPart = trimmed.substring(0, timeMatch ? timeMatch.index : trimmed.length).trim();
      
      // Remove colon if present (e.g., "Mon-Sun:" -> "Mon-Sun")
      const cleanDaysPart = daysPart.replace(/:\s*$/, '');
      
      // Parse days
      if (cleanDaysPart.toLowerCase() === 'daily') {
        daysStart = 'Daily';
        daysEnd = 'Sun';
      } else if (cleanDaysPart.includes('-')) {
        const [start, end] = cleanDaysPart.split('-').map(s => s.trim());
        // Capitalize first letter, lowercase rest
        daysStart = start.charAt(0).toUpperCase() + start.slice(1).toLowerCase();
        daysEnd = end.charAt(0).toUpperCase() + end.slice(1).toLowerCase();
      } else if (cleanDaysPart) {
        // Single day or special text like "Matchdays", "Evenings"
        const lower = cleanDaysPart.toLowerCase();
        if (lower === 'matchdays' || lower === 'evenings') {
          // For special cases, default to Mon-Sun
          daysStart = 'Mon';
          daysEnd = 'Sun';
        } else {
          daysStart = cleanDaysPart.charAt(0).toUpperCase() + cleanDaysPart.slice(1).toLowerCase();
          daysEnd = daysStart;
        }
      }

      return { daysStart, daysEnd, openingTime, closingTime };
    },
    buildPayload() {
      return {
        name: this.formData.name.trim(),
        location: this.formData.location.trim(),
        category: this.formData.category.trim(),
        owner_id: Number(this.formData.owner_id),
        opening_hours: this.formatOpeningHours(),
        is_active: this.formMode === 'create' ? true : Boolean(this.formData.is_active)
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
.form-grid textarea,
.form-grid select {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: 'Inter', sans-serif;
}

.opening-hours-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.opening-hours-selector select {
  flex: 1;
  margin-top: 0;
}

.opening-hours-selector span {
  color: #666;
  font-size: 0.9em;
}

.category-preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 6px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
}

.image-info {
  font-size: 0.85em;
  color: #666;
  margin-top: 4px;
  font-style: italic;
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

