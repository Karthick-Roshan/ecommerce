// pages/Products/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductBySlug, clearCurrentProduct } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct: product, isLoading, error } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await dispatch(addToCart({
        productId: product.id,
        quantity
      }));

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    // Add to cart first, then redirect to checkout
    handleAddToCart().then(() => {
      navigate('/checkout');
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product?.discountPrice && product?.price > product?.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getImageUrl = (imageArray, index = 0) => {
    if (Array.isArray(imageArray) && imageArray.length > index) {
      return imageArray[index];
    }
    return '/images/placeholder-product.jpg';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">⭐</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="product-detail-loading">
        <div className="container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <div className="container">
          <div className="error-content">
            <div className="error-icon">😞</div>
            <h2>Product Not Found</h2>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = getDiscountPercentage();
  const effectivePrice = product.discountPrice || product.price;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">›</span>
          <Link to="/products">Products</Link>
          {product.category && (
            <>
              <span className="separator">›</span>
              <Link to={`/category/${product.category.slug}`}>
                {product.category.name}
              </Link>
            </>
          )}
          <span className="separator">›</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={getImageUrl(product.images, selectedImage)}
                alt={product.name}
                className="main-product-image"
              />
              {product.stock === 0 && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              {product.brand && (
                <p className="product-brand">by {product.brand}</p>
              )}
            </div>

            {/* Rating */}
            <div className="product-rating">
              <div className="rating-stars">
                {renderStars(product.averageRating || 0)}
              </div>
              <span className="rating-text">
                {product.averageRating || 0} ({product.totalReviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="product-pricing">
              <div className="price-main">
                <span className="current-price">
                  {formatPrice(effectivePrice)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="original-price">
                      {formatPrice(product.price)}
                    </span>
                    <span className="discount-badge">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              {product.discountPrice && (
                <p className="savings-text">
                  You save {formatPrice(product.price - product.discountPrice)}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="short-description">
                <p>{product.shortDescription}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <div className="in-stock">
                  <span className="stock-icon">✓</span>
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="out-of-stock">
                  <span className="stock-icon">✗</span>
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <label htmlFor="quantity">Quantity:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="quantity-select"
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="btn btn-outline add-to-cart-btn"
              >
                {addingToCart ? (
                  <span>Adding...</span>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  '🛒 Add to Cart'
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn btn-primary buy-now-btn"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="seller-info">
                <h4>Sold by</h4>
                <p>{product.seller.firstName} {product.seller.lastName}</p>
              </div>
            )}

            {/* Key Features */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="key-features">
                <h4>Key Features</h4>
                <ul>
                  {Object.entries(product.specifications)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-details-tabs">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <button
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
            )}
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.totalReviews || 0})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h3>Product Description</h3>
                <p>{product.description || 'No description available.'}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="specifications-content">
                <h3>Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="specifications-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-value">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <h3>Customer Reviews</h3>
                {product.totalReviews > 0 ? (
                  <div className="reviews-summary">
                    <div className="average-rating">
                      <span className="rating-number">{product.averageRating}</span>
                      <div className="rating-stars">
                        {renderStars(product.averageRating)}
                      </div>
                      <span className="rating-count">
                        Based on {product.totalReviews} reviews
                      </span>
                    </div>
                    {/* Reviews list would go here */}
                    <p className="coming-soon">Individual reviews coming soon...</p>
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h3>Related Products</h3>
          <p>Related products will be displayed here...</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;