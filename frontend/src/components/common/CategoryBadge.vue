<template>
  <span class="category-badge">{{ capitalizedCategory }}</span>
</template>

<script>
export default {
  name: 'CategoryBadge',
  props: {
    category: {
      type: String,
      required: true
    }
  },
  computed: {
    capitalizedCategory() {
      if (!this.category) return '';
      return this.category.charAt(0).toUpperCase() + this.category.slice(1).toLowerCase();
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

