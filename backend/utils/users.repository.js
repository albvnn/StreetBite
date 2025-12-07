import { query } from './db.include.js';
import bcrypt from 'bcrypt';

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

// Fonction pour obtenir un utilisateur avec son mot de passe (pour l'authentification)
export const getUserByEmailWithPassword = (email) =>
  query(
    `SELECT user_id, name, email, password_hash, role, phone, city, created_at
     FROM Users
     WHERE email = ?`,
    [email]
  ).then((rows) => rows[0] || null);

// Fonction pour créer un nouvel utilisateur avec mot de passe crypté
export const createUser = async (userData) => {
  const { name, email, password, role = 'customer', phone, city } = userData;
  
  // Vérifier si l'email existe déjà
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Crypter le mot de passe avec bcrypt
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const result = await query(
    `INSERT INTO Users (name, email, password_hash, role, phone, city)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password_hash, role, phone || null, city || null]
  );

  // Retourner l'utilisateur créé sans le password_hash
  const newUser = await getUserById(result.insertId);
  return newUser;
};

// Fonction pour vérifier le mot de passe
export const verifyPassword = async (email, password) => {
  const user = await getUserByEmailWithPassword(email);
  if (!user) {
    return { valid: false, user: null };
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return { valid: false, user: null };
  }

  // Retourner l'utilisateur sans le password_hash
  const { password_hash, ...userWithoutPassword } = user;
  return { valid: true, user: userWithoutPassword };
};

