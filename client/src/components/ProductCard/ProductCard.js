import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    dispatch(addToCart({
      productId: product.id,
      quantity: 1
    }));
  };

  const getDiscountPercentage = () => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getEffectivePrice = () => {
    return product.discountPrice || product.price;
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

  const discountPercentage = getDiscountPercentage();
  const effectivePrice = getEffectivePrice();

  return (
    <div className="product-card">
      <Link to={`/products/${product.slug}`} className="product-link">
        <div className="product-image-container">
          <img
            src={getImageUrl(product.images)}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {discountPercentage > 0 && (
            <div className="discount-badge">{discountPercentage}% OFF</div>
          )}
          {product.stock === 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name" title={product.name}>
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="product-brand">{product.brand}</p>
          )}

          <div className="product-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < Math.floor(product.averageRating || 0) ? 'filled' : ''}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="rating-count">
              ({product.totalReviews || 0})
            </span>
          </div>

          <div className="product-pricing">
            <span className="current-price">
              {formatPrice(effectivePrice)}
            </span>
            {product.discountPrice && (
              <span className="original-price">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="product-description">
              {product.shortDescription}
            </p>
          )}

          <div className="product-actions">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;