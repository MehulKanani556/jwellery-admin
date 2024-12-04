import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';




const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const deleteUser = createAsyncThunk(
    'auth/deleteUser',
    async ({userId}, { rejectWithValue }) => {
        try {
           
            const response = await axiosInstance.delete(`/user/delete/${userId}`);
            console.log(response.data)
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
           
            const response = await axiosInstance.get(`/user/getall`);
            return response.data.users; // Assuming the API returns an array of users
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const getSingleUser = createAsyncThunk(
    'auth/getSingleUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/user/get/${userId}`);
            return response.data.user; // Assuming the API returns the user object
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllUsers = createAsyncThunk(
    'auth/deleteAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete('/users'); // Assuming the API supports deleting all users
            return response.data.message; // Assuming the API returns a success message
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editUser = createAsyncThunk(
    'auth/editUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/user/edit/${userId}`, userData);
            return response.data.user; // Assuming the API returns the updated user object
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editUserProfile = createAsyncThunk(
    'auth/editUserProfile',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });
            const response = await axiosInstance.post(`/user/updateprofile/${values.id}`, formData);
            return response.data.user; // Assuming the API returns the updated user object
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/password/change`,values);
            return response.data; // Assuming the API returns a success message
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
                state.users =  action.payload   ;
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
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.message = 'Editing user...';
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = state.users.map((user) => 
                    user._id === action.payload._id ? action.payload : user
                ); // Update the user in the users array
                state.message = 'User edited successfully';
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to edit user';
            })
            .addCase(editUserProfile.pending, (state) => {
                state.loading = true;
                state.message = 'Editing profile...';
            })
            .addCase(editUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currUser = action.payload; // Update the current user with the new profile data
                state.message = 'Profile edited successfully';
            })
            .addCase(editUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to edit profile';
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.message = 'Changing password...';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload || 'Password changed successfully';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to change password';
            });
    }
});

export default usersSlice.reducer;
