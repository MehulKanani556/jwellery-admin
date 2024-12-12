
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../reduxe/slice/orders.slice";

import { FiArrowLeft } from "react-icons/fi";


import Loader from "../components/Loader";

export default function OrderView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { selectedOrder,loading } = useSelector((state) => state.orders);
    console.log(selectedOrder)

    useEffect(() => {
        dispatch(getOrderById(id));
    }, [dispatch]);
    
    return (
        loading  ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader/></div> : 
        <div className="container  p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">View Orders</h1>
                    <p className="text-brown-50">
                        Dashboard /{" "} Orders / {" "}
                        <span className="text-brown font-medium">View Orders</span>
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <div>
                        <button
                            className=" text-brown  border-brown border px-3 py-2 rounded flex justify-center items-center gap-2"
                            onClick={() => navigate('/order')}
                        >
                            <span>
                                <FiArrowLeft />
                            </span>
                            <span>
                                Back
                            </span>
                        </button>
                    </div>
                    <div className={`font-semibold  w-24 text-center text-sm px-3 capitalize py-3 rounded ${selectedOrder?.order_status === 'delivered' ? 'bg-green-200 text-green-800 ' :
                        selectedOrder?.order_status === 'cancelled' ? 'bg-red-200 text-red-600' :
                            selectedOrder?.order_status === 'transit' ? 'bg-gray-200 text-brown ' :
                                'bg-yellow-200 text-yellow-700'}`}>
                        <span>

                            {selectedOrder?.order_status}
                        </span>
                    </div>
                </div>


            </div>
            <div className="mt-6">
                <div className="bg-white shadow  ">
                    <div>
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Product Details</h2>
                        </div>
                        <table className="w-full ">
                            <tr className="text-brown font-bold">
                                <td className="px-5 py-3">Product Name</td>
                                <td className="px-5 py-3">Price</td>
                                <td className="px-5 py-3">Qty</td>
                                <td className="px-5 py-3">Total</td>
                            </tr>
                            {selectedOrder?.order_items?.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="px-5 py-3">{item.product_name}</td>
                                    <td className="px-5 py-3">₹{item.price}</td>
                                    <td className="px-5 py-3">{item.qty}</td>
                                    <td className="px-5 py-3">₹{item.price * item.qty}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
            <div className="mt-6 w-full">
                <div className=" flex gap-5 flex-col  lg:flex-row w-full justify-between">
                    <div className="bg-white shadow lg:w-[30%] overflow-hidden ">
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Order details</h2>
                        </div>
                        <div >
                            <table className=" ">
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Order ID</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">{selectedOrder?.id}</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Order Date</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">{new Date(selectedOrder?.order_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') || ''}</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Invoice No</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">#{selectedOrder?.invoice_number}</td>

                                </tr>

                            </table>
                        </div>
                    </div>
                    <div className="bg-white shadow lg:w-[30%] overflow-hidden ">
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Customer details</h2>
                        </div>
                        <div>
                            <table className=" ">
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Name</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">{selectedOrder?.customer?.name}</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Email</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold text-wrap">{selectedOrder?.customer?.email}</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Mobile No</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">{selectedOrder?.customer?.phone}</td>

                                </tr>

                            </table>
                        </div>
                    </div>
                    <div className="bg-white shadow lg:w-[30%] overflow-hidden ">
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Delivery Address</h2>
                        </div>
                        <div>
                            <table className=" ">
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1 ">Adress</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">
                                        {selectedOrder?.deliveryAddress?.address}
                                    </td>

                                </tr>

                            </table>
                        </div>
                    </div>

                </div>
            </div>
            <div className="mt-6">
                <div className="bg-white shadow lg:w-[30%] me-3">
                    <div className="border-b">
                        <h2 className="text-xl py-3 font-bold text-brown px-5">Payment details</h2>
                    </div>
                    <div>
                        <table className=" ">
                            <tr className="">
                                <td className="px-5 text-gray-400 py-1">Payment method</td>
                                <td>:</td>
                                <td className="px-5 py-1 font-semibold">Debit card</td>

                            </tr>
                            <tr className="">
                                <td className="px-5 text-gray-400 py-1">Status</td>
                                <td>:</td>
                                <td className="px-5 py-1 font-semibold">Paid</td>

                            </tr>
                            <tr className="">
                                <td className="px-5 text-gray-400 py-1">Transaction ID</td>
                                <td>:</td>
                                <td className="px-5 py-1 font-semibold">#452178931</td>

                            </tr>
                            <tr className="">
                                <td className="px-5 text-gray-400 py-1">Total Pay Amount</td>
                                <td>:</td>
                                <td className="px-5 py-1 font-semibold">₹5000</td>

                            </tr>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
