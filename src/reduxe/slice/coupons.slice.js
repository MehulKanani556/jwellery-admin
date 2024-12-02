import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllCoupons = createAsyncThunk(
    'coupon/getAllCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/coupons/getall`);
            return response.data.coupons; // Assuming the API returns an array of coupons
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addCoupon = createAsyncThunk(
    'coupon/addCoupon',
    async (values, { rejectWithValue }) => {
        try {
            console.log("asa")
            const response = await axiosInstance.post(`/coupons/create`,values);
            return response.data.coupon; // Assuming the API returns the added coupon
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editCoupon = createAsyncThunk(
    'coupon/editCoupon',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/coupons/update/${values.id}`, values);
            return response.data.coupon; // Assuming the API returns the updated coupon
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    'coupon/deleteCoupon',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/coupons/delete/${id}`);
            return id; // Return the id of the deleted coupon
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllCoupons = createAsyncThunk(
    'coupon/deleteAllCoupons',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/coupons/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const updateStatusCoupon = createAsyncThunk(
    'coupon/updateStatusCoupon',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/coupons/updatestatus/${id}`, { status });
            return response.data.coupon; // Assuming the API returns the updated coupon
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);



const couponsSlice = createSlice({
    name: 'coupon',
    initialState: {
        coupons: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All coupons fetched successfully';
                state.coupons = action.payload;
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all coupons';
            })
            .addCase(addCoupon.fulfilled, (state, action) => {
                state.coupons.push(action.payload); // Add the new coupon to the coupons array
                state.message = 'Coupon added successfully';
            })
            .addCase(addCoupon.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add coupon';
            })
            .addCase(editCoupon.fulfilled, (state, action) => {
                const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
                if (index !== -1) {
                    state.coupons[index] = action.payload; // Update the coupon in the coupons array
                    state.message = 'Coupon edited successfully';
                }
            })
            .addCase(editCoupon.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit coupon';
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload); // Remove the deleted coupon
                state.message = 'Coupon deleted successfully';
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete coupon';
            })
            .addCase(deleteAllCoupons.fulfilled, (state) => {
                state.coupons = []; // Clear the coupons array
                state.message = 'All coupons deleted successfully';
            })
            .addCase(deleteAllCoupons.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all coupons';
            })
            .addCase(updateStatusCoupon.fulfilled, (state, action) => {
                const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
                if (index !== -1) {
                    state.coupons[index] = action.payload; // Update the coupon status in the coupons array
                    state.message = 'Coupon status updated successfully';
                }
            })
            .addCase(updateStatusCoupon.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to update coupon status';
            });
    }
});

export default couponsSlice.reducer;
