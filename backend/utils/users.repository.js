import { query } from './db.include.js';

export const getAllUsers = () =>
  query(
    `SELECT user_id, name, email, role, phone, city, created_at
     FROM Users
     ORDER BY name`
  );

export const getUserById = (userId) =>
  query(
    `SELECT user_id, name, email, role, phone, city, created_at
     FROM Users
     WHERE user_id = ?`,
    [userId]
  ).then((rows) => rows[0] || null);

export const getUserByEmail = (email) =>
  query(
    `SELECT user_id, name, email, role, phone, city, created_at
     FROM Users
     WHERE email = ?`,
    [email]
  ).then((rows) => rows[0] || null);

