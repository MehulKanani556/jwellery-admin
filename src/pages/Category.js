import { Box, Modal, Pagination, useMediaQuery } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteAllUsers } from "../reduxe/slice/users.slice";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  updateStatusCategory,
} from "../reduxe/slice/catagorys.slice";
import Loader from "../components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

export default function Category() {
  const [categoryData, setCategoryData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [delAllOpen, setDelAllOpen] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const [categoryname, setCategoryname] = useState();
  const { category, loading, success } = useSelector(
    (state) => state.categorys
  );
  const isSmallScreen = useMediaQuery("(max-width:425px)");

  const [error, setError] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRef = useRef(null);
  const searchValue = useSelector((state) => state.search.value);

  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    image: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 2MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true; // Skip for existing image URLs
          return value.size <= 2 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true; // Skip for existing image URLs
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", values.image);
      console.log(
        formData.get("image"),
        "sdvsdvdv",
        categoryData,
        values,
        formData
      );
      if (categoryData) {
        formData.append("id", categoryData.id);
        // Update category
        dispatch(editCategory(formData));
      } else {
        // Create category
        dispatch(addCategory(formData));
      }
      handleCreateClose();
    },
  });

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);


  // serch 
  const filteredData = category.filter(data =>
    data.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page

  // Calculate total pages
  const totalPages = Math.ceil(category.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpen = (data) => {
    setCreateopen(true);
    setCategoryData(data);
    if (data) {
      formik.setValues({
        name: data.name,
        image: data.image || null,
      });
    }
  };

  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setCategoryData(data);
  };
  const handleDeleteClose = () => {
    setDelOpen(false);
  };
  const handleDeleteCategory = () => {
    console.log("Delete cat", categoryData);
    dispatch(deleteCategory({ id: categoryData.id }));
    setDelOpen(false);
  };
  const handleDeleteAll = () => {
    console.log("Delete All User ");
    dispatch(deleteAllUsers());
  };

  const handleCreateClose = () => {
    setCreateopen(false);
    setCategoryData("");
    formik.resetForm();
    setIsImageChanged(false);
  };

  const handleToggle = (data) => {
    const status = data.status == "active" ? "inactive" : "active";
    dispatch(updateStatusCategory({ id: data.id, status: status }));
  };
  return loading ? (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <Loader />
    </div>
  ) : (
    <div className="container p-5 md:p-10">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown">Category </h1>
          <p className="text-brown-50">
            <Link to="/dashboard">Dashboard</Link>  / <span className="text-brown font-medium">Category</span>
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
              className="bg-brown w-32 text-white px-4 py-2 rounded hover:bg-brown-50 "
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
              <td className="py-2 px-5 w-1/4">ID</td>
              <td className="py-2 px-5 w-1/4 ">  Name</td>
              <td className="py-2 px-5 w-1/4 text-center">Status</td>
              <td className="py-2 px-5 w-1/4 text-end">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100 border-t">
                <td className="py-2 px-5">{category.id}</td>
                {/* <td className="py-2 px-5">{category.name}</td> */}
                <td className="py-2 px-5 flex ">
                  <img
                    src={category.image}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  {category.name}
                </td>
                <td className="py-2 px-5 text-center">
                  <label className="inline-flex items-end cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.status}
                      onChange={() => handleToggle(category)}
                      className="sr-only peer"
                    />
                    <div
                      className={`relative w-[30px] h-[17px] rounded-full transition-colors duration-200 ${category.status == "active"
                        ? "bg-[#523C34]"
                        : "bg-gray-500"
                        }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-[13px] h-[13px] rounded-full transition-transform duration-200 ${category.status == "active"
                          ? "translate-x-[13px] bg-white"
                          : "bg-white"
                          }`}
                      ></div>
                    </div>
                  </label>
                </td>
                <td className="py-2 px-5 flex justify-end gap-2">
                  <div>
                    <button
                      className="text-green-700 text-xl p-1 border border-brown-50 rounded"
                      onClick={() => handleOpen(category)}
                    >
                      <RiEdit2Fill />
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-red-500 text-xl p-1 border border-brown-50 rounded hover:text-red-300"
                      onClick={() => handleDeleteOpen(category)}
                    >
                      <RiDeleteBin6Fill />
                    </button>
                  </div>
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
          siblingCount={0} // Show zero sibling pages
           boundaryCount={isSmallScreen ? 0 : 1} // Show one boundary page
          // showFirstButton // Show first page button
          // showLastButton // Show last page button
          sx={{
            "& .MuiPaginationItem-root": {
              color: "text.primary",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#523b33",
              color: "white",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "lightgray",
            },
          }}
        />

      {/* create & update category */}
      <Modal open={createopen} onClose={handleCreateClose}>
        <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%]">
          <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                {categoryData ? "Edit" : "Add"} Category
              </p>
            </div>

            <div className="mt-10">
              <label className="text-brown font-bold">Category Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Category Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border border-brown rounded w-full p-2 mt-1"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="mt-3">
              <label className="text-brown font-bold mt-4">Image</label>
              <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                {formik.values.image ? (
                  <>
                    <div className="flex items-center bg-[#72727226] px-2 py-1">
                      <img
                        src={
                          typeof formik.values.image === "string"
                            ? formik.values.image
                            : URL.createObjectURL(formik.values.image)
                        }
                        alt="Preview"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                     <span className="flex-1 w-8 md:w-auto truncate ">
                        {typeof formik.values.image === "string"
                          ? formik.values.image.split("/").pop()
                          : formik.values.image.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("image", null);
                          setIsImageChanged(false);
                        }}
                        className="text-red-500 ml-1 text-[12px]"
                      >
                        X
                      </button>
                    </div>
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
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                    >
                      Browse
                    </label>
                  </>
                )}
                <input
                  id="file-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue("image", file);
                    setIsImageChanged(!!file);
                  }}
                  className="hidden"
                />
              </div>
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-sm">{formik.errors.image}</p>
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
                {categoryData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Delete category */}
      <Modal open={delOpen} onClose={handleDeleteClose}>
        <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="  p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete Category</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete Category?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6  justify-center">
              <button
                onClick={handleDeleteClose}
                className="text-brown w-32 border-brown border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Delete All category */}
      <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
        <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="  p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                Delete All Category
              </p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete All Category?
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
