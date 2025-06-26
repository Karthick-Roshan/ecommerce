// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  'products/getProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Product not found' });
    }
  }
);

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products?isFeatured=true&limit=8');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch featured products' });
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=20`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Search failed' });
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append regular fields
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle file uploads
          value.forEach(file => {
            formData.append('images', file);
          });
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create product' });
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update product' });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete product' });
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featuredProducts: [],
    currentProduct: null,
    searchResults: [],
    filters: {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      page: 1,
      limit: 12
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 12
    },
    isLoading: false,
    isSearching: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        page: 1,
        limit: 12
      };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.products;
        state.pagination = action.payload.data.pagination;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })

      // Get Product by Slug
      .addCase(getProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data;
        state.error = null;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.currentProduct = null;
        state.error = action.payload?.message || 'Product not found';
      })

      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload.data.products;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch featured products';
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.data.products;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload?.message || 'Search failed';
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create product';
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.data.id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        if (state.currentProduct?.id === action.payload.data.id) {
          state.currentProduct = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update product';
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete product';
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  clearCurrentProduct, 
  clearSearchResults, 
  clearError 
} = productSlice.actions;

export default productSlice.reducer;