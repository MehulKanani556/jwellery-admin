import {
    Box,
    Button,
    Modal,
    Typography,
    Select,
    MenuItem,
    Divider,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import img from "../Images/user.png";
import { RxCross2 } from "react-icons/rx";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import { FaFilter, FaEye } from "react-icons/fa";
import { useFormik } from 'formik';
import {
    addCoupon, deleteAllCoupons,
    deleteCoupon,
    editCoupon,
    getAllCoupons,
    updateStatusCoupon,
} from "../reduxe/slice/coupons.slice";
import { deleteAllProductOffers, deleteProductOffer, getAllProductOffers, updateStatusProductOffer } from "../reduxe/slice/productoffer.slice";
import { useNavigate } from "react-router-dom";
// import MenuItem from '@mui/material/MenuItem';

export default function ProductOffer() {
    const [data, setData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const [createopen, setCreateopen] = useState(false);
    const { productOffers } = useSelector((state) => state.productoffers);
    console.log(productOffers)
    const navigate = useNavigate();
    const [delAllOpen, setDelAllOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filterPOffer, setFilterPOffer] = useState(productOffers);

    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");

    useEffect(() => {
        dispatch(getAllProductOffers());
    }, []);

    useEffect(() => {
        setFilterPOffer(productOffers)
    }, [productOffers]);

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
    const totalPages = Math.ceil(filterPOffer?.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Handle filter application
    const handleApplyFilter = () => {
        setFiltersApplied(true);
        console.log("Filters applied:", {
            selectedCategory,
            selectedStatus,
            selectedStartDate,
            selectedEndDate,
        });

        const filteredItems = productOffers.filter((item) => {
            const matchesCategory = selectedCategory ? item.category_id == selectedCategory : true;
            const matchesStatus = selectedStatus ? item.status == selectedStatus : true;

            // Parse dates
            const itemStartDate = new Date(item.start_date);
            const itemEndDate = new Date(item.end_date);
            const filterStartDate = new Date(selectedStartDate);
            const filterEndDate = new Date(selectedEndDate);



            const matchesStartDate = selectedStartDate ? itemStartDate >= filterStartDate : true;
            const matchesEndDate = selectedEndDate ? itemEndDate <= filterEndDate : true; // Ensure end date is less than or equal to the filter end date

            return matchesCategory && matchesStatus && matchesStartDate && matchesEndDate;
        });

        handleClose();
        setFilterPOffer(filteredItems);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSelectedEndDate("");
        setSelectedStartDate("");
        setSelectedStatus("");
        setCurrentPage(1); // Reset to the first page
        setFiltersApplied(false);
        setFilterPOffer(productOffers);
    };


    // Get current items based on filtered items
    const currentItems = filterPOffer?.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    // =====pagination end=====

    const handleOpen = (data) => {
        navigate('/product-offer/add', { state: { offerData: data } });
    };
    const handleOpenView = (data) => {
        setCreateopen(true);
        setData(data);
    };
    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setData(data);
    };
    const handleDeleteClose = () => {
        setDelOpen(false);
    };
    const handleDelete
        = () => {

            dispatch(deleteProductOffer({ id: data.id }));
            setDelOpen(false);
        };


    const handleCreateClose = () => {
        setCreateopen(false);
        setData("");
    };
    const handleDeleteAll = () => {
        dispatch(deleteAllProductOffers()).then(() => {
            setDelAllOpen(false);
        });
    }

    const handleToggle = (data) => {
        const status = data.status == "active" ? "inactive" : "active";

        dispatch(updateStatusProductOffer({ id: data.id, status: status }));
    };

    // Validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Coupon Name is required"),
        code: Yup.string().required("Code is required"),
        description: Yup.string().required("Description is required"),
        type: Yup.string().required("Coupon type is required"),
        price: Yup.number().required("Price is required"),
        start_date: Yup.date().required("Start date is required"),
        end_date: Yup.date()
            .required("End date is required")
            .min(
                Yup.ref('start_date'),
                ({ min }) => `End date must be after ${min ? new Date(min).toLocaleDateString() : 'start date'}`
            ),
    });

    return (
        <div className=" md:mx-[20px] p-4 ">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Product Offers</h1>
                    <p className="text-brown-50">
                        Dashboard /{" "}
                        <span className="text-brown font-medium">Product Offers</span>
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
                                Cancel
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
                                <div className=" p-3">.
                                    <div className="">

                                        <label className="text-brown font-bold">Start Date</label>
                                        <input
                                            type="date"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            value={selectedStartDate}
                                            onChange={(e) => setSelectedStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4">

                                        <label className="text-brown font-bold mt-4">End Date</label>
                                        <input
                                            type="date"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            value={selectedEndDate}
                                            min={selectedStartDate}
                                            onChange={(e) => setSelectedEndDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4">

                                        <label className="text-brown font-bold mt-4">Status</label>
                                        <select
                                            name="status"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="inactive">InActive</option>
                                            <option value="active">Active</option>
                                        </select>
                                    </div>

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
                            onClick={() => { setDelAllOpen(true) }}
                        >
                            <span>
                                <RiDeleteBin6Fill />
                            </span>
                            <span>Delete All</span>
                        </button>
                        <button
                            className="bg-brown w-32 text-white px-4 py-2 rounded"
                            onClick={() => { navigate('/product-offer/add') }}
                        >
                            + Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white">
                    <thead>
                        <tr className="text-brown font-bold">
                            <td className="py-2 px-5">ID</td>
                            <td className="py-2 px-5">Category</td>
                            <td className="py-2 px-5">Product Name</td>
                            <td className="py-2 px-5">Code</td>
                            <td className="py-2 px-5">Discount</td>
                            <td className="py-2 px-5">Price</td>
                            <td className="py-2 px-5">Start Date</td>
                            <td className="py-2 px-5">End Date</td>
                            <td className="py-2 px-5">Status</td>
                            <td className="py-2 px-5">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((v, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="py-2 px-5">{v.id}</td>
                                    <td className="py-2 px-5">{v.category}</td>
                                    <td className="py-2 px-5">{v.product}</td>
                                    <td className="py-2 px-5">{v.code}</td>
                                    <td className="py-2 px-5">{v.type === 'fixed' ? `₹ ${v.discount}` : `${v.discount}%`}</td>
                                    <td className="py-2 px-5">₹ {v.price}</td>
                                    <td className="py-2 px-5">{v.start_date}</td>
                                    <td className="py-2 px-5">{v.end_date}</td>
                                    <td className="py-2 px-5">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={v.status}
                                                onChange={() => handleToggle(v)}
                                                className="sr-only peer"
                                            />
                                            <div
                                                className={`relative w-[30px] h-[17px] rounded-full transition-colors duration-200 ${v.status == "active" ? "bg-[#523C34]" : "bg-gray-500"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-[13px] h-[13px] rounded-full transition-transform duration-200 ${v.status == "active"
                                                        ? "translate-x-[13px] bg-white"
                                                        : "bg-white"
                                                        }`}
                                                ></div>
                                            </div>
                                        </label>
                                    </td>
                                    <td className="py-2 px-5 flex items-center gap-2">
                                        <button className="text-brown text-xl p-1 border border-brown-50 rounded" onClick={() => handleOpenView(v)}><BsFillEyeFill /></button>

                                        <button className="text-green-700 text-xl p-1 border border-brown-50 rounded" onClick={() => handleOpen(v)}>
                                            <RiEdit2Fill />
                                        </button>
                                        <button className="text-red-500 text-xl p-1 border border-brown-50 rounded" onClick={() => handleDeleteOpen(v)}>
                                            <RiDeleteBin6Fill />
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-2 px-4 text-center text-gray p-1 px-4-500 border-t">No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => handlePageChange(page)}
                variant="outlined"
                shape="rounded"
                className="flex justify-end m-4"
                siblingCount={1} // Show one sibling page on each side
                boundaryCount={1} // Show one boundary page at the start and end
                sx={{
                    "& .MuiPaginationItem-root": {
                        color: "text.primary", // Default color for pagination items
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "#523b33", // Active page background color
                        color: "white", // Active page text color
                    },
                    "& .MuiPaginationItem-root:hover": {
                        backgroundColor: "lightgray", // Hover effect
                    },
                }}
            />

            {/* view product offer*/}
            <Modal open={createopen} onClose={handleCreateClose}>
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px] transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <p className='text-brown font-bold text-xl flex justify-between'>
                        <p>View Product Offers</p>
                        <button onClick={handleCreateClose} className="font-bold"><RxCross2 /></button>
                    </p>
                    <div>
                        {console.log(data.product_image)}
                        <div className="p-4">
                            <div className="flex flex-col items-center">
                                <img src={data.product_image} alt={data.name} className="w-36 mx-auto mb-4 rounded" />
                                <div className="w-full">
                                    <table className="bg-white shadow-md rounded w-full mt-4 ">
                                        <tbody>
                                            <tr className=" border-t ">
                                                <td className="text-gray p-1 px-4">Category:</td>
                                                <td className="font-semibold ">{data.category}</td>
                                            </tr>
                                            <tr className=" border-t ">
                                                <td className="text-gray p-1 px-4">Sub Category:</td>
                                                <td className="font-semibold ">{data.subcategory}</td>
                                            </tr>
                                            <tr className=" border-t ">
                                                <td className="text-gray p-1 px-4">Product ID:</td>
                                                <td className="font-semibold ">{data.product_id}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className=" bg-white shadow-md rounded mt-4">
                                <h2 className="text-xl p-1 px-4 font-bold">Offer Details</h2>
                                <table className="w-full ">
                                    <tbody>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Name:</td>
                                            <td className="font-semibold ">{data.name}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Type:</td>
                                            <td className="font-semibold ">{data.type}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Code:</td>
                                            <td className="font-semibold ">{data.code}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Discount:</td>
                                            <td className="font-semibold ">{data.discount}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Price:</td>
                                            <td className="font-semibold ">{data.price}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Start Date:</td>
                                            <td className="font-semibold ">{data.start_date}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer End Date:</td>
                                            <td className="font-semibold ">{data.end_date}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Minimum Purchase:</td>
                                            <td className="font-semibold ">{data.minimum_purchase}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Maximum Discount:</td>
                                            <td className="font-semibold ">{data.minimum_discount}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray p-1 px-4">Offer Description:</td>
                                            <td className="font-semibold ">{data.description}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>

            {/* Delete Coupon */}
            <Modal open={delOpen} onClose={handleDeleteClose}>
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">Delete Product Offer</p>
                            <p className="text-brown-50">
                                Are you sure you want to delete product offer?
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center">
                            <button
                                onClick={handleDeleteClose}
                                className="text-brown w-32 border-brown border px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
            {/* Delete All coupon */}
            <Modal
                open={delAllOpen}
                onClose={() => setDelAllOpen(false)}

            >
                <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                    <div className='  p-5'>
                        <div className='text-center'>

                            <p className='text-brown font-bold text-xl'>Delete All Product Offer</p>
                            <p className='text-brown-50'>Are you sure you want to delete all
                                product offer?</p>
                        </div>
                        <div className='flex flex-wrap justify-center gap-3 mt-4'>
                            <button onClick={() => setDelAllOpen(false)} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDeleteAll} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                        </div>

                    </div>

                </Box>
            </Modal>
        </div>
    );
}
