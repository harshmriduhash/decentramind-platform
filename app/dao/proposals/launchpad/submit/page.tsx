"use client";

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import LaunchpadProposalForm from '../../../../components/forms/LaunchpadProposalForm';
import { LaunchpadProposal } from '../../../../types/launchpad';

export default function LaunchpadProposalSubmitPage() {
  const handleSubmit = (proposal: LaunchpadProposal) => {
    console.log('Proposal submitted:', proposal);
    // Handle successful submission - could redirect to proposal list
  };

  const handlePreview = (proposal: LaunchpadProposal) => {
    console.log('Preview proposal:', proposal);
    // Could show a modal with the proposal preview
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
            🚀 Submit Launchpad Proposal
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 500 }}>
            Create a proposal for a new token project on the DecentraMind launchpad
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
            All proposals will be reviewed by the DAO community and must align with DecentraMind's vision
          </Typography>
        </Box>

        <LaunchpadProposalForm
          onSubmit={handleSubmit}
          onPreview={handlePreview}
        />
      </Box>
    </Container>
  );
}
