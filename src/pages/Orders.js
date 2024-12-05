import {
    Box,
    Modal,
    Slider,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../reduxe/slice/catagorys.slice";
import { addOffer, deleteAllorders, deleteOffer, editOffer, updateStatusOffer } from "../reduxe/slice/offer.slice";
import { Field, Formik } from "formik";
import * as Yup from 'yup';
import { deleteAllOrders, getAllOrders } from "../reduxe/slice/orders.slice";
import { FiChevronDown } from "react-icons/fi";

export default function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const { orders } = useSelector((state) => state.orders);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filterOrder, setFilterOrder] = useState(orders);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    useEffect(() => {
        setFilterOrder(orders)

    }, [orders]);


    useEffect(() => {
        const filteredItems = selectedDate ? orders.filter(order => order.order_date === selectedDate) : orders;
        setFilterOrder(filteredItems);
    }, [selectedDate]);
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
    const totalPages = Math.ceil(filterOrder?.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;




    // Handle filter application
    const handleApplyFilter = (status) => {
        setFiltersApplied(true);
        const filteredItems = orders.filter((item) => {

            if (status == 'week') {
                // Check if the status is 'week' and filter based on the current week
                const itemDate = new Date(item.order_date);
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
                const endOfWeek = new Date();
                endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // Saturday

                // Adjusted logic for matchesWeek
                const matchesWeek = status === 'week' ? itemDate >= startOfWeek && itemDate <= endOfWeek : true;
                return matchesWeek;
            }
            else {
                const matchesStatus = status ? item.order_status === status : true;
                return matchesStatus;
            }




        });
        handleClose();
        setFilterOrder(filteredItems);
        console.log(filteredItems);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSelectedStatus("");
        setCurrentPage(1);
        setFiltersApplied(false);
        setFilterOrder(orders);
        handleClose();

    };


    // Get current items based on filtered items
    const currentItems = filterOrder?.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    // =====pagination end=====


    const handleDeleteAll = () => {
        dispatch(deleteAllOrders()).then(() => {
            setDelAllOpen(false);
        });
    }
    // Handle date change
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Update selected date
    };
    const handleToggle = (data) => {
        const status = data.status == "active" ? "inactive" : "active";
        dispatch(updateStatusOffer({ id: data.id, status: status }));
    };



    return (
        <div className=" md:mx-[20px] p-4 ">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Orders</h1>
                    <p className="text-brown-50">
                        Dashboard /{" "}
                        <span className="text-brown font-medium">Orders</span>
                    </p>
                </div>
                <div>
                    <div className="flex gap-4  mb-4">
                        <button className="text-brown border-brown border  px-4  rounded">
                            <input type="date" value={selectedDate} onChange={handleDateChange} /> {/* Update input to use selected date */}
                        </button>

                        <button
                            className="text-brown  border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            <span>
                                {selectedStatus ? (
                                selectedStatus === 'week' ? 'This Week' : 
                                selectedStatus === 'delivered' ? 'Order Delivered' : 
                                selectedStatus === 'cancelled' ? 'Order Cancelled' : 
                                selectedStatus === 'pending' ? 'Order Pending' : 'Sort by'
                                ) : 'Sort by'}
                            </span>
                            <span>
                                <FiChevronDown />

                            </span>
                        </button>
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
                                style: { width: "150px" },
                            }}
                        >
                            <div className="">

                                <div className=" px-2 pt-0">


                                    <div className="flex flex-col items-start">
                                        <button
                                            className={` rounded p-1 ${selectedStatus === 'week' ? 'font-bold text-brown' : 'text-brown'}`}
                                            onClick={() => {
                                                setSelectedStatus('week');
                                                handleApplyFilter('week');
                                            }}
                                        >
                                            This Week
                                        </button>
                                        <button
                                            className={` rounded p-1 ${selectedStatus === 'delivered' ? 'font-bold text-brown' : 'text-brown'}`}
                                            onClick={() => {
                                                setSelectedStatus('delivered');
                                                handleApplyFilter('delivered');
                                            }}
                                        >
                                            Order Delivered
                                        </button>
                                        <button
                                            className={` rounded p-1 ${selectedStatus === 'cancelled' ? 'font-bold text-brown' : 'text-brown'}`}
                                            onClick={() => {
                                                setSelectedStatus('cancelled');
                                                handleApplyFilter('cancelled');
                                            }}
                                        >
                                            Order Cancelled
                                        </button>
                                        <button
                                            className={` rounded p-1 ${selectedStatus === 'pending' ? 'font-bold text-brown' : 'text-brown'}`}
                                            onClick={() => {
                                                setSelectedStatus('pending');
                                                handleApplyFilter('pending');
                                            }}
                                        >
                                            Order Pending
                                        </button>
                                    </div>



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

                    </div>
                </div>
            </div>
            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white">
                    <thead>
                        <tr className="text-brown font-bold">
                            <td className="py-2 px-5">ID</td>
                            <td className="py-2 px-5 text-nowrap">Customer Name</td>
                            <td className="py-2 px-5 text-nowrap">Order Date</td>
                            <td className="py-2 px-5 text-nowrap">Total Amount</td>
                            <td className="py-2 px-5 text-nowrap">Order Status</td>
                            <td className="py-2 px-5 text-nowrap">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((v, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="py-2 px-5 ">{v.id}</td>

                                    <td className="py-2 px-5">{v.customer_name}</td>
                                    <td className="py-2 px-5">{v.order_date}</td>
                                    <td className="py-2 px-5">{v.total_amount}</td>
                                    <td className="py-2 px-5 capitalize ">
                                        <div className={`font-semibold w-24 text-center text-sm px-3 py-1 rounded ${v.order_status === 'delivered' ? 'bg-green-200 text-green-800 ' :
                                            v.order_status === 'cancelled' ? 'bg-red-200 text-red-600' :
                                                v.order_status === 'transit' ? 'bg-gray-200 text-brown ' :
                                                    'bg-yellow-200 text-yellow-700'}`}>
                                            {v.order_status}
                                        </div>
                                    </td>

                                    <td className="py-2 px-5 flex items-center gap-2">
                                        <button className="text-brown text-xl p-1 border border-brown-50 rounded" onClick={() => navigate(`/order/view/${v.id}`)}><BsFillEyeFill /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="py-2 px-4 text-center text-gray p-2 px-4-500 border-t">No records found</td>
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





            {/* Delete All Orders */}
            <Modal
                open={delAllOpen}
                onClose={() => setDelAllOpen(false)}

            >
                <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                    <div className='  p-5'>
                        <div className='text-center'>

                            <p className='text-brown font-bold text-xl'>Delete All  Offer</p>
                            <p className='text-brown-50'>Are you sure you want to delete all
                                offer?</p>
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