<template>
  <span :class="['status-badge', isActive ? 'active' : 'inactive']">
    {{ isActive ? activeText : inactiveText }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    isActive: {
      type: Boolean,
      default: true
    },
    activeText: {
      type: String,
      default: 'Open'
    },
    inactiveText: {
      type: String,
      default: 'Closed'
    }
  }
};
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

