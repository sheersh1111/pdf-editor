const Bill = require('../models/bill');
const Item = require('../models/item');

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

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({});
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other bill-related operations like getBillById...

module.exports = { createBill, getBills };
