<template>
  <div class="search-container">
    <div class="search-shell">
      <span class="search-icon" aria-hidden="true">🔎</span>
      <input
        v-model="searchValue"
        type="text"
        :placeholder="placeholder"
        class="search-bar"
        @input="handleInput"
      />
      <button type="button" class="search-cta">
        Explore
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Search...'
    }
  },
  emits: ['update:modelValue'],
  computed: {
    searchValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value);
    }
  }
};
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-shell {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  background: #ffffff;
  border-radius: 999px;
  padding: 12px 16px 12px 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(15, 23, 42, 0.06);
  width: 100%;
}

.search-icon {
  font-size: 1.2em;
  color: #ff9800;
}

.search-bar {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  outline: none;
  color: #1f2933;
}

.search-bar::placeholder {
  color: #94a3b8;
}

.search-cta {
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffb347, #ff6b6b);
  color: #fff;
  font-weight: 600;
  font-size: 0.95em;
  padding: 12px 24px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 25px rgba(255, 107, 107, 0.25);
  flex-shrink: 0;
}

.search-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 15px 30px rgba(255, 107, 107, 0.35);
}

.search-cta:active {
  transform: translateY(0);
}

@media (max-width: 540px) {
  .search-shell {
    padding: 16px;
  }

  .search-cta {
    width: 100%;
    text-align: center;
  }
}
</style>

