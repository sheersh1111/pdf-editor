const Bill = require('../models/bill');
const Item = require('../models/item');
const mongoose = require('mongoose');

// Create a new bill and update inventory
const createBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items } = req.body;
    let totalAmount = 0;

    for (const soldItem of items) {
      const item = await Item.findOne({ itemId: soldItem.itemId }).session(session);
      if (!item || item.quantity < soldItem.quantity) {
        throw new Error('Item not available or insufficient quantity');
      }

      item.quantity -= soldItem.quantity;
      totalAmount += soldItem.quantity * item.price;
      await item.save({ session });
    }

    const bill = new Bill({ ...req.body, totalAmount });
    await bill.save({ session });

    await session.commitTransaction();
    res.status(201).json(bill);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Get all bills
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({});
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single bill by ID
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a bill by ID
const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bill by ID
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBill, getBills, getBillById, updateBill, deleteBill };
