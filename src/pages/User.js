import React, { useState } from 'react'
import { BiSolidEditAlt } from 'react-icons/bi'
import { BsFillEyeFill } from 'react-icons/bs'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { RiDeleteBin6Fill } from 'react-icons/ri'

export default function User() {
    const data = [

        { no: '0123', name: 'Rachin', surname: 'Desai', mobile: '8574569852', username: 'Rachin05', email: 'Rachin@gmail.com', password: '21055' },
        { no: '0123', name: 'Olie Martin', surname: 'Patel', mobile: '8574569852', username: 'OlieMarting121', email: 'OlieMarting@gmail.com', password: '21055' },
        { no: '0123', name: 'Akash Deep', surname: 'Patel', mobile: '8574569852', username: 'Akash05', email: 'Aka@gmail.com', password: '012354' },


    ]

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2; // Set items per page

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

    return (
        <div className=" md:mx-[50px] p-4 ">
            <div className='flex flex-col sm:flex-row gap-3 justify-between items-center'>
                <div>
                    <h1 className="text-2xl font-bold text-brown">User </h1>
                    <p className='text-brown-50'>Dashboard / <span className='text-brown font-medium'>User</span>
                    </p>

                </div>
                <div>

                    <div className="flex gap-4  mb-4">
                        <button className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"><span><RiDeleteBin6Fill /></span><span>Delete All</span></button>
                        <button className="bg-brown w-32 text-white px-4 py-2 rounded">+ Add</button>
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
                                <td className="py-2 px-4 ">{user.no}</td>
                                <td className="py-2 px-4 ">
                                    <img src={user.image} alt="User" className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="py-2 px-4 ">{user.name}</td>
                                <td className="py-2 px-4 ">{user.surname}</td>
                                <td className="py-2 px-4 ">{user.mobile}</td>
                                <td className="py-2 px-4 ">{user.username}</td>
                                <td className="py-2 px-4 ">{user.email}</td>

                                <td className="py-2 px-4 flex items-center gap-2">
                                    <div>
                                        <button className="text-brown text-xl p-1 border border-brown-50 rounded"><BsFillEyeFill /></button>
                                    </div>
                                    <div>
                                        <button className="text-green-500 text-xl p-1 border border-brown-50 rounded"><BiSolidEditAlt /></button>
                                    </div>
                                    <div>

                                        <button className="text-red-500 text-xl  p-1 border border-brown-50 rounded"><RiDeleteBin6Fill /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

            </div>


        </div>
    )
}
