const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cart, Product, User } = require('../database/models/associations');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'price', 'discountPrice', 'images', 'stock', 'isActive', 'brand'],
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Filter out items with inactive products
    const validCartItems = cartItems.filter(item => item.product && item.product.isActive);
    
    // Remove invalid cart items from database
    const invalidItems = cartItems.filter(item => !item.product || !item.product.isActive);
    if (invalidItems.length > 0) {
      const invalidItemIds = invalidItems.map(item => item.id);
      await Cart.destroy({
        where: { id: invalidItemIds }
      });
    }

    // Calculate totals
    let totalItems = 0;
    let totalAmount = 0;
    let totalSavings = 0;

    validCartItems.forEach(item => {
      totalItems += item.quantity;
      const originalPrice = item.product.price;
      const effectivePrice = item.product.discountPrice || item.product.price;
      const itemTotal = effectivePrice * item.quantity;
      const savings = item.product.discountPrice ? (originalPrice - item.product.discountPrice) * item.quantity : 0;
      
      totalAmount += itemTotal;
      totalSavings += savings;
    });

    res.json({
      success: true,
      data: {
        items: validCartItems,
        summary: {
          totalItems,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          totalSavings: parseFloat(totalSavings.toFixed(2)),
          itemCount: validCartItems.length
        }
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', authenticateToken, [
  body('productId').isInt().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    // Check if product exists and is active
    const product = await Product.findOne({
      where: { id: productId, isActive: true },
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      // Check stock for updated quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stock - existingCartItem.quantity} more available.`
        });
      }

      // Update existing cart item
      await existingCartItem.update({
        quantity: newQuantity,
        price: product.discountPrice || product.price
      });

      // Fetch updated cart item with product details
      const updatedCartItem = await Cart.findByPk(existingCartItem.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'price', 'discountPrice', 'images', 'stock', 'brand'],
            include: [
              {
                model: User,
                as: 'seller',
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          }
        ]
      });

      return res.json({
        success: true,
        message: 'Cart updated successfully',
        data: updatedCartItem
      });
    }

    // Create new cart item
    const cartItem = await Cart.create({
      userId,
      productId,
      quantity,
      price: product.discountPrice || product.price
    });

    // Fetch cart item with product details
    const cartItemWithProduct = await Cart.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'price', 'discountPrice', 'images', 'stock', 'brand'],
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItemWithProduct
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/update/:id', authenticateToken, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

    const { id } = req.params;
    const { quantity } = req.body;

    // Find cart item with product details
    const cartItem = await Cart.findOne({
      where: { id, userId: req.user.userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'discountPrice', 'stock', 'isActive']
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (!cartItem.product || !cartItem.product.isActive) {
      // Remove inactive product from cart
      await cartItem.destroy();
      return res.status(404).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    // Check stock availability
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product.stock} items available in stock`
      });
    }

    // Update cart item
    await cartItem.update({
      quantity,
      price: cartItem.product.discountPrice || cartItem.product.price
    });

    // Fetch updated cart item with full product details
    const updatedCartItem = await Cart.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'price', 'discountPrice', 'images', 'stock', 'brand'],
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCartItem
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: { id, userId: req.user.userId }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const deletedCount = await Cart.destroy({
      where: { userId: req.user.userId }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        itemsRemoved: deletedCount
      }
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
});

// Get cart item count (for header badge)
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['isActive'],
          where: { isActive: true },
          required: true
        }
      ]
    });

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    res.json({
      success: true,
      data: {
        totalItems,
        itemCount: cartItems.length
      }
    });

  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart count',
      error: error.message
    });
  }
});

// Validate cart before checkout
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'discountPrice', 'stock', 'isActive']
        }
      ]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const validationErrors = [];
    const validItems = [];

    for (const item of cartItems) {
      if (!item.product || !item.product.isActive) {
        validationErrors.push({
          itemId: item.id,
          message: 'Product is no longer available'
        });
        // Remove inactive item from cart
        await item.destroy();
        continue;
      }

      if (item.product.stock < item.quantity) {
        validationErrors.push({
          itemId: item.id,
          productName: item.product.name,
          requestedQuantity: item.quantity,
          availableStock: item.product.stock,
          message: `Only ${item.product.stock} items available for ${item.product.name}`
        });
        continue;
      }

      validItems.push(item);
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart validation failed',
        errors: validationErrors,
        validItemsCount: validItems.length
      });
    }

    // Calculate totals for valid items
    let totalAmount = 0;
    validItems.forEach(item => {
      const effectivePrice = item.product.discountPrice || item.product.price;
      totalAmount += effectivePrice * item.quantity;
    });

    res.json({
      success: true,
      message: 'Cart validation successful',
      data: {
        validItemsCount: validItems.length,
        totalAmount: parseFloat(totalAmount.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Cart validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart',
      error: error.message
    });
  }
});

// Bulk update cart items
router.put('/bulk-update', authenticateToken, [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.id').isInt().withMessage('Item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

    const { items } = req.body;
    const updateResults = [];
    const updateErrors = [];

    for (const updateItem of items) {
      try {
        const cartItem = await Cart.findOne({
          where: { id: updateItem.id, userId: req.user.userId },
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'stock', 'price', 'discountPrice', 'isActive']
            }
          ]
        });

        if (!cartItem) {
          updateErrors.push({
            itemId: updateItem.id,
            message: 'Cart item not found'
          });
          continue;
        }

        if (!cartItem.product.isActive) {
          updateErrors.push({
            itemId: updateItem.id,
            message: 'Product is no longer available'
          });
          await cartItem.destroy();
          continue;
        }

        if (cartItem.product.stock < updateItem.quantity) {
          updateErrors.push({
            itemId: updateItem.id,
            message: `Only ${cartItem.product.stock} items available`
          });
          continue;
        }

        await cartItem.update({
          quantity: updateItem.quantity,
          price: cartItem.product.discountPrice || cartItem.product.price
        });

        updateResults.push({
          itemId: updateItem.id,
          success: true
        });

      } catch (error) {
        updateErrors.push({
          itemId: updateItem.id,
          message: error.message
        });
      }
    }

    const hasErrors = updateErrors.length > 0;
    
    res.status(hasErrors ? 207 : 200).json({
      success: !hasErrors,
      message: hasErrors ? 'Bulk update completed with some errors' : 'Bulk update successful',
      data: {
        successCount: updateResults.length,
        errorCount: updateErrors.length,
        results: updateResults,
        errors: updateErrors
      }
    });

  } catch (error) {
    console.error('Bulk update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart items',
      error: error.message
    });
  }
});

module.exports = router;