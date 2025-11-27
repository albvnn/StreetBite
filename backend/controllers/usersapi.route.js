import { Router } from 'express';

import {
  getAllUsers,
  getUserById,
  getUserByEmail
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

export default router;

