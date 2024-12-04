import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NotificationsDrawer = ({ onClose }) => {
  return (
    <Box
      sx={{
        width: 300,
        padding: 2,
        backgroundColor: '#FFF',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Notifications</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {/* Add your notification items here */}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        No new notifications.
      </Typography>
    </Box>
  );
};

export default NotificationsDrawer;