// models/productModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./categoryModel');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categories',
      key: 'category_id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

Product.belongsTo(Category, { foreignKey: 'category_id' });
module.exports = Product;