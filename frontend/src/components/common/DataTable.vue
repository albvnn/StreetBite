<template>
  <div class="table-container">
    <PageTitle v-if="title" :title="title" />
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in data" :key="getRowKey(row, index)">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatCellValue(row[column.key], column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import PageTitle from './PageTitle.vue';

export default {
  name: 'DataTable',
  components: {
    PageTitle
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  methods: {
    getRowKey(row, index) {
      return row[this.rowKey] || index;
    },
    formatCellValue(value, column) {
      if (column.formatter && typeof column.formatter === 'function') {
        return column.formatter(value);
      }
      return value || 'N/A';
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
</style>

