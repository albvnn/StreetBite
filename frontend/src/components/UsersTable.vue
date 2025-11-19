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
import usersData from '../data/users.json';
import { formatDate } from '../utils/formatters';
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
      users: usersData,
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
  }
};
</script>

