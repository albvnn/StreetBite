import { query } from './db.include.js';

export const getAllMenuItems = () =>
  query(
    `SELECT item_id, stand_id, name, description, price, is_vegan, available, created_at
     FROM MenuItems
     ORDER BY name`
  );

export const getMenuItemById = (itemId) =>
  query(
    `SELECT item_id, stand_id, name, description, price, is_vegan, available, created_at
     FROM MenuItems
     WHERE item_id = ?`,
    [itemId]
  ).then((rows) => rows[0] || null);

export const getMenuItemsByStandId = (standId) =>
  query(
    `SELECT item_id, stand_id, name, description, price, is_vegan, available, created_at
     FROM MenuItems
     WHERE stand_id = ?
     ORDER BY name`,
    [standId]
  );

export const createMenuItem = ({ stand_id, name, description, price, is_vegan, available }) =>
  query(
    `INSERT INTO MenuItems (stand_id, name, description, price, is_vegan, available)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [stand_id, name, description || null, price, is_vegan !== undefined ? is_vegan : 0, available !== undefined ? available : 1]
  ).then((result) => ({ insertId: result.insertId }));

export const updateMenuItem = (itemId, { stand_id, name, description, price, is_vegan, available }) => {
  const updates = [];
  const values = [];
  
  if (stand_id !== undefined) {
    updates.push('stand_id = ?');
    values.push(stand_id);
  }
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  if (price !== undefined) {
    updates.push('price = ?');
    values.push(price);
  }
  if (is_vegan !== undefined) {
    updates.push('is_vegan = ?');
    values.push(is_vegan);
  }
  if (available !== undefined) {
    updates.push('available = ?');
    values.push(available);
  }
  
  if (updates.length === 0) {
    return Promise.resolve();
  }
  
  values.push(itemId);
  return query(
    `UPDATE MenuItems SET ${updates.join(', ')} WHERE item_id = ?`,
    values
  );
};

export const deleteMenuItem = (itemId) =>
  query(`DELETE FROM MenuItems WHERE item_id = ?`, [itemId]);

