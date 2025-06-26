// pages/Seller/SellerDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Seller.css';

const SellerDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  const [recentProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 119900,
      stock: 50,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      price: 104900,
      stock: 25,
      status: 'active',
      createdAt: '2024-01-14'
    }
  ]);

  const [recentOrders] = useState([
    {
      id: 1,
      orderId: 'FK1705123456789',
      customerName: 'John Doe',
      amount: 119900,
      status: 'pending',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      orderId: 'FK1705123456790',
      customerName: 'Jane Smith',
      amount: 104900,
      status: 'confirmed',
      createdAt: '2024-01-14'
    }
  ]);

  useEffect(() => {
    // Simulate fetching seller stats
    setStats({
      totalProducts: 15,
      totalOrders: 45,
      totalRevenue: 2350000,
      pendingOrders: 8
    });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      shipped: 'status-shipped',
      delivered: 'status-delivered'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="seller-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p>Welcome back, {user?.firstName}!</p>
          </div>
          <Link to="/seller/add-product" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatPrice(stats.totalRevenue)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Products */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Products</h2>
              <Link to="/seller/products" className="view-all-link">View All</Link>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info">
                          <strong>{product.name}</strong>
                        </div>
                      </td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        <span className={product.stock > 10 ? 'stock-good' : 'stock-low'}>
                          {product.stock}
                        </span>
                      </td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-small btn-outline">Edit</button>
                          <button className="btn-small btn-danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/seller/orders" className="view-all-link">View All</Link>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id">{order.orderId}</span>
                      </td>
                      <td>{order.customerName}</td>
                      <td>{formatPrice(order.amount)}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-small btn-outline">View</button>
                          <button className="btn-small btn-primary">Update</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/seller/add-product" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Product</h3>
              <p>Add a new product to your inventory</p>
            </Link>
            
            <Link to="/seller/inventory" className="action-card">
              <div className="action-icon">📊</div>
              <h3>Manage Inventory</h3>
              <p>Update stock and product details</p>
            </Link>
            
            <Link to="/seller/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>View Orders</h3>
              <p>Check and process customer orders</p>
            </Link>
            
            <Link to="/seller/analytics" className="action-card">
              <div className="action-icon">📈</div>
              <h3>Analytics</h3>
              <p>View sales reports and insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;