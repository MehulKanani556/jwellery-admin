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

export const getAllStocks = createAsyncThunk(
    'stock/getAllStocks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/stocks/getall`);
            return response.data.data; // Assuming the API returns an array of sizes
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addStock = createAsyncThunk(
    'stock/addStock',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/stocks/create`, values);
            return response.data.data; // Assuming the API returns the added size
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editStock = createAsyncThunk(
    'stock/editStock',
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/stocks/update/${values.id}`, values);
            return response.data.data; // Assuming the API returns the updated size
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteStock = createAsyncThunk(
    'stock/deleteStock',
    async ({id}, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/stocks/delete/${id}`);
            return id; // Return the id of the deleted size
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllStocks = createAsyncThunk(
    'stock/deleteAllStocks',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/stocks/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const stocksSlice = createSlice({
    name: 'stock',
    initialState: {
        stocks: [],
        currStocks: null,
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllStocks.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllStocks.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "All stocks fetched successfully";
                state.stocks =  action.payload   ;
                // console.log(state.stocks)
            })
            .addCase(getAllStocks.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all stocks';
                enqueueSnackbar(state.message, { variant: 'error' })    
            })
            .addCase(addStock.pending, (state) => {
                state.loading = true
            })
            .addCase(addStock.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.stocks.push(action.payload); // Add the new size to the sizes array
                state.message = action.payload?.message || "Stock created successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })

            .addCase(addStock.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create stock';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(editStock.pending, (state) => {
                state.loading = true
            })
            .addCase(editStock.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
                if (index !== -1) {
                    state.stocks[index] = action.payload; // Update the size in the sizes array
                    state.message = action.payload?.message || "Stock updated successfully";
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(editStock.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to edit stock';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteStock.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteStock.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.stocks = state.stocks.filter(stock => stock.id !== action.payload); // Remove the deleted size
                state.message = action.payload?.message || "Stock deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteStock.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete stock';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteAllStocks.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllStocks.fulfilled, (state, action) => {    
                state.loading = false;
                state.success = true;
                state.stocks = []; // Clear the sizes array
                state.message = action.payload?.message || "All stocks deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteAllStocks.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all stocks';
                enqueueSnackbar(state.message, { variant: 'error' })
            });
    }
});

export default stocksSlice.reducer;
