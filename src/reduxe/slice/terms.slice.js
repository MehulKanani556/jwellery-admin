import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";



const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllTerms = createAsyncThunk(
  "/getAllTerms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/termconditions/getall`);
      return response.data.data; // Assuming the API returns an array of terms
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleTerm = createAsyncThunk(
  "/getSingleTerm",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/termconditions/${id}`);
      return response.data; // Assuming the API returns the term object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addTerm = createAsyncThunk(
  "/addTerm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/termconditions/create`, data);
      if (response.status === 200) {
        return response.data.data; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editTerm = createAsyncThunk(
  "/editTerm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/termconditions/update/${data.id}`, data);
      if (response.status === 200) {
        return response.data.data; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteTerm = createAsyncThunk(
  "/deleteTerm",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/termconditions/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllTerms = createAsyncThunk(
  "/deleteAllTerms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/termconditions/allDelete`);
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateStatusTerm = createAsyncThunk(
  "/updateStatusTerm",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/termconditions/updatestatus/${id}`, { status });
      return response.data.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const termsSlice = createSlice({
  name: "term",
  initialState: {
    terms: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // getAllTerms
      .addCase(getAllTerms.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getAllTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllTerms.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch data";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // getSingleTerm
      .addCase(getSingleTerm.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSingleTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSingleTerm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch data";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // addTerm
      .addCase(addTerm.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(addTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = [...state.terms, action.payload];
        state.message = action.payload?.message || "Term created successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(addTerm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create term";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // deleteTerm
      .addCase(deleteTerm.pending, (state) => {
        state.loading = true;
        state.message = "Deleting term...";
      })
      .addCase(deleteTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = state.terms.filter((term) => term.id !== action.payload);
        state.message = action.payload?.message || "Term deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(deleteTerm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete term";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // editTerm
      .addCase(editTerm.pending, (state) => {
        state.loading = true;
        state.message = "Updating term...";
      })
      .addCase(editTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = state.terms.map((v) => v.id == action.payload.id ? action.payload : v);
        state.message = action.payload?.message || "Term updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(editTerm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update term";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // deleteAllTerms
      .addCase(deleteAllTerms.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all terms...";
      })
      .addCase(deleteAllTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = [];
        state.message = action.payload || "All terms deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(deleteAllTerms.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all terms";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // updateStatusTerm
      .addCase(updateStatusTerm.pending, (state) => {
        state.loading = true;
        state.message = "Updating term status...";
      })
      .addCase(updateStatusTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.terms = state.terms.map((v) => v.id == action.payload.id ? action.payload : v);
        state.message = action.payload?.message || "Term status updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(updateStatusTerm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update term status";
        enqueueSnackbar(state.message, { variant: 'error' });
      });
  },
});

export default termsSlice.reducer;
