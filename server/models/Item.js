const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: Number,
  imageUrl: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
});

itemSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('Item', itemSchema);