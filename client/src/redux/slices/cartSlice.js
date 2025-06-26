import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add to cart' });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update cart item' });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove from cart' });
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart/clear');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to clear cart' });
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    summary: {
      totalItems: 0,
      totalAmount: 0
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.summary = {
        totalItems: 0,
        totalAmount: 0
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.items || [];
        state.summary = action.payload.data.summary || { totalItems: 0, totalAmount: 0 };
        state.error = null;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Refresh cart after adding item
        // The actual cart data will be updated when getCart is called
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add to cart';
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        // Find and update the cart item
        const updatedItem = action.payload.data;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        // Recalculate summary
        state.summary = calculateCartSummary(state.items);
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update cart item';
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the item from cart
        const itemId = action.payload;
        state.items = state.items.filter(item => item.id !== itemId);
        // Recalculate summary
        state.summary = calculateCartSummary(state.items);
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to remove from cart';
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.summary = {
          totalItems: 0,
          totalAmount: 0
        };
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to clear cart';
      });
  },
});

// Helper function to calculate cart summary
const calculateCartSummary = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => {
    const price = item.product?.discountPrice || item.product?.price || item.price;
    return total + (price * item.quantity);
  }, 0);
  
  return {
    totalItems,
    totalAmount: parseFloat(totalAmount.toFixed(2))
  };
};

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;