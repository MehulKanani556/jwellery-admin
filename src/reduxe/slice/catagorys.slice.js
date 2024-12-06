import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";



const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllCategory = createAsyncThunk(
  "/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/categories/getall`);

      return response.data.categories; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleCategory = createAsyncThunk(
  "/getSingleCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data; // Assuming the API returns the user object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addCategory = createAsyncThunk(
  "/addCategory",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/categories/create`, { name });
      if (response.status === 200) {
        console.log(response);
        return response.data.category; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editCategory = createAsyncThunk(
    "/editCategory",
    async ({ data }, { rejectWithValue }) => {
      console.log(data);
      
      try {
        const response = await axiosInstance.post(`/categories/update/${data.id}`, { name:data.name });
        if (response.status === 200) {
          console.log(response);
          
          return response.data.category; // Assuming the API returns a success message
        }
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );

export const deleteCategory = createAsyncThunk(
  "/deleteCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("Deleting user with ID:", id);
      const response = await axiosInstance.delete(`/categories/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllCategory = createAsyncThunk(
  "/deleteAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/categories/delete`); // Assuming the API supports deleting all users
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateStatusCategory = createAsyncThunk(
  "/updateStatusCategory",
  async ({ id,status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/categories/updatestatus/${id}`, { status }); // Assuming the API supports deleting all users
      console.log(response);
      
      return response.data.category; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const categorysSlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // getAllCategory
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";

      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   getSingleCategory
      .addCase(getSingleCategory.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSingleCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   addCategory
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = [...state.category, action.payload];
        state.message = action.payload?.message || "Category created successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create category";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.message = "Deleting category...";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = state.category.filter((user) => user.id !== action.payload);
        state.message = action.payload?.message || "Category deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete category";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   editCategory
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.message = "Update category...";
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = state.category.map((v) => v.id == action.payload.id ? action.payload  :  v);
        state.message = action.payload?.message || "Category updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update category";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   deleteAllCategory

      .addCase(deleteAllCategory.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all category...";
      })
      .addCase(deleteAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = []; 
        state.message = action.payload || "All category deleted successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(deleteAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all category";
        enqueueSnackbar(state.message, { variant: 'error' })
      })
    //   updateStatusCategory
      .addCase(updateStatusCategory.pending, (state) => {
        state.loading = true;
        state.message = "Update category...";
      })
      .addCase(updateStatusCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.category = state.category.map((v) => v.id == action.payload.id ? action.payload  :  v);
        state.message = action.payload?.message || "Category status updated successfully";
        enqueueSnackbar(state.message, { variant: 'success' })
      })
      .addCase(updateStatusCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update category status";
        enqueueSnackbar(state.message, { variant: 'error' })
      });
  },
});

export default categorysSlice.reducer;
