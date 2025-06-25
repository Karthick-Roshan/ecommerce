// models/orderModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Address = require('./addressModel');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Address',
      key: 'address_id',
    },
  },
  total_amount: DataTypes.DECIMAL(10, 2),
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  placed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'orders',
  timestamps: false,
});

Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Address, { foreignKey: 'address_id' });
module.exports = Order;
