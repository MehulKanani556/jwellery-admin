import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import axiosInstance from '../../utils/axiosInstance';


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
            await axiosInstance.get(`/reviews/deleteAll`);
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
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All reviews fetched successfully';
                state.reviews = action.payload;
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all reviews';
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload); // Add the new review to the reviews array
                state.message = 'Review added successfully';
            })
            .addCase(addReview.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add review';
            })
            .addCase(editReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex(review => review.id === action.payload.id);
                if (index !== -1) {
                    state.reviews[index] = action.payload; // Update the review in the reviews array
                    state.message = 'Review edited successfully';
                }
            })
            .addCase(editReview.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit review';
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter(review => review.id !== action.payload); // Remove the deleted review
                state.message = 'Review deleted successfully';
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete review';
            })
            .addCase(deleteAllReviews.fulfilled, (state) => {
                state.reviews = []; // Clear the reviews array
                state.message = 'All reviews deleted successfully';
            })
            .addCase(deleteAllReviews.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all reviews';
            });
    }
});

export default reviewsSlice.reducer;
