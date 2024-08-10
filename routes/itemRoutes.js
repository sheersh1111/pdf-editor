const express = require('express');
const {
  addItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const router = express.Router();

router.post('/items', addItem);
router.get('/items', getItems);
router.get('/items/:id', getItemById);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);

module.exports = router;
