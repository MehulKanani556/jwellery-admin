import { Box, Modal, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteAllUsers } from "../reduxe/slice/users.slice";
import { addCategory, deleteCategory, editCategory, getAllCategory, updateStatusCategory } from "../reduxe/slice/catagorys.slice";
import Loader from "../components/Loader";

export default function Category() {
  const [categoryData, setCategoryData] = useState('');
  const [delOpen, setDelOpen] = useState(false);
  const [delAllOpen, setDelAllOpen] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const [categoryname, setCategoryname] = useState();
  const {category,loading,success} = useSelector((state) => state.categorys);
  const [error, setError] = useState('');

  useEffect(()=>{
    dispatch(getAllCategory())
  },[dispatch])


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page

  // Calculate total pages
  const totalPages = Math.ceil(category.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = category.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  const handleOpen = (data) => {
    setCreateopen(true)
    setCategoryData(data);
    setCategoryname(data.name)
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
    setCreateopen(false)
    setCategoryname('');
    setCategoryData('');
    setError('')
  }

  const handlecreatedCategory = () => {
    if (!categoryname) {
      setError('Category name is required.');
      return;
    }
    setError('');
    dispatch(addCategory({ name: categoryname }));
    handleCreateClose();
    setCategoryname('');
    setCategoryData('');
  }

  const handleUpdateCategory = () => {
    if (!categoryname) {
      setError('Category name is required.');
      return;
    }
    setError('');
    const data = { id: categoryData.id, name: categoryname };
    dispatch(editCategory({ data }));
    handleCreateClose();
    setCategoryname('');
    setCategoryData('');
  }

  const handleToggle = (data) => {
   const  status =  data.status == 'active'? 'inactive' : 'active'
   dispatch(updateStatusCategory({id:data.id,status:status}))
  };
  return (

    loading  ? <div className="flex justify-center items-center h-[calc(100vh-64px)]" ><Loader/></div> : 
    <div className=" md:mx-[20px] p-10">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brown">Category </h1>
          <p className="text-brown-50">
            Dashboard / <span className="text-brown font-medium">Category</span>
          </p>
        </div>
        <div>
          <div className="flex gap-4  mb-4">
            <button
              className=" text-brown w-32 border-brown border px-4 py-2 rounded flex justify-center items-center gap-2"
              onClick={()=>setDelAllOpen(true)}
            >
              <span>
                <RiDeleteBin6Fill />
              </span>
              <span>Delete All</span>
            </button>
            <button className="bg-brown w-32 text-white px-4 py-2 rounded" onClick={() => setCreateopen(true)}>+ Add</button>
          </div>
        </div>

      </div>
      <div className="overflow-auto shadow mt-5 rounded">
        <table className="w-full bg-white">
          <thead>
            <tr className="text-brown font-bold">
              <td className="py-2 px-5 w-1/4">ID</td>
              <td className="py-2 px-5 w-1/4">Name</td>
              <td className="py-2 px-5 w-1/4">Status</td>
              <td className="py-2 px-5 w-1/4">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr key={index} className="hover:bg-gray-100 border-t">
                <td className="py-2 px-5">{category.id}</td>
                <td className="py-2 px-5">{category.name}</td>
                <td className="py-2 px-5">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={category.status}
                      onChange={() => handleToggle(category)}
                      className="sr-only peer"
                    />
                    <div className={`relative w-[30px] h-[17px] rounded-full transition-colors duration-200 ${category.status == 'active' ? 'bg-[#523C34]' : 'bg-gray-500'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-[13px] h-[13px] rounded-full transition-transform duration-200 ${category.status == 'active' ? 'translate-x-[13px] bg-white' : 'bg-white'}`}></div>
                    </div>
                  </label>
                </td>
                <td className="py-2 px-5 flex items-center gap-2">
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
                      className="text-red-500 text-xl p-1 border border-brown-50 rounded"
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
                siblingCount={1} // Show one sibling page on each side
                boundaryCount={1} // Show one boundary page at the start and end
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


      {/* create & update category */}
      <Modal open={createopen} onClose={handleCreateClose}>
        <Box className="bg-gray-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%]">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">{categoryData ? "Edit" : "Add"} Category</p>
            </div>
            <div className="mt-10">
              <label className="text-brown font-bold">Category Name</label>
              <input
                type="text"
                placeholder={categoryData ? categoryData.name  : "Enter Category Name"}
                value={categoryname}
                className="border border-brown rounded w-full p-2 mt-1"
                onChange={(e) => {
                  setCategoryname(e.target.value);
                  if (e.target.value) setError('');
                }}
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="flex justify-center gap-8 mt-10">
              <button
                onClick={handleCreateClose}
                className="text-brown w-36 border-brown border px-5 py-2 rounded"
              >
                Cancel
              </button>
              {categoryData ? 
              ( <button
               onClick={handleUpdateCategory}
               className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded"
             >
               Update
             </button> ):(
                 <button
                 onClick={handlecreatedCategory}
                 className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded"
               >
                 Add
               </button>
             )}
             
            </div>
          </div>
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
      <Modal open={delAllOpen} onClose={()=>setDelAllOpen(false)}>
        <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="  p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete All Category</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete All Category?
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6  justify-center">
              <button
                onClick={()=>setDelAllOpen(false)}
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
