const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const customer = new Customer({ name, email, phone, address });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

router.put('/:id', async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Customer deleted' });
});

router.post('/:id/payments', async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  const customer = await Customer.findById(req.params.id);
  customer.payments.push({ amount });
  await customer.save();

  res.json(customer);
});


module.exports = router;