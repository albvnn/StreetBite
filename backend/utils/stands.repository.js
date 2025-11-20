import { query } from './db.include.js';

export const getAllStands = () =>
  query(
    `SELECT stand_id, name, location, category, owner_name, phone, opening_hours, is_active
     FROM FoodStands
     ORDER BY name`
  );

export const getStandById = (standId) =>
  query(
    `SELECT stand_id, name, location, category, owner_name, phone, opening_hours, is_active
     FROM FoodStands
     WHERE stand_id = ?`,
    [standId]
  ).then((rows) => rows[0] || null);

export const createStand = ({ name, location, category, ownerName, phone, openingHours }) =>
  query(
    `INSERT INTO FoodStands (name, location, category, owner_name, phone, opening_hours)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, location, category, ownerName, phone, openingHours]
  );

export const getReviewsForStand = (standId) =>
  query(
    `SELECT review_id, stand_id, reviewer_name, rating, title, comment, likes, reviewed_at
     FROM StandReviews
     WHERE stand_id = ?
     ORDER BY reviewed_at DESC`,
    [standId]
  );

export const createReviewForStand = (standId, { reviewerName, rating, title, comment }) =>
  query(
    `INSERT INTO StandReviews (stand_id, reviewer_name, rating, title, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [standId, reviewerName, rating, title, comment]
  );

