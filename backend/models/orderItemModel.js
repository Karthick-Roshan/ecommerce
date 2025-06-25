
// models/orderItemModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Order = require('./orderModel');
const Product = require('./productModel');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'orders',
      key: 'order_id',
    },
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'product_id',
    },
  },
  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10, 2),
}, {
  tableName: 'order_items',
  timestamps: false,
});

OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
module.exports = OrderItem;
