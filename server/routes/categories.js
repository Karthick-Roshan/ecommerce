// routes/categories.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { Category, Product } = require('../database/models/associations');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false
        }
      ],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    // Filter to get only parent categories (those without parentId)
    const parentCategories = categories.filter(cat => !cat.parentId);

    res.json({
      success: true,
      data: parentCategories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get category by slug with products
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const category = await Category.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'children',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get products in this category
    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        categoryId: category.id,
        isActive: true
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
});

// Create category (Admin only)
router.post('/', authenticateToken, authorizeRoles(['admin']), [
  body('name').trim().isLength({ min: 2 }).withMessage('Category name is required'),
  body('description').optional().trim(),
  body('parentId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, parentId, sortOrder } = req.body;

    // Check if parent category exists
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }

    const category = await Category.create({
      name,
      description,
      parentId,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

module.exports = router;