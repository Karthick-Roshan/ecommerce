// database/models/Category.js (FIXED VERSION)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'categories',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['parentId']
    },
    {
      fields: ['isActive']
    }
  ]
});

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Hook to generate slug from name BEFORE validation
Category.beforeValidate(async (category) => {
  if (!category.slug && category.name) {
    const baseSlug = generateSlug(category.name);
    
    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await Category.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    category.slug = slug;
  }
});

// Also handle updates
Category.beforeUpdate(async (category) => {
  if (category.changed('name') && !category.changed('slug')) {
    const baseSlug = generateSlug(category.name);
    
    // Check if slug exists and make it unique (excluding current record)
    let slug = baseSlug;
    let counter = 1;
    
    while (await Category.findOne({ 
      where: { 
        slug,
        id: { [require('sequelize').Op.ne]: category.id }
      } 
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    category.slug = slug;
  }
});

module.exports = Category;