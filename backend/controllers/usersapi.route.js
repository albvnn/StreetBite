import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  verifyPassword
} from '../utils/users.repository.js';

const router = Router();

router.get('/users', async (_req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/users/email/:email', async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Route pour l'inscription
router.post('/users/register', async (req, res, next) => {
  try {
    const { name, email, password, role, phone, city } = req.body;

    // Validation des champs requis
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required' });
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    // Validation du mot de passe (minimum 6 caractères)
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    // Validation du rôle
    if (role && !['customer', 'owner'].includes(role)) {
      res.status(400).json({ message: 'Role must be either "customer" or "owner"' });
      return;
    }

    const user = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || 'customer',
      phone: phone?.trim() || null,
      city: city?.trim() || null
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Email already exists') {
      res.status(409).json({ message: error.message });
      return;
    }
    next(error);
  }
});

// Route pour la connexion
router.post('/users/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation des champs requis
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const result = await verifyPassword(email.trim().toLowerCase(), password);

    if (!result.valid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json(result.user);
  } catch (error) {
    next(error);
  }
});

export default router;

