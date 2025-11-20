<template>
  <div class="admin-gate">
    <div class="gate-content">
      <h2>Admin Access</h2>
      <p class="subtitle">Enter the access code to access the administration menu</p>
      <form @submit.prevent="handleSubmit" class="gate-form">
        <input
          v-model="code"
          type="text"
          placeholder="Access code"
          required
          autofocus
          maxlength="10"
          class="code-input"
        />
        <p v-if="error" class="error-message">{{ error }}</p>
        <button type="submit" class="primary-btn">Access</button>
      </form>
      <p class="hint">Default code: 1234</p>
    </div>
  </div>
</template>

<script>
import { verifyAdminCode } from '../utils/authService';
import { grantAdminAccess } from '../utils/adminAccess';

export default {
  name: 'AdminGate',
  data() {
    return {
      code: '',
      error: ''
    };
  },
  methods: {
    handleSubmit() {
      this.error = '';
      if (verifyAdminCode(this.code.trim())) {
        grantAdminAccess();
        this.$router.push('/admin');
      } else {
        this.error = 'Incorrect code';
        this.code = '';
      }
    }
  }
};
</script>

<style scoped>
.admin-gate {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.gate-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.gate-content h2 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.subtitle {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #666;
  margin-bottom: 32px;
  font-size: 0.95em;
}

.gate-form {
  margin-bottom: 20px;
}

.code-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.2em;
  text-align: center;
  letter-spacing: 4px;
  font-weight: 600;
  transition: border-color 0.2s;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.code-input:focus {
  outline: none;
  border-color: #ff9800;
}

.error-message {
  color: #c62828;
  font-size: 0.9em;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.primary-btn {
  width: 100%;
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #f57c00;
}

.hint {
  font-size: 0.85em;
  color: #999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-top: 16px;
}
</style>

