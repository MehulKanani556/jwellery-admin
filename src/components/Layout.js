import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AiFillHome } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaList } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { CgArrowsShrinkH } from "react-icons/cg";
import { BsBoxFill } from "react-icons/bs";
import { IoBagCheck } from "react-icons/io5";
import { LuBoxes } from "react-icons/lu";
import { TbMessageStar } from "react-icons/tb";
import { RiCoupon3Fill } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Badge } from '@mui/material';

const drawerWidth = 325;

function Layout({ children }) {
  const { window } = children;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const pages = [
    { title: 'Dashboard', icon: <AiFillHome />, path: '/dashboard' },
    { title: 'User', icon: <FaUser />, path: '/user' },
    { title: 'Category', icon: <BiSolidCategory /> },
    { title: 'Subcategory', icon: <FaList /> },
    { title: 'Product', icon: <BsFillBoxSeamFill /> },
    { title: 'Size', icon: <CgArrowsShrinkH /> },
    { title: 'Stock', icon: <BsBoxFill /> },
    { title: 'Cart', icon: <IoBagCheck /> },
    { title: 'Orders', icon: <LuBoxes /> },
    { title: 'Review', icon: <TbMessageStar /> },
    { title: 'Coupons', icon: <RiCoupon3Fill /> },
    { title: 'Offers', icon: <BiSolidOffer /> },
    { title: 'Return Orders', icon: <FaArrowsRotate /> },
    { title: 'Invoice', icon: <FaReceipt /> }
  ]

  const drawer = (
    <div>
      <Toolbar></Toolbar>
      <Divider />
      <List>
        {
          pages.map((v, index) => (
            <ListItem key={v.title} disablePadding sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <ListItemButton
                sx={{
                  gap: '16px',
                  backgroundColor: location.pathname == v.path ? '#FFF9F6' : 'transparent',
                  color: location.pathname == v.path ? '#523C34' : 'white',
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: '#FFF9F6',
                    color: '#523C34',
                    '& .MuiListItemIcon-root': {
                      color: '#523C34',
                    }
                  }
                }}
                onClick={() => navigate(v.path)}
              >
                <ListItemIcon sx={{ color: location.pathname == v.path ? '#523C34' : 'white', fontSize: '20px' }}>
                  {v.icon}
                </ListItemIcon>
                <ListItemText primary={v.title} sx={{ fontSize: '18px', fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#FCEAE2' }} className='p-2 rounded-full'>              

              <Badge badgeContent={4} color="secondary" >
                <NotificationsIcon color="#523C34" />
              </Badge>
              </div>
              <IconButton color="inherit" sx={{ ml: 2 }}>
                <AccountCircleIcon />
              </IconButton>
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
              paddingLeft: '60px'
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
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
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
