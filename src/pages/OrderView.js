
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../reduxe/slice/orders.slice";

export default function OrderView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { selectedOrder } = useSelector((state) => state.orders);
    console.log(selectedOrder)

    useEffect(() => {
        dispatch(getOrderById(id));
    }, [dispatch]);
    return (
        <div className=" md:mx-[20px] p-4 ">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-brown">View Orders</h1>
                    <p className="text-brown-50">
                        Dashboard /{" "} Orders / {" "}
                        <span className="text-brown font-medium">View Orders</span>
                    </p>
                </div>
                <div>
                    <div className={`font-semibold w-24 text-center text-sm px-3 capitalize py-2 rounded ${selectedOrder?.order_status === 'delivered' ? 'bg-green-200 text-green-800 ' :
                        selectedOrder?.order_status === 'cancelled' ? 'bg-red-200 text-red-600' :
                            selectedOrder?.order_status === 'transit' ? 'bg-gray-200 text-brown ' :
                                'bg-yellow-200 text-yellow-700'}`}>
                        {selectedOrder?.order_status}
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
                            {selectedOrder?.order_details?.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-100 border-t">
                                    <td className="px-5 py-3">{item.product_name}</td>
                                    <td className="px-5 py-3">{item.price}</td>
                                    <td className="px-5 py-3">{item.quantity}</td>
                                    <td className="px-5 py-3">{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </div>
            <div className="mt-6 w-full">
                <div className=" flex gap-5 flex-col  lg:flex-row w-full justify-between">
                    <div className="bg-white shadow lg:w-[30%] ">
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Order details</h2>
                        </div>
                        <div>
                            <table className=" ">
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Order ID</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">123</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Order Date</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">10-12-2024</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Invoice No</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">#452178931</td>

                                </tr>

                            </table>
                        </div>
                    </div>
                    <div className="bg-white shadow lg:w-[30%] ">
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Customer details</h2>
                        </div>
                        <div>
                            <table className=" ">
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Name</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">Name</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Email</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">abc@gmail.com</td>

                                </tr>
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1">Mobile No</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">1234567890</td>

                                </tr>

                            </table>
                        </div>
                    </div>
                    <div className="bg-white shadow lg:w-[30%] ">
                        <div className="border-b">
                            <h2 className="text-xl py-3 font-bold text-brown px-5">Delivery Address</h2>
                        </div>
                        <div>
                            <table className=" ">
                                <tr className="">
                                    <td className="px-5 text-gray-400 py-1 ">Adress</td>
                                    <td>:</td>
                                    <td className="px-5 py-1 font-semibold">1st Flr, 13 Chewoolwadi, Kalbadevi Rd, Kolbad Lane, Kalbadevi East, Mumbai 400002, Maharashtra.</td>

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