// models/wishlistModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Product = require('./productModel');

const Wishlist = sequelize.define('Wishlist', {
  wishlist_id: {
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
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'wishlist',
  timestamps: false,
});

Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id' });
module.exports = Wishlist;
