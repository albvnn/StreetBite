const STORAGE_KEY = 'streetbite_current_user';
const ADMIN_CODE = '1234';

function getStorage() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
}

// Fonction pour l'inscription
export async function register(userData) {
  try {
    const response = await fetch(`${process.env.VUE_APP_API_URL || 'http://localhost:3000/api'}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Registration failed' };
    }

    const storage = getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return { success: true, user: data };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to register. Please try again.' };
  }
}

// Fonction pour la connexion avec mot de passe
export async function loginWithPassword(email, password) {
  try {
    const response = await fetch(`${process.env.VUE_APP_API_URL || 'http://localhost:3000/api'}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'Invalid email or password' };
    }

    const storage = getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return { success: true, user: data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login. Please try again.' };
  }
}

// Ancienne fonction de login (conservée pour compatibilité mais dépréciée)
export async function loginByEmail(email) {
  return loginWithPassword(email, '');
}

export function logout() {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(STORAGE_KEY);
  }
}

export function getCurrentUser() {
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  const stored = storage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Failed to parse current user', error);
    return null;
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function isOwner() {
  const user = getCurrentUser();
  return user && user.role === 'owner';
}

export function isCustomer() {
  const user = getCurrentUser();
  return user && user.role === 'customer';
}

export function canManageStand() {
  const user = getCurrentUser();
  if (!user || user.role !== 'owner') {
    return false;
  }
  return true;
}

export function verifyAdminCode(code) {
  return code === ADMIN_CODE;
}

export function getAdminCode() {
  return ADMIN_CODE;
}

const authSubscribers = new Set();

export function subscribeToAuth(callback) {
  authSubscribers.add(callback);
  return () => {
    authSubscribers.delete(callback);
  };
}

function notifyAuthChange() {
  const user = getCurrentUser();
  authSubscribers.forEach(callback => {
    try {
      callback(user);
    } catch (error) {
      console.error('Auth subscriber error', error);
    }
  });
}

export async function login(email, password) {
  const result = await loginWithPassword(email, password);
  if (result.success) {
    notifyAuthChange();
  }
  return result;
}

export async function registerAndNotify(userData) {
  const result = await register(userData);
  if (result.success) {
    notifyAuthChange();
  }
  return result;
}

export function logoutAndNotify() {
  logout();
  notifyAuthChange();
}
