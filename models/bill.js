const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  items: [{
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
