const express = require('express');
const { addItem, getItems } = require('../controllers/itemController');
const router = express.Router();

router.post('/items', addItem);
router.get('/items', getItems);

// Other item routes...

module.exports = router;
