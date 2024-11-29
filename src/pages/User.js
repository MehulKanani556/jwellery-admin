import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BiSolidEditAlt } from 'react-icons/bi'
import { BsFillEyeFill } from 'react-icons/bs'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import img from '../Images/user.png'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllUsers, deleteUser, getAllUsers } from '../reduxe/slice/users.slice'

export default function User() {
    const [userData, setUserData] = useState([]);
    const [open, setOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector(state =>state.users.users);
    console.log(data);
    
    useEffect(()=>{
        dispatch(getAllUsers())
    },[]);
   

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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
        setUserData(data)
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setUserData(data)
    }
    const handleDeleteClose = () => {
        setDelOpen(false);
    }
    const handleDeleteUser =() =>{
        console.log('Delete User', userData)
        dispatch(deleteUser({userId:userData.id}))
        dispatch(getAllUsers())
        setDelOpen(false);
    }
    const handleDeleteAll =() =>{
        console.log('Delete All User ', )
        dispatch(deleteAllUsers());
        
    }
    return (
        <div className=" md:mx-[20px] p-4 ">
            <div className='flex flex-col sm:flex-row gap-3 justify-between items-center'>
                <div>
                    <h1 className="text-2xl font-bold text-brown">User </h1>
                    <p className='text-brown-50'>Dashboard / <span className='text-brown font-medium'>User</span>
                    </p>

                </div>
                <div>

                    <div className="flex gap-4  mb-4">
                        {/* <button className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2" onClick={handleDeleteAll}><span><RiDeleteBin6Fill /></span><span>Delete All</span></button> */}
                        {/* <button className="bg-brown w-32 text-white px-4 py-2 rounded">+ Add</button> */}
                    </div>
                </div>
            </div>
            <div className='overflow-auto shadow mt-5 rounded'>

                <table className="w-full bg-white  ">
                    <thead>
                        <tr className="text-brown font-bold">
                            <td className="py-2  px-4">No</td>
                            <td className="py-2  px-4">Image</td>
                            <td className="py-2  px-4">Name</td>
                            <td className="py-2  px-4">Surname</td>
                            <td className="py-2  px-4">Mobile No.</td>
                            <td className="py-2  px-4">Username</td>
                            <td className="py-2  px-4">Email</td>

                            <td className="py-2  px-4">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100 border-t">
                                <td className="py-2 px-4 ">{user.id}</td>
                                <td className="py-2 px-4 ">
                                    <img src={user.image} alt="User" className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="py-2 px-4 ">{user.name}</td>
                                <td className="py-2 px-4 ">{user.surname}</td>
                                <td className="py-2 px-4 ">{user.phone}</td>
                                <td className="py-2 px-4 ">{user.username}</td>
                                <td className="py-2 px-4 ">{user.email}</td>

                                <td className="py-2 px-4 flex items-center gap-2">
                                    <div>
                                        <button className="text-brown text-xl p-1 border border-brown-50 rounded" onClick={() => handleOpen(user)}><BsFillEyeFill /></button>
                                    </div>
                                    <div>
                                        <button className="text-red-500 text-xl  p-1 border border-brown-50 rounded" onClick={() => handleDeleteOpen(user)}><RiDeleteBin6Fill /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end m-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 rounded bg-white text-brown border"
                >
                    <MdKeyboardArrowLeft />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-brown text-white' : 'bg-white text-brown border'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-3 py-1 rounded bg-white text-brown border"
                >
                    <MdKeyboardArrowRight />
                </button>
            </div>

            {/* view user */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="bg-gray-50 absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <p className='text-brown font-bold text-xl  flex justify-between'>
                        <p >View User</p>
                        <button onClick={handleClose} className=" font-bold"><RxCross2 /></button>
                    </p>
                    <div>
                        <img src={userData?.image} alt="User" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <table className="table-auto">
                            <tbody>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Name:</td>
                                    <td className="px-4 py-2">{userData?.name}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Surname:</td>
                                    <td className="px-4 py-2">{userData?.surname}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Mobile No.:</td>
                                    <td className="px-4 py-2">{userData?.phone}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Username:</td>
                                    <td className="px-4 py-2">{userData?.username}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Email:</td>
                                    <td className="px-4 py-2">{userData?.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Box>
            </Modal>
            {/* Delete user */}
            <Modal
                open={delOpen}
                onClose={handleDeleteClose}

            >
                <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                    <div className='  p-5'>
                        <div className='text-center'>

                            <p className='text-brown font-bold text-xl'>Delete User</p>
                            <p className='text-brown-50'>Are you sure you want to delete
                            User?</p>
                        </div>
                        <div className='flex flex-wrap gap-3 mt-4'>
                            <button onClick={handleDeleteClose} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                            <button onClick={handleDeleteUser} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                        </div>

                    </div>

                </Box>
            </Modal>


        </div>
    )
}
