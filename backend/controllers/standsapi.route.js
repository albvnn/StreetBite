import { Router } from 'express';

import {
  getAllStands,
  getStandById,
  createStand,
  updateStand,
  deleteStand,
  getReviewsForStand,
  createReviewForStand
} from '../utils/stands.repository.js';

const router = Router();

router.get('/stands', async (_req, res, next) => {
  try {
    const stands = await getAllStands();
    res.json(stands);
  } catch (error) {
    next(error);
  }
});

router.get('/stands/:standId', async (req, res, next) => {
  try {
    const stand = await getStandById(req.params.standId);
    if (!stand) {
      res.status(404).json({ message: 'Stand not found' });
      return;
    }
    res.json(stand);
  } catch (error) {
    next(error);
  }
});

router.post('/stands', async (req, res, next) => {
  try {
    const { name, location, category, owner_id, opening_hours, is_active } = req.body;
    if (!name || !owner_id) {
      res.status(400).json({ message: 'name and owner_id are required' });
      return;
    }
    const result = await createStand({ name, location, category, owner_id, opening_hours, is_active });
    const createdStand = await getStandById(result.insertId);
    res.status(201).json(createdStand);
  } catch (error) {
    next(error);
  }
});

router.put('/stands/:standId', async (req, res, next) => {
  try {
    const standId = req.params.standId;
    const existingStand = await getStandById(standId);
    if (!existingStand) {
      res.status(404).json({ message: 'Stand not found' });
      return;
    }
    await updateStand(standId, req.body);
    const updatedStand = await getStandById(standId);
    res.json(updatedStand);
  } catch (error) {
    next(error);
  }
});

router.delete('/stands/:standId', async (req, res, next) => {
  try {
    const standId = req.params.standId;
    const existingStand = await getStandById(standId);
    if (!existingStand) {
      res.status(404).json({ message: 'Stand not found' });
      return;
    }
    await deleteStand(standId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/stands/:standId/reviews', async (req, res, next) => {
  try {
    const reviews = await getReviewsForStand(req.params.standId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post('/stands/:standId/reviews', async (req, res, next) => {
  try {
    const { user_id, rating, title, comment } = req.body;
    if (!user_id || !rating) {
      res.status(400).json({ message: 'user_id and rating are required' });
      return;
    }
    const result = await createReviewForStand(req.params.standId, { user_id, rating, title, comment });
    res.status(201).json({ message: 'Review created', review_id: result.insertId });
  } catch (error) {
    next(error);
  }
});

export default router;
