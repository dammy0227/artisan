import { createSlice } from "@reduxjs/toolkit";
import {
  registerStudent,
  loginStudent,
  updateStudent,
  getStudentById,
  getArtisans,
  getArtisanById,
  getPreviousWorksByArtisan,
  getPreviousWorkById,
} from "./studentThunks";

const initialState = {
  student: null,
  token: localStorage.getItem("studentToken") || null, // ✅ load token from storage
  artisansList: [],
  selectedArtisan: null,
  artisanPreviousWorks: [],
  selectedPreviousWork: null,
  loading: false,
  error: null,
  successMessage: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    logoutStudent: (state) => {
      state.student = null;
      state.token = null;
      localStorage.removeItem("studentToken"); // ✅ remove token on logout
    },
    clearStudentMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Register Student
      .addCase(registerStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.token = action.payload.token;
        state.successMessage = action.payload.msg;
        localStorage.setItem("studentToken", action.payload.token); // ✅ store token
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Login Student
      .addCase(loginStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.token = action.payload.token;
        state.successMessage = action.payload.msg;
        localStorage.setItem("studentToken", action.payload.token); // ✅ store token
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Update Student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload.student;
        state.successMessage = action.payload.message;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get Student by ID
      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get All Approved Artisans
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
      })

      // 🔹 Get Single Approved Artisan
      .addCase(getArtisanById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getArtisanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArtisan = action.payload;
      })
      .addCase(getArtisanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get All Previous Works of an Artisan
      .addCase(getPreviousWorksByArtisan.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviousWorksByArtisan.fulfilled, (state, action) => {
        state.loading = false;
        state.artisanPreviousWorks = action.payload;
      })
      .addCase(getPreviousWorksByArtisan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get Single Previous Work
      .addCase(getPreviousWorkById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPreviousWorkById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPreviousWork = action.payload;
      })
      .addCase(getPreviousWorkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutStudent, clearStudentMessages } = studentSlice.actions;
export default studentSlice.reducer;
