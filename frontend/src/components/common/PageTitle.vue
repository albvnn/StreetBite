<template>
  <h2 class="page-title">{{ title }}</h2>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.page-title {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style>

