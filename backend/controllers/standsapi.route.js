import { Router } from 'express';

import {
  getAllStands,
  getStandById,
  createStand,
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
    const { name, location, category, ownerName, phone, openingHours } = req.body;
    if (!name || !ownerName) {
      res.status(400).json({ message: 'name and ownerName are required' });
      return;
    }
    await createStand({ name, location, category, ownerName, phone, openingHours });
    res.status(201).json({ message: 'Stand created' });
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
    const { reviewerName, rating, title, comment } = req.body;
    if (!reviewerName || !rating) {
      res.status(400).json({ message: 'reviewerName and rating are required' });
      return;
    }
    await createReviewForStand(req.params.standId, { reviewerName, rating, title, comment });
    res.status(201).json({ message: 'Review created' });
  } catch (error) {
    next(error);
  }
});

export default router;

