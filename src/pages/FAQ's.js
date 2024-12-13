import { Box, Button, Modal, Pagination, Typography } from '@mui/material'
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
import { Form, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { addTerm, deleteAllTerms, deleteTerm, editTerm, getAllTerms } from '../reduxe/slice/terms.slice'
import {addSubFaqs, deleteAllSubFaqs, deleteSubFaqs, editSubFaqs, getAllSubFaqs } from '../reduxe/slice/subFaqs.slice'
import { getAllFaqs } from '../reduxe/slice/faqs.slice'

export default function Faqs() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { subFaqs, loading } = useSelector((state) => state.subfaqs);
    const { faqs} = useSelector((state) => state.faqs);
    
    console.log(faqs)
    useEffect(() => {
        dispatch(getAllSubFaqs())
        dispatch(getAllFaqs())
    }, []);
    const validationSchema = Yup.object({
        faq_id: Yup.string().required('FAQ Type is required'),
        question: Yup.string().required('FAQ is required'),
        answer: Yup.string().required('Answer is required'),
    });

    // Pagination statecurrentItems
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // Calculate total pages
    const totalPages = Math.ceil(subFaqs.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = subFaqs.slice(indexOfFirstItem, indexOfLastItem);

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
    const handleAddOpen = (data) => {
        setAddOpen(true);
        setData(data)
    }
    const handleAddClose = () => {
        setAddOpen(false);
    }
    const handleDelete = () => {
        dispatch(deleteSubFaqs({ id: data.id }))
        setDelOpen(false);
    }
    const handleDeleteAll = () => {
        dispatch(deleteAllSubFaqs());
        setDelAllOpen(false);

    }

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container  p-5 md:p-10">
                <div className='flex flex-col lg:flex-row gap-3 justify-between items-center'>
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold text-brown">FAQ's </h1>
                        <p className='text-brown-50'>Dashboard / <span className='text-brown font-medium'>FAQ's</span>
                        </p>

                    </div>
                    <div>
                        <div className="flex flex-wrap justify-center lg:justify-end gap-4  mb-4">
                            <button className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2" onClick={() => { navigate('/faqs/view') }}><span>View</span></button>
                            <button className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2" onClick={() => { setDelAllOpen(true) }}><span><RiDeleteBin6Fill /></span><span>Delete All</span></button>
                            <button className="bg-brown w-32 text-white px-4 py-2 rounded" onClick={handleAddOpen}>+ Add</button>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto shadow mt-5 rounded'>

                    <table className="w-full bg-white  ">
                        <thead>
                            <tr className="text-brown font-bold">
                                <td className="py-2  px-4 w-1/12">ID</td>
                                <td className="py-2  px-4 w-1/12">FAQ Type</td>
                                <td className="py-2  px-4 flex-grow w-1/6">FAQ</td>
                                <td className="py-2  px-4 flex-grow w-1/2">Answer</td>
                                <td className="py-2  px-4 text-center">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems && currentItems.length > 0 ? (
                                currentItems.map((ele, index) => (
                                    <tr key={index} className="hover:bg-gray-100 border-t">
                                        <td className="py-2 px-4 w-1/12">{ele.id}</td>
                                        <td className="py-2 px-4 w-1/12">{ele.faq_name}</td>
                                        <td className="py-2 px-4 flex-grow w-1/6">{ele.question}</td>
                                        
                                        <td className="py-2 px-4  flex-grow w-1/2">
                                            <p className="textover ">
                                                {ele.answer}
                                            </p>
                                        </td>
                                        <td className="py-2 px-4 flex items-center justify-center gap-2">
                                            <div>
                                                <button className="text-green-400 text-xl p-1 border border-brown-50 rounded" onClick={() => handleAddOpen(ele)}><BiSolidEditAlt /></button>
                                            </div>
                                            <div>
                                                <button className="text-red-500 text-xl  p-1 border border-brown-50 rounded" onClick={() => handleDeleteOpen(ele)}><RiDeleteBin6Fill /></button>
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

                {/* Add Size */}
                <Modal
                    open={addOpen}
                    onClose={handleAddClose}
                >
                    <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px]  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                        <p className='text-brown font-bold text-xl  flex justify-between'>
                            <p className='text-center'>{data.id ? "Edit FAQ's" : "Add FAQ's"}</p>
                            <button onClick={handleAddClose} className=" font-bold"><RxCross2 /></button>
                        </p>
                        <div>
                            <Formik
                                initialValues={{ 
                                    faq_id: data.faq_id || '', 
                                    question: data.question || '', 
                                    answer: data.answer || '',
                                    id: data.id || ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if (values.id) {
                                        dispatch(editSubFaqs(values));
                                    } else {
                                        dispatch(addSubFaqs(values));
                                    }
                                    resetForm();
                                    handleAddClose();
                                }}
                            >
                                {({ handleSubmit, isSubmitting,values }) => (
                                    <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">
                                        <div className="mb-4">
                                            <label htmlFor="faq_id" className="block text-sm font-bold text-brown">FAQ Type</label>
                                            <Field
                                                as="select"
                                                name="faq_id"
                                                id="faq_id"
                                                className={`mt-1 w-full border border-brown p-2 rounded ${values.faq_id == '' ? 'text-gray-400' : 'text-black'}`}

                                            >
                                                <option value="">Select FAQ Type</option>
                                                {faqs.map((ele) => (
                                                    <option key={ele.id} value={ele.id}>{ele.name}</option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="faq_id" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="question" className="block text-sm font-bold text-brown">Question</label>
                                            <Field
                                                type="text"
                                                name="question"
                                                id="question"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter FAQ"
                                            />
                                            <ErrorMessage name="question" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="answer" className="block text-sm font-bold text-brown">Answer</label>
                                            <Field
                                                as="textarea"
                                                name="answer"
                                                id="answer"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter Answer"
                                            />
                                            <ErrorMessage name="answer" component="div" className="text-red-500" />
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
                                                {isSubmitting ? 'Submitting...' : (data.id ? 'Edit ' : 'Add ')}
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
                                initialValues={{ id: data.id || '', name: data.name || '', size: data.size || '' }}
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

                                <p className='text-brown font-bold text-xl'>Delete Terms & Condition</p>
                                <p className='text-brown-50'>Are you sure you want to delete
                                Terms & Condition?</p>
                            </div>
                            <div className='flex flex-wrap gap-3 justify-center mt-4'>
                                <button onClick={handleDeleteClose} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDelete
                                } className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
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

                                <p className='text-brown font-bold text-xl'>Delete All Terms & Condition</p>
                                <p className='text-brown-50'>Are you sure you want to delete all
                                Terms & Condition?</p>
                            </div>
                            <div className='flex flex-wrap gap-3 justify-center mt-4'>
                                <button onClick={() => setDelAllOpen(false)} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteAll} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>


            </div>
    )
}
