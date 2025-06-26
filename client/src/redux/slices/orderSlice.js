import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders/create', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create order' });
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.append('status', status);
      
      const response = await api.get(`/orders/my-orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Order not found' });
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to cancel order' });
    }
  }
);

// Admin functions
export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async ({ page = 1, limit = 20, status, userId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.append('status', status);
      if (userId) params.append('userId', userId);
      
      const response = await api.get(`/orders/admin/all?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/admin/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update order status' });
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    adminOrders: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10
    },
    adminPagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 20
    },
    filters: {
      status: '',
      page: 1
    },
    isLoading: false,
    isCreating: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        page: 1
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.orders.unshift(action.payload.data);
        state.currentOrder = action.payload.data;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.message || 'Failed to create order';
      })

      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data.orders;
        state.pagination = action.payload.data.pagination;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })

      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.data;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.currentOrder = null;
        state.error = action.payload?.message || 'Order not found';
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        
        // Update in orders list
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        
        // Update current order if it's the same
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
        
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to cancel order';
      })

      // Get All Orders (Admin)
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOrders = action.payload.data.orders;
        state.adminPagination = action.payload.data.pagination;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })

      // Update Order Status (Admin)
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        
        // Update in admin orders list
        const index = state.adminOrders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.adminOrders[index] = updatedOrder;
        }
        
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update order status';
      });
  },
});

export const { clearError, clearCurrentOrder, setFilters, clearFilters } = orderSlice.actions;
export default orderSlice.reducer;