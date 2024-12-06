import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import axiosInstance from '../../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllReviews = createAsyncThunk(
    'review/getAllReviews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/reviews/getall`);
            return response.data.data; // Assuming the API returns an array of reviews
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addReview = createAsyncThunk(
    'review/addReview',
    async ({ productId, content }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/reviews/create`, { productId, content });
            return response.data.review; // Assuming the API returns the added review
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editReview = createAsyncThunk(
    'review/editReview',
    async ({ id, content }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/reviews/update/${id}`, { content });
            return response.data.review; // Assuming the API returns the updated review
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteReview = createAsyncThunk(
    'review/deleteReview',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/reviews/delete/${id}`);
            return id; // Return the id of the deleted review
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllReviews = createAsyncThunk(
    'review/deleteAllReviews',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/reviews/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const reviewsSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReviews.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "All reviews fetched successfully";
                state.reviews = action.payload;
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all reviews';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(addReview.pending, (state) => {
                state.loading = true
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews.push(action.payload); // Add the new review to the reviews array
                state.message = action.payload?.message || "Review created successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create review';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(editReview.pending, (state) => {
                state.loading = true
            })
            .addCase(editReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload; // Update the review in the reviews array
                    state.message = action.payload?.message || "Review updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(editReview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update review';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteReview.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews = state.reviews.filter(review => review.id !== action.payload); // Remove the deleted review
                state.message = action.payload?.message || "Review deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete review';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteAllReviews.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews = []; // Clear the reviews array
                state.message = action.payload?.message || "All reviews deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all reviews';
                enqueueSnackbar(state.message, { variant: 'error' })
            });
    }
});

export default reviewsSlice.reducer;
