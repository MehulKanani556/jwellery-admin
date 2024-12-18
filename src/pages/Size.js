import { Box, Button, Modal, Pagination, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BiSolidEditAlt } from 'react-icons/bi'
import { BsFillEyeFill } from 'react-icons/bs'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import img from '../Images/user.png'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { addSize, deleteAllSizes, deleteSize, editSize, getAllSizes } from '../reduxe/slice/size.slice'
import { ErrorMessage, Field, Formik } from 'formik'
import * as Yup from 'yup';
import { Form, Link } from 'react-router-dom'
import Loader from '../components/Loader'


export default function Size() {
    const [sizeData, setSizeData] = useState([]);
    const [open, setOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const dispatch = useDispatch();
    const size = useSelector(state => state.sizes.sizes);
    const loading = useSelector(state => state.sizes.loading);
    const searchValue = useSelector((state) => state.search.value);
    const isSmallScreen = useMediaQuery("(max-width:425px)");

    useEffect(() => {
        dispatch(getAllSizes())
    }, []);

    // serch
    const filteredData = size.filter(data =>
        data.size.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
        data.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        size: Yup.string().required('Size is required'),
    });

    // Pagination statecurrentItems
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // Calculate total pages
    const totalPages = Math.ceil(size.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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
    const handleOpen = (data) => {
        setOpen(true);
        setSizeData(data)
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setSizeData(data)
    }
    const handleDeleteClose = () => {
        setDelOpen(false);
    }
    const handleAddOpen = () => {
        setAddOpen(true);
    }
    const handleAddClose = () => {
        setAddOpen(false);
    }
    const handleDeleteSize = () => {
        dispatch(deleteSize({ id: sizeData.id }))
        // dispatch(getAllUsers())
        setDelOpen(false);
    }
    const handleDeleteAll = () => {
        console.log('Delete All User ',)
        dispatch(deleteAllSizes());

    }
    // const handleSubmitForm = (values, { resetForm }) => {
    //     dispatch(addSize(values));
    //     resetForm();
    //     console.log('Form submitted:', values);
    // }

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container p-5 md:p-10">
                <div className='flex flex-col lg:flex-row gap-3 justify-between items-center'>
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold text-brown">Size </h1>
                        <p className='text-brown-50'><Link to="/dashboard">Dashboard</Link>  / <span className='text-brown font-medium'>Size</span>
                        </p>
                    </div>
                    <div>
                        <div className="flex gap-4  mb-4 justify-center lg:justify-end">
                            <button className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2" onClick={() => { setDelAllOpen(true) }}><span><RiDeleteBin6Fill /></span><span>Delete All</span></button>
                            <button className="bg-brown w-32 text-white px-4 py-2 rounded hover:bg-brown-50 " onClick={handleAddOpen}>+ Add</button>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto shadow mt-5 rounded'>

                    <table className="w-full bg-white  ">
                        <thead>
                            <tr className="text-brown font-bold">
                                <td className="py-2  px-4">No</td>
                                <td className="py-2  px-4">Name</td>
                                <td className="py-2  px-4">Size</td>
                                <td className="py-2  px-4">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems && currentItems.length > 0 ? (
                                currentItems.map((size, index) => (
                                    <tr key={index} className="hover:bg-gray-100 border-t">
                                        <td className="py-2 px-4 ">{size.id}</td>

                                        <td className="py-2 px-4 ">{size.name}</td>
                                        <td className="py-2 px-4 ">{size.size}</td>

                                        <td className="py-2 px-4 flex items-center gap-2">
                                            <div>
                                                <button className="text-green-400 text-xl p-1 border border-brown-50 rounded" onClick={() => handleOpen(size)}><BiSolidEditAlt /></button>
                                            </div>
                                            <div>
                                                <button className="text-red-500 text-xl  p-1 border border-brown-50 rounded" onClick={() => handleDeleteOpen(size)}><RiDeleteBin6Fill /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-2 px-4 text-center text-gray-500 border-t">No records found</td>
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
                     boundaryCount={isSmallScreen ? 0 : 1} // Show one boundary page at the start and end
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

                {/* Add Size */}
                <Modal
                    open={addOpen}
                    onClose={handleAddClose}
                >
                    <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px]  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                        <p className='text-brown font-bold text-xl  flex justify-between'>
                            <p >Add Size</p>
                            <button onClick={handleAddClose} className=" font-bold"><RxCross2 /></button>
                        </p>
                        <div>
                            <Formik
                                initialValues={{ name: '', size: '' }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    dispatch(addSize(values));
                                    resetForm();
                                    handleAddClose(); // Close the modal after successful submission
                                }}
                            >
                                {({ handleSubmit, isSubmitting }) => (
                                    <form onSubmit={handleSubmit} className=" p-4 md:p-8 rounded-lg  ">
                                        <div className="mb-4">
                                            <label htmlFor="name" className="block text-sm font-bold text-brown">Name</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter Name"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="size" className="block text-sm font-bold text-brown">Size</label>
                                            <Field
                                                type="text"
                                                name="size"
                                                id="size"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter Size"
                                            />
                                            <ErrorMessage name="size" component="div" className="text-red-500" />
                                        </div>
                                        <div className='flex flex-col md:flex-row gap-2 p-5 pb-2 '>
                                            <button className='text-brown hover:bg-brown-50  border-brown border p-2 rounded w-full' onClick={handleAddClose}>
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Add Size'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </Box>
                </Modal>
                {/* Edit Size */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px]  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                        <p className='text-brown font-bold text-xl  flex justify-between'>
                            <p>Edit Size</p>
                            <button onClick={handleClose} className=" font-bold"><RxCross2 /></button>
                        </p>
                        <div>
                            <Formik
                                initialValues={{ id: sizeData.id || '', name: sizeData.name || '', size: sizeData.size || '' }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    dispatch(editSize(values));
                                    resetForm();
                                    handleClose(); // Close the modal after successful submission
                                }}
                            >
                                {({ handleSubmit, isSubmitting }) => (
                                    <form onSubmit={handleSubmit} className=" p-4 md:p-8 rounded-lg  ">
                                        <div className="mb-4">
                                            <label htmlFor="name" className="block text-sm font-bold text-brown">Name</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter Name"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="size" className="block text-sm font-bold text-brown">Size</label>
                                            <Field
                                                type="text"
                                                name="size"
                                                id="size"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter Size"
                                            />
                                            <ErrorMessage name="size" component="div" className="text-red-500" />
                                        </div>
                                        <div className='flex flex-col md:flex-row gap-2 p-5 pb-2 '>
                                            <button className='text-brown hover:bg-brown-50  border-brown border p-2 rounded w-full' onClick={handleAddClose}>
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Edit Size'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </Box>
                </Modal>
                {/* Delete Size */}
                <Modal
                    open={delOpen}
                    onClose={handleDeleteClose}

                >
                    <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                        <div className='  p-5'>
                            <div className='text-center'>

                                <p className='text-brown font-bold text-xl'>Delete Size</p>
                                <p className='text-brown-50'>Are you sure you want to delete
                                    size?</p>
                            </div>
                            <div className='flex flex-wrap justify-center gap-3 mt-4'>
                                <button onClick={handleDeleteClose} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteSize} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>
                {/* Delete All Size */}
                <Modal
                    open={delAllOpen}
                    onClose={() => setDelAllOpen(false)}

                >
                    <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                        <div className='  p-5'>
                            <div className='text-center'>

                                <p className='text-brown font-bold text-xl'>Delete All Size</p>
                                <p className='text-brown-50'>Are you sure you want to delete all
                                    size?</p>
                            </div>
                            <div className='flex flex-wrap justify-center gap-3 mt-4'>
                                <button onClick={() => setDelAllOpen(false)} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteAll} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>


            </div>
    )
}
