require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Dema li ser komputerê ye dê 5000 bikar bîne
const MONGO_URI = process.env.MONGO_URI;

const customerRoutes = require('./routes/Customer');
const itemRoutes = require('./routes/Item');
const invoiceRoutes = require('./routes/Invoice');

// CORS ji bo herduyan (localhost û Vercel)
const allowedOrigins = [
  'http://localhost:3000', // Ji bo testa li ser komputerê
  'https://ahmed-electric-receipts.vercel.app' // Lînka te ya Vercel
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Backend is running! ✅");
});

app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Ev ji bo Vercel e, divê li derveyî .then be
module.exports = app; 

// Ev tenê ji bo testa li ser komputerê ye
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening locally on port: ${PORT}`);
  });
}



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