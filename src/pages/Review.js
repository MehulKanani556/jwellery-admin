import { Box, Modal, Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllReviews, deleteReview, getAllReviews } from '../reduxe/slice/review.slice'
import { FaStar } from 'react-icons/fa'
import Loader from '../components/Loader'
export default function Review() {
    const [Data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [delAllOpen, setDelAllOpen] = useState(false);

    const dispatch = useDispatch();
    const { reviews, loading } = useSelector(state => state.reviews);
    console.log(reviews)
    useEffect(() => {
        dispatch(getAllReviews())
    }, []);


    // Pagination statecurrentItems
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // State for selected date
    const [selectedDate, setSelectedDate] = useState('');

    // Filter reviews by selected date
    const filteredReviews = selectedDate ? reviews.filter(review => new Date(review.date).toISOString().split('T')[0] == selectedDate) : reviews;

    // Calculate total pages after defining filteredReviews
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleOpen = (data) => {
        setOpen(true);
        setData(data)
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setData(data)
    }
    const handleDeleteClose = () => {
        setDelOpen(false);
    }

    const handleDeleteReview = () => {
        dispatch(deleteReview({ id: Data.id }))
        // dispatch(getAllUsers())
        setDelOpen(false);
    }
    const handleDeleteAll = () => {
        console.log('Delete All User ',)
        dispatch(deleteAllReviews()).then(() => {
            setDelAllOpen(false);
        });

    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? "text-yellow-500 " : "text-gray-300"}>
                    <FaStar />
                </span>
            );
        }
        return stars;
    }

    // Handle date change
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Update selected date
    };

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container  p-5 md:p-10 ">
                <div className='flex flex-col lg:flex-row gap-3 justify-between items-center'>
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold text-brown">Review </h1>
                        <p className='text-brown-50'>Dashboard / <span className='text-brown font-medium'>Review</span>
                        </p>

                    </div>
                    <div>

                        <div className="flex gap-4  mb-4">

                            <button className="text-brown border-brown border  px-4 py-1 rounded">
                                <input type="date" value={selectedDate} onChange={handleDateChange} className='outline-none ' /> {/* Update input to use selected date */}
                            </button>
                            <button className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2" onClick={() => { setDelAllOpen(true) }}><span><RiDeleteBin6Fill /></span><span>Delete All</span></button>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto shadow mt-5 rounded'>

                    <table className="w-full bg-white  ">
                        <thead>
                            <tr className="text-brown font-bold">
                                <td className="py-2  px-4">No</td>
                                <td className="py-2  px-4 text-nowrap">Customer name</td>
                                <td className="py-2  px-4">Product</td>
                                <td className="py-2  px-4 text-nowrap">Date</td>
                                <td className="py-2  px-4 ">Rate</td>
                                <td className="py-2  px-4">Description</td>
                                <td className="py-2  px-4">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems && currentItems.length > 0 ? (
                                currentItems.map((ele, index) => (
                                    <tr key={index} className="hover:bg-gray-100 border-t">
                                        <td className="py-2 px-4 ">{ele.id}</td>
                                        <td className="py-2 px-4 ">{ele.customer_name}</td>
                                        <td className="py-2 px-4 ">{ele.product_name}</td>
                                        <td className="py-2 px-4 text-nowrap">{new Date(ele.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') || ''}</td>
                                        <td className="py-2 px-4 flex ">{renderStars(ele.rating)}</td>
                                        <td className="py-2 px-4 ">{ele.description}</td>
                                        <td className="py-2 px-4 flex items-center gap-2">
                                            <div>
                                                <button className="text-brown text-xl p-1 border border-brown-50 rounded" onClick={() => handleOpen(ele)}><BsFillEyeFill /></button>
                                            </div>
                                            <div>
                                                <button className="text-red-500 text-xl  p-1 border border-brown-50 rounded" onClick={() => handleDeleteOpen(ele)}><RiDeleteBin6Fill /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-2 px-4 text-center text-gray-500 border-t">No records found</td>
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
                        '& .MuiPaginationItem-root': {
                            color: 'text.primary', // Default color for pagination items
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            backgroundColor: '#523b33', // Active page background color
                            color: 'white', // Active page text color
                        },
                        '& .MuiPaginationItem-root:hover': {
                            backgroundColor: 'lightgray', // Hover effect
                        },
                    }}
                />
                {/* View Review */}
                <Modal
                    open={open}
                    onClose={handleClose}

                >
                    <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px]  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                        <p className='text-brown font-bold text-xl  flex justify-between'>
                            <p>View Review</p>
                            <button onClick={handleClose} className=" font-bold"><RxCross2 /></button>
                        </p>
                        <div>
                            <div className="mt-5">
                                <div className='flex justify-between pb-4'>
                                    <div className='flex gap-3'>
                                        <div>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#523C34', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {Data?.customer_name ? Data.customer_name.charAt(0).toUpperCase() : ''} {/* Add a check for Data.customer_name */}
                                            </div>
                                            {/* <img src={Data.customer_image} className='w-16 h-16 object-cover rounded' alt="" /> */}
                                        </div>
                                        <div>
                                            <h2 className="text-lg text-brown font-semibold">{Data.customer_name}</h2>
                                            <div className="flex items-center">
                                                {renderStars(Data.rating)} {/* Assuming Data.rating is available */}
                                                {/* Assuming Data.date is available */}
                                            </div>
                                        </div>
                                        <div>

                                        </div>
                                    </div>
                                    <div>
                                        <span className="ml-2 text-gray-500">{Data.date ? new Date(Data.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</span>
                                    </div>
                                </div>
                                <p className="mt-2 border-t pt-4">{Data.description}</p> {/* Assuming Data.description is available */}
                                <div className="mt-4 flex gap-2">
                                    {Array.isArray(Data.product_images) && Data.product_images.map((ele) => (
                                        <img src={ele} alt="Product Image" className="w-16 h-16 object-cover rounded" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Box>
                </Modal>
                {/* Delete Review */}
                <Modal
                    open={delOpen}
                    onClose={handleDeleteClose}

                >
                    <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                        <div className='  p-5'>
                            <div className='text-center'>

                                <p className='text-brown font-bold text-xl'>Delete Review</p>
                                <p className='text-brown-50'>Are you sure you want to delete
                                    review?</p>
                            </div>
                            <div className='flex flex-wrap gap-3 mt-4'>
                                <button onClick={handleDeleteClose} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteReview} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>
                {/* Delete All Review */}
                <Modal
                    open={delAllOpen}
                    onClose={() => setDelAllOpen(false)}

                >
                    <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                        <div className='  p-5'>
                            <div className='text-center'>

                                <p className='text-brown font-bold text-xl'>Delete All Review</p>
                                <p className='text-brown-50'>Are you sure you want to delete all
                                    review?</p>
                            </div>
                            <div className='flex flex-wrap gap-3 mt-4'>
                                <button onClick={() => setDelAllOpen(false)} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteAll} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>
            </div>
    )
}
