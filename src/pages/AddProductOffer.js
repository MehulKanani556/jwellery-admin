import {
  Box,
  Button,
  Modal,
  Typography,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { BsFillEyeFill } from "react-icons/bs";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import img from "../Images/user.png";
import { RxCross2 } from "react-icons/rx";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import { FaFilter, FaEye } from "react-icons/fa";
import { useFormik } from 'formik';
import {
  addCoupon, deleteAllCoupons,
  deleteCoupon,
  editCoupon,
  getAllCoupons,
  updateStatusCoupon,
} from "../reduxe/slice/coupons.slice";
import { addProductOffer, editProductOffer, getAllProductOffers, updateStatusProductOffer } from "../reduxe/slice/productoffer.slice";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllCategory } from "../reduxe/slice/catagorys.slice";
import { getAllSubCategory } from "../reduxe/slice/subcategorys.slice";
import { getAllProducts } from "../reduxe/slice/product.slice";
// import MenuItem from '@mui/material/MenuItem';

export default function AddProductOffer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const offerData = location.state?.offerData;
  const { category } = useSelector(state => state.categorys);
  const { SubCategory } = useSelector(state => state.subcategorys);
  const { products } = useSelector(state => state.products);

  // New state to hold the selected category
  const [selectedCategory, setSelectedCategory] = useState('');

  // New state to hold the filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllSubCategory());
    dispatch(getAllProducts());


  }, [dispatch]); // Add offerData and products as dependencies


  useEffect(() => {
    // Set selected category and filter products if offerData exists
    if (offerData) {
      setSelectedCategory(offerData.subcategory_id); // Set selected category
      const filtered = products.filter(product => product.sub_category_id == offerData.subcategory_id);
      setFilteredProducts(filtered); // Filter products based on the selected subcategory
    }
  }, [offerData, products]);


  console.log("offerData", offerData);


  // Function to handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Function to handle subcategory change
  const handleSubCategoryChange = (event) => {
    const selectedSubCategoryId = event.target.value;
    const filtered = products.filter(product => product.sub_category_id == selectedSubCategoryId);
    setFilteredProducts(filtered);
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Coupon Name is required"),
    code: Yup.string().required("Code is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Coupon type is required"),
    price: Yup.number().required("Price is required"),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date()
      .required("End date is required")
      .min(
        Yup.ref('start_date'),
        ({ min }) => `End date must be after ${min ? new Date(min).toLocaleDateString() : 'start date'}`
      ),
  });

  // Set initial values based on offerData if it exists
  const initialValues = {
    category_id: offerData ? offerData.category_id : '',
    subcategory_id: offerData ? offerData.subcategory_id : '',
    product_id: offerData ? offerData.product_id : '',
    name: offerData ? offerData.name : '',
    code: offerData ? offerData.code : '',
    discount: offerData ? offerData.discount : '',
    price: offerData ? offerData.price : '',
    minimum_purchase: offerData ? offerData.minimum_purchase : '',
    minimum_discount: offerData ? offerData.minimum_discount : '',
    start_date: offerData ? offerData.start_date : '',
    end_date: offerData ? offerData.end_date : '',
    description: offerData ? offerData.description : '',
    type: offerData ? offerData.type : '',
    status: offerData ? offerData.status : 'active',
    image: offerData ? offerData.image : null,
    id: offerData ? offerData.id : '',
  };

  return (
    <div className=" md:mx-[20px] p-4 ">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brown">
            {offerData ? "Edit Product Offer" : "Add Product Offers"}
          </h1>
          <p className="text-brown-50">
            Dashboard /{" "} Product Offers /{" "}
            <span className="text-brown font-medium">
              {offerData ? "Edit Product Offer" : "Add Product Offers"}
            </span>
          </p>
        </div>

      </div>
      <div className="overflow-auto shadow mt-5 rounded">
        <div className="bg-white p-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              try {
                console.log(values)
                // Check if offerData exists to determine whether to add or edit
                if (offerData) {
                  await dispatch(editProductOffer(values)); // Call editProductOffer if offerData exists
                } else {
                  await dispatch(addProductOffer(values)); // Otherwise, call addProductOffer
                }
                resetForm();
                navigate('/product-offer');
              } catch (error) {
                console.error('Error processing product offer: ', error);
              }
            }}
          >
            {({ handleChange, handleBlur, values, setFieldValue }) => (
              <Form>
                <div className="">

                  <div className="flex flex-wrap gap-3 w-full">
                    <div className="mb-4 flex-1">
                      <label htmlFor="category_id" className="block text-sm font-bold text-brown">Category</label>
                      <Field
                        as="select"
                        name="category_id"
                        id="category_id"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        onChange={(event) => {
                          handleChange(event);
                          handleCategoryChange(event); // Update selected category
                        }}
                      >
                        <option value="">Enter category </option>
                        {category?.map((ele) => (
                          <option key={ele.id} value={ele.id}>
                            {ele.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category_id" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="subcategory_id" className="block text-sm font-bold text-brown">Subcategory</label>
                      <Field
                        as="select"
                        name="subcategory_id"
                        id="subcategory_id"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        onChange={(event) => {
                          handleChange(event);
                          handleSubCategoryChange(event); // Update filtered products
                        }}
                      >
                        <option value="">Enter sub category</option>
                        {SubCategory?.filter(sub => sub.category_id == selectedCategory).map((ele) => (
                          <option key={ele.id} value={ele.id}>
                            {ele.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="subcategory_id" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="product_id" className="block text-sm font-bold text-brown">Product Name</label>
                      <Field
                        as="select"
                        name="product_id"
                        id="product_id"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                      >
                        <option value="">Enter Product</option>
                        {filteredProducts?.map((ele) => (
                          <option key={ele.id} value={ele.id}>
                            {ele.product_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="product_id" component="div" className="text-red-500" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full">
                    <div className="mb-4 flex-1">
                      <label htmlFor="name" className="block text-sm font-bold text-brown">Offer Name</label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        placeholder="Enter Offer name"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="code" className="block text-sm font-bold text-brown">Code</label>
                      <Field
                        type="text"
                        name="code"
                        id="code"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        placeholder="Enter Code"
                      />
                      <ErrorMessage name="code" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="discount" className="block text-sm font-bold text-brown">Discount</label>
                      <Field
                        type="text"
                        name="discount"
                        id="discount"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        placeholder="Enter Discount"
                      />
                      <ErrorMessage name="discount" component="div" className="text-red-500" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full">
                    <div className="mb-4 flex-1">
                      <label htmlFor="price" className="block text-sm font-bold text-brown">Price</label>
                      <Field
                        type="text"
                        name="price"
                        id="price"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        placeholder="Enter Price"
                      />
                      <ErrorMessage name="price" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label className="block text-sm font-bold text-brown">Start Date</label>
                      <Field
                        type="date"
                        name="start_date"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                      />
                      <ErrorMessage name="start_date" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label className="block text-sm font-bold text-brown">End Date</label>
                      <Field
                        type="date"
                        name="end_date"
                        min={values.start_date || ''}
                        className="mt-1 block w-full border border-brown p-2 rounded"
                      />
                      <ErrorMessage name="end_date" component="div" className="text-red-500" />
                    </div>

                  </div>
                  <div className="flex  flex-wrap gap-3 w-full">
                    <div className="mb-4 flex-1">
                      <label htmlFor="minimum_purchase" className="block text-sm font-bold text-brown">Minimum Purchase</label>
                      <Field
                        type="text"
                        name="minimum_purchase"
                        id="minimum_purchase"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        placeholder="Minimum Purchase"
                      />
                      <ErrorMessage name="minimum_purchase" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="minimum_discount" className="block text-sm font-bold text-brown">Maximum Discount</label>
                      <Field
                        type="text"
                        name="minimum_discount"
                        id="minimum_discount"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                        placeholder="Maximum Discount"
                      />
                      <ErrorMessage name="minimum_discount" component="div" className="text-red-500" />
                    </div>
                    <div className="mb-4 flex-1">
                      <label className="block text-sm font-bold text-brown">Coupon type</label>
                      <Field
                        as="select"
                        name="type"
                        className="mt-1 block w-full border border-brown p-2 rounded"
                      >
                        <option value="">Select</option>
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </Field>
                      <ErrorMessage name="type" component="div" className="text-red-500" />
                    </div>
                  </div>
                  <div className="mb-4 flex-1">

                    <label className="text-brown font-bold mt-4">Image</label>
                    <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                      {values.image ? (
                        <>
                          <div className="flex items-center bg-[#72727226] px-2 py-1">
                            <img
                              src={typeof values.image === "string" ? values.image : URL.createObjectURL(values.image)}
                              alt="Preview"
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="flex-1">
                              {typeof values.image === "string" ? values.image.split("/").pop() : values.image.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setFieldValue("image", null)} // Clear the image
                              className="text-red-500 ml-1"
                            >
                              X
                            </button>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setFieldValue("image", file); // Update the image
                              }
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                          >
                            Change
                          </label>
                        </>
                      ) : (
                        <>
                          <p className="flex-1 text-[16px] text-[#727272]">
                            Choose Image
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setFieldValue("image", file); // Update the image
                              }
                            }}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                          >
                            Browse
                          </label>
                        </>
                      )}
                    </div>
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4 flex-1">
                    <label htmlFor="description" className="block text-sm font-bold text-brown">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      className="mt-1 block w-full border border-brown p-2 rounded"
                      placeholder="Enter Description"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">

                </div>
                <div className='flex justify-center gap-2 p-5 pb-2'>
                  <button className='text-brown hover:bg-brown-50 border-brown border p-2 rounded w-28' >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-28"
                  >
                    {offerData ? "Edit" : "Add"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
