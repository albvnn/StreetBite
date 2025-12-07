<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isRegisterMode ? 'Register' : 'Login' }}</h2>
        <button class="close-btn" @click="close">×</button>
      </div>
      <form @submit.prevent="isRegisterMode ? handleRegister() : handleLogin()" class="login-form">
        <div class="form-group" v-if="isRegisterMode">
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
            :autofocus="!isRegisterMode"
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
            minlength="6"
          />
        </div>
        <div class="form-group" v-if="isRegisterMode">
          <label for="role">Role</label>
          <select id="role" v-model="role" required>
            <option value="customer">Customer</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div class="form-group" v-if="isRegisterMode">
          <label for="phone">Phone (optional)</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="+33 600000000"
          />
        </div>
        <div class="form-group" v-if="isRegisterMode">
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
            {{ loading ? (isRegisterMode ? 'Registering...' : 'Logging in...') : (isRegisterMode ? 'Register' : 'Login') }}
          </button>
        </div>
        <div class="toggle-mode">
          <p>
            {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
            <button type="button" class="link-btn" @click="toggleMode">
              {{ isRegisterMode ? 'Login' : 'Register' }}
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { login, registerAndNotify } from '../utils/authService';

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
      isRegisterMode: false,
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
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },
  methods: {
    resetForm() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.role = 'customer';
      this.phone = '';
      this.city = '';
      this.error = '';
      this.loading = false;
    },
    toggleMode() {
      this.isRegisterMode = !this.isRegisterMode;
      this.error = '';
    },
    async handleLogin() {
      this.error = '';
      this.loading = true;

      try {
        const result = await login(this.email, this.password);
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
          this.$emit('success', result.user);
          this.close();
        } else {
          this.error = result.error || 'Registration error';
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

.toggle-mode {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.toggle-mode p {
  margin: 0;
  color: #666;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.9em;
}

.link-btn {
  background: none;
  border: none;
  color: #ff9800;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  margin-left: 4px;
}

.link-btn:hover {
  color: #f57c00;
}
</style>

