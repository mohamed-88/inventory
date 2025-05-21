const express = require('express');
const router = express.Router(); // ✅ Needed to define router
const upload = require('../middleware/upload');
const Item = require('../models/Item');

// Create item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, quantity, unitPrice, customerId } = req.body;
    if (!name || !quantity || !unitPrice || !customerId) {
      return res.status(400).json({ error: 'Missing required fields (name, quantity, unitPrice, customerId)' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const item = new Item({
      name,
      description,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalPrice: Number(quantity) * Number(unitPrice), // ✅ ensure totalPrice is calculated
      imageUrl,
      customerId
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Failed to save item:', {
      body: req.body,
      file: req.file,
      error: err.message
    });
    res.status(500).json({ error: err.message });
  }
});

// Get items with pagination + search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // bigger default
    const search = req.query.search || '';

    const query = {
      name: { $regex: search, $options: 'i' }
    };

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate('customerId')
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;

    // Convert quantity and unitPrice to numbers
    data.quantity = Number(data.quantity);
    data.unitPrice = Number(data.unitPrice);
    data.totalPrice = data.quantity * data.unitPrice; // ✅ recalculate total

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update item:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
