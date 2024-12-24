import { Box, Button, Menu, Modal, Pagination, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BiSolidEditAlt } from 'react-icons/bi'
import { RiDeleteBin6Fill, RiFilter2Fill } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorMessage, Field, Formik } from 'formik'
import * as Yup from 'yup';
import { addStock, deleteAllStocks, deleteStock, editStock, getAllStocks } from '../reduxe/slice/stoke.slice'
import { getAllCategory } from '../reduxe/slice/catagorys.slice'
import { getAllSubCategory } from '../reduxe/slice/subcategorys.slice'
import { getAllProducts } from '../reduxe/slice/product.slice'
import { FaFilter } from 'react-icons/fa'
import Loader from '../components/Loader'
import { enqueueSnackbar } from 'notistack'
import { Link } from 'react-router-dom'

export default function Stoke() {
    const [data, setData] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const dispatch = useDispatch();
    const { stocks, loading } = useSelector(state => state.stocks);
    const category = useSelector(state => state.categorys.category);
    const SubCategory = useSelector(state => state.subcategorys.SubCategory);
    const products = useSelector(state => state.products.products).filter(v => !stocks.some(stock => stock.product_id == v.id));
    const [filteredItems, setFilteredItems] = useState(stocks);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const searchValue = useSelector((state) => state.search.value);
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getAllStocks());
        };
        fetchData();
        dispatch(getAllCategory());
        dispatch(getAllSubCategory());
        dispatch(getAllProducts());
    }, [dispatch]);


    useEffect(() => {
        setFilteredItems(stocks);
    }, [stocks]);

    const filteredData = stocks.filter(data =>
        data.category_name.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
        data.sub_category_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.qty.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
        data.product_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    useEffect(() => {
        setFilteredItems(filteredData);
    }, [searchValue]);


    const validationSchema = Yup.object({
        category_id: Yup.string().required('Category is required'),
        sub_category_id: Yup.string().required('Sub Category is required'),
        product_id: Yup.string().required('Product is required'),
        date: Yup.date().required('Update Date is required'),
        status: Yup.string().required('Stock Status is required'),
        qty: Yup.number().required('Quantity is required').moreThan(0, 'Quantity must be greater than 0').integer(),
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set items per page

    // Calculate total pages
    const totalPages = Math.ceil(stocks.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    let currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleDeleteOpen = (data) => {
        if (data?.qty > 0) {
            enqueueSnackbar('Stock is not empty', { variant: 'error' });
        } else {
            setDelOpen(true);
            setData(data)
        }
    }
    const handleDeleteClose = () => {
        setDelOpen(false);
    }
    const handleAddOpen = (data) => {
        setAddOpen(true);
        setData(data)
    }
    const handleAddClose = () => {
        setAddOpen(false);
    }
    const handleDeleteItem = () => {
        dispatch(deleteStock({ id: data.id }))
        // dispatch(getAllUsers())
        setDelOpen(false);
    }
    const handleDeleteAll = () => {
        dispatch(deleteAllStocks()).then(() => {
            setDelAllOpen(false);
        });
    }


    const handleApplyFilter = (values) => {
        setFiltersApplied(true);
        const { date, status } = values;
        console.log(date, status);
        // Filter stocks based on selected date and status
        const filteredStocks = stocks.filter(stock => {
            const matchesDate = date ? stock.date === date : true; // Check if date matches
            const matchesStatus = status ? stock.status === status : true; // Check if status matches
            return matchesDate && matchesStatus; // Return true if both match
        });

        // Update filteredItems with filtered results
        setFilteredItems(filteredStocks);
        handleClose();
    };
    const handleResetFilters = () => {

        setCurrentPage(1); // Reset to the first page
        setFiltersApplied(false);
        setFilteredItems(stocks);
        handleClose();

    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategoryChange = (categoryId, setFieldValue) => {
        setFieldValue('category_id', categoryId);
        setFieldValue('sub_category_id', '');
        setFieldValue('product_id', '');
        const relevantSubCategories = SubCategory.filter(sub => sub.category_id == categoryId);
        setFilteredSubCategories(relevantSubCategories);
    };

    const handleSubCategoryChange = (subCategoryId, setFieldValue) => {
        setFieldValue('sub_category_id', subCategoryId);
        setFieldValue('product_id', ''); // Reset product

        const relevantProducts = products.filter(prod => prod.sub_category_id == subCategoryId);
        setFilteredProducts(relevantProducts);
    };

    return (
        loading ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader /></div> :
            <div className="container  p-5 md:p-10">
                <div className='flex flex-col lg:flex-row gap-3 justify-between items-center'>
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold text-brown">Stock </h1>
                        <p className='text-brown-50'><Link to="/dashboard">Dashboard</Link>  / <span className='text-brown font-medium'>Stock</span>
                        </p>
                    </div>
                    <div className=''>
                        <div className="flex flex-wrap justify-center lg:justify-end gap-4  mb-4">
                            {/* <button className=" text-brown w-32 border-brown border px-3 py-2 rounded flex justify-center items-center gap-2" onClick={handleFilterOpen}>
                            <span><RiFilter2Fill /></span><span>Filter</span>
                        </button> */}
                            {
                                filtersApplied ? (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <button
                                        className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
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
                                )
                            }

                            {/* {/ ====== /} */}
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
                                <Formik
                                    initialValues={{
                                        date: '',
                                        status: '',
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        setSubmitting(true);
                                        handleApplyFilter(values);
                                        setSubmitting(false);
                                    }}
                                >
                                    {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <form onSubmit={handleSubmit} className="">
                                            <div className="border-b-2">
                                                <p className="text-brown font-bold text-xl p-3">Filter</p>
                                            </div>
                                            <div className="mt-1 p-3">
                                                <div className="mb-4">
                                                    <label htmlFor="date" className="block text-sm font-bold text-brown">Update Date</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        id="date"
                                                        max={new Date().toISOString().split('T')[0]}
                                                        value={values.date}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`mt-1 block w-full border border-brown p-2 rounded ${values.date == '' ? 'text-gray-400' : 'text-black'}`}
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="status" className="block text-sm font-bold text-brown">Stock Status</label>
                                                    <select
                                                        name="status"
                                                        id="status"
                                                        value={values.status}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`mt-1 block w-full border border-brown p-2 rounded ${values.status == '' ? 'text-gray-400' : 'text-black'}`}

                                                    >
                                                        <option value="">Select Stock Status</option>
                                                        <option value="in-stock">In Stock</option>
                                                        <option value="out-stock">Out of Stock</option>
                                                        <option value="low-stock">Low Stock</option>
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
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded"
                                                >
                                                    {isSubmitting ? 'Applying...' : 'Apply'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </Menu>
                            <button className=" text-brown w-32 border-brown border px-3 py-2 rounded flex justify-center items-center gap-2" onClick={() => { setDelAllOpen(true) }}><span><RiDeleteBin6Fill /></span><span>Delete All</span></button>
                            <button className="bg-brown w-32 text-white px-3 py-2 rounded hover:bg-brown-50 " onClick={handleAddOpen}>+ Add</button>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto shadow mt-5 rounded'>

                    <table className="w-full bg-white  ">
                        <thead>
                            <tr className="text-brown font-bold">
                                <td className="py-2  px-4">No</td>
                                <td className="py-2  px-4">Category</td>
                                <td className="py-2  px-4">Sub Category</td>
                                <td className="py-2  px-4">Product Name</td>
                                <td className="py-2  px-4">Update Date</td>
                                <td className="py-2  px-4">Stock Status</td>
                                <td className="py-2  px-4">Qty</td>
                                <td className="py-2  px-4">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems && currentItems.length > 0 ? (
                                currentItems.map((ele, index) => (
                                    <tr key={index} className="hover:bg-gray-100 border-t">
                                        <td className="py-2 px-4 ">{ele?.id}</td>
                                        <td className="py-2  px-4">{ele?.category_name || ''}</td>
                                        <td className="py-2  px-4">{ele?.sub_category_name || ''}</td>
                                        <td className="py-2  px-4">{ele?.product_name || ''}</td>
                                        <td className="py-2  px-4 text-nowrap">{new Date(ele.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') || ''}</td>
                                        <td className="py-2 px-4">
                                            <div className={`font-bold  text-center p-1 px-2 text-sm rounded text-nowrap w-28 ${ele?.status === 'out-stock' ? 'text-red-600 bg-red-100' : ele?.status === 'in-stock' ? 'text-green-600 bg-green-100' : ele?.status === 'low-stock' ? 'text-yellow-600 bg-yellow-100' : ''}`}>
                                                {ele?.status === 'out-stock' ? 'Out Of Stock' : ele?.status === 'in-stock' ? 'In Stock' : ele?.status === 'low-stock' ? 'Low Stock' : ''}
                                            </div>
                                        </td>
                                        <td className="py-2  px-4">{ele?.qty || 0}</td>



                                        <td className="py-2 px-4 flex items-center gap-2">
                                            <div>
                                                <button className="text-green-400 text-xl p-1 border border-brown-50 rounded" onClick={() => handleAddOpen(ele)}><BiSolidEditAlt /></button>
                                            </div>
                                            <div>
                                                <button className="text-red-500 text-xl  p-1 border border-brown-50 rounded" onClick={() => handleDeleteOpen(ele)} ><RiDeleteBin6Fill /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-2 px-4 text-center text-gray-500 border-t">No records found</td>
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
                     boundaryCount={isSmallScreen ? 0 : 1} // Show one boundary page at the start and end
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: 'text.primary', // Default color for pagination items
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            backgroundColor: '#523b33', // Active page background color
                            color: 'white', // Active page text color
                        },
                        '& .MuiPaginationItem-root:hover': {
                            backgroundColor: 'lightgray', // Hover effect
                        },
                    }}
                />


                {/* Add  & Edit Stoke */}
                <Modal
                    open={addOpen}
                    onClose={handleAddClose}
                >
                    <Box className="bg-gray-50 absolute top-1/2 left-1/2 md:min-w-[500px]  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                        <p className='text-brown font-bold text-xl  flex justify-between'>
                            <p>{data.id ? 'Edit Stock' : 'Add Stock'}</p>
                            <button onClick={handleAddClose} className=" font-bold"><RxCross2 /></button>
                        </p>
                        <div>
                            <Formik
                                initialValues={{
                                    category_id: data.category_id || '',
                                    sub_category_id: data.sub_category_id || '',
                                    product_id: data.product_id || '',
                                    date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                                    status: data.status || '',
                                    qty: data.qty || '',
                                    id: data.id || '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if (data.id) {
                                        dispatch(editStock(values));
                                    } else {
                                        dispatch(addStock(values));
                                    }
                                    resetForm();
                                    handleAddClose();
                                }}
                            >
                                {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
                                    <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">
                                        <div className="mb-4">
                                            <label htmlFor="category_id" className="block text-sm font-bold text-brown">Category</label>
                                            <Field
                                                as="select"
                                                name="category_id"
                                                id="category_id"
                                                className={`mt-1 block w-full border border-brown p-2 rounded ${values?.category_id == '' ? 'text-gray-400' : 'text-black'}`}
                                                onChange={(e) => handleCategoryChange(e.target.value, setFieldValue)}
                                            >
                                                <option value="">Enter category name</option>
                                                {category?.map((ele) => (
                                                    <option key={ele.id} value={ele.id}>
                                                        {ele.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="category_id" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="sub_category_id" className="block text-sm font-bold text-brown">Sub Category</label>
                                            <Field
                                                as="select"
                                                name="sub_category_id"
                                                id="sub_category_id"
                                                className={`mt-1 block w-full border border-brown p-2 rounded ${values?.sub_category_id == '' ? 'text-gray-400' : 'text-black'}`}
                                                onChange={(e) => handleSubCategoryChange(e.target.value, setFieldValue)}
                                            >
                                                <option value="">Enter subcategory name</option>
                                                {filteredSubCategories.map((ele) => (
                                                    <option key={ele.id} value={ele.id}>
                                                        {ele.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="sub_category_id" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="product_id" className="block text-sm font-bold text-brown">Product</label>
                                            <Field
                                                as="select"
                                                name="product_id"
                                                id="product_id"
                                                className={`mt-1 block w-full border border-brown p-2 rounded ${values?.product_id == '' ? 'text-gray-400' : 'text-black'}`}
                                            >
                                                <option value="">Enter product name</option>
                                                {filteredProducts.map((ele) => (
                                                    <option key={ele.id} value={ele.id}>
                                                        {ele.product_name}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="product_id" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="date" className="block text-sm font-bold text-brown">Update Date</label>
                                            <Field
                                                type="date"
                                                name="date"
                                                id="date"
                                                max={new Date().toISOString().split('T')[0]}
                                                className={`mt-1 block w-full border border-brown p-2 rounded ${values?.date == '' ? 'text-gray-400' : 'text-black'}`}
                                            />
                                            <ErrorMessage name="date" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="status" className="block text-sm font-bold text-brown">Stock Status</label>
                                            <Field
                                                as="select"
                                                name="status"
                                                id="status"
                                                className={`mt-1 block w-full border border-brown p-2 rounded ${values?.status == '' ? 'text-gray-400' : 'text-black'}`}
                                            >
                                                <option value="">Select Stock Status</option>
                                                <option value="in-stock">In Stock</option>
                                                <option value="out-stock">Out of Stock</option>
                                                <option value="low-stock">Low Stock</option>
                                            </Field>
                                            <ErrorMessage name="status" component="div" className="text-red-500" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="qty" className="block text-sm font-bold text-brown">Qty</label>
                                            <Field
                                                type="number"
                                                name="qty"
                                                id="qty"
                                                className="mt-1 block w-full border border-brown p-2 rounded"
                                                placeholder="Enter Qty"
                                            />
                                            <ErrorMessage name="qty" component="div" className="text-red-500" />
                                        </div>
                                        <div className='flex flex-col md:flex-row gap-2 p-5 pb-2'>
                                            <button className='text-brown hover:bg-brown-50 border-brown border p-2 rounded w-full' onClick={handleAddClose}>
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-brown hover:bg-brown-50 text-white p-2 rounded w-full"
                                            >
                                                {isSubmitting ? 'Submitting...' : (data.id ? 'Edit Stock' : 'Add Stock')}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </Box>
                </Modal>

                {/* Delete Stoke */}
                <Modal
                    open={delOpen}
                    onClose={handleDeleteClose}

                >
                    <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                        <div className='  p-5'>
                            <div className='text-center'>

                                <p className='text-brown font-bold text-xl'>Delete Stock</p>
                                <p className='text-brown-50'>Are you sure you want to delete
                                    stock?</p>
                            </div>
                            <div className='flex flex-wrap justify-center gap-3 mt-4'>
                                <button onClick={handleDeleteClose} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteItem} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>
                {/* Delete All Stoke */}
                <Modal
                    open={delAllOpen}
                    onClose={() => setDelAllOpen(false)}

                >
                    <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">

                        <div className='  p-5'>
                            <div className='text-center'>

                                <p className='text-brown font-bold text-xl'>Delete All Stock</p>
                                <p className='text-brown-50'>Are you sure you want to delete all
                                    stock?</p>
                            </div>
                            <div className='flex flex-wrap gap-3 mt-4 justify-center'>
                                <button onClick={() => setDelAllOpen(false)} className="text-brown w-32 border-brown border px-4 py-2 rounded">Cancel</button>
                                <button onClick={handleDeleteAll} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Delete</button>
                            </div>

                        </div>

                    </Box>
                </Modal>



            </div>
    )
}
