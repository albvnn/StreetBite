<template>
  <DataTable
    :data="menuItems"
    :columns="columns"
    title="Menu Items"
    row-key="item_id"
  >
    <template #cell-name="{ value }">
      <strong>{{ value }}</strong>
    </template>
    <template #cell-price="{ value }">
      <span class="price-cell">{{ formatPrice(value) }}</span>
    </template>
    <template #cell-is_vegan="{ value }">
      <VeganBadge :is-vegan="value" />
    </template>
    <template #cell-available="{ value }">
      <StatusBadge :is-active="value" active-text="Yes" inactive-text="No" />
    </template>
  </DataTable>
</template>

<script>
import menuItemsData from '../data/menuItems.json';
import { formatDate, formatPrice } from '../utils/formatters';
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
      menuItems: menuItemsData,
      columns: [
        { key: 'item_id', label: 'ID' },
        { key: 'stand_id', label: 'Stand ID' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'is_vegan', label: 'Vegan' },
        { key: 'available', label: 'Available' },
        { key: 'created_at', label: 'Created At', formatter: formatDate }
      ]
    };
  },
  methods: {
    formatPrice
  }
};
</script>

<style scoped>
.price-cell {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  color: #ff9800;
  font-size: 1.05em;
}
</style>

