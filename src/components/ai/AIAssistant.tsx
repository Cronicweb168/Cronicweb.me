import React from 'react';
import { Box, Typography } from '@mui/material';

const AIAssistant: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Assistant
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Gemini AI integration for study plans and quizzes will be implemented here.
      </Typography>
    </Box>
  );
};

export default AIAssistant;