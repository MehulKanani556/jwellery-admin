import { Box, Modal, Pagination, useMediaQuery } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addReason, deleteAllReason, getAllReason, updateStatusReason } from "../reduxe/slice/reason.slice";
import { Link } from "react-router-dom";

export default function ReasonForCancel() {
  const [data, setData] = useState("");
  const [delAllOpen, setDelAllOpen] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const {reasons,loading} = useSelector((state) => state.reasons)
  const isSmallScreen = useMediaQuery("(max-width:425px)");

  const validationSchema = Yup.object({
    name: Yup.string().required("Reason is required"),
   
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {   
    
        dispatch(addReason(values));
      
      handleCreateClose();
    },
  });

  useEffect(() => {
    dispatch(getAllReason());
  }, [dispatch]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page

  // Calculate total pages
  const totalPages = Math.ceil(reasons.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reasons.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


 
  const handleDeleteAll = () => {
    dispatch(deleteAllReason());
    setDelAllOpen(false)
  };

  const handleCreateClose = () => {
    setCreateopen(false);
    setData("");
    formik.resetForm();
  };

  const handleToggle = (data) => {
    const status = data.status == "active" ? "inactive" : "active";
    dispatch(updateStatusReason({ id: data.id, status: status }));
  };
  return loading ? (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader />
    </div>
  ) : (
    <div className="container  p-5 md:p-10">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown">Reason For Cancellation </h1>
          <p className="text-brown-50">
            <Link to="/dashboard">Dashboard</Link>  / <span className="text-brown font-medium">Reason For Cancellation</span>
          </p>
        </div>
        <div>
          <div className="flex gap-4  mb-4">
            <button
              className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
              onClick={() => setDelAllOpen(true)}
            >
              <span>
                <RiDeleteBin6Fill />
              </span>
              <span>Delete All</span>
            </button>
            <button
              className="bg-brown w-32 text-white px-4 py-2 hover:bg-brown-50  rounded"
              onClick={() => setCreateopen(true)}
            >
              + Add
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-auto shadow mt-5 rounded">
        <table className="w-full bg-white">
          <thead>
            <tr className="text-brown font-bold">
              <td className="py-2 px-5 w-1/6">ID</td>
              <td className="py-2 px-5 w-1/2 ">Reason</td>
              <td className="py-2 px-5 w-1/4 text-end">Status</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100 border-t">
                <td className="py-2 px-5">{category.id}</td>
                {/* <td className="py-2 px-5">{category.name}</td> */}
                <td className="py-2 px-5 flex ">
                  
                  {category.name}
                </td>
                <td className="py-2 px-5 text-end">
                  <label className="inline-flex items-end cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.status}
                      onChange={() => handleToggle(category)}
                      className="hidden peer"
                    />
                    <div
                      className={`relative w-[30px] h-[17px] rounded-full transition-colors  duration-200 ${
                        category.status == "active"
                          ? "bg-[#523C34]"
                          : "bg-gray-500"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-[13px] h-[13px] rounded-full transition-transform duration-200 ${
                          category.status == "active"
                            ? "translate-x-[13px] bg-white"
                            : "bg-white"
                        }`}
                      ></div>
                    </div>
                  </label>
                </td>
                
              </tr>
            ))}
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
          "& .MuiPaginationItem-root": {
            color: "text.primary", // Default color for pagination items
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundColor: "#523b33", // Active page background color
            color: "white", // Active page text color
          },
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "lightgray", // Hover effect
          },
        }}
      />

      {/* create & update category */}
      <Modal open={createopen} onClose={handleCreateClose}>
        <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%]">
          <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                {data ? "Edit" : "Add"} Reason
              </p>
            </div>

            <div className="mt-10">
              <label className="text-brown font-bold">Reason for cancellation</label>
              <textarea
                name="name"
                placeholder="Enter reason"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-brown rounded w-full p-2 mt-1"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

          

            <div className="flex justify-center gap-8 mt-10">
              <button
                type="button"
                onClick={handleCreateClose}
                className="text-brown w-36 border-brown border px-5 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded"
              >
                {data ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      

      {/* Delete All category */}
      <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
        <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="  p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                Delete All Reason
              </p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete All Reason?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6  justify-center">
              <button
                onClick={() => setDelAllOpen(false)}
                className="text-brown w-32 border-brown border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
