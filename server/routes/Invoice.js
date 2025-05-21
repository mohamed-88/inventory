const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  const invoices = await Invoice.find().populate('customerId');
  res.json(invoices);
});

// Get invoices for a specific customer
router.get('/customer/:customerId', async (req, res) => {
  const invoices = await Invoice.find({ customerId: req.params.customerId });
  res.json(invoices);
});

// Get single invoice
router.get('/:id', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('customerId');
  res.json(invoice);
});

// Create invoice
router.post('/', async (req, res) => {
  const { customerId, items, paid = 0 } = req.body;
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const invoice = new Invoice({
    customerId,
    items: items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    })),
    total,
    paid
  });

  await invoice.save();
  res.status(201).json(invoice);
});

// Register payment to invoice
router.post('/:id/payments', async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  invoice.paid += parseFloat(req.body.amount);
  await invoice.save();
  res.json(invoice);
});

module.exports = router;
