const express = require('express');
const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} = require('../controllers/billController');
const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getBills);
router.get('/bills/:id', getBillById);
router.put('/bills/:id', updateBill);
router.delete('/bills/:id', deleteBill);

module.exports = router;
