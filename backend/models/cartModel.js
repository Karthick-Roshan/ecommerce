// models/cartModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Product = require('./productModel');

const CartItem = sequelize.define('CartItem', {
  cart_item_id: {
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
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'product_id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'cart_items',
  timestamps: false,
});

CartItem.belongsTo(User, { foreignKey: 'user_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });
module.exports = CartItem;