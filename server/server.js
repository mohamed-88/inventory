// Load environment variables from .env file
require('dotenv').config(); 

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize the app
const app = express();

// Define the PORT and MONGO_URI from environment variables
const PORT = process.env.PORT; // No need for "|| 5000" because it's in your .env
const MONGO_URI = process.env.MONGO_URI;

// Import Routes ✅
const customerRoutes = require('./routes/Customer');
const itemRoutes = require('./routes/Item');
const invoiceRoutes = require('./routes/Invoice');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root/Test Route
app.get("/", (req, res) => {
  res.status(200).send("Inventory Backend is running and healthy! ✅");
});

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);

// FATAL ERROR Check: Ensure MONGO_URI is defined before trying to connect
if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in your .env file or environment variables.');
  process.exit(1);
}

// MongoDB Connection and Server Listening
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port: ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
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