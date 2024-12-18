import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../reduxe/slice/orders.slice";

import { FiArrowLeft } from "react-icons/fi";

import Loader from "../components/Loader";
import { RiPrinterFill } from "react-icons/ri";
import { getAllProducts } from "../reduxe/slice/product.slice";

const InvoiceView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [netAmount, setNetAmount] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [total, setTotal] = useState(0);

  const { selectedOrder, loading } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  console.log(products, selectedOrder);

  useEffect(() => {
    dispatch(getOrderById(id));
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrder) {
      const discount = parseFloat(
        selectedOrder?.discount ? selectedOrder?.discount : 0
      );
      const deliveryCharge = parseFloat(
        selectedOrder?.delivery_charge ? selectedOrder?.delivery_charge : 0
      );
      const netAmount = parseFloat(
        (selectedOrder?.total_amount - discount + deliveryCharge).toFixed(2)
      );
      const sgst = parseFloat((netAmount * 0.065).toFixed(2));
      const cgst = parseFloat((netAmount * 0.065).toFixed(2));
      const total = parseFloat((netAmount + sgst + cgst).toFixed(2));
      setNetAmount(netAmount);
      setSgst(sgst);
      setCgst(cgst);
      setTotal(total);
    }
  }, [selectedOrder]);

  const printRef = useRef();

  const handlePrint = () => {
    if (window.printing) return;
    window.printing = true;

    const printFrame = document.createElement("iframe");
    printFrame.style.display = "block";
    document.body.appendChild(printFrame);

    const styleSheets = Array.from(document.styleSheets)
      .map((styleSheet) => {
        if (styleSheet.href) {
          return `<link rel="stylesheet" href="${styleSheet.href}" />`;
        }
        return "";
      })
      .join("");

    printFrame.contentDocument.write(`
      <html>
        <head>
          ${styleSheets}
          <style>
            @media print {
              body {
                padding: 20px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                font-family: Poppins, sans-serif;
              }
              @page {
                size: A4;
                margin: 0;
              }
            }
            p,h5,h6{
              margin:0;
              margin-bottom:5px;
            }
            .border-print{
              border-right:1px solid #D1D5DB;
            }
            section{
             padding: "20px",
            }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printFrame.contentDocument.close();

    printFrame.contentWindow.onafterprint = () => {
      document.body.removeChild(printFrame);
      window.printing = false;
    };

    printFrame.contentWindow.print();
  };

  return loading ? (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader />
    </div>
  ) : (
    <div className="container  p-5 md:p-10">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center max-w-[1500px]">
        <div>
          <h1 className="text-2xl font-bold text-brown">View Invoice</h1>
          <p className="text-brown-50">
            <Link to="/dashboard">Dashboard</Link>  / Invoice /{" "}
            <span className="text-brown font-medium">View Invoice</span>
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <button
              className="w-[100px] h-[40px] text-[25px] text-brown  border-brown border px-3 py-2 rounded flex justify-center items-center gap-2 hover:bg-[#523C34] hover:text-white"
              onClick={handlePrint}
            >
              <RiPrinterFill />
            </button>
          </div>
        </div>
      </div>
      <section
        style={{
          marginBottom: "20px",
          marginTop: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "1500px",
        }}
        className="p-4 md:p-9"
        ref={printRef}
        id="print-content"
      >
        <div>
          <div
            style={{
              backgroundColor: "#F5F4F1",
              padding: "20px",
            }}
          >
            <h5 style={{ fontWeight: "bold" }}>LOGO</h5>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div style={{ marginTop: "16px" }}>
                <h5 style={{ fontWeight: "600" }}>
                  {selectedOrder?.customer?.name}
                </h5>
                <h6 style={{ color: "#6B7280" }}>
                  {selectedOrder?.customer?.email}
                </h6>
                <h6 style={{ color: "#6B7280" }}>
                  {selectedOrder?.customer?.phone}
                </h6>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                  // width: "100%",
                }}
              >
                <div style={{ paddingRight: "20px" }}>
                  <p style={{ color: "#6B7280", marginBottom: "0" }}>
                    Invoice No
                  </p>
                  <p style={{ color: "#6B7280", marginBottom: "0" }}>
                    Invoice Date
                  </p>
                  <p style={{ color: "#6B7280", marginBottom: "0" }}>
                    Order ID
                  </p>
                  <p style={{ color: "#6B7280", marginBottom: "0" }}>GSTIN</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#1F2937", fontWeight: "600" }}>
                    #{selectedOrder?.invoice_number}
                  </p>
                  <p style={{ color: "#1F2937", fontWeight: "600" }}>
                    {selectedOrder?.order_date
                      ? new Date(selectedOrder?.order_date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")
                      : ""}
                  </p>
                  <p style={{ color: "#1F2937", fontWeight: "600" }}>
                    #{selectedOrder?.order_number}
                  </p>
                  <p style={{ color: "#1F2937", fontWeight: "600" }}>
                    CGHCJU554451JH
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <div className="border-r border-gray-400  pr-4 border-print"
              style={{ paddingRight: "12px" }}
            >
              <p
                style={{
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                SOLD BY
              </p>
              <p
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0",
                }}
              >
                COCOBLU RETAIL LIMITED
              </p>
              <p style={{ color: "#4B5563" }}>
                Renaissance industrial smart city, Kalyan Sape road, Thane,
                Maharashtra, 421302 IN
              </p>
            </div>
            <div className="border-r-0 sm:border-r-0 md:border-r  border-gray-400 pr-4 border-print"
              style={{ paddingRight: "12px" }}
            >
              <p
                style={{
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                BILLED TO
              </p>
              <p
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0",
                }}
              >
                {selectedOrder?.customer?.name}
              </p>
              <p style={{ color: "#4B5563" }}>
                {selectedOrder?.deliveryAddress?.address}
              </p>
            </div>
            <div className="col-span-3 md:col-span-1 text-center">
              <p
                style={{
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                SHIPPED TO
              </p>
              <p
                style={{
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0",
                }}
              >
                {selectedOrder?.customer?.name}
              </p>
              <p style={{ color: "#4B5563" }}>
                {selectedOrder?.deliveryAddress?.address}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#D1D5DB",
              height: "1px",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          ></div>

          <div style={{ overflow: "auto", marginTop: "16px" }}>
            <table style={{ width: "100%", borderCollapse: "-moz-initial" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #D1D5DB", backgroundColor: "rgb(247 246 244)" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px",
                      color: "#4B5563",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      color: "#4B5563",
                      textAlign: "center",
                    }}
                  >
                    Qty.
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      color: "#4B5563",
                      textAlign: "center",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      color: "#4B5563",
                      textAlign: "right",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.order_items?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #D1D5DB" }}>
                    <td style={{ padding: "8px" }}>
                      <div style={{ fontWeight: "600" }}>
                        {item?.product_name}
                      </div>
                      {item?.size && <p style={{ color: "#6B7280", marginBottom: "0" }}>
                        Size:{" "}
                        <span style={{ fontWeight: "600" }}>{item?.size}</span>
                      </p>}
                      {item?.metal && <p style={{ color: "#6B7280" }}>
                        Metal:{" "}
                        <span style={{ fontWeight: "600" }}>{item?.metal}</span>
                      </p>}
                    </td>
                    <td style={{ fontWeight: "600", textAlign: "center" }}>
                      {item?.qty}
                    </td>
                    <td style={{ fontWeight: "600", textAlign: "center" }}>
                      ₹{item?.price}
                    </td>
                    <td style={{ fontWeight: "600", textAlign: "right" }}>
                      ₹{item?.price * item?.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              backgroundColor: "#D1D5DB",
              height: "1px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ marginTop: "16px" }}>
              <h6 style={{ color: "#6B7280", fontWeight: "bold", fontSize: "18px" }}>
                Payment Method
              </h6>
              <p style={{ color: "#374151" }}>
                Bank Name: Bank Central Asia (BCA)
              </p>
              <p style={{ color: "#374151" }}>Card No.: 1234 5678 9123 4567</p>
              <p style={{ color: "#374151" }}>Name: Jhon Wick</p>
            </div>
            <div className="w-[100%] sm:w-[100%] md:w-auto " style={{marginTop: "16px", display: "flex", gap: "50px", justifyContent:"space-between"}}>
              <div>
                <p style={{ color: "#6B7280" }}>Sub Total</p>
                <p style={{ color: "#6B7280" }}>Discount</p>
                <p style={{ color: "#6B7280" }}>SGST</p>
                <p style={{ color: "#6B7280" }}>CGST</p>
                <h6 style={{ fontWeight: "bold", fontSize: "16px", borderTop: "1px solid #D1D5DB", paddingTop: "10px" }}>
                  Total Amount
                </h6>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: "600", color: "#374151" }}>
                  ₹{selectedOrder?.total_amount}
                </p>
                <p style={{ fontWeight: "600", color: "#16A34A" }}>
                  -₹{selectedOrder?.discount ? selectedOrder?.discount : 0}
                </p>
                <p style={{ fontWeight: "600", color: "#374151" }}>₹{sgst}</p>
                <p style={{ fontWeight: "600", color: "#374151" }}>₹{cgst}</p>
                <h6 style={{ fontWeight: "bold", fontSize: "16px", borderTop: "1px solid #D1D5DB", paddingTop: "10px" }}>
                  ₹{total}
                </h6>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "50px", textAlign: "center" }}>
            <p style={{ color: "#374151", fontWeight: "600" }}>
              Thank you for shopping with us!
            </p>
            <p style={{ color: "#374151" }}>Have a nice day 😊</p>
          </div>

          <div
            style={{
              backgroundColor: "#523C34",
              padding: "20px",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <p
              style={{
                color: "white",
                fontSize: "14px",
                maxWidth: "320px",
                margin: "0 auto",
              }}
            >
              If you have any questions, feel free to call customer care at +1
              565 5656 565 or use Contact Us section.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvoiceView;
