import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import sessionStorage from "redux-persist/es/storage/session";
import { BASE_URL } from "../../utils/BaseUrl";

// Create an Axios instance
const axiosInstance = axios.create();

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
    const token = sessionStorage.getItem("token") // Retrieve the token from session storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Set the token in the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAllSubCategory = createAsyncThunk(
  "/getAllSubCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/subcategories/getall`);
      console.log(response);
      
      return response.data.subCategories; // Assuming the API returns an array of users
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleSubCategory = createAsyncThunk(
  "/getSingleSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/subcategories/get/${id}`);
      return response.data.subCategories; // Assuming the API returns the user object
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addSubCategory = createAsyncThunk(
  "/addSubCategory",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/subcategories/create`, { name });
      if (response.status === 200) {
        console.log(response);
        return response.data.subCategories; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editSubCategory = createAsyncThunk(
    "/editSubCategory",
    async ({ data }, { rejectWithValue }) => {
      console.log(data);
      
      try {
        const response = await axiosInstance.post(`${BASE_URL}/subcategories/update/${data.id}`, { name:data.name });
        if (response.status === 200) {
          console.log(response);
          
          return response.data.subCategories; // Assuming the API returns a success message
        }
      } catch (error) {
        return handleErrors(error, null, rejectWithValue);
      }
    }
  );

export const deleteSubCategory = createAsyncThunk(
  "/deleteSubCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("Deleting user with ID:", id);
      const response = await axiosInstance.delete(`${BASE_URL}/subcategories/delete/${id}`);
      if (response.status === 200) {
        return id; // Assuming the API returns a success message
      }
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllSubCategory = createAsyncThunk(
  "/deleteAllSubCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${BASE_URL}/subcategories/delete`); // Assuming the API supports deleting all users
      return response.data; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const updateStatusSubCategory = createAsyncThunk(
  "/updateStatusSubCategory",
  async ({ id,status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/subcategories/updatestatus/${id}`, { status }); // Assuming the API supports deleting all users
      console.log(response);
      
      return response.data.subCategories; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const subcategorysSlice = createSlice({
  name: "SubCategory",
  initialState: {
    SubCategory: [],
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // getAllSubCategory
      .addCase(getAllSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getAllSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getAllSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })
    //   getSingleSubCategory
      .addCase(getSingleSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(getSingleSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = action.payload;
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(getSingleSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })
    //   addSubCategory
      .addCase(addSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Data is being fetched";
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = [...state.SubCategory, action.payload];
        state.message = action.payload?.message || "Data is fetched successfully";
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to Data fetched";
      })
    //   deleteSubCategory
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Deleting SubCategory...";
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = state.SubCategory.filter((user) => user.id !== action.payload);
        state.message = action.payload?.message || "SubCategory deleted successfully";
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete SubCategory";
      })
    //   editSubCategory
      .addCase(editSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Update SubCategory...";
      })
      .addCase(editSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = state.SubCategory.map((v) => v.id == action.payload.id ? action.payload  :  v);
        state.message = action.payload?.message || "Update successfully";
      })
      .addCase(editSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete SubCategory";
      })
    //   deleteAllSubCategory

      .addCase(deleteAllSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Deleting all SubCategory...";
      })
      .addCase(deleteAllSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = []; 
        state.message = action.payload || "All SubCategory deleted successfully";
      })
      .addCase(deleteAllSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete all SubCategory";
      })

      //   updateStatusSubCategory
      .addCase(updateStatusSubCategory.pending, (state) => {
        state.loading = true;
        state.message = "Update SubCategory...";
      })
      .addCase(updateStatusSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.SubCategory = state.SubCategory.map((v) => v.id == action.payload.id ? action.payload  :  v);
        state.message = action.payload?.message || "Update successfully";
      })
      .addCase(updateStatusSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete SubCategory";
      });
  },
});

export default subcategorysSlice.reducer;
