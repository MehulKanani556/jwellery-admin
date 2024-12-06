import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import { enqueueSnackbar } from 'notistack';

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllOrders = createAsyncThunk(
    'order/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/order/getall`);
            return response.data.orders; // Assuming the API returns an array of orders
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addOrder = createAsyncThunk(
    'order/addOrder',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/orders/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.order; // Assuming the API returns the added order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editOrder = createAsyncThunk(
    'order/editOrder',
    async (values, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            // Append all fields to FormData
            for (const key in values) {
                formData.append(key, values[key]);
            }
            const response = await axiosInstance.post(`/orders/update/${values.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                },
            });
            return response.data.order; // Assuming the API returns the updated order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'order/deleteOrder',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/orders/delete/${id}`);
            return id; // Return the id of the deleted order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllOrders = createAsyncThunk(
    'order/deleteAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/orders/allDelete`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const updateStatusOrder = createAsyncThunk(
    'order/updateStatusOrder',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/order/updatestatus/${id}`, { status });
            return response.data.order; // Assuming the API returns the updated order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const getOrderById = createAsyncThunk(
    'order/getOrderById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/order/get/${id}`);
            return response.data.order; // Assuming the API returns the order
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const ordersSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All orders fetched successfully';
                state.orders = action.payload;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all orders';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(addOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(addOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.orders.push(action.payload); // Add the new order to the orders array
                state.message = action.payload?.message || "Order created successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(addOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to create order';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(editOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(editOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload; // Update the order in the orders array
                    state.message = 'Order edited successfully';
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(editOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update order';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order.id !== action.payload); // Remove the deleted order
                state.message = action.payload?.message || "Order deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete order';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(deleteAllOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteAllOrders.fulfilled, (state, action) => {
                state.orders = []; // Clear the orders array
                state.message = action.payload?.message || "All orders deleted successfully";
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(deleteAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete all orders';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(updateStatusOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload; // Update the order status in the orders array
                    state.message = 'Order status updated successfully';
                }
                enqueueSnackbar(state.message, { variant: 'success' })
            })
            .addCase(updateStatusOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update order status';
                enqueueSnackbar(state.message, { variant: 'error' })
            })
            .addCase(getOrderById.pending, (state) => {
                state.loading = true
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Order fetched successfully";
                // You can store the fetched order in a specific state if needed
                 state.selectedOrder = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch order';
                enqueueSnackbar(state.message, { variant: 'error' })
            });
    }
});

export default ordersSlice.reducer;
