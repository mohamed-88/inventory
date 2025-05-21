const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    name: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    imageUrl: String
  }],
  total: Number,
  paid: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
