<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Login</h2>
        <button class="close-btn" @click="close">×</button>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
            autofocus
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="primary-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
      <div class="demo-hint">
        <p><strong>Demo emails:</strong></p>
        <ul>
          <li>alice.johnson@email.com (customer)</li>
          <li>bob.smith@email.com (owner)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../utils/authService';

export default {
  name: 'LoginModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success'],
  data() {
    return {
      email: '',
      error: '',
      loading: false
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.email = '';
        this.error = '';
      }
    }
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;

      try {
        const result = login(this.email);
        if (result.success) {
          this.$emit('success', result.user);
          this.close();
        } else {
          this.error = result.error || 'Login error';
        }
      } catch (error) {
        this.error = 'An error occurred';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2em;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.login-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #ff9800;
}

.error-message {
  color: #c62828;
  font-size: 0.9em;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-actions {
  margin-top: 24px;
}

.primary-btn {
  width: 100%;
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover:not(:disabled) {
  background-color: #f57c00;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-hint {
  padding: 16px 24px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-hint p {
  margin: 0 0 8px 0;
  color: #666;
}

.demo-hint ul {
  margin: 0;
  padding-left: 20px;
  color: #555;
}

.demo-hint li {
  margin-bottom: 4px;
}
</style>

