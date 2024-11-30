import {
    Box,
    Modal,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
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
import { FaFilter } from "react-icons/fa";
import { deleteAllProducts, deleteProduct, getAllProducts } from "../reduxe/slice/product.slice";
import { useLocation, useNavigate } from "react-router-dom";
// import MenuItem from '@mui/material/MenuItem';

export default function AddProduct() {

    const [productData, setProductData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useLocation().state;
    const category = useSelector((state) => state.categorys.category);
    const subcategory = useSelector((state) => state.subcategorys.SubCategory);
    const products = useSelector((state) => state.products.products);
    console.log(products);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filterProducts, setFilterProducts] = useState(subcategory);

    useEffect(() => {
        dispatch(getAllCategory());
        dispatch(getAllSubCategory());
        dispatch(getAllProducts())
    }, []);

    useEffect(() => {
        setFilterProducts(products);
    }, [products]);

    // ======filter=====
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //  =====pagination start=====
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // Calculate total pages
    const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Handle filter application
    const handleApplyFilter = () => {
        setFiltersApplied(true);
        console.log(selectedCategory, selectedStatus);

        const filteredItems = subcategory.filter((item) => {
            const matchesCategory = selectedCategory
                ? item.category_id == selectedCategory
                : true;
            const matchesStatus = selectedStatus
                ? item.status == selectedStatus
                : true;

            return matchesCategory && matchesStatus;
        });

        handleClose();
        setFilterProducts(filteredItems);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSelectedCategory("");
        setSelectedStatus("");
        setCurrentPage(1); // Reset to the first page
        setFiltersApplied(false);
        setFilterProducts(subcategory);
    };

    // Get current items based on filtered items
    const currentItems = filterProducts.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle next and previous
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // =====pagination end=====

    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setProductData(data);
    };
    const handleDeleteClose = () => {
        setDelOpen(false);
    };
    const handleDeleteCategory = () => {
        dispatch(deleteProduct({ id: productData.id }));
        setDelOpen(false);
    };
    const handleDeleteAll = () => {
        console.log("Delete All User ");
        dispatch(deleteAllProducts());
    };

    const handleToggle = (data) => {
        const status = data.status == "active" ? "inactive" : "active";
        dispatch(updateStatusSubCategory({ id: data.id, status: status }));
    };

    const handleproductadd = (id) => {
        navigate('/product/productadd')
    }

    const handleproductview = (id) => {
        navigate('/product/Productview')
    }

    return (
        <div className=" md:mx-[20px] p-4 ">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Add Product </h1>
                    <p className="text-brown-50">
                        Dashboard / Product / {' '}
                        <span className="text-brown font-medium">Add Product</span>
                    </p>
                </div>
                <div>
                    <div className="flex gap-4  mb-4">
                        {filtersApplied ? (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                            >
                                <span>
                                    <FaFilter />
                                </span>
                                <span>Cancel</span>
                            </button>
                        ) : (
                            <button
                                className="text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            >
                                <span>
                                    <FaFilter />
                                </span>
                                <span>Filter</span>
                            </button>
                        )}
                        {/* ====== */}
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}
                            PaperProps={{
                                style: { width: "300px" },
                            }}
                        >
                            <div className="">
                                <div className="border-b-2">
                                    <p className="text-brown font-bold text-xl p-3">Filter</p>
                                </div>
                                <div className="mt-1 p-3">
                                    <label className="text-brown font-bold">Category</label>
                                    <select
                                        name="category_id"
                                        className="border border-brown rounded w-full p-3 mt-1"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {category.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="text-brown font-bold mt-4">Status</label>
                                    <select
                                        name="name"
                                        className="border border-brown rounded w-full p-3 mt-1"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Select status</option>
                                        <option value="inactive">InActive</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>
                                <div className="flex justify-center gap-8 mt-2 p-3">
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="text-brown w-36 border-brown border px-5 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleApplyFilter}
                                        className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </Menu>

                        {/* ===== */}

                        <button
                            className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                            onClick={handleDeleteAll}
                        >
                            <span>
                                <RiDeleteBin6Fill />
                            </span>
                            <span>Delete All</span>
                        </button>
                        <button
                            className="bg-brown w-32 text-white px-4 py-2 rounded"
                            onClick={() => handleproductadd()}
                        >
                            + Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-6">Product Details</h2>

                <form className="space-y-6">
                    {/* Product Name, Category, Sub Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <input type="text" placeholder="Enter name"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brown" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brown">
                                <option>Enter category</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Sub category</label>
                            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brown">
                                <option>Enter sub category</option>
                            </select>
                        </div>
                    </div>

                    {/* Metal Options Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 flex gap-4 items-center">
                            <div>
                                <label className=" text-sm font-medium mb-2">Metal color</label>
                                <div className="flex">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Rose
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        Gold
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className=" text-sm font-medium mb-2">Metal</label>
                                <div className="flex">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        14K Gold
                                    </label>
                                    <label className="flex items-center">
                                        <input type="checkbox" className="mr-2" />
                                        18K Gold
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Image Upload */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Image</label>
                            <div className="flex items-center justify-between border rounded-md p-2">
                                <input type="text" placeholder="Choose Image" className="flex-1" readOnly />
                                <button type="button" className="px-4 py-1 bg-brown text-white rounded-md">Browse</button>
                            </div>
                        </div>
                    </div>

                    {/* Diamond Properties Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1 flex gap-4 items-center justify-between w-full">
                            <div className="w-50">
                                <label className="block text-sm font-medium mb-2">Diamond Color</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option>Diamond Color</option>
                                </select>
                            </div>
                            <div className="w-50">
                                <label className="block text-sm font-medium mb-2">Clarity</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option>Clarity</option>
                                </select>
                            </div>
                            <div>
                                <button type="button" className="px-3 py-1 bg-brown text-white rounded-md">
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Diamond Quality</label>
                            <div className="flex flex-wrap gap-2 border rounded-md p-2">
                                <button type="button" className="px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    GH/VS1 <span className="text-red-500">×</span>
                                </button>
                                <button type="button" className="px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    D/VS1 <span className="text-red-500">×</span>
                                </button>
                                <button type="button" className="px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    D/VS1 <span className="text-red-500">×</span>
                                </button>
                                <button type="button" className="px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-1">
                                    D/VS1 <span className="text-red-500">×</span>
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-medium mb-2">Size Name</label>
                            <select className="w-full px-3 py-2 border rounded-md">
                                <option>Select Size name</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Size Name</label>
                            <select className="w-full px-3 py-2 border rounded-md">
                                <option>Select Size name</option>
                            </select>
                        </div>
                        {/* <div>
                            <label className="block text-sm font-medium mb-2">Weight</label>
                            <input type="text" placeholder="Enter Weight"
                                className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">No of Diamond</label>
                            <input type="text" placeholder="Enter no of diamond"
                                className="w-full px-3 py-2 border rounded-md" />
                        </div> */}
                    </div>

                    {/* {.....} */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Name</label>
                            <input type="text" placeholder="Enter name"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brown" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brown">
                                <option>Enter category</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Sub category</label>
                            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brown">
                                <option>Enter sub category</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea rows="4" placeholder="Enter Description"
                            className="w-full px-3 py-2 border rounded-md"></textarea>
                    </div>

                    {/* Price Details Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Qty</label>
                            <input type="number" placeholder="Enter Qty"
                                className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Price</label>
                            <input type="number" placeholder="Enter Price"
                                className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Discount</label>
                            <input type="number" placeholder="Discount Value"
                                className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button"
                            className="px-6 py-2 border rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-6 py-2 bg-brown text-white rounded-md hover:bg-brown-600">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
