<template>
  <div class="table-container">
    <h2 class="page-title">Users</h2>
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>City</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id">
            <td>{{ user.user_id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role]">
                {{ user.role }}
              </span>
            </td>
            <td>{{ user.phone || 'N/A' }}</td>
            <td>{{ user.city || 'N/A' }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import usersData from '../data/users.json';

export default {
  name: 'UsersTable',
  data() {
    return {
      users: usersData
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
  max-width: 1400px;
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

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.customer {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.owner {
  background-color: #fff3e0;
  color: #f57c00;
}
</style>

