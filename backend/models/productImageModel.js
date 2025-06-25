// models/productImageModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Product = require('./productModel');

const ProductImage = sequelize.define('ProductImage', {
  image_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'product_id',
    },
  },
  image_url: DataTypes.TEXT,
}, {
  tableName: 'product_images',
  timestamps: false,
});

ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
module.exports = ProductImage;