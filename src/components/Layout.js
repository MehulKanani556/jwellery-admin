import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaList } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { CgArrowsShrinkH } from "react-icons/cg";
import { BsBoxFill } from "react-icons/bs";
import { LuBoxes } from "react-icons/lu";
import { TbMessageStar } from "react-icons/tb";
import { RiCoupon3Fill } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {  Modal } from '@mui/material';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, editUserProfile, getSingleUser } from '../reduxe/slice/users.slice';
import { RxCross2 } from 'react-icons/rx';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const drawerWidth = 250;

function Layout({ children }) {
  const { window } = children;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = sessionStorage.getItem('userId');
  const role = sessionStorage.getItem('role');
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const user = useSelector((state) => state.users.currUser)
  const [openProfile, setOpenProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // console.log(user);

  // Memoize the user data
  const memoizedUser = useMemo(() => user, [user]);

  useEffect(() => {
    if (userId) {
      dispatch(getSingleUser(userId))
    }
  }, [userId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleSubmenuToggle = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };



  const handleLogout= () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    navigate('/');
  }

  const pages = [
    { title: 'Dashboard', icon: <AiFillHome />, path: '/dashboard' },
    { title: 'User', icon: <FaUser />, path: '/user' },
    { title: 'Category', icon: <BiSolidCategory />, path: '/category' },
    { title: 'Subcategory', icon: <FaList />, path: '/subcategory' },
    { title: 'Product', icon: <BsFillBoxSeamFill />, path: '/products' },
    { title: 'Size', icon: <CgArrowsShrinkH />, path: '/size' },
    { title: 'Stock', icon: <BsBoxFill />, path: '/stoke' },
    // { title: 'Cart', icon: <IoBagCheck />, path: '/' },
    { title: 'Orders', icon: <LuBoxes />, path: '/order' },
    { title: 'Review', icon: <TbMessageStar />, path: '/review' },
    { title: 'Coupons', icon: <RiCoupon3Fill />, path: '/coupons' },
    {
      title: 'Offers',
      icon: <BiSolidOffer />,

      subItems: [
        { title: 'Product Offer', path: '/product-offer' },
        { title: 'Offer', path: '/offers' },
      ],
      dropdownIcon: <FaAngleDown />
    },
    { title: 'Return Orders', icon: <FaArrowsRotate />, path: '/return-order' },
    { title: 'Invoice', icon: <FaReceipt />, path: '/invoice' }
  ]
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Mobile No. is required'),
    gender: Yup.string().required('Gender is required'),
  });

  const drawer = (
    <div>
      <Toolbar></Toolbar>
      <Divider />
      <List>
        {
          pages.map((v) => (
            <div key={v.title}>
              <ListItem disablePadding sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
                <ListItemButton
                  onClick={() => {
                    handleSubmenuToggle(v.title);
                    if (!v.subItems) {
                      navigate(v.path);
                    }
                  }}
                  sx={{
                    gap: '4px',
                    backgroundColor: location.pathname.includes(v.path) ? '#FFF9F6' : 'transparent',
                    color: location.pathname.includes(v.path) ? '#523C34' : 'white',
                    borderRadius: '10px',
                    '&:hover': {
                      backgroundColor: '#FFF9F6',
                      color: '#523C34',
                      '& .MuiSvgIcon-root': {
                        color: '#523C34',
                      },
                      '& .icon': {
                        color: '#523C34',
                      }
                    }
                  }}
                >
                  <ListItemIcon className="icon" sx={{ color: location.pathname.includes(v.path) ? '#523C34' : 'white', fontSize: '20px', minWidth: '35px' }}>
                    {v.icon}
                  </ListItemIcon>
                  <ListItemText primary={v.title} sx={{ fontSize: '18px', fontWeight: 500 }} />
                  {v.dot && <span style={{ color: 'red', marginLeft: '5px' }}>•</span>}
                  {v.subItems && openSubmenu === v.title ? <FaAngleUp /> : v.dropdownIcon}
                </ListItemButton>
              </ListItem>
              {v.subItems && openSubmenu === v.title && v.subItems.map(subItem => (
                <ListItem key={subItem.title} disablePadding sx={{ paddingLeft: '40px' }}>
                  <ListItemButton
                    sx={{
                      backgroundColor: location.pathname.includes(subItem.path) ? '#FFF9F6' : 'transparent',
                      color: location.pathname.includes(subItem.path) ? '#523C34' : 'white',
                      borderRadius: '10px',
                      fontSize: '10px',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                      marginTop: '7px',
                      '&:hover': {
                        backgroundColor: '#FFF9F6',
                        color: '#523C34',
                      }
                    }}
                    onClick={() => navigate(subItem.path)}
                  >
                    <span style={{ margin: '5px' }}>•</span>
                    <ListItemText primary={subItem.title} sx={{ fontSize: '14px', fontWeight: 400 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </div>
          ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#523C34'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>


          <div className='flex justify-between w-full' >
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <SearchIcon sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'text.brown' }} />
              <input
                type="search"
                placeholder="Search..."
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '8px',
                  paddingLeft: '40px',
                  width: '100%'
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }} className="gap-4 me-4">
              
              <div color="inherit" sx={{ ml: 2 }} className='relative'>
                <div className='flex gap-2 items-center' onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
                  <div>
                    <img src={memoizedUser?.image} alt="User Profile" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 500 }} className='capitalize'>{memoizedUser?.name}</div>
                    <div style={{ fontSize: '14px' }} className='capitalize flex items-center gap-1 text-brown-50'>
                      <span>
                        {role}
                      </span>
                      <span>
                        {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                    </div>
                  </div>
                </div>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`dropdown-content ${dropdownOpen ? 'fade-in scale-in' : 'fade-out scale-out'}`}
                    style={{ position: 'absolute', background: '#FFF', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '4px', zIndex: 1000, right: 0 }}
                  >
                    <div style={{ padding: '10px', cursor: 'pointer' }} className='text-nowrap' onClick={() => setOpenProfile(true)}>Edit Profile</div>
                    <div style={{ padding: '10px', cursor: 'pointer' }} className='text-nowrap' onClick={() => setOpenPassword(true)}>Change Password</div>
                    <div style={{ padding: '10px', cursor: 'pointer' }} className='text-nowrap' onClick={handleLogout}>Logout</div>
                  </div>
                )}
                {/* View Profile */}
                <Modal
                  open={openProfile}
                  onClose={() => setOpenProfile(false)}

                >
                  <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className='text-end'>
                      <button onClick={() => setOpenProfile(false)} className=" font-bold "><RxCross2 /></button>
                    </div>
                    <p className='text-brown font-bold text-xl  '>
                      <p className='text-center'>My Profile</p>
                    </p>
                    <div className=' p-5'>
                      <div className='flex gap-6 items-center'>

                        <div>
                          <img src={memoizedUser?.image} alt="User Profile" className='rounded-full w-24 h-24' />
                        </div>
                        <div>

                          <table className='text-brown'>
                            <tbody>
                              <tr>
                                <td className='p-1'>Name:</td>
                                <td className='capitalize font-semibold ps-3'>{memoizedUser?.name}</td>
                              </tr>
                              <tr>
                                <td className='p-1'>Email:</td>
                                <td className=' font-semibold ps-3'>{memoizedUser?.email}</td>
                              </tr>
                              <tr>
                                <td className='p-1'>Mobile No.:</td>
                                <td className=' font-semibold ps-3'>{memoizedUser?.phone}</td>
                              </tr>
                              <tr>
                                <td className='p-1'>Gender:</td>
                                <td className='capitalize font-semibold ps-3'>{memoizedUser?.gender}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>


                    </div>
                    <div className='text-center py-2'>

                      <button onClick={() => { setEditProfile(true); setOpenProfile(false) }} className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Edit Profile</button>
                    </div>
                  </Box>
                </Modal>
                {/* Edit Profile */}
                <Modal
                  open={editProfile}
                  onClose={() => setEditProfile(false)}

                >
                  <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className='text-end'>
                      <button onClick={() => setEditProfile(false)} className=" font-bold "><RxCross2 /></button>
                    </div>
                    <p className='text-brown font-bold text-xl  '>
                      <p className='text-center'>Edit Profile</p>
                    </p>
                    <div>
                      <Formik
                        initialValues={{
                          image: memoizedUser ? memoizedUser.image : '',
                          name: memoizedUser ? memoizedUser.name : '',
                          email: memoizedUser ? memoizedUser.email : '',
                          phone: memoizedUser ? memoizedUser.phone : '',
                          gender: memoizedUser ? memoizedUser.gender : '',
                          id: memoizedUser ? memoizedUser.id : ''

                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                          if (memoizedUser.id) {
                            dispatch(editUserProfile(values)).then((response) => {
                              resetForm();
                              setEditProfile(false);

                            });
                          }
                        }}
                      >
                        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                          <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">
                            <div className="mb-4">
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
                            <div className="mb-4">
                              <label htmlFor="name" className="block text-sm font-bold text-brown">Name</label>
                              <Field
                                type="text"
                                name="name"
                                id="name"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                                placeholder="Enter your name"
                              />
                              <ErrorMessage name="name" component="div" className="text-red-500" />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="email" className="block text-sm font-bold text-brown">Email</label>
                              <Field
                                type="email"
                                name="email"
                                id="email"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                                placeholder="Enter your email"
                              />
                              <ErrorMessage name="email" component="div" className="text-red-500" />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="phone" className="block text-sm font-bold text-brown">Mobile No.</label>
                              <Field
                                type="text"
                                name="phone"
                                id="phone"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                                placeholder="Enter your mobile number"
                              />
                              <ErrorMessage name="phone" component="div" className="text-red-500" />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="gender" className="block text-sm font-bold text-brown">Gender</label>
                              <Field
                                as="select"
                                name="gender"
                                id="gender"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </Field>
                              <ErrorMessage name="gender" component="div" className="text-red-500" />
                            </div>

                            <div className='flex flex-col md:flex-row gap-2 p-5 pb-2 justify-center'>
                              <button className='text-brown hover:bg-brown-50 border-brown border p-2 w-32 rounded ' onClick={() => setEditProfile(false)}>Cancel</button>
                              <button className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Edit </button>
                            </div>
                          </form>
                        )}
                      </Formik>
                    </div>

                  </Box>
                </Modal>
                {/* Change Password */}
                <Modal
                  open={openPassword}
                  onClose={() => setOpenPassword(false)}

                >
                  <Box className="bg-gray-50  absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className='text-end'>
                      <button onClick={() => setOpenPassword(false)} className=" font-bold "><RxCross2 /></button>
                    </div>
                    <p className='text-brown font-bold text-xl  '>
                      <p className='text-center'>Change Password</p>
                    </p>
                    <div>
                      <Formik
                        initialValues={{
                          current_password: '',
                          new_password: '',
                          confirm_password: ''
                        }}
                        validationSchema={Yup.object({
                          current_password: Yup.string().required('Current password is required'),
                          new_password: Yup.string().required('New password is required').min(8, 'Password must be at least 8 characters'),
                          confirm_password: Yup.string().required('Confirm password is required').oneOf([Yup.ref('new_password'), null], 'Passwords must match')
                        })}
                        onSubmit={(values, { resetForm, setErrors }) => {
                          if (memoizedUser.id) {
                            dispatch(changePassword(values)).then((response) => {
                              console.log(response.payload);
                              if (response?.payload?.success) {
                                resetForm();
                                setOpenPassword(false);
                              } else {
                                setErrors({ new_password: response.payload.message || 'Failed to change password' });
                              }
                            });
                          }
                        }}
                      >
                        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                          <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">

                            <div className="mb-4">
                              <label htmlFor="current_password" className="block text-sm font-bold text-brown">Old Password</label>
                              <Field
                                type="password"
                                name="current_password"
                                id="current_password"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                                placeholder="Enter old password"
                              />
                              <ErrorMessage name="current_password" component="div" className="text-red-500" />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="new_password" className="block text-sm font-bold text-brown">New Password</label>
                              <Field
                                type="password"
                                name="new_password"
                                id="new_password"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                                placeholder="Enter new password"
                              />
                              <ErrorMessage name="new_password" component="div" className="text-red-500" />
                            </div>
                            <div className="mb-4">
                              <label htmlFor="confirm_password" className="block text-sm font-bold text-brown">Confirm New Password</label>
                              <Field
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                className="mt-1 block w-full border border-brown p-2 rounded"
                                placeholder="Enter confirm password"
                              />
                              <ErrorMessage name="confirm_password" component="div" className="text-red-500" />
                            </div>

                            <div className='flex flex-col md:flex-row gap-2 p-5 pb-2 justify-center'>
                              <button className='text-brown hover:bg-brown-50 border-brown border p-2 w-32 rounded ' onClick={() => setOpenPassword(false)}>Cancel</button>
                              <button className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded">Change </button>
                            </div>
                          </form>
                        )}
                      </Formik>
                    </div>

                  </Box>
                </Modal>
              </div>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#523C34',
              // paddingLeft: '60px'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#523C34',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
     
    </Box>
  );
}

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Layout;
