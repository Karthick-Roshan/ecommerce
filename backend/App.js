// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');

// Load env variables
dotenv.config();

// Init Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Register all Sequelize models (to ensure associations work)
require('./models/userModel');
require('./models/categoryModel');
require('./models/productModel');
require('./models/productImageModel');
require('./models/cartModel');
require('./models/wishlistModel');
require('./models/addressModel');
require('./models/orderModel');
require('./models/orderItemModel');
require('./models/paymentModel');

// ✅ Routes (only auth shown; add product/cart/order/etc. as you create them)
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🚀 E-commerce API is running');
});

// ✅ Sync Sequelize models and start server
sequelize.sync({ alter: true }) // ⚠️ Use alter in dev, not in prod
  .then(() => {
    console.log('✅ All models synced with the DB');
    connectDB(); // Optional: logs DB connection info
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error syncing Sequelize models:', err.message);
  });
