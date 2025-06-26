import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { searchProducts } from '../../redux/slices/productSlice';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);
  const { items: cartItems } = useSelector((state) => state.cart);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate cart item count
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    navigate('/');
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <span>Flipkart</span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <span className="search-icon">🔍</span>
              </button>
            </form>

            {/* Right Section */}
            <div className="header-right">
              {isAuthenticated ? (
                <div className="user-section">
                  {/* User Dropdown */}
                  <div className="user-dropdown">
                    <button 
                      onClick={toggleUserDropdown}
                      className="user-name"
                    >
                      {user?.firstName} ▼
                    </button>
                    
                    {showUserDropdown && (
                      <div className="dropdown-menu">
                        <Link 
                          to="/profile" 
                          className="dropdown-item"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          My Profile
                        </Link>
                        <Link 
                          to="/orders" 
                          className="dropdown-item"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Orders
                        </Link>
                        {user?.role === 'seller' && (
                          <Link 
                            to="/seller/dashboard" 
                            className="dropdown-item"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            Seller Dashboard
                          </Link>
                        )}
                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin/dashboard" 
                            className="dropdown-item"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout}
                          className="dropdown-item logout-btn"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cart */}
                  <Link to="/cart" className="cart-link">
                    <span className="cart-icon">🛒</span>
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </Link>
                </div>
              ) : (
                <div className="auth-links">
                  <Link 
                    to="/login" 
                    state={{ from: location }}
                    className="auth-link"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    state={{ from: location }}
                    className="auth-link"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-links">
            <Link to="/products" className="nav-link">All Products</Link>
            {categories?.slice(0, 6).map((category) => (
              <Link 
                key={category.id} 
                to={`/category/${category.slug}`} 
                className="nav-link"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;