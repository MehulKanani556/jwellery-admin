import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
const apiUrl = "http://127.0.0.1:8000/api";
getToken();


async function getToken() {
    const token = await sessionStorage.getItem("token");
    return token;
}

export const getAllSizes = createAsyncThunk(
    'size/getAllSizes',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getToken();
            const response = await axios.get(`${apiUrl}/sizes/getall`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
            const token = await getToken();
            const response = await axios.post(`${apiUrl}/sizes/create`, {name,size}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
            const token = await getToken();
            const response = await axios.post(`${apiUrl}/sizes/update/${id}`, { name, size }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
            const token = await getToken();
            await axios.delete(`${apiUrl}/sizes/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
            const token = await getToken();
            await axios.get(`${apiUrl}/sizes/deleteAll`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
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
