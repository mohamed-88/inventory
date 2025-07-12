require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const customerRoutes = require('./routes/Customer');
const itemRoutes = require('./routes/Item');
const invoiceRoutes = require('./routes/Invoice');

app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

// Girêdana bi MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Destpêkirina serverê
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});

module.exports = app;




// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const app = express();


// // ✅ Routes
// const customerRoutes = require('./routes/Customer');
// const itemRoutes = require('./routes/Item');
// const invoiceRoutes = require('./routes/Invoice'); // ✅ NEW

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/inventoryDB')
//   .then(() => {
//     console.log('✅ Connected to MongoDB');
//     app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err.message);
//   });

// // ✅ API Routes
// app.use('/api/customers', customerRoutes);
// app.use('/api/items', itemRoutes);
// app.use('/api/invoices', invoiceRoutes); // ✅ Add invoice API

// app.get("/api/test", (req, res) => {
//   res.send("Backend is working fine ✅");
// });


// trigger deploy