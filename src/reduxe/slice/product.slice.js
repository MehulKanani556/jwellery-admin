import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import sessionStorage from 'redux-persist/es/storage/session';
import axiosInstance from '../../utils/axiosInstance';


const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';

    return rejectWithValue(error.response?.data || { message: errorMessage });
};
export const getAllProducts = createAsyncThunk(
    'product/getAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/products/getall`);
            return response.data.data; // Assuming the API returns an array of products
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const getSingleProducts = createAsyncThunk(
    'product/getSingleProducts',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/products/get/${id}`);
            return response.data.data; // Assuming the API returns an array of products
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const addProduct = createAsyncThunk(
    'product/addProduct',
    async (data, { rejectWithValue }) => {
        // Format the data object
        const formData = new FormData();
        
        // Add all fields to FormData
        formData.append('product_name', data.product_name);
        formData.append('category_id', data.category_id);
        formData.append('sub_category_id', data.sub_category_id);
        formData.append('metal_color', data.metal_color);
        formData.append('metal', data.metal);
        formData.append('diamond_color', data.diamond_color);
        formData.append('diamond_quality', Array.isArray(data.diamond_quality) ? data.diamond_quality.join(',') : data.diamond_quality);
        formData.append('no_of_diamonds', data.no_of_diamonds);
        formData.append('clarity', data.clarity);
        formData.append('size_id', data.size_id);
        formData.append('size_name', data.size_name);
        formData.append('weight', data.weight);
        formData.append('diamond_setting', Array.isArray(data.diamond_setting) ? data.diamond_setting.join(',') : data.diamond_setting);
        formData.append('diamond_shape', data.diamond_shape);
        formData.append('collection', data.collection);
        formData.append('gender', data.gender);
        formData.append('qty', data.qty);
        formData.append('price', data.price);
        formData.append('discount', data.discount);
        formData.append('description', data.description);
        formData.append('status', data.status);
        if (Array.isArray(data.mediaFiles)) {
            data.mediaFiles.forEach((image, index) => {
                formData.append(`image[${index}]`, image);
            });
            console.log(formData);
        } else {
            formData.append('image', data.mediaFiles);
        }
        
        try {
            const response = await axiosInstance.post(`/products/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const editProduct = createAsyncThunk(
    'product/editProduct',
    async ({data, id}, { rejectWithValue }) => {
        // Format the data object
        console.log(data);
        
        const formData = new FormData();
        
        // Add all fields to FormData
        formData.append('product_name', data.product_name);
        formData.append('category_id', data.category_id);
        formData.append('sub_category_id', data.sub_category_id);
        formData.append('metal_color', data.metal_color);
        formData.append('metal', data.metal);
        formData.append('diamond_color', data.diamond_color);
        formData.append('diamond_quality', Array.isArray(data.diamond_quality) ? data.diamond_quality.join(',') : data.diamond_quality);
        formData.append('no_of_diamonds', data.no_of_diamonds);
        formData.append('clarity', data.clarity);
        formData.append('size_id', data.size_id);
        formData.append('size_name', data.size_name);
        formData.append('weight', data.weight);
        formData.append('diamond_setting', Array.isArray(data.diamond_setting) ? data.diamond_setting.join(',') : data.diamond_setting);
        formData.append('diamond_shape', data.diamond_shape);
        formData.append('collection', data.collection);
        formData.append('gender', data.gender);
        formData.append('qty', data.qty);
        formData.append('price', data.price);
        formData.append('discount', data.discount);
        formData.append('description', data.description);
        formData.append('status', data.status);
        // if (Array.isArray(data.mediaFiles)) {
        //     data.mediaFiles.forEach((media, index) => {
        //         if (typeof media === 'string') {
        //             formData.append(`image[${index}][url]`, media);
        //         } else {
        //             formData.append(`image[${index}][file]`, media, media.name);
        //         }
        //     });
        // } else if (data.mediaFiles) {
        //     if (typeof data.mediaFiles === 'string') {
        //         formData.append('image[url]', data.mediaFiles);
        //     } else {
        //         formData.append('image[file]', data.mediaFiles, data.mediaFiles.name);
        //     }
        // }
        if (Array.isArray(data.mediaFiles)) {
            data.mediaFiles.forEach((image, index) => {
                formData.append(`image[${index}]`, image);
            });
            console.log(formData);
        } else {
            formData.append('image', data.mediaFiles);
        }
        
        try {
            const response = await axiosInstance.post(`/products/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            return response.data.data; // Assuming the API returns the updated product
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/products/delete/${id}`);
            return id; // Return the id of the deleted product
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

export const deleteAllProducts = createAsyncThunk(
    'product/deleteAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.get(`/products/deleteAll`);
            return; // No need to return anything for delete all
        } catch (error) {
            return handleErrors(error, null, rejectWithValue);
        }
    }
);

const productsSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        currProducts: null,
        success: false,
        message: '',
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'All products fetched successfully';
                state.products = action.payload;
                // console.log(state.products)
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all products';
            })

            .addCase(getSingleProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'products fetched successfully';
                state.products = action.payload;
                // console.log(state.products)
            })
            .addCase(getSingleProducts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch all products';
            })

            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload); // Add the new product to the products array
                state.message = 'Product added successfully';
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to add product';
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload; // Update the product in the products array
                    state.message = 'Product edited successfully';
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to edit product';
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload); // Remove the deleted product
                state.message = 'Product deleted successfully';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete product';
            })
            .addCase(deleteAllProducts.fulfilled, (state) => {
                state.products = []; // Clear the products array
                state.message = 'All products deleted successfully';
            })
            .addCase(deleteAllProducts.rejected, (state, action) => {
                state.message = action.payload?.message || 'Failed to delete all products';
            });
    }
});

export default productsSlice.reducer;
