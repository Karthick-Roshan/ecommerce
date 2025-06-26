import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { email: 'admin@flipkart.com', password: 'admin123' },
      seller: { email: 'seller@flipkart.com', password: 'seller123' },
      customer: { email: 'customer@flipkart.com', password: 'customer123' }
    };

    setFormData(credentials[role]);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Login</h2>
            <p>Get access to your Orders, Wishlist and Recommendations</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="demo-section">
            <h4>Demo Credentials</h4>
            <div className="demo-buttons">
              <button
                onClick={() => fillDemoCredentials('customer')}
                className="demo-btn customer"
              >
                Customer Demo
              </button>
              <button
                onClick={() => fillDemoCredentials('seller')}
                className="demo-btn seller"
              >
                Seller Demo
              </button>
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="demo-btn admin"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              New to Flipkart?{' '}
              <Link to="/register" state={{ from: location.state?.from }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <img src="/images/auth-banner.jpg" alt="Flipkart" />
          <div className="auth-image-content">
            <h3>Login for the best experience</h3>
            <p>Enjoy seamless shopping with personalized recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;