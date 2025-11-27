import { Router } from 'express';

import {
  getAllReviews,
  getReviewById,
  getReviewsByStandId,
  createReview,
  updateReview,
  deleteReview
} from '../utils/reviews.repository.js';

const router = Router();

router.get('/reviews', async (_req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.get('/reviews/:reviewId', async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.reviewId);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
});

router.get('/stands/:standId/reviews', async (req, res, next) => {
  try {
    const reviews = await getReviewsByStandId(req.params.standId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post('/reviews', async (req, res, next) => {
  try {
    const { stand_id, user_id, rating, title, comment } = req.body;
    if (!stand_id || !user_id || !rating) {
      res.status(400).json({ message: 'stand_id, user_id, and rating are required' });
      return;
    }
    const result = await createReview({ stand_id, user_id, rating, title, comment });
    const createdReview = await getReviewById(result.insertId);
    res.status(201).json(createdReview);
  } catch (error) {
    next(error);
  }
});

router.put('/reviews/:reviewId', async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const existingReview = await getReviewById(reviewId);
    if (!existingReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    await updateReview(reviewId, req.body);
    const updatedReview = await getReviewById(reviewId);
    res.json(updatedReview);
  } catch (error) {
    next(error);
  }
});

router.delete('/reviews/:reviewId', async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const existingReview = await getReviewById(reviewId);
    if (!existingReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    await deleteReview(reviewId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

