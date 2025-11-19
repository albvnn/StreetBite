<template>
  <span :class="['role-badge', role.toLowerCase()]">
    {{ role }}
  </span>
</template>

<script>
export default {
  name: 'RoleBadge',
  props: {
    role: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: capitalize;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.role-badge.customer {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.owner {
  background-color: #fff3e0;
  color: #ff9800;
}
</style>

