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
import { useNavigate } from 'react-router-dom'; 

const drawerWidth = 325;

function Layout({children}) {
  const { window } = children;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const navigate = useNavigate(); 
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
    { title: 'Dashboard', icon: <AiFillHome />, path: '/' },
    { title: 'User', icon: <FaUser />,path: '/user' },
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
    { title: 'Invoice', icon: <FaReceipt />}
  ]

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {
          pages.map((v, index) => (
            <ListItem key={v.title} disablePadding sx={{ paddingLeft: '20px' }}>
              <ListItemButton 
                sx={{ gap: '16px' }} 
                onClick={() => navigate(v.path)} // Add onClick handler for navigation
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {v.icon}
                </ListItemIcon>
                <ListItemText primary={v.title} sx={{ color: 'white', fontSize: '16px', fontWeight: 500 }} />
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
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
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
