import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getFeaturedProducts } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  const bannerItems = [
    {
      id: 1,
      title: 'Smartphones',
      subtitle: 'Latest models from top brands',
      image: '/images/banner-mobile.jpg',
      link: '/category/mobiles'
    },
    {
      id: 2,
      title: 'Laptops',
      subtitle: 'Power & Performance',
      image: '/images/banner-laptop.jpg',
      link: '/category/laptops'
    },
    {
      id: 3,
      title: 'Fashion',
      subtitle: 'Trending styles',
      image: '/images/banner-fashion.jpg',
      link: '/category/fashion'
    }
  ];

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-banner">
            <div className="banner-slider">
              {bannerItems.map((item, index) => (
                <div key={item.id} className={`banner-slide ${index === 0 ? 'active' : ''}`}>
                  <div className="banner-content">
                    <h2 className="banner-title">{item.title}</h2>
                    <p className="banner-subtitle">{item.subtitle}</p>
                    <Link to={item.link} className="banner-btn">Shop Now</Link>
                  </div>
                  <div className="banner-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories?.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="category-card"
              >
                <div className="category-icon">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="view-all-btn">View All</Link>
          </div>
          
          {isLoading ? (
            <div className="loading">Loading featured products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals Section */}
      <section className="deals-section">
        <div className="container">
          <h2 className="section-title">Best Deals</h2>
          <div className="deals-grid">
            <div className="deal-card">
              <h3>Electronics</h3>
              <p>Up to 70% Off</p>
              <Link to="/category/electronics" className="deal-btn">Shop Now</Link>
            </div>
            <div className="deal-card">
              <h3>Fashion</h3>
              <p>Flat 50% Off</p>
              <Link to="/category/fashion" className="deal-btn">Shop Now</Link>
            </div>
            <div className="deal-card">
              <h3>Home & Kitchen</h3>
              <p>Starting ₹199</p>
              <Link to="/category/home-kitchen" className="deal-btn">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>Free delivery on orders above ₹500</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>7-day return policy</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payment</h3>
              <p>100% secure payment gateway</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Electronics': '📱',
    'Mobiles': '📱',
    'Laptops': '💻',
    'Fashion': '👗',
    'Men\'s Clothing': '👔',
    'Women\'s Clothing': '👗',
    'Home & Kitchen': '🏠',
    'Books': '📚',
    'Sports': '⚽',
    'Toys': '🧸'
  };
  return icons[categoryName] || '📦';
};

export default Home;