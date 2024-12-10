import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";



const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllReason = createAsyncThunk(
  "/getAllReason",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/reasonCancellation/getall`);
      return response.data.reasonCancellation; // Assuming the API returns an array of reasons
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleReason = createAsyncThunk(
  "/getSingleReason",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/reasons/${id}`);
      return response.data; // Assuming the API returns the reason object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addReason = createAsyncThunk(
  "/addReason",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/reasonCancellation/create`, data);
      if (response.status === 200) {
        return response.data.reasonCancellation; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editReason = createAsyncThunk(
  "/editReason",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/reasons/update/${data.get('id')}`, data);
      if (response.status === 200) {
        return response.data.reason; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteReason = createAsyncThunk(
  "/deleteReason",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/reasons/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllReason = createAsyncThunk(
  "/deleteAllReason",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/reasonCancellation/alldelete`);
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateStatusReason = createAsyncThunk(
  "/updateStatusReason",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/reasonCancellation/updatestatus/${id}`, { status });
      return response.data.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const reasonsSlice = createSlice({
  name: "reason",
  initialState: {
    reasons: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // getAllReason
      .addCase(getAllReason.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getAllReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch data";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    //   getSingleReason
      .addCase(getSingleReason.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSingleReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSingleReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   addReason
      .addCase(addReason.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(addReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = [...state.reasons, action.payload];
        state.message = action.payload?.message || "Reason created successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(addReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create reason";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   deleteReason
      .addCase(deleteReason.pending, (state) => {
        state.loading = true;
        state.message = "Deleting reason...";
      })
      .addCase(deleteReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = state.reasons.filter((user) => user.id !== action.payload);
        state.message = action.payload?.message || "Reason deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete reason";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   editReason
      .addCase(editReason.pending, (state) => {
        state.loading = true;
        state.message = "Update reason...";
      })
      .addCase(editReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = state.reasons.map((v) => v.id == action.payload.id ? action.payload  :  v);
        state.message = action.payload?.message || "Reason updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(editReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update reason";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   deleteAllReason

      .addCase(deleteAllReason.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all reason...";
      })
      .addCase(deleteAllReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = []; 
        state.message = action.payload || "All reason deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteAllReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all reason";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   updateStatusReason
      .addCase(updateStatusReason.pending, (state) => {
        state.loading = true;
        state.message = "Update reason...";
      })
      .addCase(updateStatusReason.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.reasons = state.reasons.map((v) => v.id == action.payload.id ? action.payload  :  v);
        state.message = action.payload?.message || "Reason status updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(updateStatusReason.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update reason status";
        enqueueSnackbar(state.message, { variant: 'error' })
      });
  },
});

export default reasonsSlice.reducer;
