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
import { addProduct, deleteAllProducts, deleteProduct, editProduct, getAllProducts, getSingleProducts } from "../reduxe/slice/product.slice";
import { useLocation, useNavigate } from "react-router-dom";
// import MenuItem from '@mui/material/MenuItem';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { getAllSizes } from "../reduxe/slice/size.slice";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const AddProduct = React.memo(() => {

    const [productData, setProductData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useLocation().state;
    console.log(id);

    const category = useSelector((state) => state.categorys.category);
    const subcategory = useSelector((state) => state.subcategorys.SubCategory);
    const products = useSelector((state) => state.products.products);
    const size = useSelector((state) => state.sizes.sizes);
    // console.log(products, category, subcategory, size);

    const [filteredSubcategorys, setFilteredSubcategorys] = useState([]);
    const [filteredSize, setFilteredSize] = useState([]);
    // console.log(filteredSubcategorys, filteredSize);

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
    const [mediaFiles, setMediaFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(getAllCategory());
        dispatch(getAllSubCategory());
        if (id) {
            dispatch(getSingleProducts(id));
        } else {
            dispatch(getAllProducts());
        }
        dispatch(getAllSizes());
    }, []);





    // const handleproductadd = (id) => {
    //     navigate('/product/productadd')
    // }

    // const handleproductview = (id) => {
    //     navigate('/product/Productview')
    // }

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
            const newQualityArray = !diamondQualities.includes(newQuality)
                ? [...diamondQualities, newQuality]
                : [...diamondQualities];

            setDiamondQualities(newQualityArray);
            setFieldValue('diamond_quality', newQualityArray);
        }
    };

    // Add handler for removing diamond quality
    const handleRemoveQuality = (qualityToRemove) => {
        let newQualityArray;
        if (diamondQualities.includes(qualityToRemove)) {
            newQualityArray = diamondQualities.filter(quality => quality !== qualityToRemove);
            // setSelectedColor('');
            // setSelectedClarity('');
        }
        setDiamondQualities(newQualityArray);
        setFieldValue('diamond_quality', newQualityArray);
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

    // Add validation function
    const validateFile = (file) => {
        if (file.size > MAX_FILE_SIZE) {
            return `${file.name} is too large. Maximum size is 20MB.`;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
            return `${file.name} has unsupported format. Allowed formats are JPG, PNG, GIF, WEBP, MP4, WEBM, and MOV.`;
        }

        return null;
    };

    // Update the file change handler
    const handleFileChange = (e) => {
        const files = Array.from(e.currentTarget.files);
        const errors = [];
        const validFiles = [];

        files.forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(error);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // Update mediaFiles state
        const newMediaFiles = [...mediaFiles, ...validFiles];
        setMediaFiles(newMediaFiles);

        // Validate the entire mediaFiles array
        const validationError = validateMediaFiles(newMediaFiles);
        if (validationError) {
            setFieldError('mediaFiles', validationError);
            setFieldTouched('mediaFiles', true);
        } else {
            setFieldValue('mediaFiles', newMediaFiles);
            setFieldError('mediaFiles', undefined);
        }

        e.target.value = '';
    };

    // Add new validation function for the entire mediaFiles array
    const validateMediaFiles = (files) => {
        if (!files || files.length === 0) {
            return 'At least one image or video is required';
        }

        // Skip validation for existing files (strings)
        const newFiles = files.filter(file => typeof file !== 'string');

        for (const file of newFiles) {
            if (file.size > MAX_FILE_SIZE) {
                return `${file.name} is too large. Maximum size is 20MB.`;
            }

            if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
                return `${file.name} has unsupported format. Allowed formats are JPG, PNG, GIF, WEBP, MP4, WEBM, and MOV.`;
            }
        }

        return undefined;
    };

    // Update the remove handler
    const removeFile = (indexToRemove) => {
        const newMediaFiles = mediaFiles.filter((_, index) => index !== indexToRemove);
        setMediaFiles(newMediaFiles);

        // Validate the remaining files
        const validationError = validateMediaFiles(newMediaFiles);
        if (validationError) {
            setFieldError('mediaFiles', validationError);
            setFieldTouched('mediaFiles', true);
        } else {
            setFieldValue('mediaFiles', newMediaFiles);
            setFieldError('mediaFiles', undefined);
        }
    };

    // =================updateData=================
    useEffect(() => {
        if (id) {
            console.log(products);
            setValues(products);
            setFieldValue('product_name', products.product_name);
            setFieldValue('category_id', products.category_id);
            setFieldValue('sub_category_id', products.sub_category_id);
            setFieldValue('metal_color', products.metal_color);
            setFieldValue('metal', products.metal);
            setFieldValue('diamond_color', products.diamond_color);
            setFieldValue('diamond_quality', products.diamond_quality?.split(',') || []);
            setFieldValue('no_of_diamonds', products.no_of_diamonds);
            setFieldValue('clarity', products.clarity);
            setFieldValue('size_id', products.size_id);
            setFieldValue('size_name', products.size_name?.split(',') || []);
            setFieldValue('weight', products.weight);
            setFieldValue('diamond_setting', products.diamond_setting);
            setFieldValue('diamond_shape', products.diamond_shape);
            setFieldValue('collection', products.collection);
            setFieldValue('gender', products.gender);
            setFieldValue('qty', products.qty);
            setFieldValue('price', products.price);
            setFieldValue('discount', products.discount);
            setFieldValue('description', products.description);

            // Set media files if they exist
            if (products.images) {
                setMediaFiles(products.images);
                setFieldValue('mediaFiles', products.images);
            }

            // Set other state values
            setDiamondQualities(products.diamond_quality?.split(',') || []);
            setSelectedSizes(products.size_name?.split(',') || []);
            setSelectedSettings(products.diamond_setting?.split(',') || []);

            // Filter subcategories based on selected category
            setFilteredSubcategorys(subcategory.filter(
                (subcat) => subcat.category_id == products.category_id
            ));

            // Filter sizes based on selected size category
            const selectedSizeCategory = size.find(
                (s) => s.id == products.size_id
            );
            if (selectedSizeCategory) {
                setFilteredSize(selectedSizeCategory.size?.split(',') || []);
            }
        }
    }, [id, products, subcategory, size]);



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
        mediaFiles: Yup.array()
            .test('required', 'At least one image or video is required', function (value) {
                return value && value.length > 0;
            })
            .test('fileSize', 'One or more files exceed 20MB limit', function (value) {
                if (!value) return true;
                // Skip validation for existing files (strings)
                const newFiles = value.filter(file => typeof file !== 'string');
                return newFiles.every(file => file.size <= MAX_FILE_SIZE);
            })
            .test('fileType', 'Unsupported file format', function (value) {
                if (!value) return true;
                // Skip validation for existing files (strings)
                const newFiles = value.filter(file => typeof file !== 'string');
                return newFiles.every(file =>
                    ALLOWED_IMAGE_TYPES.includes(file.type) ||
                    ALLOWED_VIDEO_TYPES.includes(file.type)
                );
            }),
    });

    const formik = useFormik({
        initialValues: {
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
            mediaFiles: [],
        },
        validationSchema: productValidationSchema,
        validateOnChange: false,
        // validateOnBlur: true,
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            const data = { ...values, status: "active" }
            if (id) {
                dispatch(editProduct({ data, id: id }))
                navigate('/products')
            } else {
                dispatch(addProduct(data))
                navigate('/products')
            }
        },
    });

    const { 
        handleSubmit, 
        handleChange, 
        handleBlur, 
        errors, 
        values, 
        touched, 
        setFieldValue, 
        setValues, 
        setFieldError, 
        setFieldTouched
    } = formik;

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

    const pageTitle = id ? "Edit Product" : "Add Product";
    const buttonText = id ? "Update" : "Add";

    return (
        <div className="md:mx-[20px] p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">{pageTitle}</h1>
                    <p className="text-brown-50">
                        Dashboard / Product / {' '}
                        <span className="text-brown font-medium">{pageTitle}</span>
                    </p>
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-6 text-brown">Product Details</h2>

                <form className="space-y-6" onSubmit={handleSubmit} enctype="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-brown text-base font-semibold mb-2">Product Name </label>
                            <input
                                name="product_name"
                                type="text"
                                placeholder="Enter product name"
                                className="w-full px-3 py-2 h-[40px] border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown"
                                onChange={handleChange}
                                // onBlur={handleBlur}
                                value={values.product_name}
                            />
                            {(errors.product_name && touched.product_name) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.product_name}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Category </label>
                            <select
                                name="category_id"
                                className={`w-full px-3 py-2 h-[40px] border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown ${values.category_id === '' ? 'text-gray-400' : 'text-black'}`}
                                onChange={(e) => handleCategory(e)}
                                // onBlur={handleBlur}
                                value={values.category_id}
                            >
                                <option value="" >Select category </option>
                                {category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {(errors.category_id && touched.category_id) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.category_id}</p>}
                        </div>
                        <div>
                            <label className="block text-brown text-base font-semibold mb-2">Sub Category </label>
                            <select
                                name="sub_category_id"
                                className={`w-full px-3 py-2 h-[40px] border border-brown rounded-md focus:outline-none focus:ring-1 focus:ring-brown ${values.sub_category_id === '' ? 'text-gray-400' : 'text-black'}`}
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
                            {(errors.sub_category_id && touched.sub_category_id) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.sub_category_id}</p>}
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
                                                handleChange({ target: { name: 'metal_color', value: 'rose' } });
                                                // setFieldValue('metal_color', 'Rose');
                                            }}
                                            onBlur={handleBlur}
                                            value="rose"
                                            checked={values.metal_color == 'rose'}
                                        />
                                        <span className="text-gray-700">Rose</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="metal_color"
                                            className="mr-1 text-brown"
                                            onChange={() => {
                                                handleChange({ target: { name: 'metal_color', value: 'gold' } });
                                                // setFieldValue('metal_color', 'Gold');
                                            }}
                                            onBlur={handleBlur}
                                            value="gold"
                                            checked={values.metal_color == 'gold'}
                                        />
                                        <span className="text-gray-700">Gold</span>
                                    </label>
                                </div>
                                {(errors.metal_color && touched.metal_color) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.metal_color}</p>}
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
                                                handleChange({ target: { name: 'metal', value: '14k' } });
                                                setFieldValue('metal', '14k');
                                            }}
                                            onBlur={handleBlur}
                                            value="14k"
                                            checked={values.metal == '14k'}
                                        />
                                        <span className="text-gray-700">14K Gold</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="metal"
                                            className="mr-1 text-brown"
                                            onChange={() => {
                                                handleChange({ target: { name: 'metal', value: '18k' } });
                                                setFieldValue('metal', '18k');
                                            }}
                                            onBlur={handleBlur}
                                            value="18k"
                                            checked={values.metal == '18k'}
                                        />
                                        <span className="text-gray-700">18K Gold</span>
                                    </label>
                                </div>
                                {(errors.metal && touched.metal) && <p className="text-red-500 text-sm mt-1 text-[11px] ">{errors.metal}</p>}
                            </div>
                        </div>
                        {/* Image Upload */}
                        <div className="col-span-2">
                            <label className="block text-brown text-base font-semibold mb-2">Product Media (Images/Videos) </label>
                            <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                                {mediaFiles.length > 0 ? (
                                    <>
                                        <div className="flex w-[100%] gap-2 overflow-x-scroll scrollbar-hide">
                                            {mediaFiles.map((file, index) => (
                                                <div key={index} className="flex w-[200px] items-center justify-between bg-[#72727226] hover:bg-gray-300 px-2 py-1">
                                                    <div className="flex items-center">
                                                        {typeof file === "string" ? (
                                                            file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                                <img
                                                                    src={file}
                                                                    alt="Preview"
                                                                    className="w-8 h-8 rounded-full mr-2"
                                                                />
                                                            ) : (
                                                                <video
                                                                    className="w-8 h-8 rounded-full mr-2 object-cover"
                                                                >
                                                                    <source src={file} />
                                                                </video>
                                                            )
                                                        ) : (
                                                            file.type.startsWith('image/') ? (
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt="Preview"
                                                                    className="w-8 h-8 rounded-full mr-2"
                                                                />
                                                            ) : (
                                                                <video
                                                                    className="w-8 h-8 rounded-full mr-2 object-cover"
                                                                >
                                                                    <source src={URL.createObjectURL(file)} />
                                                                </video>
                                                            )
                                                        )}
                                                        <span className="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {typeof file === "string"
                                                                ? file.split("/").pop()
                                                                : file.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="text-red-500 ml-1 text-[15px] font-bold hover:text-red-600 hover:scale-110 transition-all duration-300"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center ml-4">
                                            <input
                                                type="file"
                                                accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                                                multiple
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
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
                                            Choose Images or Videos (Max 20MB each)
                                        </p>
                                        <input
                                            type="file"
                                            accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                                            multiple
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
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
                            {(errors.mediaFiles && touched.mediaFiles) &&
                                <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.mediaFiles}</p>
                            }
                            <p className="text-gray-500 text-xs mt-1">
                                Supported formats: JPG, PNG, GIF, WEBP, MP4, WEBM, MOV (Max size: 20MB)
                            </p>
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
                                {(errors.diamond_color && touched.diamond_color) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.diamond_color}</p>}
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
                                {(errors.clarity && touched.clarity) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.clarity}</p>}
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
                                        className="px-3 py-1 bg-[#72727226] hover:bg-gray-300 flex items-center gap-1"
                                    >
                                        {quality}
                                        <span
                                            className="text-red-500 cursor-pointer text-[15px] font-bold hover:text-red-600 hover:scale-110 transition-all duration-300"
                                            onClick={() => handleRemoveQuality(quality)}
                                        >
                                            x
                                        </span>
                                    </button>
                                )) : <span className="text-gray-400">Select diamond quality</span>}
                            </div>
                            {(errors.diamond_quality && touched.diamond_quality) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.diamond_quality}</p>}
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
                            {(errors.size_name && touched.size_name) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.size_name}</p>}
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
                                        className="px-3 py-1 bg-[#72727226] hover:bg-gray-300 flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {size}
                                        <span
                                            className="text-red-500 cursor-pointer text-[15px] font-bold hover:text-red-600 hover:scale-110 transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleRemoveSize(size)
                                            }}
                                        >
                                            x
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
                            {(errors.size_id && touched.size_id) && <p
                                name="size_id"
                                component="div"
                                className="text-red-500 text-sm mt-1 text-[11px]"
                            >{errors.size_id}</p>}
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
                            {(errors.weight && touched.weight) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.weight}</p>}
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
                                        className="px-3 py-1 bg-[#72727226] hover:bg-gray-300 flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {setting}
                                        <span
                                            className="text-red-500 cursor-pointer text-[15px] font-bold hover:text-red-600 hover:scale-110 transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveSetting(setting);
                                            }}
                                        >
                                            x
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
                            {(errors.diamond_setting && touched.diamond_setting) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.diamond_setting}</p>}
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
                            {(errors.diamond_shape && touched.diamond_shape) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.diamond_shape}</p>}
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
                            {(errors.no_of_diamonds && touched.no_of_diamonds) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.no_of_diamonds}</p>}
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
                                {(errors.gender && touched.gender) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.gender}</p>}
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
                            {(errors.collection && touched.collection) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.collection}</p>}
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
                        {(errors.description && touched.description) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.description}</p>}
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
                            {(errors.qty && touched.qty) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.qty}</p>}
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
                            {(errors.price && touched.price) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.price}</p>}
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
                            {(errors.discount && touched.discount) && <p className="text-red-500 text-sm mt-1 text-[11px]">{errors.discount}</p>}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 max-w-[200px] w-full border border-brown text-brown rounded-md hover:bg-brown hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 max-w-[200px] w-full bg-brown text-white rounded-md hover:bg-brown-600 transition-colors"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default AddProduct;
