import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
   
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { dispatch, rejectWithValue }) => {
        try {
            console.log("Login",email, password);
            
            const response = await axios.post('/login', { email, password });
            // console.log(" response.data.AccessToken", response.data.AccessToken);
            // console.log(" response.data.refreshToken", response.data.refreshToken);
            if (response.status === 200) {            
                localStorage.setItem("id", response.data.user._id);
                return response.data.AccessToken;
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
            console.log("forgot pass",email);
            sessionStorage.setItem('email', email)
            const response = await axios.post('/forgot-password', { email });
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
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            console.log("Verifying",email,otp);
            const response = await axios.post('/verify-otp', { email, otp });
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
    async ({  password }, { rejectWithValue }) => {
        try {
            console.log("Resetting password",password);
            const response = await axios.post('/reset-password', {  password });
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
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Login Failed";
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                // Handle success message if needed
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Forgot Password Failed";
            })
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                // Handle success message if needed
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "OTP Verification Failed";
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // Clear any previous errors
                // Handle success message if needed
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Password Reset Failed";
            });
            
            
    },
});


export default authSlice.reducer;
