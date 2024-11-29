import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import axiosInstance from '../../utils/axiosInstance';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/products/getall`);
            return response.data.data; // Assuming the API returns an array of products
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async ({ name, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/products/create`, { name, size });
            return response.data.product; // Assuming the API returns the added product
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editProduct = createAsyncThunk(
    'product/editProduct',
    async ({ id, name, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/products/update/${id}`, { name, size });
            return response.data.product; // Assuming the API returns the updated product
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
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
    'product/deleteAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.get(`/products/deleteAll`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const productsSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        currProducts: null,
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All products fetched successfully';
                state.products = action.payload;
                // console.log(state.products)
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all products';
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload); // Add the new product to the products array
                state.message = 'Product added successfully';
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add product';
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload; // Update the product in the products array
                    state.message = 'Product edited successfully';
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit product';
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload); // Remove the deleted product
                state.message = 'Product deleted successfully';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete product';
            })
            .addCase(deleteAllProducts.fulfilled, (state) => {
                state.products = []; // Clear the products array
                state.message = 'All products deleted successfully';
            })
            .addCase(deleteAllProducts.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all products';
            });
    }
});

export default productsSlice.reducer;
