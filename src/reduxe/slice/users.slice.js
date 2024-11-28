import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';




const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const deleteUser = createAsyncThunk(
    'auth/deleteUser',
    async ({userId}, { rejectWithValue }) => {
        try {
            console.log("Deleting user with ID:", userId);
            const response = await axios.delete(`/users/${userId}`);
            if (response.status === 200) {
                return response.data.message; // Assuming the API returns a success message
            }
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'auth/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/users');
            return response.data; // Assuming the API returns an array of users
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const getSingleUser = createAsyncThunk(
    'auth/getSingleUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/users/${userId}`);
            return response.data; // Assuming the API returns the user object
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllUsers = createAsyncThunk(
    'auth/deleteAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.delete('/users'); // Assuming the API supports deleting all users
            return response.data.message; // Assuming the API returns a success message
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        currUser: null,
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting user...';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.message = action.payload?.message || 'User deleted successfully';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete user';
            })

            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All users fetched successfully';
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all users';
            })
            .addCase(getSingleUser.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching user...';
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currUser = action.payload;
                state.message = 'User fetched successfully';
            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch user';
            })
            .addCase(deleteAllUsers.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting all users...';
            })
            .addCase(deleteAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = []; // Clear the users array
                state.message = action.payload || 'All users deleted successfully';
            })
            .addCase(deleteAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all users';
            });
    }
});

export default usersSlice.reducer;
