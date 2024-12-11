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
import { deleteAllProducts, deleteProduct, getAllProducts, updateStatusProduct } from "../reduxe/slice/product.slice";
import { useNavigate } from "react-router-dom";
import Slider from '@mui/material/Slider';
import { FiChevronDown } from "react-icons/fi";
import Loader from "../components/Loader";
// import MenuItem from '@mui/material/MenuItem';

const isVideo = (filename) => {
  const videoExtensions = [
    '.mp4',
    '.mov',
    '.avi',
    '.wmv',
    '.flv',
    '.mkv',
    '.webm',
    '.m4v',
    '.mpeg',
    '.3gp'
  ];
  return videoExtensions.some(ext =>
    filename.toLowerCase().endsWith(ext)
  );
};

export default function Product() {
  const [productData, setProductData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [delAllOpen, setDelAllOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector((state) => state.categorys.category);
  const subcategory = useSelector((state) => state.subcategorys.SubCategory);
  const { products, loading } = useSelector((state) => state.products);
  const searchValue = useSelector((state) => state.search.value);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllSubCategory());
    dispatch(getAllProducts())
  }, []);

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(...products.map(p => Number(p.price)));
      setMaxPrice(highestPrice + 5000);
      setPriceRange([0, highestPrice + 5000]);
    }
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

  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const sortOpen = Boolean(sortAnchorEl);

  // Add these new handler functions
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
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

    const filteredItems = filterProducts.filter((item) => {
      const matchesCategory = selectedCategory
        ? item.category_id == selectedCategory
        : true;
      const matchesSubCategory = selectedSubCategory
        ? item.sub_category_id == selectedSubCategory
        : true;
      const matchesStatus = selectedStatus
        ? item.status == selectedStatus
        : true;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesCategory && matchesSubCategory && matchesStatus && matchesPrice;
    });

    handleClose();
    setFilterProducts(filteredItems);
  };
  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    console.log(sortValue);

    if (sortValue) {

      const sortedProducts = [...filterProducts].sort((a, b) => {
        switch (sortValue) {
          case "price_low":
            return Number(a.price) - Number(b.price);
          case "price_high":
            return Number(b.price) - Number(a.price);
          case "best_selling":
            // Assuming there's a sales_count field, adjust as needed
            return (b.sales_count || 0) - (a.sales_count || 0);
          case "low_stock":
            return Number(a.qty) - Number(b.qty);
          default:
            return 0;
        }
      });
      setFilterProducts(sortedProducts);
    } else {
      setFilterProducts(products)
    }
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedStatus("");
    setCurrentPage(1); // Reset to the first page
    setFiltersApplied(false);

    setFilterProducts(subcategory);
    handleClose();


    setPriceRange([0, maxPrice]);
    setFilteredSubcategories([]);

    let resetProducts = [...products];
    if (sortBy) {
      resetProducts = resetProducts.sort((a, b) => {
        switch (sortBy) {
          case "price_low":
            return Number(a.price) - Number(b.price);
          case "price_high":
            return Number(b.price) - Number(a.price);
          case "best_selling":
            return (b.sales_count || 0) - (a.sales_count || 0);
          case "low_stock":
            return Number(a.qty) - Number(b.qty);
          default:
            return 0;
        }
      });
    }

    setFilterProducts(resetProducts);

  };
  // serch
  const filteredData = products.filter(data =>
    (data.category_name && data.category_name.toString().toLowerCase().includes(searchValue.toLowerCase())) ||
    (data.sub_category_name && data.sub_category_name.toString().toLowerCase().includes(searchValue.toLowerCase())) ||
    (data.price && data.price.toString().toLowerCase().includes(searchValue.toLowerCase())) ||
    (data.qty && data.qty.toString().toLowerCase().includes(searchValue.toLowerCase())) ||
    (data.product_name && data.product_name.toString().toLowerCase().includes(searchValue.toLowerCase()))
  );
  useEffect(() => {
    setFilterProducts(filteredData);
  }, [searchValue]);

  // Get current items based on filtered items
  const currentItems = Array.isArray(filterProducts)
    ? filterProducts.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  const handleDeleteAllProduct = () => {
    // console.log("Delete All User ");
    dispatch(deleteAllProducts());
    setDelAllOpen(false);
  };

  const handleToggle = (data) => {
    const status = data.status == "active" ? "inactive" : "active";
    dispatch(updateStatusProduct({ id: data.id, status: status }));
  };

  const handleproductadd = (id) => {
    navigate('/products/productAdd', { state: { id } })
  }

  const handleproductview = (id) => {
    navigate('/products/productView', { state: { id } })
  }

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    // Filter subcategories based on selected category
    const filtered = subcategory.filter(sub => sub.category_id == categoryId);
    setFilteredSubcategories(filtered);
    setSelectedSubCategory(""); // Reset subcategory selection
  };


  return (
    loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
      <div className="p-10">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-brown">Product </h1>
            <p className="text-brown-50">
              Dashboard /{" "}
              <span className="text-brown font-medium">Product</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end w-auto">
            <div className="flex gap-2 md:gap-x-8 lg:gap-x-2 flex-wrap mb-4 justify-center lg:justify-end">
              {filtersApplied ? (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-brown text-white w-[130px] border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                >
                  <span>
                    <FaFilter />
                  </span>
                  <span>Cancel</span>
                </button>
              ) : (
                <button
                  className="text-brown w-[130px] border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
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
              <button
                className="text-brown border-brown border px-4 py-2 rounded flex justify-center items-center gap-2 w-[130px]"
                id="sort-button"
                aria-controls={sortOpen ? "sort-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={sortOpen ? "true" : undefined}
                onClick={handleSortClick}
              >
                <span>
                  {sortBy ? (
                    sortBy === 'best_selling' ? 'Best Selling' :
                      sortBy === 'price_low' ? 'Price Low to High' :
                        sortBy === 'price_high' ? 'Price High to Low' :
                          sortBy === 'low_stock' ? 'Low Stock' : 'Sort By'
                  ) : 'Sort By'}
                </span>
                <span className={`${sortOpen ? "rotate-180" : "rotate-0"} transition-all duration-500`}>
                  <FiChevronDown />
                </span>
              </button>

              <Menu
                id="sort-menu"
                anchorEl={sortAnchorEl}
                open={sortOpen}
                onClose={handleSortClose}
                MenuListProps={{
                  "aria-labelledby": "sort-button",
                }}
                PaperProps={{
                  style: { width: "200px" },
                }}
              >
                <div className="px-2 pt-0">
                  <div className="flex flex-col items-start">
                    <button
                      className={`rounded p-1 ${sortBy === 'best_selling' ? 'font-bold text-brown' : 'text-brown'}`}
                      onClick={() => {
                        setSortBy('best_selling');
                        handleSort({ target: { value: 'best_selling' } });
                        handleSortClose();
                      }}
                    >
                      Best Selling
                    </button>
                    <button
                      className={`rounded p-1 ${sortBy === 'price_low' ? 'font-bold text-brown' : 'text-brown'}`}
                      onClick={() => {
                        setSortBy('price_low');
                        handleSort({ target: { value: 'price_low' } });
                        handleSortClose();
                      }}
                    >
                      Price Low to High
                    </button>
                    <button
                      className={`rounded p-1 ${sortBy === 'price_high' ? 'font-bold text-brown' : 'text-brown'}`}
                      onClick={() => {
                        setSortBy('price_high');
                        handleSort({ target: { value: 'price_high' } });
                        handleSortClose();
                      }}
                    >
                      Price High to Low
                    </button>
                    <button
                      className={`rounded p-1 ${sortBy === 'low_stock' ? 'font-bold text-brown' : 'text-brown'}`}
                      onClick={() => {
                        setSortBy('low_stock');
                        handleSort({ target: { value: 'low_stock' } });
                        handleSortClose();
                      }}
                    >
                      Low Stock
                    </button>
                  </div>
                </div>
              </Menu>

              {/* ===== */}

              <button
                className=" text-brown w-[130px] border-brown border px-4 py-2 rounded flex justify-center items-center gap-2 "
                onClick={() => setDelAllOpen(true)}
              >
                <span>
                  <RiDeleteBin6Fill />
                </span>
                <span>Delete All</span>
              </button>
              <button
                className="bg-brown w-[130px] text-white px-4 py-2 rounded"
                onClick={() => handleproductadd()}
              >
                + Add
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto shadow mt-5 rounded">
          <table className="bg-white w-full min-w-[1000px]">
            <thead>
              <tr className="text-brown font-bold">
                <th className="py-2 px-5 text-left whitespace-nowrap">ID</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">Product name</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">Category</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">SubCategory</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">Price</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">Qty</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">Status</th>
                <th className="py-2 px-5 text-left whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((v, index) => (
                  <tr key={index} className="hover:bg-gray-100 border-t">
                    <td className="py-2 px-5">{v.id}</td>
                    <td className="py-2 px-5 flex items-center">
                      {v.images?.[0] && isVideo(v.images[0]) ? (
                        <video
                          className="w-10 h-10 rounded-full mr-2 object-cover"
                          src={v.images[0]}
                        >
                          <source src={v.images[0]} />
                        </video>
                      ) : (
                        <img
                          src={v.images?.[0]}
                          alt="Product"
                          className="w-10 h-10 rounded-full mr-2 object-cover"
                        />
                      )}
                      {v.product_name}
                    </td>
                    <td className="py-2 px-5">{v.category_name || ""}</td>
                    <td className="py-2 px-5">{v.sub_category_name || ''}</td>
                    <td className="py-2 px-5">{v.price}</td>
                    <td className="py-2 px-5">{v.qty}</td>
                    <td className="py-2 px-5">
                      <label className="items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={v.status}
                          onChange={() => handleToggle(v)}
                          className="hidden peer"
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
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 border-t">
                    No Data found.
                  </td>
                </tr>
              )}
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
                <p className="text-brown font-bold text-xl mb-2">Delete Product</p>
                <p className="text-brown-50 mb-4">
                  Are you sure you want to delete Product?
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

        {/* Delete all product */}
        <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
          <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
            <div className="p-5">
              <div className="text-center">
                <p className="text-brown font-bold text-xl mb-2">Delete All Product</p>
                <p className="text-brown-50 mb-4">
                  Are you sure you want to delete all Product?
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                <button
                  onClick={() => setDelAllOpen(false)}
                  className="text-brown w-32 border-brown border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAllProduct}
                  className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </Box>
        </Modal>

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
                <label className="text-brown font-bold">Category</label>
                <select
                  name="category_id"
                  className="border border-brown rounded w-full p-3 mt-1"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
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
                <label className="text-brown font-bold">SubCategory</label>
                <select
                  name="subcategory_id"
                  className="border border-brown rounded w-full p-3 mt-1"
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="">Select SubCategory</option>
                  {filteredSubcategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3">
                <label className="text-brown font-bold">Status</label>
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

              <div className="mt-3">
                <label className="text-brown font-bold">Price Range</label>
                <div className="px-3 mt-2">
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice}
                    sx={{
                      color: '#523C34',
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: '#523C34',
                      },
                    }}
                  />
                  <div className="flex justify-between text-sm text-brown">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>


            </div>
            <div className="flex justify-center gap-8 mt-2 p-3">
              <button
                type="button"
                onClick={handleClose}
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

      </div>
  );
}
