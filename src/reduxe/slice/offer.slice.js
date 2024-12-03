import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllOffers = createAsyncThunk(
    'offer/getAllOffers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/offers/getall`);
            return response.data.offers; // Assuming the API returns an array of product offers
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addOffer = createAsyncThunk(
    'offer/addOffer',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/offers/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.offer; // Assuming the API returns the added product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editOffer = createAsyncThunk(
    'offer/editOffer',
    async (values, { rejectWithValue }) => {
        try {
            console.log(values)
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/offers/update/${values.id}`, formData,{
                headers: {
                    'Content-Type':'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.offer; // Assuming the API returns the updated product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteOffer = createAsyncThunk(
    'offer/deleteOffer',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/offers/delete/${id}`);
            return id; // Return the id of the deleted product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllOffers = createAsyncThunk(
    'offer/deleteAllOffers',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/offers/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const updateStatusOffer = createAsyncThunk(
    'offer/updateStatusOffer',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/offers/updatestatus/${id}`, { status });
            return response.data.offer; // Assuming the API returns the updated product offer
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const offersSlice = createSlice({
    name: 'offer',
    initialState: {
        offers: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllOffers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All product offers fetched successfully';
                state.offers = action.payload;
            })
            .addCase(getAllOffers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all product offers';
            })
            .addCase(addOffer.fulfilled, (state, action) => {
                state.offers.push(action.payload); // Add the new product offer to the offers array
                state.message = 'Product offer added successfully';
            })
            .addCase(addOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add product offer';
            })
            .addCase(editOffer.fulfilled, (state, action) => {
                const index = state.offers.findIndex(offer => offer.id === action.payload.id);
                if (index !== -1) {
                    state.offers[index] = action.payload; // Update the product offer in the offers array
                    state.message = 'Product offer edited successfully';
                }
            })
            .addCase(editOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit product offer';
            })
            .addCase(deleteOffer.fulfilled, (state, action) => {
                state.offers = state.offers.filter(offer => offer.id !== action.payload); // Remove the deleted product offer
                state.message = 'Product offer deleted successfully';
            })
            .addCase(deleteOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete product offer';
            })
            .addCase(deleteAllOffers.fulfilled, (state) => {
                state.offers = []; // Clear the offers array
                state.message = 'All product offers deleted successfully';
            })
            .addCase(deleteAllOffers.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all product offers';
            })
            .addCase(updateStatusOffer.fulfilled, (state, action) => {
                
                const index = state.offers.findIndex(offer => offer.id === action.payload.id);
                if (index !== -1) {
                    state.offers[index] = action.payload; // Update the product offer status in the offers array
                    state.message = 'Product offer status updated successfully';
                }
            })
            .addCase(updateStatusOffer.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to update product offer status';
            });
    }
});

export default offersSlice.reducer;
