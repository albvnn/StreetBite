<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>Create an Account</h1>
        <p>Join StreetBite today</p>
      </div>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Your name"
            required
            autofocus
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="At least 6 characters"
            required
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" v-model="role" required>
            <option value="customer">Customer</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div class="form-group">
          <label for="phone">Phone (optional)</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="+33 600000000"
          />
        </div>
        <div class="form-group">
          <label for="city">City (optional)</label>
          <input
            id="city"
            v-model="city"
            type="text"
            placeholder="Paris"
          />
        </div>
        <p v-if="error" class="error-message">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="primary-btn" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </div>
        <div class="form-footer">
          <p>
            Already have an account?
            <router-link to="/login" class="link">Login</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { registerAndNotify } from '../utils/authService';

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      role: 'customer',
      phone: '',
      city: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async handleRegister() {
      this.error = '';
      this.loading = true;

      try {
        const result = await registerAndNotify({
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
          phone: this.phone || null,
          city: this.city || null
        });

        if (result.success) {
          // Rediriger vers la page d'origine ou la page d'accueil
          const redirectTo = this.$route.query.redirect || '/';
          this.$router.push(redirectTo);
        } else {
          this.error = result.error || 'Registration error';
        }
      } catch (error) {
        this.error = 'An error occurred';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #fafafa;
}

.register-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.register-header p {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  color: #666;
  margin: 0;
}

.register-form {
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1em;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
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
</style>

