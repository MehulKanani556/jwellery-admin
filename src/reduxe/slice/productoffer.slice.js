import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllProductOffers = createAsyncThunk(
    'productOffer/getAllProductOffers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/productoffers/getall`);
            return response.data.productOffers; // Assuming the API returns an array of product offers
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addProductOffer = createAsyncThunk(
    'productOffer/addProductOffer',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/productoffers/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.productOffer; // Assuming the API returns the added product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editProductOffer = createAsyncThunk(
    'productOffer/editProductOffer',
    async (values, { rejectWithValue }) => {
        try {
            console.log(values)
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/productoffers/update/${values.id}`, formData,{
                headers: {
                    'Content-Type':'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.productOffer; // Assuming the API returns the updated product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteProductOffer = createAsyncThunk(
    'productOffer/deleteProductOffer',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/productoffers/delete/${id}`);
            return id; // Return the id of the deleted product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllProductOffers = createAsyncThunk(
    'productOffer/deleteAllProductOffers',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/productoffers/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const updateStatusProductOffer = createAsyncThunk(
    'productOffer/updateStatusProductOffer',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/productoffers/updatestatus/${id}`, { status });
            return response.data.productOffer; // Assuming the API returns the updated product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const productOffersSlice = createSlice({
    name: 'productOffer',
    initialState: {
        productOffers: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProductOffers.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllProductOffers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All product offers fetched successfully';
                state.productOffers = action.payload;
            })
            .addCase(getAllProductOffers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all product offers';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(addProductOffer.pending, (state) => {
                state.loading = true
            })
            .addCase(addProductOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productOffers.push(action.payload); // Add the new product offer to the productOffers array
                state.message = action.payload?.message || "Product offer created successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(addProductOffer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create product offer';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(editProductOffer.pending, (state) => {
                state.loading = true
            })
            .addCase(editProductOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.productOffers.findIndex(offer => offer.id === action.payload.id);
                if (index !== -1) {
                    state.productOffers[index] = action.payload; // Update the product offer in the productOffers array
                    state.message = action.payload?.message || "Product offer updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(editProductOffer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update product offer';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteProductOffer.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteProductOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productOffers = state.productOffers.filter(offer => offer.id !== action.payload); // Remove the deleted product offer
                state.message = action.payload?.message || "Product offer deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteProductOffer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete product offer';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteAllProductOffers.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllProductOffers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productOffers = []; // Clear the productOffers array
                state.message = action.payload?.message || "All product offers deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteAllProductOffers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all product offers';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(updateStatusProductOffer.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.productOffers.findIndex(offer => offer.id === action.payload.id);
                if (index !== -1) {
                    state.productOffers[index] = action.payload; // Update the product offer status in the productOffers array
                    state.message = action.payload?.message || "Product offer status updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(updateStatusProductOffer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update product offer status';
                enqueueSnackbar(state.message, { variant: 'error' })
            });
    }
});

export default productOffersSlice.reducer;
