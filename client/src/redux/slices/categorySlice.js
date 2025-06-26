// redux/slices/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch categories' });
    }
  }
);

export const getCategoryBySlug = createAsyncThunk(
  'categories/getCategoryBySlug',
  async ({ slug, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/categories/${slug}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Category not found' });
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create category' });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update category' });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete category' });
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategory: null,
    categoryProducts: [],
    categoryPagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 12
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
      state.categoryProducts = [];
    },
    setCategoryProducts: (state, action) => {
      state.categoryProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch categories';
      })

      // Get Category by Slug
      .addCase(getCategoryBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.data.category;
        state.categoryProducts = action.payload.data.products;
        state.categoryPagination = action.payload.data.pagination;
        state.error = null;
      })
      .addCase(getCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.currentCategory = null;
        state.categoryProducts = [];
        state.error = action.payload?.message || 'Category not found';
      })

      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload.data);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create category';
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.data.id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
        if (state.currentCategory?.id === action.payload.data.id) {
          state.currentCategory = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update category';
      })

      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete category';
      });
  },
});

export const { clearError, clearCurrentCategory, setCategoryProducts } = categorySlice.actions;
export default categorySlice.reducer;