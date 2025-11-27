import { query } from './db.include.js';

export const getAllReviews = () =>
  query(
    `SELECT review_id, stand_id, user_id, rating, title, comment, likes, reviewed_at, updated_at
     FROM Reviews
     ORDER BY reviewed_at DESC`
  );

export const getReviewById = (reviewId) =>
  query(
    `SELECT review_id, stand_id, user_id, rating, title, comment, likes, reviewed_at, updated_at
     FROM Reviews
     WHERE review_id = ?`,
    [reviewId]
  ).then((rows) => rows[0] || null);

export const getReviewsByStandId = (standId) =>
  query(
    `SELECT review_id, stand_id, user_id, rating, title, comment, likes, reviewed_at, updated_at
     FROM Reviews
     WHERE stand_id = ?
     ORDER BY reviewed_at DESC`,
    [standId]
  );

export const createReview = ({ stand_id, user_id, rating, title, comment }) =>
  query(
    `INSERT INTO Reviews (stand_id, user_id, rating, title, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [stand_id, user_id, rating, title || null, comment || null]
  ).then((result) => ({ insertId: result.insertId }));

export const updateReview = (reviewId, { rating, title, comment }) => {
  const updates = [];
  const values = [];
  
  if (rating !== undefined) {
    updates.push('rating = ?');
    values.push(rating);
  }
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (comment !== undefined) {
    updates.push('comment = ?');
    values.push(comment);
  }
  
  if (updates.length === 0) {
    return Promise.resolve();
  }
  
  updates.push('updated_at = NOW()');
  values.push(reviewId);
  return query(
    `UPDATE Reviews SET ${updates.join(', ')} WHERE review_id = ?`,
    values
  );
};

export const deleteReview = (reviewId) =>
  query(`DELETE FROM Reviews WHERE review_id = ?`, [reviewId]);

