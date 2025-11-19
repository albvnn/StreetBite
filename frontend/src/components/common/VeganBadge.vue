<template>
  <span :class="['vegan-badge', isVegan ? 'vegan' : 'non-vegan']">
    {{ isVegan ? 'Yes' : 'No' }}
  </span>
</template>

<script>
export default {
  name: 'VeganBadge',
  props: {
    isVegan: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.vegan-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
}

.vegan-badge.vegan {
  background-color: #c8e6c9;
  color: #2e7d32;
}

.vegan-badge.non-vegan {
  background-color: #fff3e0;
  color: #ff9800;
}
</style>

