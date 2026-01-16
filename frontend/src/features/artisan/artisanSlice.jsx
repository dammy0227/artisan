import { createSlice } from "@reduxjs/toolkit";
import {
  registerArtisan,
  loginArtisan,
  updateArtisan,
  addPreviousWork,
  getPreviousWorks,
  getPreviousWorkById,
  updatePreviousWork,
  deletePreviousWork,
  getArtisans
} from "./artisanThunks";

const initialState = {
  artisan: null,
  token: localStorage.getItem("artisanToken") || null,
  artisansList: [],
  previousWorks: [],
  currentWork: null,
  loading: false,
  error: null,
  successMessage: null,
};

const artisanSlice = createSlice({
  name: "artisan",
  initialState,
  reducers: {
    logoutArtisan: (state) => {
      state.artisan = null;
      state.token = null;
      localStorage.removeItem("artisanToken");
    },
    clearArtisanMessages: (state) => {
      state.error = null;
      state.successMessage = null;
      state.currentWork = null;
      state.loading = false; 
    },
  },
  extraReducers: (builder) => {
    builder
      // --------------------------
      // Register Artisan
      // --------------------------
      .addCase(registerArtisan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.artisan = action.payload.artisan || null;
        state.successMessage =
          action.payload.message || "Registration submitted. Awaiting admin approval.";
      })
      .addCase(registerArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --------------------------
      // Login Artisan
      // --------------------------
      .addCase(loginArtisan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.artisan = action.payload.artisan;
        state.token = action.payload.token;
      })
      .addCase(loginArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --------------------------
      // Update Artisan Profile
      // --------------------------
      .addCase(updateArtisan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.artisan = action.payload.artisan;
        state.successMessage = action.payload.message;
      })
      .addCase(updateArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --------------------------
      // Previous Works
      // --------------------------
      .addCase(addPreviousWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPreviousWork.fulfilled, (state, action) => {
        state.loading = false;
        state.previousWorks = action.payload.previousWorks;
        state.successMessage = action.payload.message;
      })
      .addCase(addPreviousWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPreviousWorks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviousWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.previousWorks = action.payload;
      })
      .addCase(getPreviousWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPreviousWorkById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviousWorkById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWork = action.payload;
      })
      .addCase(getPreviousWorkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePreviousWork.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePreviousWork.fulfilled, (state, action) => {
        state.loading = false;
        state.previousWorks = state.previousWorks.map(work =>
          work._id === action.payload._id ? action.payload : work
        );
        state.successMessage = "Previous work updated successfully";
      })
      .addCase(updatePreviousWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePreviousWork.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePreviousWork.fulfilled, (state, action) => {
        state.loading = false;
        state.previousWorks = state.previousWorks.filter(
          work => work._id !== action.payload.deletedId
        );
        state.successMessage = "Previous work deleted successfully";
      })
      .addCase(deletePreviousWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(getArtisans.pending, (state) => {
        state.loading = true;
      })
      .addCase(getArtisans.fulfilled, (state, action) => {
        state.loading = false;
        state.artisansList = action.payload;
      })
      .addCase(getArtisans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutArtisan, clearArtisanMessages } = artisanSlice.actions;
export default artisanSlice.reducer;
