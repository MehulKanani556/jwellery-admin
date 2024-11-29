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
            .addCase(getAllStocks.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All stocks fetched successfully';
                state.stocks =  action.payload   ;
                // console.log(state.stocks)
            })
            .addCase(getAllStocks.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all stocks';
            })
            .addCase(addStock.fulfilled, (state, action) => {
                state.stocks.push(action.payload); // Add the new size to the sizes array
                state.message = 'Stock added successfully';
            })
            .addCase(addStock.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add stock';
            })
            .addCase(editStock.fulfilled, (state, action) => {
                const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
                if (index !== -1) {
                    state.stocks[index] = action.payload; // Update the size in the sizes array
                    state.message = 'Stock edited successfully';
                }
            })
            .addCase(editStock.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit stock';
            })
            .addCase(deleteStock.fulfilled, (state, action) => {
                state.stocks = state.stocks.filter(stock => stock.id !== action.payload); // Remove the deleted size
                state.message = 'Stock deleted successfully';
            })
            .addCase(deleteStock.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete stock';
            })
            .addCase(deleteAllStocks.fulfilled, (state) => {
                state.stocks = []; // Clear the sizes array
                state.message = 'All stocks deleted successfully';
            })
            .addCase(deleteAllStocks.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all stocks';
            });
    }
});

export default stocksSlice.reducer;
