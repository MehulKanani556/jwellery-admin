import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import { BASE_URL } from '../../utils/BaseUrl';
import { enqueueSnackbar } from 'notistack';

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
   
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {
           
            
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            if (response.status == 200) {            
                console.log(response)
              
                localStorage.setItem("userId", response.data.result.id);
                sessionStorage.setItem("userId", response.data.result.id);
                sessionStorage.setItem("token", response.data.result.access_token);
                sessionStorage.setItem("email", response.data.result.email);
                sessionStorage.setItem("role", response.data.result.role);
                return response.data.result;
            } else {
                return rejectWithValue({ message: `Login failed with status: ${response.status}` });
            }
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({email}, { rejectWithValue }) => {
        try {
            sessionStorage.setItem('email', email)
            const response = await axios.post(`${BASE_URL}/password/email`, { email });
            if (response.status === 200) {
                return response.data.message; // Assuming the API returns a success message
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ otp }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/password/otp`, {  otp });
            if (response.status === 200) {
                return response.data.message; // Assuming the API returns a success message
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({  otp,new_password,confirm_password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/password/reset/${otp}`, {  new_password,confirm_password });
            if (response.status === 200) {
                return response.data.message; // Assuming the API returns a success message
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: true,
        loading: false,
        error: null,
        loggedIn: false,
        isLoggedOut: false,
        message:null
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                // console.log("Login fulfilled with user:", action.payload);
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                state.loggedIn = true;
                state.isLoggedOut = false;
                state.message = action.payload?.message || "Login successful";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.message = action.payload?.message || "Login Failed";
                state.error = action.payload?.message || "Login Failed";
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                state.message = action.payload?.message || "Forgot Password successful";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Forgot Password Failed";
                state.message = action.payload?.message || "Forgot Password Failed";
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                state.message = action.payload?.message || "OTP Verification successful";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "OTP Verification Failed";
                state.message = action.payload?.message || "OTP Verification Failed";
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                state.message = action.payload?.message || "Password Reset successful";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Password Reset Failed";
                state.message = action.payload?.message || "Password Reset Failed";
                enqueueSnackbar(state.message, { variant: 'error' })
            });
            
            
    },
});


export default authSlice.reducer;
