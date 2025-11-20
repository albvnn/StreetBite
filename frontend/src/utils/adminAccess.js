const ADMIN_STORAGE_KEY = 'streetbite_admin_access';

export function hasAdminAccess() {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return false;
  }
  return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}

export function grantAdminAccess() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  }
}

export function revokeAdminAccess() {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

