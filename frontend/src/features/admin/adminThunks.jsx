import { createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService";

// 🔹 Admin Login
export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await adminService.login(credentials);
      localStorage.setItem("adminToken", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// 🔹 Fetch Analytics
export const getAnalytics = createAsyncThunk(
  "admin/getAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAnalytics();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch analytics");
    }
  }
);

export const getAllArtisans = createAsyncThunk(
  "admin/getAllArtisans",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllArtisans();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch artisans");
    }
  }
);

// 🔹 Approve Artisan

export const approveArtisan = createAsyncThunk(
  "admin/approveArtisan",
  async (artisanId, { rejectWithValue }) => {
    try {
      const data = await adminService.approveArtisan(artisanId);
      // Return artisan ID + message for instant state update
      return { artisanId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to approve artisan");
    }
  }
);

// 🔹 Reject Artisan
export const rejectArtisan = createAsyncThunk(
  "admin/rejectArtisan",
  async (artisanId, { rejectWithValue }) => {
    try {
      const data = await adminService.rejectArtisan(artisanId);
      return { artisanId, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reject artisan");
    }
  }
);

// 🔹 Get All Students
export const getAllStudents = createAsyncThunk(
  "admin/getAllStudents",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllStudents();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch students");
    }
  }
);

// 🔹 Delete Student
export const deleteStudent = createAsyncThunk(
  "admin/deleteStudent",
  async (studentId, { rejectWithValue }) => {
    try {
      await adminService.deleteStudent(studentId);
      return studentId; // return deleted ID for updating state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete student");
    }
  }
);
