import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";



const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllPrivacyPolicies = createAsyncThunk(
  "/getAllPrivacyPolicies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/privacypolicies/getall`);
      return response.data.data; // Assuming the API returns an array of privacy policies
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSinglePrivacyPolicy = createAsyncThunk(
  "/getSinglePrivacyPolicy",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/privacypolicies/${id}`);
      return response.data; // Assuming the API returns the privacy policy object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addPrivacyPolicy = createAsyncThunk(
  "/addPrivacyPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/privacypolicies/create`, data);
      if (response.status === 200) {
        return response.data.data; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editPrivacyPolicy = createAsyncThunk(
  "/editPrivacyPolicy",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/privacypolicies/update/${data.id}`, data);
      if (response.status === 200) {
        return response.data.data; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deletePrivacyPolicy = createAsyncThunk(
  "/deletePrivacyPolicy",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/privacypolicies/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllPrivacyPolicies = createAsyncThunk(
  "/deleteAllPrivacyPolicies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/privacypolicies/allDelete`);
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateStatusPrivacyPolicy = createAsyncThunk(
  "/updateStatusPrivacyPolicy",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/privacypolicies/updatestatus/${id}`, { status });
      return response.data.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const privacySlice = createSlice({
  name: "privacy",
  initialState: {
    policies: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // getAllPrivacyPolicies
      .addCase(getAllPrivacyPolicies.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getAllPrivacyPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllPrivacyPolicies.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch data";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // getSinglePrivacyPolicy
      .addCase(getSinglePrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSinglePrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSinglePrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to fetch data";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // addPrivacyPolicy
      .addCase(addPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(addPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = [...state.policies, action.payload];
        state.message = action.payload?.message || "Policy created successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(addPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create policy";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // deletePrivacyPolicy
      .addCase(deletePrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.message = "Deleting policy...";
      })
      .addCase(deletePrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = state.policies.filter((policy) => policy.id !== action.payload);
        state.message = action.payload?.message || "Policy deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(deletePrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete policy";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // editPrivacyPolicy
      .addCase(editPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.message = "Updating policy...";
      })
      .addCase(editPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = state.policies.map((v) => v.id == action.payload.id ? action.payload : v);
        state.message = action.payload?.message || "Policy updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(editPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update policy";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // deleteAllPrivacyPolicies
      .addCase(deleteAllPrivacyPolicies.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all policies...";
      })
      .addCase(deleteAllPrivacyPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = [];
        state.message = action.payload || "All policies deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(deleteAllPrivacyPolicies.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all policies";
        enqueueSnackbar(state.message, { variant: 'error' });
      })
    // updateStatusPrivacyPolicy
      .addCase(updateStatusPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.message = "Updating policy status...";
      })
      .addCase(updateStatusPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.policies = state.policies.map((v) => v.id == action.payload.id ? action.payload : v);
        state.message = action.payload?.message || "Policy status updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' });
      })
      .addCase(updateStatusPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update policy status";
        enqueueSnackbar(state.message, { variant: 'error' });
      });
  },
});

export default privacySlice.reducer;
