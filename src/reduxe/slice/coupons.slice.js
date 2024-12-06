import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';

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
            .addCase(getAllCoupons.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all coupons';
            })
            .addCase(addCoupon.fulfilled, (state, action) => {
                state.coupons.push(action.payload); // Add the new coupon to the coupons array
                state.message = action.payload?.message || "Coupon created successfully";
                state.loading = false;
                state.success = true;
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(addCoupon.pending, (state) => {
                state.loading = true
            })
            .addCase(addCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create coupon';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(editCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
                if (index !== -1) {
                    state.coupons[index] = action.payload; // Update the coupon in the coupons array
                    state.message = action.payload?.message || "Coupon updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(editCoupon.pending, (state) => {
                state.loading = true
            })
            .addCase(editCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update coupon';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter(coupon => coupon.id !== action.payload); // Remove the deleted coupon
                state.message = action.payload?.message || "Coupon deleted successfully";
                state.loading = false;
                state.success = true;
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteCoupon.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete coupon';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteAllCoupons.fulfilled, (state, action) => {
                state.coupons = []; // Clear the coupons array
                state.message = action.payload?.message || "All coupons deleted successfully";
                state.loading = false;
                state.success = true;
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteAllCoupons.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all coupons';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(updateStatusCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.coupons.findIndex(coupon => coupon.id === action.payload.id);
                if (index !== -1) {
                    state.coupons[index] = action.payload; // Update the coupon status in the coupons array
                    state.message = action.payload?.message || "Coupon status updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            // .addCase(updateStatusCoupon.pending, (state) => {
            //     state.loading = true
            // })
            .addCase(updateStatusCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update coupon status';
                enqueueSnackbar(state.message, { variant: 'error' })
            });
    }
});

export default couponsSlice.reducer;
