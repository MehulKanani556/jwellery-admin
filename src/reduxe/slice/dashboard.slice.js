import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getDashboard = createAsyncThunk(
    'auth/getDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/dashboard`);
            return response.data.data; // Assuming the API returns an array of product offers
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        dashbaords: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                state.dashboardData = action.payload; // Assuming you want to store the dashboard data
                enqueueSnackbar("Dashboard data fetched successfully", { variant: 'success' });
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch dashboard data";
                enqueueSnackbar(state.error, { variant: 'error' });
            });
    }
});

export default dashboardSlice.reducer;
