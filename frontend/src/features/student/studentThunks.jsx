import { createAsyncThunk } from "@reduxjs/toolkit";
import studentService from "../../services/studentService";

// 🔹 Register Student
export const registerStudent = createAsyncThunk(
  "student/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await studentService.register(data);
      localStorage.setItem("studentToken", res.token);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Registration failed");
    }
  }
);

// 🔹 Login Student
export const loginStudent = createAsyncThunk(
  "student/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await studentService.login(credentials);
      localStorage.setItem("studentToken", res.token);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Login failed");
    }
  }
);

// 🔹 Update Student
export const updateStudent = createAsyncThunk(
  "student/update",
  async (data, { rejectWithValue }) => {
    try {
      return await studentService.update(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Update failed");
    }
  }
);

// 🔹 Get Student by ID
export const getStudentById = createAsyncThunk(
  "student/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await studentService.getById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch student");
    }
  }
);

// 🔹 Get all approved artisans
export const getArtisans = createAsyncThunk(
  "student/getArtisans",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await studentService.getArtisans(filters);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch artisans");
    }
  }
);

// 🔹 Get single approved artisan by ID
export const getArtisanById = createAsyncThunk(
  "student/getArtisanById",
  async (id, { rejectWithValue }) => {
    try {
      return await studentService.getArtisanById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch artisan");
    }
  }
);

// 🔹 Get all previous works of a specific artisan
export const getPreviousWorksByArtisan = createAsyncThunk(
  "student/getPreviousWorksByArtisan",
  async (artisanId, { rejectWithValue }) => {
    try {
      return await studentService.getPreviousWorksByArtisan(artisanId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch previous works");
    }
  }
);

// 🔹 Get single previous work by ID
export const getPreviousWorkById = createAsyncThunk(
  "student/getPreviousWorkById",
  async (workId, { rejectWithValue }) => {
    try {
      return await studentService.getPreviousWorkById(workId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch previous work");
    }
  }
);
