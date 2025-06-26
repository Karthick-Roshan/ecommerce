import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, summary, isLoading } = useSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      const result = await dispatch(updateCartItem({ itemId, quantity: newQuantity }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Cart updated successfully');
        dispatch(getCart()); // Refresh cart
      }
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId, productName) => {
    if (window.confirm(`Remove ${productName} from cart?`)) {
      try {
        const result = await dispatch(removeFromCart(itemId));
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Item removed from cart');
          dispatch(getCart()); // Refresh cart
        }
      } catch (error) {
        toast.error('Failed to remove item');
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        const result = await dispatch(clearCart());
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Cart cleared successfully');
        }
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getImageUrl = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return imageArray[0];
    }
    return '/images/placeholder-product.jpg';
  };

  const calculateItemTotal = (item) => {
    const price = item.product?.discountPrice || item.product?.price || item.price;
    return price * item.quantity;
  };

  const calculateSavings = (item) => {
    if (item.product?.discountPrice && item.product?.price > item.product?.discountPrice) {
      return (item.product.price - item.product.discountPrice) * item.quantity;
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add items to your cart to get started</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart ({summary?.totalItems || 0} items)</h1>
          {items.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="btn btn-outline btn-small clear-cart-btn"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={getImageUrl(item.product?.images)} 
                    alt={item.product?.name} 
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">
                    <Link to={`/products/${item.product?.slug}`}>
                      {item.product?.name}
                    </Link>
                  </h3>
                  
                  {item.product?.brand && (
                    <p className="item-brand">{item.product.brand}</p>
                  )}

                  <div className="item-seller">
                    Sold by: {item.product?.seller?.firstName} {item.product?.seller?.lastName}
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      
                      <span className="quantity-display">
                        {updatingItems.has(item.id) ? (
                          <div className="mini-spinner"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={
                          item.quantity >= (item.product?.stock || 0) || 
                          updatingItems.has(item.id)
                        }
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id, item.product?.name)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>

                  {item.product?.stock <= 5 && (
                    <div className="stock-warning">
                      Only {item.product.stock} left in stock!
                    </div>
                  )}
                </div>

                <div className="item-pricing">
                  <div className="current-price">
                    {formatPrice(item.product?.discountPrice || item.product?.price || item.price)}
                  </div>
                  
                  {item.product?.discountPrice && (
                    <div className="original-price">
                      {formatPrice(item.product.price)}
                    </div>
                  )}

                  {calculateSavings(item) > 0 && (
                    <div className="savings">
                      You save {formatPrice(calculateSavings(item))}
                    </div>
                  )}

                  <div className="item-total">
                    Total: {formatPrice(calculateItemTotal(item))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Price Details</h3>
              
              <div className="summary-row">
                <span>Price ({summary?.totalItems || 0} items)</span>
                <span>{formatPrice(summary?.totalAmount || 0)}</span>
              </div>

              {summary?.totalSavings > 0 && (
                <div className="summary-row savings-row">
                  <span>Total Savings</span>
                  <span className="savings-amount">
                    -{formatPrice(summary.totalSavings)}
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span>Delivery Charges</span>
                <span className="free-delivery">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>{formatPrice(summary?.totalAmount || 0)}</span>
              </div>

              {summary?.totalSavings > 0 && (
                <div className="total-savings">
                  You will save {formatPrice(summary.totalSavings)} on this order
                </div>
              )}

              <button 
                onClick={() => navigate('/checkout')}
                className="btn btn-primary checkout-btn"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>

            <div className="delivery-info">
              <div className="delivery-icon">🚚</div>
              <div>
                <h4>Safe and Secure Payments</h4>
                <p>Easy returns. 100% Authentic products.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="suggested-products">
          <h3>Customers who bought items in your cart also bought</h3>
          {/* This would be populated with recommended products */}
          <div className="suggested-grid">
            {/* Placeholder for recommended products */}
            <p>Loading recommendations...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;