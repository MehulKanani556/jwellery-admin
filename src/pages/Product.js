import {
  Box,
  Modal,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategory,
} from "../reduxe/slice/catagorys.slice";
import {
  getAllSubCategory,
  updateStatusSubCategory,
} from "../reduxe/slice/subcategorys.slice";
import Pagination from "@mui/material/Pagination";
import Menu from "@mui/material/Menu";
import { FaFilter } from "react-icons/fa";
import { deleteAllProducts, deleteProduct, getAllProducts } from "../reduxe/slice/product.slice";
import { useNavigate } from "react-router-dom";
// import MenuItem from '@mui/material/MenuItem';

export default function Product() {
  const [productData, setProductData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector((state) => state.categorys.category);
  const subcategory = useSelector((state) => state.subcategorys.SubCategory);
  const products = useSelector((state) => state.products.products);
  console.log(products);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filterProducts, setFilterProducts] = useState(subcategory);

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllSubCategory());
    dispatch(getAllProducts())
  }, []);

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  // ======filter=====
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //  =====pagination start=====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page

  // Calculate total pages
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

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
    setFilterProducts(filteredItems);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedStatus("");
    setCurrentPage(1); // Reset to the first page
    setFiltersApplied(false);
    setFilterProducts(subcategory);
  };

  // Get current items based on filtered items
  const currentItems = filterProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

  // =====pagination end=====

  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setProductData(data);
  };
  const handleDeleteClose = () => {
    setDelOpen(false);
  };
  const handleDeleteCategory = () => {
    dispatch(deleteProduct({ id: productData.id }));
    setDelOpen(false);
  };
  const handleDeleteAll = () => {
    console.log("Delete All User ");
    dispatch(deleteAllProducts());
  };

  const handleToggle = (data) => {
    const status = data.status == "active" ? "inactive" : "active";
    dispatch(updateStatusSubCategory({ id: data.id, status: status }));
  };

  const handleproductadd = (id) => {
    navigate('/products/productAdd', { state: { id } })
  }

  const handleproductview = (id) => {
    // navigate('/products/Productview')
  }

  return (
    <div className=" md:mx-[20px] p-4 ">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brown">Product </h1>
          <p className="text-brown-50">
            Dashboard /{" "}
            <span className="text-brown font-medium">Product</span>
          </p>
        </div>
        <div>
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
                  <label className="text-brown font-bold">Category</label>
                  <select
                    name="category_id"
                    className="border border-brown rounded w-full p-3 mt-1"
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
                  <label className="text-brown font-bold mt-4">Status</label>
                  <select
                    name="name"
                    className="border border-brown rounded w-full p-3 mt-1"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="inactive">InActive</option>
                    <option value="active">Active</option>
                  </select>
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
              onClick={handleDeleteAll}
            >
              <span>
                <RiDeleteBin6Fill />
              </span>
              <span>Delete All</span>
            </button>
            <button
              className="bg-brown w-32 text-white px-4 py-2 rounded"
              onClick={() => handleproductadd()}
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
              <td className="py-2 px-5 w-1/4">Product name</td>
              <td className="py-2 px-5 w-1/4">Category</td>
              <td className="py-2 px-5 w-1/4">SubCategory</td>
              <td className="py-2 px-5 w-1/4">Price</td>
              <td className="py-2 px-5 w-1/4">Qty</td>
              <td className="py-2 px-5 w-1/4">Status</td>
              <td className="py-2 px-5 w-1/4">Action</td>
            </tr>
          </thead>
          <tbody>
          {currentItems &&
            currentItems?.map((v, index) => (
              <tr key={index} className="hover:bg-gray-100 border-t">
                <td className="py-2 px-5">{v.id}</td>
                <td className="py-2 px-5 flex items-center">
                  <img
                    src={v.images?.[0]}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  {v.product_name}
                </td>
                <td className="py-2 px-5">{v.category_name || ""}</td>
                <td className="py-2 px-5">{v.sub_category_name  || ''}</td>
                <td className="py-2 px-5">{v.price}</td>
                <td className="py-2 px-5">{v.qty}</td>
                <td className="py-2 px-5">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.status}
                      onChange={() => handleToggle(v)}
                      className="sr-only peer"
                    />
                    <div
                      className={`relative w-[30px] h-[17px] rounded-full transition-colors duration-200 ${
                        v.status == "active" ? "bg-[#523C34]" : "bg-gray-500"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-[13px] h-[13px] rounded-full transition-transform duration-200 ${
                          v.status == "active"
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
                      className="text-brown text-xl p-1 border border-brown-50 rounded"
                        onClick={() => handleproductview(v.id)}
                    >
                      <BsFillEyeFill />
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-green-700 text-xl p-1 border border-brown-50 rounded"
                      onClick={() => handleproductadd(v.id)}
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

      {/* Delete category */}
      <Modal open={delOpen} onClose={handleDeleteClose}>
        <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete SubCategory</p>
              <p className="text-brown-50">
                Are you sure you want to delete SubCategory?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
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
    </div>
  );
}
