<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Welcome to StreetBite</h1>
        <p>Sign in to continue</p>
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
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="primary-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
        <div class="form-footer">
          <p>
            Don't have an account?
            <router-link to="/register" class="link">Register</router-link>
          </p>
        </div>
      </form>
      <div class="demo-accounts-section">
        <button type="button" class="demo-btn" @click="showDemoAccounts = !showDemoAccounts">
          {{ showDemoAccounts ? 'Hide' : 'Show' }} Demo Accounts
        </button>
        <div v-if="showDemoAccounts" class="demo-accounts">
          <h3>Demo Accounts</h3>
          <p class="demo-note">All passwords: <strong>password123</strong></p>
          <div class="accounts-list">
            <div v-for="account in demoAccounts" :key="account.email" class="account-item">
              <div class="account-info">
                <div class="account-row">
                  <span class="label">Email:</span>
                  <span class="value email" @click="fillCredentials(account.email, account.password)">{{ account.email }}</span>
                </div>
                <div class="account-row">
                  <span class="label">Password:</span>
                  <span class="value">{{ account.password }}</span>
                </div>
                <div class="account-row">
                  <span class="label">Role:</span>
                  <span class="value role-badge" :class="account.role">{{ account.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../utils/authService';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
      showDemoAccounts: false,
      demoAccounts: [
        { email: 'maya@example.com', password: 'password123', role: 'owner' },
        { email: 'kenji@example.com', password: 'password123', role: 'owner' },
        { email: 'sofia@example.com', password: 'password123', role: 'owner' },
        { email: 'omar@example.com', password: 'password123', role: 'owner' },
        { email: 'nina@example.com', password: 'password123', role: 'owner' },
        { email: 'ava@example.com', password: 'password123', role: 'customer' },
        { email: 'liam@example.com', password: 'password123', role: 'customer' },
        { email: 'zoe@example.com', password: 'password123', role: 'customer' },
        { email: 'hugo@example.com', password: 'password123', role: 'customer' },
        { email: 'lea@example.com', password: 'password123', role: 'customer' },
        { email: 'ibra@example.com', password: 'password123', role: 'customer' },
        { email: 'clara@example.com', password: 'password123', role: 'customer' },
        { email: 'pablo@example.com', password: 'password123', role: 'customer' },
        { email: 'yuki@example.com', password: 'password123', role: 'customer' },
        { email: 'ana@example.com', password: 'password123', role: 'customer' }
      ]
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;

      try {
        const result = await login(this.email, this.password);
        if (result.success) {
          // Rediriger vers la page d'origine ou la page d'accueil
          const redirectTo = this.$route.query.redirect || '/';
          this.$router.push(redirectTo);
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
    fillCredentials(email, password) {
      this.email = email;
      this.password = password;
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #fafafa;
}

.login-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.login-header p {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  color: #666;
  margin: 0;
}

.login-form {
  width: 100%;
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

.form-footer {
  margin-top: 24px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.form-footer p {
  margin: 0;
  color: #666;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.9em;
}

.form-footer .link {
  color: #ff9800;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.form-footer .link:hover {
  text-decoration: underline;
}

.demo-accounts-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.demo-btn {
  width: 100%;
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-btn:hover {
  background-color: #eeeeee;
  border-color: #ff9800;
  color: #ff9800;
}

.demo-accounts {
  margin-top: 20px;
}

.demo-accounts h3 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
}

.demo-note {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.9em;
  color: #666;
  margin: 0 0 16px 0;
  padding: 12px;
  background-color: #fff3e0;
  border-radius: 6px;
  border-left: 3px solid #ff9800;
}

.accounts-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
}

.account-item {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.account-item:last-child {
  margin-bottom: 0;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-row .label {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 600;
  color: #666;
  min-width: 70px;
  font-size: 0.85em;
}

.account-row .value {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  font-size: 0.9em;
}

.account-row .value.email {
  color: #ff9800;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.account-row .value.email:hover {
  color: #f57c00;
}

.account-row .value.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8em;
}

.account-row .value.role-badge.owner {
  background-color: #e1bee7;
  color: #7b1fa2;
}

.account-row .value.role-badge.customer {
  background-color: #b3e5fc;
  color: #0277bd;
}
</style>

