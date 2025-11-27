import { Router } from 'express';

import {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByStandId,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../utils/menuitems.repository.js';

const router = Router();

router.get('/menu-items', async (_req, res, next) => {
  try {
    const items = await getAllMenuItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/menu-items/:itemId', async (req, res, next) => {
  try {
    const item = await getMenuItemById(req.params.itemId);
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.get('/stands/:standId/menu-items', async (req, res, next) => {
  try {
    const items = await getMenuItemsByStandId(req.params.standId);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.post('/menu-items', async (req, res, next) => {
  try {
    const { stand_id, name, description, price, is_vegan, available } = req.body;
    if (!stand_id || !name || price === undefined) {
      res.status(400).json({ message: 'stand_id, name, and price are required' });
      return;
    }
    const result = await createMenuItem({ stand_id, name, description, price, is_vegan, available });
    const createdItem = await getMenuItemById(result.insertId);
    res.status(201).json(createdItem);
  } catch (error) {
    next(error);
  }
});

router.put('/menu-items/:itemId', async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const existingItem = await getMenuItemById(itemId);
    if (!existingItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    await updateMenuItem(itemId, req.body);
    const updatedItem = await getMenuItemById(itemId);
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

router.delete('/menu-items/:itemId', async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const existingItem = await getMenuItemById(itemId);
    if (!existingItem) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    await deleteMenuItem(itemId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

