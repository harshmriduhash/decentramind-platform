'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AutoAwesome as SparkleIcon } from '@mui/icons-material';

export default function TestPage() {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <SparkleIcon sx={{ fontSize: 60, color: '#00ffff', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        🎉 Test Page Working!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The basic Material-UI setup is working correctly.
      </Typography>
      <Button variant="contained" color="primary">
        Test Button
      </Button>
    </Box>
  );
} 