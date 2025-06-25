// models/addressModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');

const Address = sequelize.define('Address', {
  address_id: {
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
  address_line1: DataTypes.STRING,
  address_line2: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip_code: DataTypes.STRING,
  country: DataTypes.STRING,
  phone_number: DataTypes.STRING,
}, {
  tableName: 'Address',
  timestamps: false,
});

Address.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Address;
