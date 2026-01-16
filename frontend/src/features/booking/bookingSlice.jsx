import { createSlice } from "@reduxjs/toolkit";
import {
  createBooking,
  getBookingsByStudent,
  getBookingsByArtisan,
  updateBookingStatus,
} from "./bookingThunks";

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  successMessage: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload.booking);
        state.successMessage = action.payload.msg;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getBookingsByStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingsByStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingsByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(getBookingsByArtisan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingsByArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookingsByArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBooking = action.payload.booking;
        state.bookings = state.bookings.map((b) =>
          b._id === updatedBooking._id ? updatedBooking : b
        );
        state.successMessage = action.payload.message;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessages } = bookingSlice.actions;
export default bookingSlice.reducer;
