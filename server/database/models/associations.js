// database/models/associations.js
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const { Cart, Address, Order, OrderItem } = require('./CartAndOrder');

// Self-referencing association for categories (parent-child relationship)
Category.belongsTo(Category, { 
  as: 'parent', 
  foreignKey: 'parentId',
  onDelete: 'SET NULL'
});

Category.hasMany(Category, { 
  as: 'children', 
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
});

// User associations
User.hasMany(Product, { foreignKey: 'sellerId', as: 'sellerProducts' });
User.hasMany(Cart, { foreignKey: 'userId', as: 'cartItems' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Category associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

// Product associations
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(Cart, { foreignKey: 'productId', as: 'cartItems' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Address associations
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Address.hasMany(Order, { foreignKey: 'addressId', as: 'orders' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.belongsTo(Address, { foreignKey: 'addressId', as: 'address' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  User,
  Category,
  Product,
  Cart,
  Address,
  Order,
  OrderItem
};