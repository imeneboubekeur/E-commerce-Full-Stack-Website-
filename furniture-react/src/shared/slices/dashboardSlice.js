import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI } from '../services/api.js';

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async () => {
    return await adminAPI.getDashboardStats();
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
     productStats: null,
     orderStats:null,
     customerStats:null,
    loading: false,
  },
  reducers:{
fetchDashboardStart: (state) => {
      state.loading = true;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
     fetchProductStatsSuccess: (state, action) => {
      state.productStats = action.payload;
    },
     fetchOrderStatsSuccess: (state, action) => {
      state.orderStats = action.payload;
    },
    fetchCustomerStatsSuccess: (state, action) => {
      state.customerStats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
   fetchProductStatsSuccess,
   fetchOrderStatsSuccess,
   fetchCustomerStatsSuccess
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
