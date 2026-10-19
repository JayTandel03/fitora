import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Make sure the backend base URL is correct
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ✅ Always include cookies (for login/auth)
axios.defaults.withCredentials = true;

const initialState = {
  isLoading: false,
  searchResults: [],
};

// ✅ Fetch search results
export const getSearchResults = createAsyncThunk(
  "order/getSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shop/search/${keyword}`, {
        withCredentials: true, // important for cookies
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching search results");
    }
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
