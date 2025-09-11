import { createSlice } from "@reduxjs/toolkit";
import {
  loginAdmin,
  getAnalytics,
  getAllArtisans, // ✅ new thunk for both pending + approved
  approveArtisan,
  rejectArtisan,
  getAllStudents,
  deleteStudent,
} from "./adminThunks";

const initialState = {
  admin: null,
  token: localStorage.getItem("adminToken") || null,
  analytics: null,
  artisans: [], // ✅ combined list (pending + approved)
  students: [],
  loading: false,
  error: null,
  successMessage: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login Admin
      .addCase(loginAdmin.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(loginAdmin.fulfilled, (state, action) => { 
        state.loading = false; 
        state.admin = action.payload.admin; 
        state.token = action.payload.token; 
      })
      .addCase(loginAdmin.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // 🔹 Get Analytics
      .addCase(getAnalytics.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(getAnalytics.fulfilled, (state, action) => { 
        state.loading = false; 
        state.analytics = action.payload; 
      })
      .addCase(getAnalytics.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // 🔹 Get All Artisans (Pending + Approved)
      .addCase(getAllArtisans.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(getAllArtisans.fulfilled, (state, action) => { 
        state.loading = false; 
        state.artisans = action.payload; 
      })
      .addCase(getAllArtisans.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

// 🔹 Approve Artisan
.addCase(approveArtisan.fulfilled, (state, action) => {
  state.successMessage = action.payload.message;
  const index = state.artisans.findIndex(a => a._id === action.payload.artisanId);
  if (index !== -1) {
    state.artisans[index] = { ...state.artisans[index], status: "approved" };
  }
})
.addCase(approveArtisan.rejected, (state, action) => {
  state.error = action.payload;
})

// 🔹 Reject Artisan
.addCase(rejectArtisan.fulfilled, (state, action) => {
  state.successMessage = action.payload.message;
  const index = state.artisans.findIndex(a => a._id === action.payload.artisanId);
  if (index !== -1) {
    state.artisans[index] = { ...state.artisans[index], status: "rejected" };
  }
})
.addCase(rejectArtisan.rejected, (state, action) => {
  state.error = action.payload;
})

      // 🔹 Get All Students
      .addCase(getAllStudents.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(getAllStudents.fulfilled, (state, action) => { 
        state.loading = false; 
        state.students = action.payload; 
      })
      .addCase(getAllStudents.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // 🔹 Delete Student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s._id !== action.payload);
        state.successMessage = "Student deleted successfully";
      })
      .addCase(deleteStudent.rejected, (state, action) => { 
        state.error = action.payload; 
      });
  },
});

export const { logoutAdmin, clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;



