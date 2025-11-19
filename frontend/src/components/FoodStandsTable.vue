<template>
  <DataTable
    :data="foodStands"
    :columns="columns"
    title="Food Stands"
    row-key="stand_id"
  >
    <template #cell-name="{ value }">
      <strong>{{ value }}</strong>
    </template>
    <template #cell-category="{ value }">
      <CategoryBadge :category="value" />
    </template>
    <template #cell-is_active="{ value }">
      <StatusBadge :is-active="value" active-text="Active" inactive-text="Inactive" />
    </template>
  </DataTable>
</template>

<script>
import foodStandsData from '../data/foodStands.json';
import { formatDate } from '../utils/formatters';
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
      foodStands: foodStandsData,
      columns: [
        { key: 'stand_id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'category', label: 'Category' },
        { key: 'owner_id', label: 'Owner ID' },
        { key: 'opening_hours', label: 'Opening Hours' },
        { key: 'is_active', label: 'Status' },
        { key: 'created_at', label: 'Created At', formatter: formatDate }
      ]
    };
  }
};
</script>

