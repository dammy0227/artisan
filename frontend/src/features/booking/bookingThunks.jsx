// src/features/booking/bookingThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../../services/bookingService";

// 🔹 Create booking (Student only)
export const createBooking = createAsyncThunk(
  "booking/create",
  async (data, { rejectWithValue }) => {
    try {
      return await bookingService.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Booking creation failed");
    }
  }
);

// 🔹 Get bookings for logged-in student
export const getBookingsByStudent = createAsyncThunk(
  "booking/getByStudent",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getByStudent();
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch student bookings");
    }
  }
);

// 🔹 Get bookings for logged-in artisan
export const getBookingsByArtisan = createAsyncThunk(
  "booking/getByArtisan",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getByArtisan();
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch artisan bookings");
    }
  }
);

// 🔹 Update booking status (Artisan only)
export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      return await bookingService.updateStatus(bookingId, status);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to update booking status");
    }
  }
);
