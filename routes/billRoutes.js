const express = require('express');
const { createBill, getBills } = require('../controllers/billController');
const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getBills);

// Other bill routes...

module.exports = router;
