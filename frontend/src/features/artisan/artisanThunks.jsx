import { createAsyncThunk } from "@reduxjs/toolkit";
import artisanService from "../../services/artisanService";

// --------------------------
// Auth & Profile
// --------------------------
export const registerArtisan = createAsyncThunk(
  "artisan/register",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await artisanService.register(formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Registration failed");
    }
  }
);

export const loginArtisan = createAsyncThunk(
  "artisan/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await artisanService.login(credentials);
      localStorage.setItem("artisanToken", data.token);
      return data;
    } catch (err) {
      if (err.response?.status === 403) {
        return rejectWithValue("Your account is pending admin approval.");
      }
      return rejectWithValue(err.response?.data?.msg || "Login failed");
    }
  }
);

export const updateArtisan = createAsyncThunk(
  "artisan/update",
  async (formData, { rejectWithValue }) => {
    try {
      return await artisanService.update(formData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Update failed");
    }
  }
);

// --------------------------
// Previous Works
// --------------------------
export const addPreviousWork = createAsyncThunk(
  "artisan/addPreviousWork",
  async (formData, { rejectWithValue }) => {
    try {
      return await artisanService.addPreviousWork(formData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Adding previous work failed");
    }
  }
);

export const getPreviousWorks = createAsyncThunk(
  "artisan/getPreviousWorks",
  async (_, { rejectWithValue }) => {
    try {
      return await artisanService.getPreviousWorks();
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch previous works");
    }
  }
);

export const getPreviousWorkById = createAsyncThunk(
  "artisan/getPreviousWorkById",
  async (workId, { rejectWithValue }) => {
    try {
      return await artisanService.getPreviousWorkById(workId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch previous work");
    }
  }
);

export const updatePreviousWork = createAsyncThunk(
  "artisan/updatePreviousWork",
  async ({ workId, formData }, { rejectWithValue }) => {
    try {
      return await artisanService.updatePreviousWork(workId, formData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to update previous work");
    }
  }
);

export const deletePreviousWork = createAsyncThunk(
  "artisan/deletePreviousWork",
  async (workId, { rejectWithValue }) => {
    try {
      return await artisanService.deletePreviousWork(workId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to delete previous work");
    }
  }
);

// --------------------------
// Get All Approved Artisans
// --------------------------
export const getArtisans = createAsyncThunk(
  "artisan/getArtisans",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await artisanService.getArtisans(filters);
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch artisans");
    }
  }
);
