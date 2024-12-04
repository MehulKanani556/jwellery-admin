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
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAllCategory } from "../reduxe/slice/catagorys.slice";
import { addOffer, deleteAllOffers, deleteOffer, editOffer, getAllOffers, updateStatusOffer } from "../reduxe/slice/offer.slice";
import { Field, Formik } from "formik";
import * as Yup from 'yup';

export default function Offer() {
    const [data, setData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const [createopen, setCreateopen] = useState(false);
    const [openView, setOpenView] = useState(false);
    const { offers } = useSelector((state) => state.offers);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [selectType, setSelectType] = useState("");
    const [selectName, setSelectName] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filterOffer, setFilterOffer] = useState(offers);

    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");

    // ====== Price and Discount Range ======
    // Calculate dynamic min and max prices based on productOffers
    const minPrice = 0;
    const maxPrice = Math.max(...offers.map(offer => offer.price)) + 1000;
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]); // Price range state
    const [discountRange, setDiscountRange] = useState([0, 100]); // Discount range state

    useEffect(() => {
        dispatch(getAllOffers());
        dispatch(getAllCategory());

    }, []);

    useEffect(() => {
        setFilterOffer(offers)
    }, [offers]);

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
    const totalPages = Math.ceil(filterOffer?.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;



    // Handle discount range change
    const handleDiscountRangeChange = (event, newValue) => {
        setDiscountRange(newValue);
    };

    // Handle filter application
    const handleApplyFilter = () => {
        setFiltersApplied(true);
        const filteredItems = offers.filter((item) => {
            const matchesTypes = selectType ? item.type === selectType : true;
            const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
            const matchesDiscount = (discountRange[0] !== 0 || discountRange[1] !== 100)
                ? (item.discount >= discountRange[0] && item.discount <= discountRange[1])
                : true;
            // Parse dates
            const itemStartDate = new Date(item.start_date);
            const itemEndDate = new Date(item.end_date);
            const filterStartDate = new Date(selectedStartDate);
            const filterEndDate = new Date(selectedEndDate);
            const matchesStartDate = selectedStartDate ? itemStartDate >= filterStartDate : true;
            const matchesEndDate = selectedEndDate ? itemEndDate <= filterEndDate : true;
            const matchesName = selectName ? item.name.toLowerCase().includes(selectName.toLowerCase()) : true;
            return matchesTypes && matchesStatus && matchesDiscount && matchesStartDate && matchesEndDate && matchesName;
        });
        handleClose();
        setFilterOffer(filteredItems);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSelectedEndDate("");
        setSelectedStartDate("");
        setSelectedStatus("");
        setSelectType("");
        setSelectName("");
        setCurrentPage(1);
        setFiltersApplied(false);
        setFilterOffer(offers);
        setPriceRange([minPrice, maxPrice]); // Reset price range
        setDiscountRange([0, 100]); // Reset discount range
    };


    // Get current items based on filtered items
    const currentItems = filterOffer?.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    // =====pagination end=====

    const handleOpen = (data) => {
        console.log("data", data)
        setCreateopen(true);
        // navigate('/product-offer/add', { state: { offerData: data } });
        setData(data);
    };
    const handleOpenView = (data) => {
        setOpenView(true);
        setData(data);
    };
    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setData(data);
    };
    const handleDeleteClose = () => {
        setDelOpen(false);
    };
    const handleDelete = () => {
        dispatch(deleteOffer({ id: data.id }));
        setDelOpen(false);
    };
    const handleCreateClose = () => {
        setCreateopen(false);
        setData("");
    };
    const handleDeleteAll = () => {
        dispatch(deleteAllOffers()).then(() => {
            setDelAllOpen(false);
        });
    }

    const handleToggle = (data) => {
        const status = data.status == "active" ? "inactive" : "active";
        dispatch(updateStatusOffer({ id: data.id, status: status }));
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        type: Yup.string().required('Type is required'),
        discount: Yup.number().typeError('Discount must be a number').positive('Discount must be positive').required('Discount is required'),
        start_date: Yup.date().required('Start date is required'),
        end_date: Yup.date().required('End date is required'),
        status: Yup.string().required('Status is required'),
    });

    return (
        <div className=" md:mx-[20px] p-4 ">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">Offers</h1>
                    <p className="text-brown-50">
                        Dashboard /{" "}
                        <span className="text-brown font-medium">Offers</span>
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
                                <div className=" p-3 pt-0">
                                    <div className="mt-4">

                                        <label className="text-brown font-bold mt-4">Offer Type</label>
                                        <select
                                            name="type"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            value={selectType}
                                            onChange={(e) => setSelectType(e.target.value)}
                                        >
                                            <option value="">Select Offer Type</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>

                                        </select>
                                    </div>
                                    <div className="mt-4">

                                        <label className="text-brown font-bold mt-4">Offer Name</label>
                                        <input
                                            type="text"
                                            className="border border-brown rounded w-full p-3 mt-1"
                                            placeholder="Enter offer name"
                                            value={selectName}
                                            onChange={(e) => setSelectName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4">

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
                                            <option value="inactive">In Active</option>
                                            <option value="active">Active</option>
                                        </select>
                                    </div>

                                    {/* Discount Range Slider */}
                                    <div className="mt-4">
                                        <label className="text-brown font-bold">Discount</label>
                                        <Slider
                                            value={discountRange}
                                            onChange={handleDiscountRangeChange}
                                            valueLabelDisplay="auto"
                                            min={0}
                                            max={100}
                                            marks={[{ value: 0, label: '0%' }, { value: 100, label: '100%' }]}
                                            style={{ width: '90%', display: 'flex', justifyContent: 'center', color: '#523C34' }}
                                            className="mx-auto flex justify-center"
                                        />
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
                            onClick={handleOpen}
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
                            <td className="py-2 px-5 text-nowrap">Offer Image</td>
                            <td className="py-2 px-5 text-nowrap">Offer Type</td>
                            <td className="py-2 px-5 text-nowrap">Description</td>
                            <td className="py-2 px-5 text-nowrap">Offer Name</td>
                            <td className="py-2 px-5 text-nowrap">Button Text</td>
                            <td className="py-2 px-5 text-nowrap">Discount</td>
                            <td className="py-2 px-5 text-nowrap">Start Date</td>
                            <td className="py-2 px-5 text-nowrap">End Date</td>
                            <td className="py-2 px-5 text-nowrap">Status</td>
                            <td className="py-2 px-5 text-nowrap">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.length > 0 ? (
                            currentItems.map((v, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="py-2 px-5 ">{v.id}</td>
                                    <td className="py-2 px-5">
                                        <img src={v.image} alt="" className="w-[50px] rounded object-cover" /></td>
                                    <td className="py-2 px-5 capitalize">{v.type}</td>
                                    <td className="py-2 px-5">{v.description}</td>
                                    <td className="py-2 px-5">{v.name}</td>
                                    <td className="py-2 px-5">{v.button_text}</td>
                                    <td className="py-2 px-5">{v.type === 'fixed' ? `₹ ${v.discount}` : `${v.discount}%`}</td>
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

            {/* Add and Edit Offer*/}
            <Modal open={createopen} onClose={handleCreateClose}>
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px] transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <p className='text-brown font-bold text-xl flex justify-between'>
                        <p>{data.id ? 'Edit Offer' : 'Add Offer'}</p>
                        <button onClick={handleCreateClose} className="font-bold"><RxCross2 /></button>
                    </p>
                    <div>
                        <Formik
                            initialValues={{

                                type: data.type || '',
                                description: data.description || '',
                                name: data.name || '',
                                image: data.image || '',
                                button_text: data.button_text || '',
                                discount: data.discount || '',
                                start_date: data.start_date || '',
                                end_date: data.end_date || '',
                                id: data.id || '',
                                status: data.status || 'active'
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { resetForm }) => {
                                if (data.id) {
                                    dispatch(editOffer(values));
                                } else {
                                    dispatch(addOffer(values));
                                }
                                resetForm();
                                handleCreateClose();
                            }}
                        >
                            {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                                <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">

                                    <div className="mb-4">
                                        <label htmlFor="type" className="block text-sm font-bold text-brown">Offer Type</label>
                                        <Field
                                            as="select"
                                            name="type"
                                            id="type"
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                        >
                                            <option value="">Select Offer Type</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </Field>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-bold text-brown">Description</label>
                                        <Field
                                            type="text"
                                            name="description"
                                            id="description"
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                            placeholder="Enter Description"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-bold text-brown">Offer Name</label>
                                        <Field
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                            placeholder="Enter Offer Name"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="image" className="block text-sm font-bold text-brown">Offer Image</label>
                                        <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                                            {values.image ? (
                                                <>
                                                    <div className="flex items-center bg-[#72727226] px-2 py-1">
                                                        <img
                                                            src={typeof values.image === "string" ? values.image : URL.createObjectURL(values.image)}
                                                            alt="Preview"
                                                            className="w-8 h-8 rounded-full mr-2"
                                                        />
                                                        <span className="flex-1">
                                                            {typeof values.image === "string" ? values.image.split("/").pop() : values.image.name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFieldValue("image", null)} // Clear the image
                                                            className="text-red-500 ml-1"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setFieldValue("image", file); // Update the image
                                                            }
                                                        }}
                                                        className="hidden"
                                                        id="file-upload"
                                                    />
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                                                    >
                                                        Change
                                                    </label>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="flex-1 text-[16px] text-[#727272]">
                                                        Choose Image
                                                    </p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                setFieldValue("image", file); // Update the image
                                                            }
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
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="button_text" className="block text-sm font-bold text-brown">Button Text</label>
                                        <Field
                                            type="text"
                                            name="button_text"
                                            id="button_text"
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                            placeholder="Enter Button Text"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="discount" className="block text-sm font-bold text-brown">Discount</label>
                                        <Field
                                            type="number"
                                            name="discount"
                                            id="discount"
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                            placeholder="Enter Discount"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="start_date" className="block text-sm font-bold text-brown">Start Date</label>
                                        <Field
                                            type="date"
                                            name="start_date"
                                            id="start_date"
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="end_date" className="block text-sm font-bold text-brown">End Date</label>
                                        <Field
                                            type="date"
                                            name="end_date"
                                            id="end_date"
                                            min={values.start_date || ''}
                                            className="mt-1 block w-full border border-brown p-2 rounded"
                                        />
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
                                            {isSubmitting ? 'Submitting...' : (data.id ? 'Edit Offer' : 'Add Offer')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </Box>
            </Modal>
            {/* View Offer*/}
            <Modal open={openView} onClose={() => setOpenView(false)}>
                <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px] transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <p className='text-brown font-bold text-xl flex justify-between'>
                        <p>View Offer</p>
                        <button onClick={() => setOpenView(false)} className="font-bold"><RxCross2 /></button>
                    </p>
                    <div>
                        <div className="p-4">
                            <div className="flex flex-col items-center">
                                <img src={data.image} alt={data.name} className="w-36 mx-auto mb-4 rounded" />
                                
                            </div>
                            <div className=" bg-white shadow-md rounded mt-4">
                                <h2 className="text-xl p-1 px-4 font-bold">Offer Details</h2>
                                <table className="w-full ">
                                    <tbody>
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Offer Name:</td>
                                            <td className="font-semibold text-brown">{data.name}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Offer Type:</td>
                                            <td className="font-semibold text-brown capitalize ">{data.type}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Button Text:</td>
                                            <td className="font-semibold text-brown">{data.button_text}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Offer Discount:</td>
                                            <td className="font-semibold text-brown">{data.type === 'fixed' ? `₹ ${data.discount}` : `${data.discount}%`}</td>
                                            
                                        </tr>
                                        
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Offer Start Date:</td>
                                            <td className="font-semibold text-brown">{data.start_date}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Offer End Date:</td>
                                            <td className="font-semibold text-brown">{data.end_date}</td>
                                        </tr>
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Status:</td>
                                            <td className="font-semibold text-brown capitalize">{data.status}</td>
                                        </tr>
                                       
                                        <tr className=" border-t ">
                                            <td className="text-gray-500 p-2 px-4">Offer Description:</td>
                                            <td className="font-semibold text-brown">{data.description}</td>
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
                            <p className="text-brown font-bold text-xl">Delete  Offer</p>
                            <p className="text-brown-50">
                                Are you sure you want to delete offer?
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
