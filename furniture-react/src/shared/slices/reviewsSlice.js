import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewsAPI } from '../services/api.js';

const initialState = {
  reviews: [],
  loading: false,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId) => {
    return await reviewsAPI.getProductReviews(productId);
  }
);

export const addReview = createAsyncThunk(
  "reviews/add",
  async (reviewData) => {
    return await reviewsAPI.createReview(reviewData);
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: { 
    fetchReviewsStart: (state) => {
      state.loading = true;
    },
    fetchReviewsSuccess: (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    },},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      });
  },
});
export const {
  fetchReviewsStart,
  fetchReviewsSuccess,
} = reviewsSlice.actions;
export default reviewsSlice.reducer;
