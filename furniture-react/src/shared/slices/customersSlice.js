import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customersAPI } from '../services/api.js';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      return await customersAPI.getAll();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customersAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    totalPages: 10,
    total:50,
     filteredCustomers: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      status: 'all', // all | active | inactive
      sort: 'newest',
       page: 1,
       limit:10,
    },
  }, 
  reducers: {
     fetchCustomersStart: (state) => {
      state.loading = true;
    },
    fetchCustomersSuccess: (state, action) => {
      state.loading = false;
state.customers = action.payload.customers;
  state.totalPages = action.payload.totalPages; 
  state.total= action.payload.total;    

},
    fetchCustomersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
  state.filters = action.payload;
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
    setPage(state, action) {
  state.filters.page = action.payload;
},
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload
        );
      });
  },
});
export const {
  fetchCustomersStart,
  fetchCustomersSuccess,
  fetchCustomersFailure,
  setFilters,
  setSearch,
  setStatus,
  setSortBy,
  setPage,
  applyFilters,
} = customersSlice.actions;
export default customersSlice.reducer;
