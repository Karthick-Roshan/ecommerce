// pages/Checkout/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items: cartItems, summary } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const { isCreating } = useSelector(state => state.orders);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addresses] = useState([
    {
      id: 1,
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      phone: '9876543210',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      landmark: 'Near Central Mall',
      isDefault: true
    }
  ]);

  useEffect(() => {
    dispatch(getCart());
    if (addresses.length > 0) {
      setSelectedAddress(addresses.find(addr => addr.isDefault) || addresses[0]);
    }
  }, [dispatch, addresses]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      const orderData = {
        addressId: selectedAddress.id,
        paymentMethod,
        notes: ''
      };

      const result = await dispatch(createOrder(orderData));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Order placed successfully!');
        navigate(`/orders/${result.payload.data.orderId}`);
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to proceed with checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-main">
            {/* Delivery Address */}
            <div className="checkout-section">
              <h2>1. Delivery Address</h2>
              <div className="address-list">
                {addresses.map(address => (
                  <div 
                    key={address.id}
                    className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="address-header">
                      <span className="address-type">{address.type.toUpperCase()}</span>
                      {address.isDefault && <span className="default-badge">DEFAULT</span>}
                    </div>
                    <div className="address-details">
                      <p><strong>{address.firstName} {address.lastName}</strong></p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p>Phone: {address.phone}</p>
                      {address.landmark && <p>Landmark: {address.landmark}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Review */}
            <div className="checkout-section">
              <h2>2. Review Items</h2>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <img 
                      src={item.product?.images?.[0] || '/images/placeholder-product.jpg'} 
                      alt={item.product?.name} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.product?.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">
                        {formatPrice(item.product?.discountPrice || item.product?.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h2>3. Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                
                <label className="payment-option disabled">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    disabled
                  />
                  <span>Credit/Debit Card (Coming Soon)</span>
                </label>
                
                <label className="payment-option disabled">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    disabled
                  />
                  <span>UPI (Coming Soon)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({summary?.totalItems || 0})</span>
                <span>{formatPrice(summary?.totalAmount || 0)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free">FREE</span>
              </div>
              
              {summary?.totalSavings > 0 && (
                <div className="summary-row savings">
                  <span>Total Savings</span>
                  <span>-{formatPrice(summary.totalSavings)}</span>
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>{formatPrice(summary?.totalAmount || 0)}</span>
              </div>
              
              {summary?.totalSavings > 0 && (
                <div className="savings-note">
                  You will save {formatPrice(summary.totalSavings)} on this order
                </div>
              )}
              
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || isCreating}
                className="place-order-btn"
              >
                {isCreating ? 'Placing Order...' : 'Place Order'}
              </button>
              
              <div className="secure-checkout">
                <span>🔒 Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;