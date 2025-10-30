<template>
  <div class="table-container">
    <h2 class="page-title">Menu Items</h2>
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Stand ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Vegan</th>
            <th>Available</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in menuItems" :key="item.item_id">
            <td>{{ item.item_id }}</td>
            <td>{{ item.stand_id }}</td>
            <td><strong>{{ item.name }}</strong></td>
            <td>{{ item.description }}</td>
            <td class="price-cell">{{ formatPrice(item.price) }}</td>
            <td>
              <span :class="['vegan-badge', item.is_vegan ? 'vegan' : 'non-vegan']">
                {{ item.is_vegan ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', item.available ? 'available' : 'unavailable']">
                {{ item.available ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>{{ formatDate(item.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import menuItemsData from '../data/menuItems.json';

export default {
  name: 'MenuItemsTable',
  data() {
    return {
      menuItems: menuItemsData
    };
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatPrice(price) {
      return `€${price.toFixed(2)}`;
    }
  }
};
</script>

<style scoped>
.table-container {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

.data-table thead {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff9800 100%);
  color: white;
}

.data-table th {
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85em;
  letter-spacing: 0.5px;
}

.data-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background-color: #f5f5f5;
}

.data-table td {
  padding: 12px;
  color: #555;
}

.price-cell {
  font-weight: 600;
  color: #ff9800;
  font-size: 1.05em;
}

.vegan-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.vegan-badge.vegan {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.vegan-badge.non-vegan {
  background-color: #ffe0b2;
  color: #e65100;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.status-badge.available {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status-badge.unavailable {
  background-color: #ffcdd2;
  color: #c62828;
}
</style>

