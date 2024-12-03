import {
    Box,
    Modal,
} from "@mui/material";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllCategory,
} from "../reduxe/slice/catagorys.slice";
import {
    getAllSubCategory,
    updateStatusSubCategory,
} from "../reduxe/slice/subcategorys.slice";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem';
import { FaFilter } from "react-icons/fa";
import { addProduct, deleteAllProducts, deleteProduct, editProduct, getAllProducts } from "../reduxe/slice/product.slice";
import { useLocation, useNavigate } from "react-router-dom";
// import MenuItem from '@mui/material/MenuItem';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { getAllSizes } from "../reduxe/slice/size.slice";

const AddProduct = React.memo(() => {

    const [productData, setProductData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useLocation().state;
    const category = useSelector((state) => state.categorys.category);
    const subcategory = useSelector((state) => state.subcategorys.SubCategory);
    const products = useSelector((state) => state.products.products);
    const size = useSelector((state) => state.sizes.sizes);
    console.log(products, category, subcategory, size);

    const [filteredSubcategorys, setFilteredSubcategorys] = useState([]);
    const [filteredSize, setFilteredSize] = useState([]);
    console.log(filteredSubcategorys, filteredSize);

    // Add new state for diamond qualities
    const [diamondQualities, setDiamondQualities] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedClarity, setSelectedClarity] = useState('');

    // Add these new states
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [anchorElSize, setAnchorElSize] = useState(null);

    // Add new state for diamond settings
    const [selectedSettings, setSelectedSettings] = useState([]);
    const [anchorElSetting, setAnchorElSetting] = useState(null);

    // Add these new states at the top with other states
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(getAllCategory());
        dispatch(getAllSubCategory());
        dispatch(getAllProducts());
        dispatch(getAllSizes());
    }, []);


    const handleproductadd = (id) => {
        navigate('/product/productadd')
    }

    const handleproductview = (id) => {
        navigate('/product/Productview')
    }

    // Add handler for color and clarity selection
    const handleColorChange = (e) => {
        setFieldValue('diamond_color', e.target.value);
        setSelectedColor(e.target.value);
    };

    const handleClarityChange = (e) => {
        setFieldValue('clarity', e.target.value);
        setSelectedClarity(e.target.value);
    };

    // Add handler for adding new diamond quality
    const handleAddDiamondQuality = () => {
        if (selectedColor && selectedClarity) {
            const newQuality = `${selectedColor}/${selectedClarity}`;
            if (!diamondQualities.includes(newQuality)) {
                setDiamondQualities([...diamondQualities, newQuality]);
                // Reset selections
                // setSelectedColor('');
                // setSelectedClarity('');
            }
        }
        setFieldValue('diamond_quality', diamondQualities);
    };

    // Add handler for removing diamond quality
    const handleRemoveQuality = (qualityToRemove) => {
        setDiamondQualities(diamondQualities.filter(quality => quality !== qualityToRemove));
        setFieldValue('diamond_quality', diamondQualities);
    };

    // Add these new handlers
    const handleSizeClick = (event) => {
        setAnchorElSize(event.currentTarget);
    };

    const handleSizeClose = () => {
        setAnchorElSize(null);
    };

    const handleSizeSelect = (size) => {
        console.log(size);
        let sizes;
        if (selectedSizes.includes(size)) {
            sizes = selectedSizes.filter((s) => s !== size);
        } else {
            sizes = [...selectedSizes, size];
        }
        setFieldValue('size_name', sizes);
        setSelectedSizes(sizes);
    };

    const handleRemoveSize = (sizeToRemove) => {
        setAnchorElSize(null)
        const sizes = selectedSizes.filter((size) => size !== sizeToRemove);
        setSelectedSizes(sizes);
        setFieldValue('size_name', sizes);
    };

    // Add these new handlers for diamond settings
    const handleSettingClick = (event) => {
        setAnchorElSetting(event.currentTarget);
    };

    const handleSettingClose = () => {
        setAnchorElSetting(null);
    };

    const handleSettingSelect = (setting) => {
        let settings;
        if (selectedSettings.includes(setting)) {
            settings = selectedSettings.filter((s) => s !== setting);
        } else {
            settings = [...selectedSettings, setting];
        }
        setFieldValue('diamond_setting', settings?.join(','));
        setSelectedSettings(settings);
    };

    const handleRemoveSetting = (settingToRemove) => {
        const settings = selectedSettings.filter((setting) => setting !== settingToRemove);
        setSelectedSettings(settings);
        setFieldValue('diamond_setting', settings?.join(','));
    };

    // Add this function to handle image removal
    const removeImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    // Update the file input handler
    const handleFileChange = (e) => {
        const files = Array.from(e.currentTarget.files);
        setImages(prevImages => [...prevImages, ...files]);
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };

    // Add validation schema
    const productValidationSchema = Yup.object({
        product_name: Yup.string().required('Product name is required'),
        category_id: Yup.number().required('Category is required'),
        sub_category_id: Yup.number().required('Sub category is required'),
        metal_color: Yup.string().required('Metal color is required'),
        metal: Yup.string().required('Metal type is required'),
        diamond_color: Yup.string().required('Diamond color is required'),
        diamond_quality: Yup.array().min(1, 'At least one diamond quality is required'),
        no_of_diamonds: Yup.number().required('Number of diamonds is required'),
        clarity: Yup.string().required('Clarity is required'),
        size_id: Yup.string().required('Size is required'),
        size_name: Yup.array().min(1, 'At least one size is required'),
        weight: Yup.number().required('Weight is required'),
        diamond_setting: Yup.string().required('Diamond setting is required'),
        diamond_shape: Yup.string().required('Diamond shape is required'),
        collection: Yup.string().required('Collection is required'),
        gender: Yup.string().required('Gender is required'),
        qty: Yup.number().required('Quantity is required'),
        price: Yup.number().required('Price is required'),
        discount: Yup.number(),
        description: Yup.string().required('Description is required'),
        images: Yup.array().min(1, 'At least one image is required')
    });

    const formik = useFormik({
        initialValues : {
            product_name: '',
            category_id: '',
            sub_category_id: '',
            metal_color: '',
            metal: '',
            diamond_color: '',
            diamond_quality: [],
            no_of_diamonds: '',
            clarity: '',
            size_id: '',
            size_name: '',
            weight: '',
            diamond_setting: '',
            diamond_shape: '',
            collection: '',
            gender: '',
            qty: '',
            price: '',
            discount: '',
            description: '',
            images: []
        },
        validationSchema: productValidationSchema,
        validateOnChange: false,
        // validateOnBlur: true,
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            const data = { ...values, status: "active" }
            if (id) {
                dispatch(editProduct({ data, id: id }))
                navigate('/product')
            } else {
                dispatch(addProduct(data))
            }
        },
    });

    const { handleSubmit, handleChange, handleBlur, errors, values, touched, setFieldValue, } = formik;

    const handleCategory = useCallback((event) => {
        let id = event.target.value;
        console.log(id);
        setFieldValue('category_id', id);
        setFieldValue('subcategory_id', '');
        setFilteredSubcategorys(subcategory.filter((subcat) => subcat.category_id == id));
    }, [subcategory, setFieldValue]);

    const handleSizeChange = (event) => {
        let id = event.target.value
        setFieldValue('size_id', id);
        setFilteredSize(size.find((size) => size.id == id)?.size?.split(','));
    }
    console.log(values);


    // const submitvalues = async (values, { setSubmitting }) => {
    //     try {
    //         const formData = new FormData();

    //         // Append all form values
    //         Object.keys(values).forEach(key => {
    //             if (key === 'images') {
    //                 values.images.forEach(image => {
    //                     formData.append('images', image);
    //                 });
    //             } else if (key === 'diamond_quality') {
    //                 formData.append('diamond_quality', JSON.stringify(values.diamond_quality));
    //             } else {
    //                 formData.append(key, values[key]);
    //             }
    //         });

    //         // Make API call here
    //         // const response = await axios.post('/api/products', formData);

    //         console.log('Form submitted:', values);
    //         navigate('/products');
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    // const filteredSubcategorys = useMemo(() => {
    //     return subcategory.filter((subcat) => subcat.category_id == values.category_id);
    // }, [subcategory, values.category_id]);

    return (
        <div className="md:mx-[20px] p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Add Product</h1>
                    <p className="text-brown-50">
                        Dashboard / Product / {' '}
                        <span className="text-brown font-medium">Add Product</span>
                    </p>
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-6 text-brown">Product Details</h2>

                <form className="space-y-6" onSubmit={handleSubmit}  enctype="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-brown text-base font-semibold mb-2">Product Name </label>
                            <input
                                name="product_name"
                                type="text"
                                placeholder="Enter product name"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                // onBlur={handleBlur}
                                value={values.product_name}
                            />
                            {errors.product_name && <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Category </label>
                            <select
                                name="category_id"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={(e) => handleCategory(e)}
                                // onBlur={handleBlur}
                                value={values.category_id}
                            >
                                <option value="">Select category</option>
                                {category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Sub Category </label>
                            <select
                                name="sub_category_id"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.sub_category_id}
                            >
                                <option value="">Select sub category</option>
                                {filteredSubcategorys.map((subcat) => (
                                    <option key={subcat.id} value={subcat.id}>
                                        {subcat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.sub_category_id && <p className="text-red-500 text-sm mt-1">{errors.sub_category_id}</p>}
                        </div>
                    </div>

                    {/* Metal Options Row */}
                    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div className="col-span-1 flex gap-4 items-center">
                            <div>
                                <label className="block text-brown text-base font-semibold mb-2">Metal Color </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="metal_color"
                                            className="mr-1 text-brown"
                                            onChange={() => {
                                                handleChange({ target: { name: 'metal_color', value: 'Rose' } });
                                                // setFieldValue('metal_color', 'Rose');
                                            }}
                                            onBlur={handleBlur}
                                            value="Rose"
                                        />
                                        <span className="text-gray-700">Rose</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="metal_color"
                                            className="mr-1 text-brown"
                                            onChange={() => {
                                                handleChange({ target: { name: 'metal_color', value: 'Gold' } });
                                                // setFieldValue('metal_color', 'Gold');
                                            }}
                                            onBlur={handleBlur}
                                            value="Gold"
                                        />
                                        <span className="text-gray-700">Gold</span>
                                    </label>
                                </div>
                                {errors.metal_color && <p className="text-red-500 text-sm mt-1">{errors.metal_color}</p>}
                            </div>
                            <div>
                                <label className="block text-brown text-base font-semibold mb-2">Metal Type </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="metal"
                                            className="mr-1 text-brown"
                                            onChange={() => {
                                                handleChange({ target: { name: 'metal', value: '14K' } });
                                                setFieldValue('metal', '14K');
                                            }}
                                            onBlur={handleBlur}
                                            value="14K"
                                        />
                                        <span className="text-gray-700">14K Gold</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="metal"
                                            className="mr-1 text-brown"
                                            onChange={() => {
                                                handleChange({ target: { name: 'metal', value: '18K' } });
                                                setFieldValue('metal', '18K');
                                            }}
                                            onBlur={handleBlur}
                                            value="18K"
                                        />
                                        <span className="text-gray-700">18K Gold</span>
                                    </label>
                                </div>
                                {errors.metal && <p className="text-red-500 text-sm mt-1">{errors.metal}</p>}
                            </div>
                        </div>
                        {/* Image Upload */}
                        <div className="col-span-2">
                            <label className="block text-brown text-base font-semibold mb-2">Product Images </label>
                            <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                                {images.length > 0 ? (
                                    <>
                                        <div className="flex w-[100%] gap-2 overflow-x-scroll scrollbar-hide ">
                                            {images.map((image, index) => (
                                                <div key={index} className="flex w-[300px] items-center justify-between bg-[#72727226] px-2 py-1">
                                                    <div className="flex items-center">
                                                        {typeof image === "string" ? (
                                                            <img
                                                                src={image}
                                                                alt="Preview"
                                                                className="w-8 h-8 rounded-full mr-2"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={URL.createObjectURL(image)}
                                                                alt="Preview"
                                                                className="w-8 h-8 rounded-full mr-2"
                                                            />
                                                        )}
                                                        <span className="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis ">
                                                            {typeof image === "string"
                                                                ? image.split("/").pop()
                                                                : image.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="flex-1 items-center text-red-500 ml-1 text-[12px]"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center ml-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    const files = Array.from(e.currentTarget.files);
                                                    setFieldValue('images', [...values.images, ...files]);
                                                    handleFileChange(e);
                                                }}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px] whitespace-nowrap"
                                            >
                                                Add More
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex-1 text-[16px] text-[#727272]">
                                            Choose Images
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const files = Array.from(e.currentTarget.files);
                                                setFieldValue('images', files);
                                                handleFileChange(e);
                                            }}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                                        >
                                            Browse
                                        </label>
                                    </>
                                )}
                            </div>
                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                        </div>
                    </div>

                    {/* Diamond Properties Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 flex gap-4 items-center justify-between w-full">
                            <div className="w-50">
                                <label className="block text-brown text-base font-semibold mb-2">Diamond Color</label>
                                <select
                                    name="diamond_color"
                                    className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                    onChange={handleColorChange}
                                    onBlur={handleBlur}
                                    value={values.diamond_color}
                                >
                                    <option value="">Select color</option>
                                    <option value="D">D</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="GH">GH</option>
                                    <option value="IJ">IJ</option>
                                    <option value="KM">KM</option>
                                    <option value="NZ">NZ</option>
                                </select>
                                {errors.diamond_color && <p className="text-red-500 text-sm mt-1">{errors.diamond_color}</p>}
                            </div>
                            <div className="w-50">
                                <label className="block text-brown text-base font-semibold mb-2">Clarity</label>
                                <select
                                    name="clarity"
                                    className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                    onChange={handleClarityChange}
                                    onBlur={handleBlur}
                                    value={values.clarity}
                                >
                                    <option value="">Select clarity</option>
                                    <option value="FL">FL</option>
                                    <option value="IF">IF</option>
                                    <option value="VVS1">VVS1</option>
                                    <option value="VVS2">VVS2</option>
                                    <option value="VS1">VS1</option>
                                    <option value="VS2">VS2</option>
                                    <option value="SI1">SI1</option>
                                    <option value="SI2">SI2</option>
                                    <option value="I1">I1</option>
                                    <option value="I2">I2</option>
                                    <option value="I3">I3</option>
                                </select>
                                {errors.clarity && <p className="text-red-500 text-sm mt-1">{errors.clarity}</p>}
                            </div>
                            <div className="self-end mb-2">
                                <button
                                    type="button"
                                    onClick={handleAddDiamondQuality}
                                    disabled={!selectedColor || !selectedClarity}
                                    className="px-3 py-1 bg-brown text-white rounded-md hover:bg-brown-600 disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-brown text-base font-semibold mb-2">Diamond Quality</label>
                            <div className="flex flex-wrap gap-2 border border-brown rounded-md p-2">
                                {diamondQualities.length > 0 ? diamondQualities.map((quality, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="px-3 py-1 border border-brown rounded-md hover:bg-gray-50 flex items-center gap-1"
                                    >
                                        {quality}
                                        <span
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => handleRemoveQuality(quality)}
                                        >
                                            ×
                                        </span>
                                    </button>
                                )) : <span className="text-gray-400">Select diamond quality</span>}
                            </div>
                            {errors.diamond_quality && <p className="text-red-500 text-sm mt-1">{errors.diamond_quality}</p>}
                        </div>
                    </div>

                    {/* Size Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-brown text-base font-semibold mb-2">Size Category</label>
                            <select
                                name="size_id"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleSizeChange}
                                onBlur={handleBlur}
                                value={values.size_id}
                            >
                                <option value="">Select size category</option>
                                {size.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                            {errors.size_name && <p className="text-red-500 text-sm mt-1">{errors.size_name}</p>}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-brown text-base font-semibold mb-2">Size Range </label>
                            <div
                                onClick={handleSizeClick}
                                className="w-full flex flex-wrap gap-2 px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown cursor-pointer"
                            >
                                {selectedSizes.length > 0 ? selectedSizes.map((size, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="px-3 py-1 border border-brown rounded-md hover:bg-gray-50 flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {size}
                                        <span
                                            className="text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveSize(size)
                                            }}
                                        >
                                            ×
                                        </span>
                                    </button>
                                )) : <span className="text-gray-400">Select size range</span>}
                            </div>
                            <Menu
                                anchorEl={anchorElSize}
                                open={Boolean(anchorElSize)}
                                onClose={handleSizeClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: 200,
                                        width: anchorElSize?.offsetWidth || 'auto',
                                        padding: '0px 5px',
                                    },
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <div className="grid grid-cols-6 gap-2 p-2 w-full flex flex-wrap">
                                    {filteredSize.map((size) => (
                                        <MenuItem
                                            key={size}
                                            onClick={() => handleSizeSelect(size)}
                                            sx={{
                                                backgroundColor: selectedSizes.includes(size) ? '#795548' : 'transparent',
                                                color: selectedSizes.includes(size) ? 'white' : 'inherit',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    backgroundColor: selectedSizes.includes(size) ? '#795548' : '#f5f5f5',
                                                },
                                                fontSize: '16px',
                                                borderRadius: '5px',
                                                border: '0.75px solid #727272',
                                                margin: '2px',
                                                padding: '4px',
                                                minWidth: '35px',
                                            }}
                                        >
                                            {size}
                                        </MenuItem>
                                    ))}
                                </div>
                            </Menu>
                            {errors.size_id && <p
                                name="size_id"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />}
                        </div>
                    </div>

                    {/* Product Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Weight (grams) </label>
                            <input
                                name="weight"
                                type="text"
                                placeholder="Enter product weight"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.weight}
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Diamond Setting</label>
                            <div
                                onClick={handleSettingClick}
                                className="w-full flex flex-wrap gap-2 px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown cursor-pointer"
                            >
                                {selectedSettings.map((setting, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="px-3 py-1 border border-brown rounded-md hover:bg-gray-50 flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {setting}
                                        <span
                                            className="text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveSetting(setting);
                                            }}
                                        >
                                            ×
                                        </span>
                                    </button>
                                ))}
                                {selectedSettings.length === 0 && 'Select setting type'}
                            </div>
                            <Menu
                                anchorEl={anchorElSetting}
                                open={Boolean(anchorElSetting)}
                                onClose={handleSettingClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: 200,
                                        width: anchorElSetting?.offsetWidth || 'auto',
                                        padding: '8px',
                                    },
                                }}
                            >
                                {['Flush', 'Pressure', 'Free', 'Channel', 'Prong'].map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() => handleSettingSelect(setting)}
                                        sx={{
                                            backgroundColor: selectedSettings.includes(setting) ? '#795548' : 'transparent',
                                            color: selectedSettings.includes(setting) ? 'white' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: selectedSettings.includes(setting) ? '#795548' : '#f5f5f5',
                                            },
                                            borderRadius: '4px',
                                            margin: '2px 0',
                                        }}
                                    >
                                        {setting}
                                    </MenuItem>
                                ))}
                            </Menu>
                            {errors.diamond_setting && <p className="text-red-500 text-sm mt-1">{errors.diamond_setting}</p>}
                        </div>

                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Diamond Shape</label>
                            <select
                                name="diamond_shape"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.diamond_shape}
                            >
                                <option value="">Select diamond shape</option>
                                <option value="round">Round</option>
                                <option value="princess">Princess</option>
                                <option value="emerald">Emerald</option>
                                <option value="asscher">Asscher</option>
                                <option value="cushion">Cushion</option>
                                <option value="oval">Oval</option>
                                <option value="pear">Pear</option>
                                <option value="marquise">Marquise</option>
                                <option value="radiant">Radiant</option>
                            </select>
                            {errors.diamond_shape && <p className="text-red-500 text-sm mt-1">{errors.diamond_shape}</p>}
                        </div>

                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Number of Diamonds </label>
                            <input
                                name="no_of_diamonds"
                                type="text"
                                placeholder="Enter total diamonds"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.no_of_diamonds}
                            />
                            {errors.no_of_diamonds && <p className="text-red-500 text-sm mt-1">{errors.no_of_diamonds}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Gender </label>
                            <select
                                name="gender"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.gender}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="unisex">Unisex</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Collection</label>
                            <input
                                name="collection"
                                type="text"
                                placeholder="Enter collection name"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.collection}
                            />
                            {errors.collection && <p className="text-red-500 text-sm mt-1">{errors.collection}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-brown text-base font-semibold mb-2">Product Description </label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Enter detailed product description"
                            className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Price Details Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Quantity </label>
                            <input
                                name="qty"
                                type="number"
                                placeholder="Enter quantity"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.qty}
                            />
                            {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Price (₹) </label>
                            <input
                                name="price"
                                type="number"
                                placeholder="Enter price"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.price}
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Discount (%)</label>
                            <input
                                name="discount"
                                type="number"
                                placeholder="Enter discount percentage"
                                className="w-full px-3 py-2 border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.discount}
                            />
                            {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brown text-white rounded-md hover:bg-brown-600 transition-colors"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default AddProduct;
