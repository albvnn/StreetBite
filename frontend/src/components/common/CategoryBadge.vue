<template>
  <span class="category-badge">{{ category }}</span>
</template>

<script>
export default {
  name: 'CategoryBadge',
  props: {
    category: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
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
</style>

