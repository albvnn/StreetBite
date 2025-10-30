<template>
  <div class="table-container">
    <h2 class="page-title">Food Stands</h2>
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Category</th>
            <th>Owner ID</th>
            <th>Opening Hours</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stand in foodStands" :key="stand.stand_id">
            <td>{{ stand.stand_id }}</td>
            <td><strong>{{ stand.name }}</strong></td>
            <td>{{ stand.location }}</td>
            <td>
              <span class="category-badge">{{ stand.category }}</span>
            </td>
            <td>{{ stand.owner_id }}</td>
            <td>{{ stand.opening_hours }}</td>
            <td>
              <span :class="['status-badge', stand.is_active ? 'active' : 'inactive']">
                {{ stand.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ formatDate(stand.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import foodStandsData from '../data/foodStands.json';

export default {
  name: 'FoodStandsTable',
  data() {
    return {
      foodStands: foodStandsData
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
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
  background-color: #ff9800;
  color: white;
}

.data-table th {
  padding: 15px 12px;
  text-align: left;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.category-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.85em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #fff3e0;
  color: #ff9800;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
}

.status-badge.active {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #ffcdd2;
  color: #c62828;
}
</style>

