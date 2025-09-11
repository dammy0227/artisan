import { createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";

// 🔹 Create review (Student only)
export const createReview = createAsyncThunk(
  "review/create",
  async (data, { rejectWithValue }) => {
    try {
      return await reviewService.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit review");
    }
  }
);

// 🔹 Get reviews for a specific artisan (public)
export const getReviewsForArtisan = createAsyncThunk(
  "review/getForArtisan",
  async (artisanId, { rejectWithValue }) => {
    try {
      return await reviewService.getForArtisan(artisanId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

// 🔹 Get reviews for logged-in student
export const getReviewsForStudent = createAsyncThunk(
  "review/getForStudent",
  async (_, { rejectWithValue }) => {
    try {
      return await reviewService.getForStudent();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your reviews");
    }
  }
);

// 🔹 Get reviews for logged-in artisan
export const getReviewsForLoggedArtisan = createAsyncThunk(
  "review/getForLoggedArtisan",
  async (_, { rejectWithValue }) => {
    try {
      return await reviewService.getForLoggedArtisan();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your artisan reviews");
    }
  }
);
