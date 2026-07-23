import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../services/api.js';
import { useCallback } from 'react';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.cancelOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

const initialState = {
  orders: [],
  filteredOrders:[],
  currentOrder: null,
  loading: false,
  error: null,
  createOrderLoading: false,
  createOrderError: null,
  totalPages: 10,
  total:20,
  filters: {
    search: '',
    status: 'all',
    sort: 'newest',
    page: 1,
    limit: 10,
  },
  
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
  state.orders = action.payload.orders;
  state.totalPages = action.payload.totalPages;
  state.total = action.payload.total;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
  state.filters = action.payload;
},
      fetchOrderStart: (state) => {
  state.loading = true;
},

fetchOrderSuccess: (state, action) => {
  state.loading = false;
  state.currentOrder = action.payload;
},
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
      state.createOrderError = null;
    },
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    setStatus(state, action) {
      state.filters.status = action.payload;
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    applyFilters(state) {
      let filtered = [...state.orders];
      // 🔍 Search by name or email
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.customer.toLowerCase().includes(q) 
        );
      }

      // ✅ Status filter
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(
          (c) => c.status === state.filters.status
        );
      }

      // 🔃 Sorting
      if (state.filters.sortBy === 'newest') {
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      } else if (state.filters.sortBy === 'oldest') {
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      } else if (state.filters.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      state.filteredOrders = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.createOrderLoading = true;
        state.createOrderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrderLoading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderError = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        if (state.currentOrder?.id === action.payload.order.id) {
          state.currentOrder = action.payload.order;
        }
      });
  },
});

export const {
  fetchOrdersSuccess,
  fetchOrdersStart,
  fetchOrdersFailure,
  setFilters,
  fetchOrderSuccess,
  clearCurrentOrder,
  clearOrderError,
  setSearch,
  setStatus,
  setSortBy,
  applyFilters,
} = ordersSlice.actions;
export default ordersSlice.reducer;