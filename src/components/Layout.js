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
import { RiCoupon3Fill, RiFileListFill } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Modal } from '@mui/material';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, editUserProfile, getSingleUser } from '../reduxe/slice/users.slice';
import { RxCross2 } from 'react-icons/rx';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { logout } from '../reduxe/slice/auth.slice';
import { setSearchValue } from '../reduxe/slice/search.slice';

const drawerWidth = 275;

function Layout({ children }) {
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

  const handleLogout = () => {
    dispatch(logout());
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
    // { title: 'Invoice', icon: <FaReceipt />, path: '/invoice' },
    {
      title: 'Reason For Cancellation',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.9954 5.91906C23.9815 5.79087 23.9348 5.66843 23.8598 5.56355C23.7848 5.45867 23.684 5.3749 23.5672 5.32033L12.3172 0.0703301C12.1161 -0.0234668 11.8839 -0.0234199 11.6828 0.0703301L0.432844 5.32033C0.316051 5.37488 0.21529 5.45861 0.140285 5.56345C0.0652792 5.66828 0.0185618 5.79068 0.00464063 5.91883C0.00283146 5.94586 0.00128451 5.97291 5.75795e-10 5.99997L5.75795e-10 18.75C-5.87192e-06 18.8999 0.0449082 19.0463 0.128947 19.1704C0.212985 19.2946 0.332291 19.3906 0.471469 19.4463L11.7215 23.9463C11.9003 24.0178 12.0997 24.0178 12.2785 23.9463L15.3269 22.7273C16.2467 23.52 17.4433 24 18.75 24C21.6449 24 24 21.6448 24 18.75V5.99997C24 5.99622 23.9959 5.92422 23.9954 5.91906ZM12 1.5776L21.363 5.947L17.7577 7.38911L8.21845 3.3423L12 1.5776ZM11.25 22.1422L1.5 18.2422V7.10772L11.25 11.0077V22.1422ZM12 9.69217L2.637 5.947L6.38948 4.19585L15.7807 8.17989L12 9.69217ZM18.75 22.5C16.6823 22.5 15 20.8177 15 18.75C15 16.6822 16.6823 15 18.75 15C20.8177 15 22.5 16.6822 22.5 18.75C22.5 20.8177 20.8177 22.5 18.75 22.5ZM18.75 13.5C15.8551 13.5 13.5 15.8551 13.5 18.75C13.5 19.7679 13.7915 20.7189 14.295 21.5244L12.75 22.1423V11.0077L22.5 7.10772V15.0798C21.5464 14.1056 20.2177 13.5 18.75 13.5Z" />
          <path d="M19.8107 18.75L20.4053 18.1554C20.6983 17.8625 20.6983 17.3876 20.4053 17.0947C20.1125 16.8018 19.6376 16.8018 19.3447 17.0947L18.75 17.6894L18.1553 17.0947C17.8625 16.8018 17.3876 16.8018 17.0947 17.0947C16.8018 17.3876 16.8018 17.8624 17.0947 18.1553L17.6894 18.75L17.0947 19.3447C16.8018 19.6376 16.8018 20.1125 17.0947 20.4054C17.2412 20.5518 17.4331 20.625 17.625 20.625C17.817 20.625 18.0089 20.5518 18.1553 20.4054L18.75 19.8107L19.3447 20.4054C19.4912 20.5518 19.6831 20.625 19.875 20.625C20.067 20.625 20.2589 20.5518 20.4053 20.4054C20.6983 20.1125 20.6983 19.6376 20.4053 19.3447L19.8107 18.75Z" />
        </svg>
      ),
      path: '/cancel-reason'
    },
    { title: 'Terms & Condition', icon: <RiFileListFill />, path: '/tc' },
    {
      title: 'FAQ’s',
      icon: <BiSolidOffer />,
      path: '/faqs/view',
      subItems: [
        { title: 'FAQ Type', path: '/faq-type' },
        { title: 'FAQ’s', path: '/faqs' },
      ],
      dropdownIcon: <FaAngleDown />
    },
    {
      title: 'Privacy Policy', icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.182 4.1813C18.8413 4.03855 17.5217 3.74021 16.25 3.2923C15.083 2.87987 13.9636 2.34347 12.911 1.6923C12.6364 1.52563 12.3213 1.4375 12 1.4375C11.6787 1.4375 11.3636 1.52563 11.089 1.6923L11.088 1.6933C10.0356 2.34395 8.91657 2.88 7.75 3.2923C6.47891 3.74003 5.16004 4.03837 3.82 4.1813C3.38954 4.22513 2.99066 4.42716 2.70062 4.74824C2.41057 5.06932 2.25 5.48661 2.25 5.9193V11.1143C2.25073 13.0313 2.76378 14.9133 3.73605 16.5654C4.70832 18.2176 6.10447 19.5799 7.78 20.5113L11.15 22.3843C11.4095 22.5303 11.7023 22.6069 12 22.6069C12.2977 22.6069 12.5905 22.5303 12.85 22.3843L16.22 20.5113C17.8955 19.5799 19.2917 18.2176 20.264 16.5654C21.2362 14.9133 21.7493 13.0313 21.75 11.1143V5.9203C21.7505 5.48758 21.5905 5.07005 21.3008 4.7486C21.0111 4.42714 20.6124 4.22563 20.182 4.1813ZM15.979 10.1833L12.229 14.1833C12.0509 14.3733 11.8055 14.4863 11.5453 14.498C11.2851 14.5098 11.0306 14.4195 10.836 14.2463L8.586 12.2463C8.48287 12.1606 8.39805 12.055 8.33656 11.9358C8.27508 11.8166 8.23819 11.6863 8.2281 11.5525C8.21801 11.4188 8.23493 11.2844 8.27783 11.1574C8.32074 11.0303 8.38876 10.9132 8.47786 10.8129C8.56696 10.7127 8.6753 10.6314 8.79645 10.5739C8.9176 10.5164 9.04909 10.4839 9.18307 10.4782C9.31706 10.4725 9.45082 10.4939 9.57639 10.541C9.70196 10.5881 9.81677 10.6599 9.914 10.7523L11.437 12.1053L14.521 8.8153C14.6146 8.71575 14.7275 8.63637 14.8529 8.58203C14.9782 8.52769 15.1134 8.49954 15.25 8.4993C15.4451 8.4992 15.6359 8.55616 15.7991 8.66317C15.9622 8.77019 16.0904 8.92257 16.168 9.10157C16.2456 9.28056 16.2692 9.47834 16.2357 9.67054C16.2023 9.86275 16.1124 10.041 15.979 10.1833Z" />
        </svg>
      ), path: '/privacy'
    },
  ]
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Mobile No. is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('D.O.B is required').max(new Date().toISOString().split('T')[0], 'D.O.B cannot be in the future'),
  });
  const styles = {
    '@media (max-width: 425px)': {
      padding: '2px 10px', // Adjust the padding as needed
    },
  };
  const drawer = (
    <div>
      <Toolbar>
        <div className='w-full'>
          <h1 className='text-center text-white font-semibold text-3xl'>LOGO</h1>
        </div>
      </Toolbar>
      <Divider />
      <List>
        {pages.map((v) => (
          <div key={v.title}>
            <ListItem disablePadding sx={{ paddingLeft: '20px', paddingRight: '20px' }} >
              <ListItemButton
                onClick={() => {
                  if (v.subItems) {
                    handleSubmenuToggle(v.title);
                  } else {
                    navigate(v.path);
                    if (window && window.innerWidth < 900) {
                      setMobileOpen(false);
                    }
                  }
                }}
                sx={{
                  gap: '4px',
                  ...styles,
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
                <ListItemText primary={v.title} sx={{ fontSize: '18px', fontWeight: 500, whiteSpace: 'nowrap' }} />
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
                  onClick={() => {
                    navigate(subItem.path);
                    if (window && window.innerWidth < 900) {
                      setMobileOpen(false);
                    }
                  }}
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
  const container = typeof window !== 'undefined' ? () => window.document.body : undefined;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (event) => {
    dispatch(setSearchValue(event.target.value));
  };

  const handleListItemClick = (item, path) => {
    if (item?.subItems) {
      handleSubmenuToggle(item.title, path);
    } else {
      navigate(path);
      if (window && window.innerWidth < 900) {
        setMobileOpen(false);
      }
    }
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
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
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <div className='flex justify-between w-full' >
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <SearchIcon sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'text.brown' }} />
              <input
                type="search"
                placeholder="Search..."
                onChange={handleSearchChange}
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
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#523C34', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {memoizedUser?.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className='hidden md:block'>
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
                                <td className='p-1'>D.O.B:</td>
                                <td className='capitalize font-semibold ps-3'>{memoizedUser?.dob ? new Date(memoizedUser.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ''}</td>
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
                          name: memoizedUser ? memoizedUser.name : '',
                          email: memoizedUser ? memoizedUser.email : '',
                          phone: memoizedUser ? memoizedUser.phone : '',
                          gender: memoizedUser ? memoizedUser.gender : '',
                          id: memoizedUser ? memoizedUser.id : '',
                          dob: memoizedUser ? memoizedUser.dob : ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                          if (memoizedUser.id) {
                            console.log(values);
                            const submitData = {
                              ...values,
                              role_id: memoizedUser.role_id
                            }
                            dispatch(editUserProfile(submitData)).then((response) => {
                              resetForm();
                              setEditProfile(false);

                            });
                          }
                        }}
                      >
                        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                          <form onSubmit={handleSubmit} className="p-4 md:p-8 rounded-lg">
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
                            <div className="mb-4">
                              <label htmlFor="dob" className="block text-sm font-bold text-brown">D.O.B</label>
                              <Field
                                type="date"
                                name="dob"
                                id="dob"
                                max={new Date().toISOString().split('T')[0]}
                                className="mt-1 block w-full border border-brown p-2 rounded"
                              />
                              <ErrorMessage name="dob" component="div" className="text-red-500" />
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
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
            display: { xs: 'block', md: 'none' },
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
            display: { xs: 'none', md: 'block' },
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
