// database/models/Product.js (FIXED VERSION)
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../connection');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  slug: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  specifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'products',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      unique: true,
      fields: ['sku']
    },
    {
      fields: ['categoryId']
    },
    {
      fields: ['sellerId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['price']
    },
    {
      fields: ['averageRating']
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
Product.beforeValidate(async (product) => {
  if (!product.slug && product.name) {
    const baseSlug = generateSlug(product.name);
    
    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await Product.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    product.slug = slug;
  }
});

// Instance method to calculate discount percentage
Product.prototype.getDiscountPercentage = function() {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
};

// Instance method to get effective price
Product.prototype.getEffectivePrice = function() {
  return this.discountPrice || this.price;
};

module.exports = Product;