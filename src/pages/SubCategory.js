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
import { deleteAllUsers, deleteUser } from "../reduxe/slice/users.slice";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  updateStatusCategory,
} from "../reduxe/slice/catagorys.slice";
import {
  addSubCategory,
  deleteAllSubCategory,
  deleteSubCategory,
  editSubCategory,
  getAllSubCategory,
  updateStatusSubCategory,
} from "../reduxe/slice/subcategorys.slice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import { FaFilter } from "react-icons/fa";
import Loader from "../components/Loader";
// import MenuItem from '@mui/material/MenuItem';

export default function SubCategory() {
  const [subCategoryData, setSubCategoryData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [delAllOpen, setDelAllOpen] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [image, setImage] = useState();
  const category = useSelector((state) => state.categorys.category);
  const subcategory = useSelector((state) => state.subcategorys.SubCategory);
  const loading = useSelector(state => state.subcategorys.loading);
  const searchValue = useSelector((state) => state.search.value);

  const fileInputRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filterSubCategory, setFilterSubCategory] = useState(subcategory);


  const [isImageChanged, setIsImageChanged] = useState(false);


  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllSubCategory());
  }, []);

  useEffect(() => {

    setFilterSubCategory(subcategory);

  }, [subcategory]);


  // ======filter=====
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  // serch
  const filteredData = subcategory.filter(data =>
    data.category_name.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
    data.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  useEffect(() => {
    setFilterSubCategory(filteredData);
  }, [searchValue]);

  //  =====pagination start=====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page

  // Calculate total pages
  const totalPages = Math.ceil(filterSubCategory.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Handle filter application
  const handleApplyFilter = () => {
    setFiltersApplied(true);
    console.log(selectedCategory, selectedStatus);

    const filteredItems = subcategory.filter((item) => {

      const matchesCategory = selectedCategory
        ? item.category_id == selectedCategory
        : true;
      const matchesStatus = selectedStatus
        ? item.status == selectedStatus
        : true;


      return matchesCategory && matchesStatus;
    });

    handleClose();
    setFilterSubCategory(filteredItems);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedStatus("");
    setCurrentPage(1); // Reset to the first page
    setFiltersApplied(false);
    setFilterSubCategory(subcategory);
    handleClose();
  };

  // // Get current items with filtering
  // const filteredItems = subcategory.filter((item) => {
  //   const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true;
  //   const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
  //   return matchesCategory && matchesStatus;
  // });

  // Get current items based on filtered items
  const currentItems = filterSubCategory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  // =====pagination end=====

  const handleOpen = (data) => {
    setCreateopen(true);
    setSubCategoryData(data);
  };

  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setSubCategoryData(data);
  };
  const handleDeleteClose = () => {
    setDelOpen(false);
  };
  const handleDeleteCategory = () => {
    console.log("Delete cat", subCategoryData);
    dispatch(deleteSubCategory({ id: subCategoryData.id }));
    setDelOpen(false);
  };
  const handleDeleteAllSubCategory = () => {
    // console.log("Delete All User ");
    dispatch(deleteAllSubCategory());
    setDelAllOpen(false);
  };

  const handleCreateClose = () => {
    setCreateopen(false);
    setSubCategoryData("");
  };

  const handlecreatedCategory = (values) => {
    // Ensure the image is included in the values
    const formData = new FormData();
    formData.append("category_id", values.category_id);
    formData.append("name", values.name);
    formData.append("image", values.image); // Ensure the image is included

    dispatch(addSubCategory(formData)); // Dispatch the formData
    handleCreateClose();
    setSubCategoryData("");
  };

  const handleUpdateCategory = (values) => {
    const formData = new FormData();

    formData.append("id", subCategoryData.id);
    formData.append("name", values.name);
    formData.append("category_id", values.category_id);

    // Ensure the image is included if it has been changed
    if (values.image) {
      formData.append("image", values.image);
    }

    console.log("sdsd", formData, values);

    dispatch(editSubCategory(formData)); // Dispatch the formData
    handleCreateClose();
    setSubCategoryData("");
  };

  const handleToggle = (data) => {
    const status = data.status == "active" ? "inactive" : "active";
    dispatch(updateStatusSubCategory({ id: data.id, status: status }));
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    category_id: Yup.string().required("Category is required"),
    name: Yup.string().required("Sub Category Name is required"),
    image: Yup.mixed()
      .test("fileSize", "File size is too large, must be 2MB or less", function (value) {
        const { id } = this.parent;
        if (!isImageChanged && id) {
          return true;
        }
        return !value || (value.size <= 2 * 1024 * 1024);
      })
      .test("fileFormat", "Unsupported Format", function (value) {
        const { id } = this.parent;
        if (!isImageChanged && id) {
          return true;
        }
        return !value || ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      })

  });

  return (

    loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
      <div className="p-10">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-brown">SubCategory </h1>
            <p className="text-brown-50">
              Dashboard /{" "}
              <span className="text-brown font-medium">SubCategory</span>
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="flex gap-4  mb-4">
              {filtersApplied ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                >
                  <span>
                    <FaFilter />
                  </span>
                  <span>Cancel</span>
                </button>
              ) : (
                <button
                  className="text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <span>
                    <FaFilter />
                  </span>
                  <span>Filter</span>
                </button>
              )}
              {/* ====== */}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  style: { width: "300px" },
                }}
              >
                <div className="">
                  <div className="border-b-2">
                    <p className="text-brown font-bold text-xl p-3">Filter</p>
                  </div>
                  <div className="mt-1 p-3">
                    <div className>
                      <label className="text-brown font-bold mt-4">Category</label>
                      <select
                        name="category_id"
                        className="border border-brown rounded w-full p-3 "
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {category.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3">
                      <label className="text-brown font-bold mt-4">Status</label>
                      <select
                        name="name"
                        className="border border-brown rounded w-full p-3 mt-1"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">Select status</option>
                        <option value="inactive">In Active</option>
                        <option value="active">Active</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center gap-8 mt-2 p-3">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-brown w-36 border-brown border px-5 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyFilter}
                      className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </Menu>

              {/* ===== */}

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
                className="bg-brown w-32 text-white px-4 py-2 rounded"
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
                <td className="py-2 px-5 w-1/4">Category</td>
                <td className="py-2 px-5 w-1/4">Name</td>
                <td className="py-2 px-5 w-1/4">Status</td>
                <td className="py-2 px-5 w-1/4">Action</td>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((v, index) => (
                <tr key={index} className="hover:bg-gray-100 border-t">
                  <td className="py-2 px-5">{v.id}</td>
                  <td className="py-2 px-5">{v.category_name}</td>
                  <td className="py-2 px-5 flex items-center">
                    <img
                      src={v.image}
                      alt="User"
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    {v.name}
                  </td>
                  <td className="py-2 px-5">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={v.status}
                        onChange={() => handleToggle(v)}
                        className="sr-only peer"
                      />
                      <div
                        className={`relative w-[30px] h-[17px] rounded-full transition-colors duration-200 ${v.status == "active" ? "bg-[#523C34]" : "bg-gray-500"
                          }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-[13px] h-[13px] rounded-full transition-transform duration-200 ${v.status == "active"
                            ? "translate-x-[13px] bg-white"
                            : "bg-white"
                            }`}
                        ></div>
                      </div>
                    </label>
                  </td>
                  <td className="py-2 px-5 flex items-center gap-2">
                    <div>
                      <button
                        className="text-green-700 text-xl p-1 border border-brown-50 rounded"
                        onClick={() => handleOpen(v)}
                      >
                        <RiEdit2Fill />
                      </button>
                    </div>
                    <div>
                      <button
                        className="text-red-500 text-xl p-1 border border-brown-50 rounded"
                        onClick={() => handleDeleteOpen(v)}
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
          siblingCount={1} // Show one sibling page on each side
          boundaryCount={1} // Show one boundary page at the start and end
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
            <div className="p-5">
              <div className="text-center">
                <p className="text-brown font-bold text-xl">
                  {subCategoryData ? "Edit" : "Add"} SubCategory
                </p>
              </div>
              <Formik
                initialValues={{
                  category_id: subCategoryData ? subCategoryData.category_id : "",
                  name: subCategoryData ? subCategoryData.name : "",
                  image:
                    subCategoryData && subCategoryData.image
                      ? subCategoryData.image
                      : null,
                  id: subCategoryData ? subCategoryData.id : "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  if (subCategoryData) {
                    console.log("sdsvdgsd", values);

                    handleUpdateCategory(values); // Pass values to update function
                  } else {
                    handlecreatedCategory(values); // Pass values to create function
                  }
                  handleCreateClose();
                }}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    {console.log(subCategoryData)}
                    <div className="mt-7">
                      <div className="mt-3">
                        <label className="text-brown font-bold">Category</label>
                        <Field
                          as="select"
                          name="category_id"
                          className={`border border-brown rounded w-full p-3 mt-1 ${values.category_id == "" ? "text-gray-500" : "text-black"}`}
                        >
                          <option value="" className="text-black">Select Category</option>
                          {category.map((cat) => (
                            <option key={cat.id} value={cat.id} className="text-black">
                              {cat.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="category_id"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="text-brown font-bold mt-4">
                          SubCategory Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter Sub Category Name"
                          className="border border-brown rounded w-full p-2 mt-1"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-[12px]"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="text-brown font-bold mt-4">Image</label>
                        <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                          {values.image ? (
                            <>
                              <div className="flex items-center bg-[#72727226] px-2 py-1">
                                {typeof values.image === "string" ? (
                                  <img
                                    src={values.image}
                                    alt="Preview"
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                ) : (
                                  <img
                                    src={URL.createObjectURL(values.image)}
                                    alt="Preview"
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                )}
                                <span className="flex-1">
                                  {typeof values.image === "string"
                                    ? values.image.split("/").pop()
                                    : values.image.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setFieldValue("image", null)} // Clear the image
                                  className="text-red-500 ml-1 text-[12px]"
                                >
                                  X
                                </button>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => {
                                  const file = e.currentTarget.files[0];
                                  setFieldValue("image", file);
                                  setIsImageChanged(!!file);

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
                                  const file = e.currentTarget.files[0];
                                  setFieldValue("image", file);
                                  setIsImageChanged(!!file);

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
                          className="text-red-500 text-[12px]"
                        />
                      </div>
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
                        {subCategoryData ? "Edit" : "Add"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Box>
        </Modal>

        {/* Delete category */}
        <Modal open={delOpen} onClose={handleDeleteClose}>
          <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
            <div className="p-5">
              <div className="text-center">
                <p className="text-brown font-bold text-xl">Delete SubCategory</p>
                <p className="text-brown-50 mt-2">
                  Are you sure you want to delete SubCategory?
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
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

        {/* Delete all sub category */}
        <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
          <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
            <div className="p-5">
              <div className="text-center">
                <p className="text-brown font-bold text-xl">Delete All SubCategory</p>
                <p className="text-brown-50 mt-2">
                  Are you sure you want to delete All SubCategory?
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <button
                  onClick={() => setDelAllOpen(false)}
                  className="text-brown w-32 border-brown border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllSubCategory}
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
