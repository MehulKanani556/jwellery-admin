import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";


const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllFaqs = createAsyncThunk(
  "/getAllFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/faqs/getall`);
      // console.log(response);

      return response.data.faqs; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleFaqs = createAsyncThunk(
  "/getSingleFaqs",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/faqs/get/${id}`);
        return response.data.faqs; // Assuming the API returns the user object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addFaqs = createAsyncThunk(
  "/addFaqs",
  async (data, { rejectWithValue }) => {
    // console.log(data);
    try {
      const response = await axiosInstance.post(`/faqs/create`, data);
      if (response.status === 200) {
        console.log(response);
        return response.data.faq; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editFaqs = createAsyncThunk(
  "/editFaqs",
  async (values, { rejectWithValue }) => {
    console.log(values);

    try {
      const response = await axiosInstance.post(`/faqs/update/${values.id}`, values);
      if (response.status === 200) {
        console.log(response);

        return response.data.faq; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteFaqs = createAsyncThunk(
  "/deleteFaqs",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("Deleting user with ID:", id);
      const response = await axiosInstance.delete(`/faqs/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllFaqs = createAsyncThunk(
  "/deleteAllFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/faqs/allDelete`); // Assuming the API supports deleting all users
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const faqsSlice = createSlice({
  name: "Faqs",
  initialState: {
    faqs: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(getAllFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getAllFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.faqs = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })
  
      .addCase(getSingleFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSingleFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
          state.faqs = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSingleFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })

      .addCase(addFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Adding Faqs...";
      })
      .addCase(addFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.faqs = [...state.faqs, action.payload];
        state.message = action.payload?.message || "Faqs created successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(addFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })

      .addCase(deleteFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Deleting Faqs...";
      })
      .addCase(deleteFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.faqs = state.faqs.filter((user) => user.id !== action.payload);
        state.message = action.payload?.message || "Faqs deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
 
      .addCase(editFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Update Faqs...";
      })
      .addCase(editFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.faqs = state.faqs.map((v) => v.id == action.payload.id ? { ...v, ...action.payload } : v);
        state.message = action.payload?.message || "Faqs updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(editFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
  

      .addCase(deleteAllFaqs.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all Faqs...";
      })
      .addCase(deleteAllFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.faqs = [];
        state.message = action.payload || "All Faqs deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteAllFaqs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all Faqs";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
  },
});

export default faqsSlice.reducer;
