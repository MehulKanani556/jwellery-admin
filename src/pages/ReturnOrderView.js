import {
    Box,
    Menu,
    Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";
import { getAllReturnOrders, deleteAllReturnOrders, updateStatusReturnOrder } from "../reduxe/slice/returnorder.slice";
import { FiArrowLeft } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import Loader from "../components/Loader";
export default function ReturnOrderView() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { returnOrders,loading } = useSelector((state) => state.returnorders);

    const [delAllOpen, setDelAllOpen] = useState(false);

    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filterReturn, setFilterReturn] = useState(returnOrders);
    const [selectName, setSelectName] = useState('');
    const [selectDate, setSelectDate] = useState('');
    const [selectStatus, setSelectStatus] = useState('');


    useEffect(() => {
        dispatch(getAllReturnOrders());
    }, [dispatch]);

    useEffect(() => {
        setFilterReturn(returnOrders)
        // handleApplyFilter();
    }, [returnOrders]);



    //  =====pagination start=====
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page
    // Calculate total pages
    const totalPages = Math.ceil(filterReturn?.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // ======filter=====
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    // Handle filter application
    const handleApplyFilter = () => {
        setFiltersApplied(true);
        const filteredItems = returnOrders.filter((item) => {

            // const matchesStatus = item.return_status === "pending";
            const matchesName = selectName ? item.product.toLowerCase().includes(selectName.toLowerCase()) : true;
            const matchesDate = selectDate ? item.return_date == selectDate : true;
            const matchesStatus = selectStatus ? item.return_status == selectStatus : true;
            return matchesName && matchesDate && matchesStatus;
        });
        setFilterReturn(filteredItems);
    };

    const handleResetFilters = () => {
        // setSelectedEndDate("");
        // setSelectedStartDate("");
        setSelectStatus("");
        setSelectDate("");
        setSelectName("");
        setCurrentPage(1);
        setFiltersApplied(false);
        handleClose();
        setFilterReturn(returnOrders);
        // setPriceRange([minPrice, maxPrice]); // Reset price range
        // setDiscountRange([0, 100]); // Reset discount range
    };

    // Get current items based on filtered items
    const currentItems = filterReturn?.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    const handleDeleteAll = () => {
        dispatch(deleteAllReturnOrders()).then(() => {
            setDelAllOpen(false);
        });
    }

    const handleToggle = (data) => {
        dispatch(updateStatusReturnOrder({ id: data.id, return_status: data.status }));
    };

    return (
        loading  ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader/></div> : 
        <div className="container p-5 md:p-10 ">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">View Return Orders</h1>
                    <p className="text-brown-50">
                        Dashboard /{" "}
                        <span className="text-brown font-medium">View Return Orders</span>
                    </p>
                </div>
                <div>
                    <div className="flex gap-4  mb-4">
                        <button
                            className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                            onClick={() => navigate('/return-order')}
                        >
                            <span>
                                <FiArrowLeft />
                            </span>
                            <span>
                                Back
                            </span>
                        </button>

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
                                <div className=" p-3 pt-0">

                                    <div className="mt-4">

                                        <label className="text-brown font-bold mt-4">Product Name</label>
                                        <input
                                            type="text"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            placeholder="Enter product name"
                                            value={selectName}
                                            onChange={(e) => setSelectName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4">

                                        <label className="text-brown font-bold"> Date</label>
                                        <input
                                            type="date"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            value={selectDate}
                                            onChange={(e) => setSelectDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4">

                                        <label className="text-brown font-bold mt-4">Status</label>
                                        <select
                                            name="status"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            value={selectStatus}
                                            onChange={(e) => setSelectStatus(e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="pending">Pending</option>
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
                    </div>
                </div>
            </div>
            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white">
                    <thead>
                        <tr className="text-brown font-bold">
                            <td className="py-2 px-5">ID</td>
                            <td className="py-2 px-5 text-nowrap">Customer Name</td>
                            <td className="py-2 px-5 text-nowrap">Product</td>
                            <td className="py-2 px-5 text-nowrap">Date</td>
                            <td className="py-2 px-5 text-nowrap">Status</td>
                            <td className="py-2 px-5 text-nowrap">Reason</td>
                        </tr>
                    </thead>
                    <tbody>
                        {console.log(currentItems)}
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((v, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="py-2 px-5 ">{v.id}</td>
                                    <td className="py-2 px-5 capitalize">{v.customer}</td>
                                    <td className="py-2 px-5">{v.product}</td>
                                    <td className="py-2 px-5 text-nowrap">{v.return_date ? new Date(v.return_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</td>
                                    <td className="py-2 px-5 flex gap-2 capitalize">
                                        <span className={`font-semibold w-24 text-center text-sm px-3 py-1 rounded ${v.return_status === 'accepted' ? 'bg-green-200 text-green-800 ' : v.return_status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-700'}`}>
                                            {v.return_status}
                                        </span>

                                    </td>
                                    <td className="py-2 px-5">{v.reason}</td>
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


            {/* Delete All coupon */}
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
