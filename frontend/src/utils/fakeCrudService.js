import foodStandsData from '../data/foodStands.json';
import menuItemsData from '../data/menuItems.json';
import reviewsData from '../data/reviews.json';

const ENTITY_CONFIG = {
  foodStands: {
    storageKey: 'streetbite_food_stands',
    idKey: 'stand_id',
    source: foodStandsData,
    normalize: stand => ({
      ...stand,
      stand_id: Number(stand.stand_id),
      owner_id: Number(stand.owner_id),
      is_active: Boolean(stand.is_active)
    })
  },
  menuItems: {
    storageKey: 'streetbite_menu_items',
    idKey: 'item_id',
    source: menuItemsData,
    normalize: item => ({
      ...item,
      item_id: Number(item.item_id),
      stand_id: Number(item.stand_id),
      price: Number(item.price),
      is_vegan: Boolean(item.is_vegan),
      available: Boolean(item.available)
    })
  },
  reviews: {
    storageKey: 'streetbite_reviews',
    idKey: 'review_id',
    source: reviewsData,
    normalize: review => ({
      ...review,
      review_id: Number(review.review_id),
      stand_id: Number(review.stand_id),
      item_id: Number(review.item_id),
      user_id: Number(review.user_id),
      rating: Number(review.rating)
    })
  }
};

const collections = {};
const subscribers = {};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getStorage() {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
}

function getConfig(entity) {
  const config = ENTITY_CONFIG[entity];
  if (!config) {
    throw new Error(`Unknown entity "${entity}"`);
  }
  return config;
}

function normalizeCollection(entity, items) {
  const { normalize } = getConfig(entity);
  if (!normalize) {
    return items;
  }
  return items.map(item => normalize({ ...item }));
}

function ensureCollection(entity) {
  if (collections[entity]) {
    return collections[entity];
  }

  const { source, storageKey } = getConfig(entity);
  const storage = getStorage();
  let initialData = clone(source);

  if (storage) {
    const storedValue = storage.getItem(storageKey);
    if (storedValue) {
      try {
        initialData = JSON.parse(storedValue);
      } catch (error) {
        console.warn(`Failed to parse localStorage data for ${entity}. Falling back to defaults.`, error);
      }
    } else {
      storage.setItem(storageKey, JSON.stringify(initialData));
    }
  }

  collections[entity] = normalizeCollection(entity, initialData);
  return collections[entity];
}

function persistCollection(entity) {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const { storageKey } = getConfig(entity);
  storage.setItem(storageKey, JSON.stringify(collections[entity]));
}

function notifySubscribers(entity) {
  if (!subscribers[entity]) {
    return;
  }
  const snapshot = listEntities(entity);
  subscribers[entity].forEach(callback => {
    try {
      callback(snapshot);
    } catch (error) {
      console.error(`Subscriber for ${entity} threw an error`, error);
    }
  });
}

export function listEntities(entity) {
  return clone(ensureCollection(entity));
}

export function getEntityById(entity, id) {
  const collection = ensureCollection(entity);
  const { idKey } = getConfig(entity);
  const numericId = Number(id);
  const record = collection.find(item => item[idKey] === numericId);
  return record ? clone(record) : null;
}

export function createEntity(entity, payload) {
  const collection = ensureCollection(entity);
  const config = getConfig(entity);
  const nextId =
    collection.reduce((max, item) => Math.max(max, item[config.idKey]), 0) + 1;

  const rawItem = {
    ...payload,
    [config.idKey]: nextId,
    created_at: payload.created_at || new Date().toISOString()
  };

  const normalizedItem = config.normalize ? config.normalize(rawItem) : rawItem;
  collection.push(normalizedItem);
  persistCollection(entity);
  notifySubscribers(entity);
  return clone(normalizedItem);
}

export function updateEntity(entity, id, updates) {
  const collection = ensureCollection(entity);
  const config = getConfig(entity);
  const numericId = Number(id);
  const index = collection.findIndex(item => item[config.idKey] === numericId);

  if (index === -1) {
    throw new Error(`Cannot update ${entity} with id ${id} because it does not exist.`);
  }

  const rawItem = {
    ...collection[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  const normalizedItem = config.normalize ? config.normalize(rawItem) : rawItem;
  collection[index] = normalizedItem;
  persistCollection(entity);
  notifySubscribers(entity);
  return clone(normalizedItem);
}

export function deleteEntity(entity, id) {
  const collection = ensureCollection(entity);
  const { idKey } = getConfig(entity);
  const numericId = Number(id);
  const index = collection.findIndex(item => item[idKey] === numericId);

  if (index === -1) {
    throw new Error(`Cannot delete ${entity} with id ${id} because it does not exist.`);
  }

  const [removed] = collection.splice(index, 1);
  persistCollection(entity);
  notifySubscribers(entity);
  return clone(removed);
}

export function subscribeToEntity(entity, callback) {
  if (!subscribers[entity]) {
    subscribers[entity] = new Set();
  }
  subscribers[entity].add(callback);

  return () => {
    subscribers[entity].delete(callback);
  };
}

export function resetEntity(entity) {
  const config = getConfig(entity);
  collections[entity] = normalizeCollection(entity, clone(config.source));
  persistCollection(entity);
  notifySubscribers(entity);
}

export const ENTITY_KEYS = Object.keys(ENTITY_CONFIG);

