import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  singleProduct: null,
  singleLoading: false,
  singleError: null,
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  searchError: null,
    totalPages: 1,
    total:20,
 filters: {
    category:'all',
    search: '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 10,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
                state.total = action.payload.total;

      state.filteredProducts = action.payload.products;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
     setFilters: (state, action) => {
    state.filters = action.payload;
  },
    fetchSingleStart: (state) => {
  state.singleLoading = true;
  state.singleError = null;
},

fetchSingleSuccess: (state, action) => {
  state.singleLoading = false;
  state.singleProduct = action.payload;
},

fetchSingleFailure: (state, action) => {
  state.singleLoading = false;
  state.singleError = action.payload;
},
    removeProduct: (state, action) => {
  state.products = state.products.filter(
    (product) => product.id !== action.payload
  );

  state.filteredProducts = state.filteredProducts.filter(
    (product) => product.id !== action.payload
  );
},
    fetchSearchStart: (state) => {
      state.searchLoading = true;
      state.searchError = null;
    },
    fetchSearchSuccess: (state, action) => {
      state.searchLoading = false;
      state.searchResults = action.payload;
    },
    fetchSearchFailure: (state, action) => {
      state.searchLoading = false;
      state.searchError = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      // Filter by category
      if (state.filters.category !== 'all') {
        filtered = filtered.filter((p) => p.category === state.filters.category);
      }

      // Filter by price range
      filtered = filtered.filter(
        (p) => p.price >= state.filters.priceRange[0] && p.price <= state.filters.priceRange[1]
      );

      // Filter by search
      if (state.filters.search) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(state.filters.search.toLowerCase())
        );
      }

      // Sort
      if (state.filters.sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (state.filters.sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (state.filters.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      state.filteredProducts = filtered;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setFilters,
  fetchSingleStart,
  fetchSingleSuccess,
  fetchSingleFailure,
  removeProduct,
  setCategory,
  setPriceRange,
  setSearch,
  setSortBy,
  applyFilters,
} = productsSlice.actions;
export default productsSlice.reducer;