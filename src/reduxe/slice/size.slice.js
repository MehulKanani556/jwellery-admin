import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import axiosInstance from '../../utils/axiosInstance';


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
            })
            .addCase(addSize.fulfilled, (state, action) => {
                state.sizes.push(action.payload); // Add the new size to the sizes array
                state.message = 'Size added successfully';
            })
            .addCase(addSize.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add size';
            })
            .addCase(editSize.fulfilled, (state, action) => {
                const index = state.sizes.findIndex(size => size.id === action.payload.id);
                if (index !== -1) {
                    state.sizes[index] = action.payload; // Update the size in the sizes array
                    state.message = 'Size edited successfully';
                }
            })
            .addCase(editSize.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit size';
            })
            .addCase(deleteSize.fulfilled, (state, action) => {
                state.sizes = state.sizes.filter(size => size.id !== action.payload); // Remove the deleted size
                state.message = 'Size deleted successfully';
            })
            .addCase(deleteSize.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete size';
            })
            .addCase(deleteAllSizes.fulfilled, (state) => {
                state.sizes = []; // Clear the sizes array
                state.message = 'All sizes deleted successfully';
            })
            .addCase(deleteAllSizes.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all sizes';
            });
    }
});

export default sizesSlice.reducer;
