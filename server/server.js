require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Piştrast be ku ev importkirî ye

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Rêyên importkirinê
const customerRoutes = require('./routes/Customer.js');
const itemRoutes = require('./routes/Item.js');
const invoiceRoutes = require('./routes/Invoice.js');

// ===============================================
//          GUHERTINA HERÎ GIRÎNG
// ===============================================
// Ev rê dide her kesî ku daxwaziyan bişîne. Ev ê pirsgirêka CORS çareser bike.
app.use(cors());
// ===============================================

app.use(express.json());

// Rêyên API-yê
const apiRouter = express.Router();
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/items', itemRoutes);
apiRouter.use('/invoices', invoiceRoutes);

// Tenê carekê /api bikar bîne
app.use('/api', apiRouter);

// Rêya testê
app.get("/", (req, res) => {
  res.status(200).send("Backend is running! ✅");
});

// Piştrastkirina MONGO_URI
if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

// Girêdana bi MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Tenê dema li ser komputerê ye serverê bixebitîne
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 Server is listening locally on port: ${PORT}`);
      });
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Ji bo Render an platformên din ên serverless
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