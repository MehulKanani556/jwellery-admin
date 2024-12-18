import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

const handleErrors = (error, dispatch, rejectWithValue) => {
  const errorMessage = error.response?.data?.message || "An error occurred";

  return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/getall`);
      return response.data.data; // Assuming the API returns an array of products
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const getSingleProducts = createAsyncThunk(
  "product/getSingleProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/get/${id}`);
      return response.data.data; // Assuming the API returns an array of products
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, { rejectWithValue }) => {
    // Format the data object
    const formData = new FormData();

    // Add all fields to FormData
    formData.append("product_name", data.product_name);
    formData.append("category_id", data.category_id);
    formData.append("sub_category_id", data.sub_category_id);
    formData.append("metal_color", data.metal_color);
    formData.append("metal", data.metal);
    formData.append("diamond_color", data.diamond_color);
    formData.append(
      "diamond_quality",
      Array.isArray(data.diamond_quality)
        ? data.diamond_quality.join(",")
        : data.diamond_quality
    );
    formData.append("no_of_diamonds", data.no_of_diamonds);
    formData.append("clarity", data.clarity);
    formData.append("size_id", data.size_id);
    formData.append("size_name", data.size_name);
    formData.append("weight", data.weight);
    formData.append(
      "diamond_setting",
      Array.isArray(data.diamond_setting)
        ? data.diamond_setting.join(",")
        : data.diamond_setting
    );
    formData.append("diamond_shape", data.diamond_shape);
    formData.append("collection", data.collection);
    formData.append("gender", data.gender);
    formData.append("qty", data.qty);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("description", data.description);
    formData.append("occasion", data.occasion);
    formData.append("gram", data.gram);
    formData.append("stone", data.stone);
    formData.append("stone_price", data.stone_price);
    formData.append("making_charge", data.making_charge);
    formData.append("status", data.status);
    formData.append('water_resistant', data.water_resistant);
    formData.append('cash_material', data.cash_material);
    formData.append('movement', data.movement);
    formData.append('clasp_type', data.clasp_type);
    formData.append('reference_number', data.reference_number);
    formData.append('warranty', data.warranty);




    if (Array.isArray(data.mediaFiles)) {
      data.mediaFiles.forEach((image, index) => {
        formData.append(`image[${index}]`, image);
      });
      console.log(formData);
    } else {
      formData.append("image", data.mediaFiles);
    }
    try {
      const response = await axiosInstance.post(`/products/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({ data, id }, { rejectWithValue }) => {
    // Format the data object
    console.log(data);

    const formData = new FormData();

    // Add all fields to FormData
    formData.append("product_name", data.product_name);
    formData.append("category_id", data.category_id);
    formData.append("sub_category_id", data.sub_category_id);
    formData.append("metal_color", data.metal_color);
    formData.append("metal", data.metal);
    formData.append("diamond_color", data.diamond_color);
    formData.append(
      "diamond_quality",
      Array.isArray(data.diamond_quality)
        ? data.diamond_quality.join(",")
        : data.diamond_quality
    );
    formData.append("no_of_diamonds", data.no_of_diamonds);
    formData.append("clarity", data.clarity);
    formData.append("size_id", data.size_id);
    formData.append("size_name", data.size_name);
    formData.append("weight", data.weight);
    formData.append(
      "diamond_setting",
      Array.isArray(data.diamond_setting)
        ? data.diamond_setting.join(",")
        : data.diamond_setting
    );
    formData.append("diamond_shape", data.diamond_shape);
    formData.append("collection", data.collection);
    formData.append("gender", data.gender);
    formData.append("qty", data.qty);
    formData.append("price", data.price);
    formData.append("discount", data.discount);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("occasion", data.occasion);
    formData.append("gram", data.gram);
    formData.append("stone", data.stone);
    formData.append("stone_price", data.stone_price);
    formData.append("making_charge", data.making_charge);
    formData.append('water_resistant', data.water_resistant);
    formData.append('cash_material', data.cash_material);
    formData.append('movement', data.movement);
    formData.append('clasp_type', data.clasp_type);
    formData.append('reference_number', data.reference_number);
    formData.append('warranty', data.warranty);

    if (Array.isArray(data.mediaFiles)) {
      data.mediaFiles.forEach((media, index) => {
        if (typeof media === "string") {
          formData.append(`image[${index}][url]`, media);
        } else {
          formData.append(`image[${index}][file]`, media, media.name);
        }
      });
    } else if (data.mediaFiles) {
      if (typeof data.mediaFiles === "string") {
        formData.append("image[url]", data.mediaFiles);
      } else {
        formData.append("image[file]", data.mediaFiles, data.mediaFiles.name);
      }
    }
    // if (Array.isArray(data.mediaFiles)) {
    //     data.mediaFiles.forEach((image, index) => {
    //         formData.append(`image[${index}]`, image);
    //     });
    //     console.log(formData);
    // } else {
    //     formData.append('image', data.mediaFiles);
    // }

    try {
      const response = await axiosInstance.post(
        `/products/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      return response.data.data; // Assuming the API returns the updated product
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/delete/${id}`);
      return id; // Return the id of the deleted product
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

export const deleteAllProducts = createAsyncThunk(
  "product/deleteAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get(`/products/deleteAll`);
      return; // No need to return anything for delete all
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);
export const updateStatusProduct = createAsyncThunk(
  "/updateStatusProduct",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/products/updatestatus/${id}`,
        { status }
      ); // Assuming the API supports deleting all users
      // console.log(response.data.product.status);

      return { id, status }; // Assuming the API returns a success message
    } catch (error) {
      return handleErrors(error, null, rejectWithValue);
    }
  }
);

const productsSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    currProducts: null,
    success: false,
    message: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllProducts.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "All products fetched successfully";
        state.products = action.payload;
        // console.log(state.products)
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message =
          action.payload?.message || "Failed to fetch all products";
        enqueueSnackbar(state.message, { variant: "error" });
      })
      .addCase(getSingleProducts.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(getSingleProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "products fetched successfully";
        state.products = action.payload;
        // console.log(state.products)
      })

      .addCase(getSingleProducts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message =
          action.payload?.message || "Failed to fetch all products";
        enqueueSnackbar(state.message, { variant: "error" });
      })


      .addCase(addProduct.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload); // Add the new product to the products array
        state.message =
          action.payload?.message || "Product created successfully";
        state.loading = false;
        state.success = true;
        enqueueSnackbar(state.message, { variant: "success" });
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to create product";
        enqueueSnackbar(state.message, { variant: "error" });
      })
      .addCase(editProduct.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // Ensure state.products is an array
        if (!Array.isArray(state.products)) {
          state.products = [];
        }

        // Find and update the product
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }

        state.message = action.payload?.message || "Product updated successfully";
        enqueueSnackbar(state.message, { variant: "success" });
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to update product";
        enqueueSnackbar(state.message, { variant: "error" });
      })

      .addCase(deleteProduct.pending, (state, action) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        ); // Remove the deleted product
        state.message =
          action.payload?.message || "Product deleted successfully";
        enqueueSnackbar(state.message, { variant: "success" });
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.message || "Failed to delete product";
        enqueueSnackbar(state.message, { variant: "error" });
      })
      .addCase(deleteAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = []; // Clear the products array
        state.message =
          action.payload?.message || "All products deleted successfully";
        enqueueSnackbar(state.message, { variant: "success" });
      })
      .addCase(deleteAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message =
          action.payload?.message || "Failed to delete all products";
        enqueueSnackbar(state.message, { variant: "error" });
      })
      .addCase(updateStatusProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            status: action.payload.status,
          }; // Update the product in the products array
          state.message =
            action.payload?.message || "Product status updated successfully";
          enqueueSnackbar(state.message, { variant: "success" });
        }
      })
      .addCase(updateStatusProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message =
          action.payload?.message || "Failed to update product status";
        enqueueSnackbar(state.message, { variant: "error" });
      });
  },
});

export default productsSlice.reducer;
