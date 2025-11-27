<template>
  <DataTable
    :data="users"
    :columns="columns"
    title="Users"
    row-key="user_id"
  >
    <template #cell-role="{ value }">
      <RoleBadge :role="value" />
    </template>
  </DataTable>
</template>

<script>
import { formatDate } from '../utils/formatters';
import { listEntities } from '../utils/apiService';
import DataTable from './common/DataTable.vue';
import RoleBadge from './common/RoleBadge.vue';

export default {
  name: 'UsersTable',
  components: {
    DataTable,
    RoleBadge
  },
  data() {
    return {
      users: [],
      columns: [
        { key: 'user_id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City' },
        { key: 'created_at', label: 'Created At', formatter: formatDate }
      ]
    };
  },
  async created() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        this.users = await listEntities('users');
      } catch (error) {
        console.error('Failed to load users', error);
        this.users = [];
      }
    }
  }
};
</script>

