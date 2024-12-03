import {
    Box,
    Modal,
} from "@mui/material";
import ReactOwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

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
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];



const ProductView = React.memo(() => {

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
    console.log(products, category, subcategory, size);

    const [filteredSubcategorys, setFilteredSubcategorys] = useState([]);
    const [filteredSize, setFilteredSize] = useState([]);
    console.log(filteredSubcategorys, filteredSize);


    useEffect(() => {
        dispatch(getAllCategory());
        dispatch(getAllSubCategory());
        if (id) {
            dispatch(getSingleProducts(id));
        }
        dispatch(getAllSizes());
    }, []);

    const [mainImage, setMainImage] = useState(0);

    const thumbnailOptions = {
        items: 6,
        loop: true,
        margin: 10,
        nav: true,
        dots: false,
        navSpeed: 500,
        navText: [
            `<div style="color: white"><i><MdKeyboardArrowLeft /></i></div>`,
            `<div style="color: white"><i><MdKeyboardArrowRight /></i></div>`
        ],
        responsive: {
            0: { items: 2 },
            600: { items: 4 },
            1000: { items: 6 }
        }
    };

    return (
        <div className="md:mx-[20px] p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">View Product</h1>
                    <p className="text-brown-50">
                        Dashboard / Product / {' '}
                        <span className="text-brown font-medium">View product</span>
                    </p>
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left side - Images */}
                    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="relative aspect-square">
                            <img
                                src={products?.images?.[0] || '/placeholder-image.jpg'}
                                alt="Product"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="relative aspect-square">
                            <img
                                src={products?.images?.[0] || '/placeholder-image.jpg'}
                                alt="Product"
                                className="w-full h-full object-cover "
                            />
                        </div>
                        <div className="relative aspect-square">
                            <img
                                src={products?.images?.[0] || '/placeholder-image.jpg'}
                                alt="Product"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="relative aspect-square">
                            <img
                                src={products?.images?.[0] || '/placeholder-image.jpg'}
                                alt="Product"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="col-span-2 h-[100px] w-full relative">
                            <ReactOwlCarousel className="product-thumbs-carousel w-full h-full" {...thumbnailOptions}>
                                {products?.images?.map((thumb, index) => (
                                    <div
                                        key={index}
                                        className={`aspect-square cursor-pointer h-full w-full`}
                                        onClick={() => setMainImage(index)}
                                    >
                                        <img
                                            src={thumb || '/placeholder-image.jpg'}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </ReactOwlCarousel>
                        </div>
                    </div>

                    {/* Right side - Product Details */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">{products?.name || "Dual Tone Halo Diamond Finger Ring"}</h2>
                        <div className="text-2xl font-semibold">₹{products?.price || "141268.00"}</div>

                        <p className="text-gray-600">{products?.description || "Make a statement with this 18 Karat white and rose gold Finger Ring, featuring a dazzling central Diamond surrounded by two halos of real Diamonds.Perfect for engagements or special occasions, this real Diamond Finger Ring brings together modern sophistication and classic charm, making it a truly memorable piece."}</p>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <span className="font-medium w-32">Metal Color:</span>
                                <span>Gold, Rose</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium w-32">Metal:</span>
                                <span>14 K Gold, 18 K Gold</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium w-32">Gender:</span>
                                <span>Women</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium w-32">Size:</span>
                                <span>5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23</span>
                            </div>
                            {/* Add more product details as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductView;
