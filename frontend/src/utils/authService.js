import { usersApi } from './apiService';

const STORAGE_KEY = 'streetbite_current_user';
const ADMIN_CODE = '1234';

function getStorage() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
}

export async function loginByEmail(email) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await usersApi.getByEmail(normalizedEmail);
    
    if (!user) {
      return { success: false, error: 'Email not found' };
    }

    const storage = getStorage();
    if (storage) {
      // Ne pas stocker le password_hash
      const { password_hash, ...userWithoutPassword } = user;
      storage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    }

    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login. Please try again.' };
  }
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

export async function login(email) {
  const result = await loginByEmail(email);
  if (result.success) {
    notifyAuthChange();
  }
  return result;
}

export function logoutAndNotify() {
  logout();
  notifyAuthChange();
}
