import React from 'react';
import { Box, Typography } from '@mui/material';

const PlaylistList: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Playlists
      </Typography>
      <Typography variant="body1" color="text.secondary">
        YouTube playlist management interface will be implemented here.
      </Typography>
    </Box>
  );
};

export default PlaylistList;