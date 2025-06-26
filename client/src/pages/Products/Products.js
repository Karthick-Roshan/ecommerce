import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts, setFilters, clearFilters } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items: products, filters, pagination, isLoading } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);

  const [localFilters, setLocalFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'DESC',
    page: parseInt(searchParams.get('page')) || 1
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Update Redux filters when URL params change
    const urlFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'DESC',
      page: parseInt(searchParams.get('page')) || 1
    };

    setLocalFilters(urlFilters);
    dispatch(setFilters(urlFilters));
    dispatch(getProducts(urlFilters));
  }, [searchParams, dispatch]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    };

    setLocalFilters(newFilters);
    updateURL(newFilters);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    handleFilterChange('sortBy', sortBy);
    handleFilterChange('sortOrder', sortOrder);
  };

  const handlePageChange = (page) => {
    handleFilterChange('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      page: 1
    };

    setLocalFilters(clearedFilters);
    updateURL(clearedFilters);
    dispatch(clearFilters());
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    // Always show first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(i);
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          ← Previous
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            className={`pagination-btn ${page === currentPage ? 'active' : ''} ${typeof page !== 'number' ? 'dots' : ''}`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div className="results-info">
            {localFilters.search && (
              <h1>Search results for "{localFilters.search}"</h1>
            )}
            <p>{pagination.totalItems} products found</p>
          </div>

          <div className="header-controls">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle btn btn-outline"
            >
              🔽 Filters
            </button>

            <select
              value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="price-ASC">Price: Low to High</option>
              <option value="price-DESC">Price: High to Low</option>
              <option value="averageRating-DESC">Highest Rated</option>
              <option value="name-ASC">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="products-content">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={handleClearFilters} className="clear-filters">
                Clear All
              </button>
            </div>

            <div className="filter-section">
              <h4>Categories</h4>
              <div className="category-filters">
                <label>
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={localFilters.category === ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  All Categories
                </label>
                {categories.map(category => (
                  <label key={category.id}>
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={localFilters.category === category.id.toString()}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-filters">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={localFilters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="price-input"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="price-input"
                  />
                </div>

                <div className="price-presets">
                  <button onClick={() => {
                    handleFilterChange('minPrice', '0');
                    handleFilterChange('maxPrice', '500');
                  }} className="price-preset">Under ₹500</button>
                  
                  <button onClick={() => {
                    handleFilterChange('minPrice', '500');
                    handleFilterChange('maxPrice', '1000');
                  }} className="price-preset">₹500 - ₹1000</button>
                  
                  <button onClick={() => {
                    handleFilterChange('minPrice', '1000');
                    handleFilterChange('maxPrice', '5000');
                  }} className="price-preset">₹1000 - ₹5000</button>
                  
                  <button onClick={() => {
                    handleFilterChange('minPrice', '5000');
                    handleFilterChange('maxPrice', '');
                  }} className="price-preset">Above ₹5000</button>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h4>Rating</h4>
              <div className="rating-filters">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating}>
                    <input type="checkbox" />
                    {'⭐'.repeat(rating)}{'☆'.repeat(5 - rating)} & above
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {isLoading ? (
              <div className="products-loading">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {renderPagination()}
              </>
            ) : (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={handleClearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;