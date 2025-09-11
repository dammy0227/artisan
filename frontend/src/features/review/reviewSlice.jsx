import { createSlice } from "@reduxjs/toolkit";
import {
  createReview,
  getReviewsForArtisan,
  getReviewsForStudent,
  getReviewsForLoggedArtisan,
} from "./reviewThunks";

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  successMessage: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.review);
        state.successMessage = action.payload.message;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get reviews for specific artisan (public)
      .addCase(getReviewsForArtisan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsForArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsForArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get reviews for logged-in student
      .addCase(getReviewsForStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsForStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsForStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get reviews for logged-in artisan
      .addCase(getReviewsForLoggedArtisan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReviewsForLoggedArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviewsForLoggedArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewMessages } = reviewSlice.actions;
export default reviewSlice.reducer;
