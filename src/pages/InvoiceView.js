import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../reduxe/slice/orders.slice";

import { FiArrowLeft } from "react-icons/fi";

import Loader from "../components/Loader";
import { RiPrinterFill } from "react-icons/ri";
import { getAllProducts } from "../reduxe/slice/product.slice";
import html2canvas from 'html2canvas';

const InvoiceView = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [netAmount, setNetAmount] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst]= useState(0);
  const [total ,setTotal] = useState(0);

  const { selectedOrder, loading } = useSelector((state) => state.orders);
  const {products} = useSelector((state) => state.products);
  console.log(products,selectedOrder)

  useEffect(() => {
    dispatch(getOrderById(id));
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(()=>{
    if(selectedOrder){
  const discount = parseFloat(selectedOrder?.discount ? selectedOrder?.discount : 0);
  const deliveryCharge = parseFloat(selectedOrder?.delivery_charge ? selectedOrder?.delivery_charge : 0);
  const netAmount = parseFloat((selectedOrder?.total_amount - discount + deliveryCharge).toFixed(2));
  const sgst = parseFloat((netAmount * 0.065).toFixed(2));
  const cgst = parseFloat((netAmount * 0.065).toFixed(2));
  const total = parseFloat((netAmount + sgst + cgst).toFixed(2));
    setNetAmount(netAmount);
    setSgst(sgst);
    setCgst(cgst);
    setTotal(total);
  }
  },[selectedOrder])

  const printRef = useRef();

  
  const handlePrint = async () => {
    if (window.printing) return; // Prevent multiple prints
    window.printing = true;

    const content = printRef.current;

    // Wait for images and other resources to load
    const waitForImages = () => {
      const images = content.getElementsByTagName('img');
      const promises = Array.from(images).map(img => {
        if (img.complete) {
          return Promise.resolve();
        } else {
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
      });
      return Promise.all(promises);
    };

    try {
      // Wait for all images to load
      await waitForImages();

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');

      // Create a temporary container for the print content
      const printContainer = document.createElement('div');
      printContainer.innerHTML = `
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          #printContainer, #printContainer * {
            visibility: visible;
          }
          #printContainer {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #printContainer img {
            width: 100%;
            height: auto;
            object-fit: contain;
            page-break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 0mm !important;
            padding: 0mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            overflow: hidden;
          }
        }
      </style>
      <div id="printContainer">
        <img src="${imgData}" />
      </div>
    `;

      document.body.appendChild(printContainer);

      const img = printContainer.querySelector('img');
      img.onload = () => {
        window.print();
        document.body.removeChild(printContainer);
        window.printing = false; // Reset the printing flag
      };

    } catch (error) {
      console.error('Error generating print preview:', error);
      window.printing = false; // Reset the printing flag in case of error
    }
  };



  return (
    loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
      <div className="p-10">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center max-w-[1500px]">
          <div>
            <h1 className="text-2xl font-bold text-brown">View Invoice</h1>
            <p className="text-brown-50">
              Dashboard / Invoice / {' '}
              <span className="text-brown font-medium">View Invoice</span>
            </p>
          </div>
          <div className="flex gap-4 items-center">
                    <div>
                        <button
                            className="w-[100px] h-[40px] text-[25px] text-brown  border-brown border px-3 py-2 rounded flex justify-center items-center gap-2 hover:bg-[#523C34] hover:text-white"
                            onClick={handlePrint}
                        >
                            <RiPrinterFill/>
                        </button>
                    </div>
                </div>
        </div>
            <section className="mb-5 mt-5 p-10 bg-white rounded-lg shadow-md max-w-[1500px]" ref={printRef} id="print-content">
              <div>
                <div className="bg-[#F5F4F1] p-5">
                  <h5 className="font-bold">LOGO</h5>
                  <div className="flex flex-wrap justify-between">
                    <div className="mt-4">
                      <h5 className="font-semibold">{selectedOrder?.customer?.name}</h5>
                      <h6 className="text-gray-500">{selectedOrder?.customer?.email}</h6>
                      <h6 className="text-gray-500">{selectedOrder?.customer?.phone}</h6>
                    </div>
                    <div className="flex justify-between mt-4 w-full sm:w-auto">
                      <div>
                        <p className="text-gray-500 mb-0">Invoice No</p>
                        <p className="text-gray-500 mb-0">Invoice Date</p>
                        <p className="text-gray-500 mb-0">Order ID</p>
                        <p className="text-gray-500 mb-0">GSTIN</p>
                      </div>
                      <div className="text-right">
                        <p className="text-dark font-semibold">#{selectedOrder?.invoice_number}</p>
                        <p className="text-dark font-semibold">{selectedOrder?.order_date? new Date(selectedOrder?.order_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</p>
                        <p className="text-dark font-semibold">#{selectedOrder?.id}</p>
                        <p className="text-dark font-semibold">CGHCJU554451JH</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="border-r border-gray-400 pr-3">
                    <p className="text-gray-500 font-semibold mb-2">SOLD BY</p>
                    <p className="font-semibold text-gray-800 mb-0">COCOBLU RETAIL LIMITED</p>
                    <p className="text-gray-600">Renaissance industrial smart city, Kalyan Sape road, Thane, Maharashtra, 421302 IN</p>
                  </div>
                  <div className="border-r border-gray-400 pr-3">
                    <p className="text-gray-500 font-semibold mb-2">BILLED TO</p>
                    <p className="font-semibold text-gray-800 mb-0">{selectedOrder?.customer?.name}</p>
                    <p className="text-gray-600">{selectedOrder?.deliveryAddress?.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-2">SHIPPED TO</p>
                    <p className="font-semibold text-gray-800 mb-0">{selectedOrder?.customer?.name}</p>
                    <p className="text-gray-600">{selectedOrder?.deliveryAddress?.address}</p>
                  </div>
                </div>

                <div className="bg-gray-400 h-[1px] my-3"></div>

                <div className="overflow-auto mt-4">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-700">Item</th>
                        <th className="text-left py-2 text-gray-700 text-center">Qty.</th>
                        <th className="text-left py-2 text-gray-700 text-center">Price</th>
                        <th className="text-left py-2 text-gray-700 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder?.order_items?.map((item, index) => {
                        const product = products.find((p) => p.id == item.product_id);
                        console.log(product)
                        return (
                      <tr className="border-b">
                        <td className="py-2">
                          <div className="font-semibold">{item?.product_name}</div>
                          <p className="text-gray-500 mb-0">Size: <span className="font-semibold">{product?.size}</span></p>
                          <p className="text-gray-500">Metal: <span className="font-semibold">{product?.metal}</span></p>
                        </td>
                        <td className="font-semibold text-center">{item?.qty}</td>
                        <td className="font-semibold text-center">₹{item?.price}</td>
                        <td className="font-semibold text-right">₹{item?.price * item?.qty}</td>
                      </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-400 h-[1px] my-5"></div>

                <div className="flex flex-wrap justify-between items-end">
                  <div className="mt-4">
                    <h6 className="text-gray-500 font-semibold">Payment Method</h6>
                    <p className="text-gray-800">Bank Name: Bank Central Asia (BCA)</p>
                    <p className="text-gray-800">Card No.: 1234 5678 9123 4567</p>
                    <p className="text-gray-800">Name: Jhon Wick</p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-5">
                    <div>
                      <p className="text-gray-500">Sub Total</p>
                      <p className="text-gray-500">Discount</p>
                      <p className="text-gray-500">SGST</p>
                      <p className="text-gray-500">CGST</p>
                      <h6 className="font-bold text-gray-800">Total Amount</h6>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{selectedOrder?.total_amount}</p>
                      <p className="font-semibold text-green-600">-₹{selectedOrder?.discount ? selectedOrder?.discount : 0}</p>
                      <p className="font-semibold text-gray-800">₹{sgst}</p>
                      <p className="font-semibold text-gray-800">₹{cgst}</p>
                      <h6 className="font-bold text-gray-800">₹{total}</h6>
                    </div>
                  </div>
                </div>

                <div className="mt-28 text-center">
                  <p className="text-gray-700 font-semibold">Thank you for shopping with us!</p>
                  <p className="text-gray-700">Have a nice day 😊</p>
                </div>

                <div className="bg-[#523C34] py-5 text-center mt-5">
                  <p className="text-white text-sm max-w-md mx-auto">
                    If you have any questions, feel free to call customer care at +1 565 5656 565 or use Contact Us section.
                  </p>
                </div>
              </div>
            </section>
        </div>
  )
}

export default InvoiceView
