const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  payments: [
    {
      amount: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Customer', customerSchema);
