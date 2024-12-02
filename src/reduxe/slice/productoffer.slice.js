import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


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
            })
            .addCase(addProductOffer.fulfilled, (state, action) => {
                state.productOffers.push(action.payload); // Add the new product offer to the productOffers array
                state.message = 'Product offer added successfully';
            })
            .addCase(addProductOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add product offer';
            })
            .addCase(editProductOffer.fulfilled, (state, action) => {
                const index = state.productOffers.findIndex(offer => offer.id === action.payload.id);
                if (index !== -1) {
                    state.productOffers[index] = action.payload; // Update the product offer in the productOffers array
                    state.message = 'Product offer edited successfully';
                }
            })
            .addCase(editProductOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit product offer';
            })
            .addCase(deleteProductOffer.fulfilled, (state, action) => {
                state.productOffers = state.productOffers.filter(offer => offer.id !== action.payload); // Remove the deleted product offer
                state.message = 'Product offer deleted successfully';
            })
            .addCase(deleteProductOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete product offer';
            })
            .addCase(deleteAllProductOffers.fulfilled, (state) => {
                state.productOffers = []; // Clear the productOffers array
                state.message = 'All product offers deleted successfully';
            })
            .addCase(deleteAllProductOffers.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all product offers';
            })
            .addCase(updateStatusProductOffer.fulfilled, (state, action) => {
                
                const index = state.productOffers.findIndex(offer => offer.id === action.payload.id);
                if (index !== -1) {
                    state.productOffers[index] = action.payload; // Update the product offer status in the productOffers array
                    state.message = 'Product offer status updated successfully';
                }
            })
            .addCase(updateStatusProductOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to update product offer status';
            });
    }
});

export default productOffersSlice.reducer;
