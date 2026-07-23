import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload || [];
    },

    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addCategory: (state, action) => {
      state.items.push(action.payload);
    },

    updateCategory: (state, action) => {
      const { id, name, image_url } = action.payload;
      const category = state.items.find((c) => c.id === id);

      if (category) {
        if (name !== undefined) category.name = name;
        if (image_url !== undefined) category.image_url = image_url;
      }
    },

    removeCategory: (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },

    clearCategories: (state) => {
      state.items = [];
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategory,
  updateCategory,
  removeCategory,
  clearCategories,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;