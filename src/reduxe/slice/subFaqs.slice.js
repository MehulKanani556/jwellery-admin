import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";


const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllSubFaqs = createAsyncThunk(
  "/getAllSubFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subfaqs/getall`);
      // console.log(response);

      return response.data.subfaqs; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleSubFaqs = createAsyncThunk(
  "/getSingleSubFaqs",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subfaqs/get/${id}`);
        return response.data.subfaqs; // Assuming the API returns the user object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addSubFaqs = createAsyncThunk(
  "/addSubFaqs",
  async (data, { rejectWithValue }) => {
    // console.log(data);
    try {
      const response = await axiosInstance.post(`/subfaqs/create`, data);
      if (response.status === 200) {
        console.log(response);
        return response.data.subfaq; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editSubFaqs = createAsyncThunk(
  "/editSubFaqs",
  async (values, { rejectWithValue }) => {
    console.log(values);

    try {
      const response = await axiosInstance.post(`/subfaqs/update/${values.id}`, values);
      if (response.status === 200) {
        console.log(response);

        return response.data.subfaq; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteSubFaqs = createAsyncThunk(
  "/deleteSubFaqs",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("Deleting user with ID:", id);
      const response = await axiosInstance.delete(`/subfaqs/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllSubFaqs = createAsyncThunk(
  "/deleteAllSubFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/subfaqs/allDelete`); // Assuming the API supports deleting all users
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const subFaqsSlice = createSlice({
  name: "subFaqs",
  initialState: {
    subFaqs: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(getAllSubFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getAllSubFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subFaqs = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllSubFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })
  
      .addCase(getSingleSubFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSingleSubFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
          state.subFaqs = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSingleSubFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })

      .addCase(addSubFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Adding Faqs...";
      })
      .addCase(addSubFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subFaqs = [...state.subFaqs, action.payload];
        state.message = action.payload?.message || "Faqs created successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(addSubFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })

      .addCase(deleteSubFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Deleting Faqs...";
      })
      .addCase(deleteSubFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subFaqs = state.subFaqs.filter((user) => user.id !== action.payload);
        state.message = action.payload?.message || "Faqs deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteSubFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
 
      .addCase(editSubFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Update Faqs...";
      })
      .addCase(editSubFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subFaqs = state.subFaqs.map((v) => v.id == action.payload.id ? { ...v, ...action.payload } : v);
        state.message = action.payload?.message || "Faqs updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(editSubFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
  

      .addCase(deleteAllSubFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all Faqs...";
      })
      .addCase(deleteAllSubFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subFaqs = [];
        state.message = action.payload || "All Faqs deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteAllSubFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
  },
});

export default subFaqsSlice.reducer;
