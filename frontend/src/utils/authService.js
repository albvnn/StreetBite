import usersData from '../data/users.json';

const STORAGE_KEY = 'streetbite_current_user';
const ADMIN_CODE = '1234';

function getStorage() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
}

function loadUsers() {
  const storage = getStorage();
  if (!storage) {
    return usersData;
  }
  const stored = storage.getItem('streetbite_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to parse users from storage', error);
    }
  }
  storage.setItem('streetbite_users', JSON.stringify(usersData));
  return usersData;
}

export function loginByEmail(email) {
  const users = loadUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  
  if (!user) {
    return { success: false, error: 'Email not found' };
  }

  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  return { success: true, user };
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

export function login(email) {
  const result = loginByEmail(email);
  if (result.success) {
    notifyAuthChange();
  }
  return result;
}

export function logoutAndNotify() {
  logout();
  notifyAuthChange();
}

