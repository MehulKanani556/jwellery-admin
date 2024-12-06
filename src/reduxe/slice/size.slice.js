import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import axiosInstance from '../../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
// const apiUrl = "https://shreekrishnaastrology.com/api";



async function getToken() {
    const token = await sessionStorage.getItem("token");
    return token;
}

export const getAllSizes = createAsyncThunk(
    'size/getAllSizes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/sizes/getall`);
            return response.data.sizes; // Assuming the API returns an array of sizes
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addSize = createAsyncThunk(
    'size/addSize',
    async ({name,size}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/sizes/create`, {name,size});
            return response.data.size; // Assuming the API returns the added size
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editSize = createAsyncThunk(
    'size/editSize',
    async ({ id, name, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/sizes/update/${id}`, { name, size });
            return response.data.size; // Assuming the API returns the updated size
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteSize = createAsyncThunk(
    'size/deleteSize',
    async ({id}, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/sizes/delete/${id}`);
            return id; // Return the id of the deleted size
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllSizes = createAsyncThunk(
    'size/deleteAllSizes',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.get(`/sizes/deleteAll`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const sizesSlice = createSlice({
    name: 'size',
    initialState: {
        sizes: [],
        currSizes: null,
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSizes.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllSizes.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All sizes fetched successfully';
                state.sizes =  action.payload   ;
            })
            .addCase(getAllSizes.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all sizes';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(addSize.pending, (state) => {
                state.loading = true
            })
            .addCase(addSize.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sizes.push(action.payload); // Add the new size to the sizes array
                state.message = action.payload?.message || "Size created successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(addSize.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create size';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(editSize.pending, (state) => {
                state.loading = true
            })
            .addCase(editSize.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.sizes.findIndex(size => size.id === action.payload.id);
                if (index !== -1) {
                    state.sizes[index] = action.payload; // Update the size in the sizes array
                    state.message = action.payload?.message || "Size updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(editSize.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update size';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteSize.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteSize.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sizes = state.sizes.filter(size => size.id !== action.payload); // Remove the deleted size
                state.message = action.payload?.message || "Size deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })  

            .addCase(deleteSize.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete size';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteAllSizes.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllSizes.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.sizes = []; // Clear the sizes array
                state.message = action.payload?.message || "All sizes deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteAllSizes.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all sizes';    
                enqueueSnackbar(state.message, { variant: 'error' })
            });
    }
});

export default sizesSlice.reducer;
