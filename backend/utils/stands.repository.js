import { query } from './db.include.js';

export const getAllStands = () =>
  query(
    `SELECT stand_id, name, location, category, owner_id, opening_hours, is_active, created_at
     FROM FoodStands
     ORDER BY name`
  );

export const getStandById = (standId) =>
  query(
    `SELECT stand_id, name, location, category, owner_id, opening_hours, is_active, created_at
     FROM FoodStands
     WHERE stand_id = ?`,
    [standId]
  ).then((rows) => rows[0] || null);

export const createStand = ({ name, location, category, owner_id, opening_hours, is_active }) =>
  query(
    `INSERT INTO FoodStands (name, location, category, owner_id, opening_hours, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, location, category, owner_id, opening_hours !== undefined ? opening_hours : null, is_active !== undefined ? is_active : 1]
  ).then((result) => ({ insertId: result.insertId }));

export const updateStand = (standId, { name, location, category, owner_id, opening_hours, is_active }) => {
  const updates = [];
  const values = [];
  
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (location !== undefined) {
    updates.push('location = ?');
    values.push(location);
  }
  if (category !== undefined) {
    updates.push('category = ?');
    values.push(category);
  }
  if (owner_id !== undefined) {
    updates.push('owner_id = ?');
    values.push(owner_id);
  }
  if (opening_hours !== undefined) {
    updates.push('opening_hours = ?');
    values.push(opening_hours);
  }
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(is_active);
  }
  
  if (updates.length === 0) {
    return Promise.resolve();
  }
  
  values.push(standId);
  return query(
    `UPDATE FoodStands SET ${updates.join(', ')} WHERE stand_id = ?`,
    values
  );
};

export const deleteStand = (standId) =>
  query(`DELETE FROM FoodStands WHERE stand_id = ?`, [standId]);

export const getReviewsForStand = (standId) =>
  query(
    `SELECT review_id, stand_id, user_id, rating, title, comment, likes, reviewed_at, updated_at
     FROM Reviews
     WHERE stand_id = ?
     ORDER BY reviewed_at DESC`,
    [standId]
  );

export const createReviewForStand = (standId, { user_id, rating, title, comment }) =>
  query(
    `INSERT INTO Reviews (stand_id, user_id, rating, title, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [standId, user_id, rating, title || null, comment || null]
  ).then((result) => ({ insertId: result.insertId }));
