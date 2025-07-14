import React from 'react';
import { Box, Typography } from '@mui/material';

const ReminderList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reminders
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Reminder management interface will be implemented here.
      </Typography>
    </Box>
  );
};

export default ReminderList;