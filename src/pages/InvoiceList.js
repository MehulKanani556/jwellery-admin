import {
    Box,
    Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { RiDeleteBin6Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import { FaFilter } from "react-icons/fa";
import {
    addCoupon, deleteAllCoupons,
    deleteCoupon,
    editCoupon,
    getAllCoupons,
    updateStatusCoupon,
} from "../reduxe/slice/coupons.slice";
// import MenuItem from '@mui/material/MenuItem';
import Loader from "../components/Loader";
export default function Coupons() {
    const [couponData, setCouponData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const [createopen, setCreateopen] = useState(false);
    const { coupons,loading } = useSelector((state) => state.coupons);
    const [delAllOpen, setDelAllOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filterCoupon, setFilterCoupon] = useState(coupons);

    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");

    useEffect(() => {
        dispatch(getAllCoupons());
    }, []);

    useEffect(() => {
        setFilterCoupon(coupons)
    }, [coupons]);

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
    const totalPages = Math.ceil(filterCoupon?.length / itemsPerPage);

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

        const filteredItems = coupons.filter((item) => {
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
        setFilterCoupon(filteredItems);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSelectedEndDate("");
        setSelectedStartDate("");
        setSelectedStatus("");
        setCurrentPage(1); // Reset to the first page
        setFiltersApplied(false);
        setFilterCoupon(coupons);
        handleClose();
    };


    // Get current items based on filtered items
    const currentItems = filterCoupon.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    // =====pagination end=====

    const handleOpen = (data) => {
        setCreateopen(true);
        setCouponData(data);
    };

    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setCouponData(data);
    };
    const handleDeleteClose = () => {
        setDelOpen(false);
    };
    const handleDelete
        = () => {
            console.log("Delete coupon", couponData);
            dispatch(deleteCoupon({ id: couponData.id }));
            setDelOpen(false);
        };


    const handleCreateClose = () => {
        setCreateopen(false);
        setCouponData("");
    };
    const handleDeleteAll = () => {
        dispatch(deleteAllCoupons()).then(() => {
            setDelAllOpen(false);
        });
    }

    const handleToggle = (data) => {
        const status = data.status == "active" ? "inactive" : "active";
        dispatch(updateStatusCoupon({ id: data.id, status: status }));
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
        loading  ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader/></div> : 
        <div className="container  p-5 md:p-10">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Invoice </h1>
                    <p className="text-brown-50">
                        Dashboard /{" "}
                        <span className="text-brown font-medium">Invoice</span>
                    </p>
                </div>
                <div>
                    <div className="flex gap-4  mb-4">
                        <button
                            className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                            onClick={() => { setDelAllOpen(true) }}
                        >
                            <span>
                                <RiDeleteBin6Fill />
                            </span>
                            <span>Delete All</span>
                        </button>
                        
                    </div>
                </div>
            </div>
            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white">
                    <thead>
                        <tr className="text-brown font-bold">
                            <td className="py-2 px-5 ">ID</td>
                            <td className="py-2 px-5 ">Name</td>
                            <td className="py-2 px-5 ">Email</td>
                            <td className="py-2 px-5 ">Date</td>
                            <td className="py-2 px-5 ">Amount</td>
                            <td className="py-2 px-5 ">Status</td>
                            <td className="py-2 px-5 ">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((v, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="py-2 px-5">{v.id}</td>
                                    <td className="py-2 px-5">{v.code}</td>
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
                                        <div>
                                            <button
                                                className="text-green-700 text-xl p-1 border border-brown-50 rounded"
                                                onClick={() => handleOpen(v)}
                                            >
                                                <RiEdit2Fill />
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className="text-red-500 text-xl p-1 border border-brown-50 rounded"
                                                onClick={() => handleDeleteOpen(v)}
                                            >
                                                <RiDeleteBin6Fill />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-2 px-4 text-center text-gray-500 border-t">No records found</td>
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

            {/* create & update  Coupon*/}
            <Modal open={createopen} onClose={handleCreateClose}>
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px] transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <p className='text-brown font-bold text-xl flex justify-between'>
                        <p>{couponData ? 'Edit Coupon' : 'Add Coupon'}</p>
                        <button onClick={handleCreateClose} className="font-bold"><RxCross2 /></button>
                    </p>
                    <div>
                        <Formik
                            initialValues={{
                                name: couponData ? couponData.name : "",
                                code: couponData ? couponData.code : "",
                                description: couponData ? couponData.description : "",
                                type: couponData ? couponData.type : "",
                                price: couponData ? couponData.price : "",
                                start_date: couponData ? couponData.start_date : "",
                                end_date: couponData ? couponData.end_date : "",
                                id: couponData ? couponData.id : "",
                                status: couponData ? couponData.status : "active",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { resetForm }) => {
                                if (couponData) {
                                    dispatch(editCoupon(values));
                                } else {
                                    dispatch(addCoupon(values));
                                }
                                resetForm();
                                handleCreateClose();
                            }}
                        >
                            {({ handleSubmit, isSubmitting, values }) => (
                                <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">Code</label>
                                        <Field
                                            type="text"
                                            name="code"
                                            placeholder="Enter Code"
                                            className="border border-brown rounded w-full p-2 mt-1"
                                        />
                                        <ErrorMessage name="code" component="div" className="text-red-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">Coupon Name</label>
                                        <Field
                                            type="text"
                                            name="name"
                                            placeholder="Enter Coupon Name"
                                            className="border border-brown rounded w-full p-2 mt-1"
                                        />
                                        <ErrorMessage name="name" component="div" className="text-red-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">Description</label>
                                        <Field
                                            type="text"
                                            name="description"
                                            placeholder="Enter Description"
                                            className="border border-brown rounded w-full p-2 mt-1"
                                        />
                                        <ErrorMessage name="description" component="div" className="text-red-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">Coupon type</label>
                                        <Field
                                            as="select"
                                            name="type"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                        >
                                            <option value="">Select</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </Field>
                                        <ErrorMessage name="type" component="div" className="text-red-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">Price</label>
                                        <Field
                                            type="text"
                                            name="price"
                                            placeholder="Enter Price"
                                            className="border border-brown rounded w-full p-2 mt-1"
                                        />
                                        <ErrorMessage name="price" component="div" className="text-red-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">Start Date</label>
                                        <Field
                                            type="date"
                                            name="start_date"
                                            className="border border-brown rounded w-full p-2 mt-1"
                                        />
                                        <ErrorMessage name="start_date" component="div" className="text-red-500" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-brown font-bold mt-4">End Date</label>
                                        <Field
                                            type="date"
                                            name="end_date"
                                            min={values.start_date || ''}
                                            className="border border-brown rounded w-full p-2 mt-1"
                                        />
                                        <ErrorMessage name="end_date" component="div" className="text-red-500" />
                                    </div>
                                    <div className='flex flex-col md:flex-row gap-2 p-5 pb-2'>
                                        <button className='text-brown hover:bg-brown-50 border-brown border p-2 rounded w-full' onClick={handleCreateClose}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full"
                                        >
                                            {isSubmitting ? 'Submitting...' : (couponData ? 'Edit' : 'Add')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </Box>
            </Modal>

            {/* Delete Coupon */}
            <Modal open={delOpen} onClose={handleDeleteClose}>
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">Delete Coupon</p>
                            <p className="text-brown-50">
                                Are you sure you want to delete coupon?
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

                            <p className='text-brown font-bold text-xl'>Delete All Coupon</p>
                            <p className='text-brown-50'>Are you sure you want to delete all
                                coupon?</p>
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
