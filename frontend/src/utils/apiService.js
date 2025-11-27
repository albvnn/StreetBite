// Service API pour communiquer avec le backend
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si la réponse n'est pas du JSON, utiliser le message par défaut
      }
      throw new Error(errorMessage);
    }

    // Pour les réponses 204 No Content, retourner null
    if (response.status === 204) {
      return null;
    }

    // Pour les autres réponses, parser le JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Stands API
export const standsApi = {
  getAll: () => apiRequest('/stands'),
  getById: (id) => apiRequest(`/stands/${id}`),
  create: (stand) => apiRequest('/stands', { method: 'POST', body: stand }),
  update: (id, stand) => apiRequest(`/stands/${id}`, { method: 'PUT', body: stand }),
  delete: (id) => apiRequest(`/stands/${id}`, { method: 'DELETE' })
};

// Menu Items API
export const menuItemsApi = {
  getAll: () => apiRequest('/menu-items'),
  getById: (id) => apiRequest(`/menu-items/${id}`),
  getByStandId: (standId) => apiRequest(`/stands/${standId}/menu-items`),
  create: (item) => apiRequest('/menu-items', { method: 'POST', body: item }),
  update: (id, item) => apiRequest(`/menu-items/${id}`, { method: 'PUT', body: item }),
  delete: (id) => apiRequest(`/menu-items/${id}`, { method: 'DELETE' })
};

// Reviews API
export const reviewsApi = {
  getAll: () => apiRequest('/reviews'),
  getById: (id) => apiRequest(`/reviews/${id}`),
  getByStandId: (standId) => apiRequest(`/stands/${standId}/reviews`),
  create: (review) => apiRequest('/reviews', { method: 'POST', body: review }),
  update: (id, review) => apiRequest(`/reviews/${id}`, { method: 'PUT', body: review }),
  delete: (id) => apiRequest(`/reviews/${id}`, { method: 'DELETE' })
};

// Users API
export const usersApi = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  getByEmail: (email) => apiRequest(`/users/email/${encodeURIComponent(email)}`)
};

// Service compatible avec l'ancienne interface fakeCrudService
const subscribers = {};

function notifySubscribers(entity, data) {
  if (subscribers[entity]) {
    subscribers[entity].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Subscriber for ${entity} threw an error`, error);
      }
    });
  }
}

// Mapping des entités vers les APIs
const entityApiMap = {
  foodStands: standsApi,
  menuItems: menuItemsApi,
  reviews: reviewsApi,
  users: usersApi
};

export function listEntities(entity) {
  const api = entityApiMap[entity];
  if (!api) {
    throw new Error(`Unknown entity "${entity}"`);
  }
  return api.getAll().then(data => {
    notifySubscribers(entity, data);
    return data;
  });
}

export function getEntityById(entity, id) {
  const api = entityApiMap[entity];
  if (!api) {
    throw new Error(`Unknown entity "${entity}"`);
  }
  return api.getById(id);
}

export function createEntity(entity, payload) {
  const api = entityApiMap[entity];
  if (!api) {
    throw new Error(`Unknown entity "${entity}"`);
  }
  return api.create(payload).then(result => {
    // Notifier les subscribers avec la nouvelle liste
    listEntities(entity).catch(err => {
      console.error(`Failed to reload ${entity} after create`, err);
    });
    return result;
  });
}

export function updateEntity(entity, id, updates) {
  const api = entityApiMap[entity];
  if (!api) {
    throw new Error(`Unknown entity "${entity}"`);
  }
  return api.update(id, updates).then(result => {
    // Notifier les subscribers avec la nouvelle liste
    listEntities(entity).catch(err => {
      console.error(`Failed to reload ${entity} after update`, err);
    });
    return result;
  });
}

export function deleteEntity(entity, id) {
  const api = entityApiMap[entity];
  if (!api) {
    throw new Error(`Unknown entity "${entity}"`);
  }
  return api.delete(id).then(result => {
    // Notifier les subscribers avec la nouvelle liste
    listEntities(entity).catch(err => {
      console.error(`Failed to reload ${entity} after delete`, err);
    });
    return result;
  });
}

export function subscribeToEntity(entity, callback) {
  if (!subscribers[entity]) {
    subscribers[entity] = new Set();
  }
  subscribers[entity].add(callback);

  // Charger les données initiales
  listEntities(entity).catch(err => {
    console.error(`Failed to load initial data for ${entity}`, err);
  });

  return () => {
    subscribers[entity].delete(callback);
  };
}

export function resetEntity(entity) {
  // Cette fonction n'est pas vraiment applicable avec une vraie API
  // On peut juste recharger les données
  return listEntities(entity);
}

export const ENTITY_KEYS = Object.keys(entityApiMap);

