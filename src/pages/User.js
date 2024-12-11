import { Box, Modal, Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import {  deleteUser, getAllUsers } from '../reduxe/slice/users.slice'
import Loader from '../components/Loader'

export default function User() {
    const [userData, setUserData] = useState([]);
    const [open, setOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const dispatch = useDispatch();
    const data = useSelector(state =>state.users.users).filter(user => user.role_id != 1);
    const loading = useSelector(state => state.users.loading);
    const searchValue = useSelector((state) => state.search.value);
   
    
    useEffect(()=>{
        dispatch(getAllUsers())
    },[dispatch]);
   

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // Filter users based on searchValue
    const filteredData = data.filter(user => 
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.phone.includes(searchValue)
    );

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Get current items from filtered data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
   
    return (
        loading  ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader/></div> : 
        <div className=" md:mx-[20px] p-10">
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
                            <td className="py-2  px-4">Name</td>
                            <td className="py-2  px-4">Mobile No.</td>
                            <td className="py-2  px-4">D.O.B</td>
                            <td className="py-2  px-4">Gender</td>
                            <td className="py-2  px-4">Email</td>
                            <td className="py-2  px-4">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100 border-t">
                                <td className="py-2 px-4 ">{user.id}</td>
                                <td className="py-2 px-4 ">{user.name}</td>
                                <td className="py-2 px-4 ">{user.phone}</td>
                                <td className="py-2 px-4">{user.dob ? new Date(user.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</td>
                                <td className="py-2 px-4 ">{user.gender}</td>
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
                        )) : (
                            <tr className='border-t'>
                                <td colSpan="7" className="text-center py-3 ">No users found.</td>
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

            {/* view user */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="bg-gray-50 absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 rounded">
                    <p className='text-brown font-bold text-xl  flex justify-between border-b border-gray-500 p-4'>
                        <p>View User</p>
                        <button onClick={handleClose} className=" font-bold"><RxCross2 /></button>
                    </p>
                    <div className='p-4'>
                        <table className="table-auto">
                            <tbody>
                                <tr className=''>
                                    <td className="px-4 py-2 text-brown font-bold">Name:</td>
                                    <td className="px-4 py-2">{userData?.name}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Mobile No.:</td>
                                    <td className="px-4 py-2">{userData?.phone}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">D.O.B:</td>
                                    <td className="px-4 py-2">{userData?.dob ? new Date(userData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</td>
                                </tr>
                                <tr className='border-t'>
                                    <td className="px-4 py-2 text-brown font-bold">Gender:</td>
                                    <td className="px-4 py-2">{userData?.gender}</td>
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
