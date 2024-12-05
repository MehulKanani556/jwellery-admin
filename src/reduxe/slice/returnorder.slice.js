import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllReturnOrders = createAsyncThunk(
    'returnOrder/getAllReturnOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/returnorder/getall`);
            return response.data.returnOrders; // Assuming the API returns an array of return orders
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addReturnOrder = createAsyncThunk(
    'returnOrder/addReturnOrder',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/returnOrders/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.returnOrder; // Assuming the API returns the added return order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editReturnOrder = createAsyncThunk(
    'returnOrder/editReturnOrder',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/returnOrders/update/${values.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.returnOrder; // Assuming the API returns the updated return order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteReturnOrder = createAsyncThunk(
    'returnOrder/deleteReturnOrder',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/returnOrders/delete/${id}`);
            return id; // Return the id of the deleted return order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllReturnOrders = createAsyncThunk(
    'returnOrder/deleteAllReturnOrders',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/returnorder/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const updateStatusReturnOrder = createAsyncThunk(
    'returnOrder/updateStatusReturnOrder',
    async ({ id, return_status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/returnorder/updatestatus/${id}`, { return_status });
            return response.data.returnOrder; // Assuming the API returns the updated return order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const returnOrdersSlice = createSlice({
    name: 'returnOrder',
    initialState: {
        returnOrders: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReturnOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All return orders fetched successfully';
                // console.log(action.payload)
                state.returnOrders = action.payload;
            })
            .addCase(getAllReturnOrders.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all return orders';
            })
            .addCase(addReturnOrder.fulfilled, (state, action) => {
                state.returnOrders.push(action.payload); // Add the new return order to the returnOrders array
                state.message = 'Return order added successfully';
            })
            .addCase(addReturnOrder.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add return order';
            })
            .addCase(editReturnOrder.fulfilled, (state, action) => {
                const index = state.returnOrders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.returnOrders[index] = action.payload; // Update the return order in the returnOrders array
                    state.message = 'Return order edited successfully';
                }
            })
            .addCase(editReturnOrder.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit return order';
            })
            .addCase(deleteReturnOrder.fulfilled, (state, action) => {
                state.returnOrders = state.returnOrders.filter(order => order.id !== action.payload); // Remove the deleted return order
                state.message = 'Return order deleted successfully';
            })
            .addCase(deleteReturnOrder.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete return order';
            })
            .addCase(deleteAllReturnOrders.fulfilled, (state) => {
                state.returnOrders = []; // Clear the returnOrders array
                state.message = 'All return orders deleted successfully';
            })
            .addCase(deleteAllReturnOrders.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all return orders';
            })
            .addCase(updateStatusReturnOrder.fulfilled, (state, action) => {
                const index = state.returnOrders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.returnOrders[index] = action.payload; // Update the return order status in the returnOrders array
                    state.message = 'Return order status updated successfully';
                }
            })
            .addCase(updateStatusReturnOrder.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to update return order status';
            });
    }
});

export default returnOrdersSlice.reducer;
