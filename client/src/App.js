import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import Products from './pages/Products/Products';
import ProductDetail from './pages/Products/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/Orders/OrderDetail';
import AddProduct from './pages/Seller/AddProduct';
import SellerDashboard from './pages/Seller/SellerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CategoryPage from './pages/Category/CategoryPage';

// Redux
import { loadUser } from './redux/slices/authSlice';
import { getCategories } from './redux/slices/categorySlice';

// Styles
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user if token exists
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
    
    // Load categories
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            <Route path="/orders/:orderId" element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            } />
            
            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={
              <PrivateRoute requiredRole="seller">
                <SellerDashboard />
              </PrivateRoute>
            } />
            <Route path="/seller/add-product" element={
              <PrivateRoute requiredRole="seller">
                <AddProduct />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;