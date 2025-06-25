// models/paymentModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Order = require('./orderModel');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id',
    },
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: false,
});

Payment.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Payment;
