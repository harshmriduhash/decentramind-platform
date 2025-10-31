import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Grid,
  InputAdornment,
  FormHelperText,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import daoService from '../services/daoService';
import { tokenomicsService } from '../services/tokenomicsService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

interface ProposalFormProps {
  onProposalCreated?: (proposalId: string) => void;
  onCancel?: () => void;
}

const PROPOSAL_TYPES = [
  {
    value: 'platformDevelopment',
    label: 'Platform Development',
    description: 'Technical improvements, new features, bug fixes',
    maxFunding: 100000,
    votingPeriod: 7,
    quorum: '5% of circulating DMT'
  },
  {
    value: 'economicPolicy',
    label: 'Economic Policy',
    description: 'Tokenomics changes, fee adjustments, reward modifications',
    maxFunding: 0,
    votingPeriod: 14,
    quorum: '10% of circulating DMT'
  },
  {
    value: 'treasuryManagement',
    label: 'Treasury Management',
    description: 'Budget allocation, investment decisions, spending approvals',
    maxFunding: 500000,
    votingPeriod: 10,
    quorum: '7% of circulating DMT'
  },
  {
    value: 'governance',
    label: 'Governance',
    description: 'Constitution amendments, governance structure changes',
    maxFunding: 0,
    votingPeriod: 21,
    quorum: '15% of circulating DMT'
  },
  {
    value: 'emergency',
    label: 'Emergency',
    description: 'Critical security issues, urgent platform fixes',
    maxFunding: 50000,
    votingPeriod: 3,
    quorum: '3% of circulating DMT'
  }
];

const SUGGESTED_TAGS = [
  'Technical', 'UI/UX', 'Security', 'Performance', 'Integration',
  'Tokenomics', 'Governance', 'Community', 'Marketing', 'Partnership',
  'Research', 'Development', 'Infrastructure', 'Compliance', 'Emergency'
];

export const ProposalForm: React.FC<ProposalFormProps> = ({ 
  onProposalCreated, 
  onCancel 
}) => {
  const { session } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userVotingPower, setUserVotingPower] = useState<number>(0);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'platformDevelopment',
    funding: 0,
    tags: [] as string[],
    detailedDescription: ''
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (session.isAuthenticated && session.walletAddress) {
      loadUserData();
    }
  }, [session.isAuthenticated, session.walletAddress]);

  const loadUserData = async () => {
    if (!session.walletAddress) return;

    try {
      const [balance, votingPower] = await Promise.all([
        tokenomicsService.getDmtBalance(session.walletAddress),
        Promise.resolve(1000) // Placeholder voting power
      ]);

      setUserBalance(balance);
      setUserVotingPower(votingPower);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      errors.description = 'Description must be at least 50 characters';
    } else if (formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    // Detailed description validation
    if (!formData.detailedDescription.trim()) {
      errors.detailedDescription = 'Detailed description is required';
    } else if (formData.detailedDescription.length < 200) {
      errors.detailedDescription = 'Detailed description must be at least 200 characters';
    }

    // Funding validation
    const selectedType = PROPOSAL_TYPES.find(t => t.value === formData.type);
    if (selectedType && selectedType.maxFunding > 0) {
      if (formData.funding <= 0) {
        errors.funding = 'Funding amount must be greater than 0';
      } else if (formData.funding > selectedType.maxFunding) {
        errors.funding = `Funding cannot exceed ${selectedType.maxFunding.toLocaleString()} DMT`;
      }
    }

    // User balance validation
    if (formData.funding > userBalance) {
      errors.funding = 'Insufficient DMT balance for funding';
    }

    // User requirements validation
    if (userBalance < 1000) { // Minimum 1000 DMT for proposal creation
      errors.general = `Insufficient DMT balance. Required: 1,000, Current: ${userBalance.toLocaleString()}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!session.walletAddress || !validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const proposalId = await daoService.submitProposal(
        {
          title: formData.title,
          description: formData.description,
          status: 'active',
          createdBy: session.walletAddress,
          category: 'governance',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) as any
        },
        session.walletAddress
      );

      if (proposalId) {
        showSuccess('Proposal created successfully!');
        onProposalCreated?.(proposalId);
      } else {
        throw new Error('Failed to create proposal');
      }
    } catch (error) {
      console.error('Failed to create proposal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create proposal';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getSelectedTypeInfo = () => {
    return PROPOSAL_TYPES.find(t => t.value === formData.type);
  };

  const steps = [
    {
      label: 'Basic Information',
      description: 'Provide the basic details of your proposal'
    },
    {
      label: 'Detailed Description',
      description: 'Explain your proposal in detail'
    },
    {
      label: 'Funding & Tags',
      description: 'Set funding requirements and categorize your proposal'
    },
    {
      label: 'Review & Submit',
      description: 'Review your proposal before submission'
    }
  ];

  if (!session.isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          🔐 Wallet Connection Required
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please connect your wallet to create proposals.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        📝 Create New Proposal
      </Typography>

      {/* User Status */}
      <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                💰 DMT Balance
              </Typography>
              <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                {userBalance.toLocaleString()} DMT
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                🗳️ Voting Power
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                {userVotingPower.toLocaleString()} DMT
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                📋 Requirements
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {userBalance >= 1000 ? (
                  <CheckIcon color="success" />
                ) : (
                  <ErrorIcon color="error" />
                )}
                <Typography variant="body2" color={userBalance >= 1000 ? 'success.main' : 'error.main'}>
                  {userBalance >= 1000 ? 'Eligible' : 'Insufficient DMT'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* General Validation Error */}
      {validationErrors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {validationErrors.general}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>

              {/* Step 1: Basic Information */}
              {index === 0 && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Proposal Title"
                    value={formData.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    error={!!validationErrors.title}
                    helperText={validationErrors.title || 'Enter a clear, concise title for your proposal'}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Short Description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    error={!!validationErrors.description}
                    helperText={validationErrors.description || 'Brief description of your proposal (max 500 characters)'}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Proposal Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      label="Proposal Type"
                    >
                      {PROPOSAL_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {type.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Type Information */}
                  {getSelectedTypeInfo() && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>{getSelectedTypeInfo()?.label}</strong><br />
                        Voting Period: {getSelectedTypeInfo()?.votingPeriod} days<br />
                        Quorum: {getSelectedTypeInfo()?.quorum}<br />
                        {(() => {
                          const typeInfo = getSelectedTypeInfo();
                          return typeInfo?.maxFunding && typeInfo.maxFunding > 0 ? (
                            <>Max Funding: {typeInfo.maxFunding.toLocaleString()} DMT</>
                          ) : null;
                        })()}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* Step 2: Detailed Description */}
              {index === 1 && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Detailed Description"
                    value={formData.detailedDescription}
                    onChange={(e) => handleFormChange('detailedDescription', e.target.value)}
                    error={!!validationErrors.detailedDescription}
                    helperText={validationErrors.detailedDescription || 'Provide a detailed explanation of your proposal, including rationale, implementation plan, and expected outcomes'}
                    multiline
                    rows={8}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              {/* Step 3: Funding & Tags */}
              {index === 2 && (
                <Box sx={{ mb: 2 }}>
                  {(() => {
                    const typeInfo = getSelectedTypeInfo();
                    return typeInfo?.maxFunding && typeInfo.maxFunding > 0 ? (
                      <TextField
                        fullWidth
                        label="Funding Amount (DMT)"
                        type="number"
                        value={formData.funding}
                        onChange={(e) => handleFormChange('funding', parseFloat(e.target.value) || 0)}
                        error={!!validationErrors.funding}
                        helperText={validationErrors.funding || `Maximum funding: ${typeInfo.maxFunding.toLocaleString()} DMT`}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">DMT</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                      />
                    ) : null;
                  })()}

                  <Autocomplete
                    multiple
                    options={SUGGESTED_TAGS}
                    value={formData.tags}
                    onChange={(event, newValue) => handleFormChange('tags', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select or type tags"
                        helperText="Add relevant tags to categorize your proposal"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          sx={{ background: '#00ffff', color: 'black' }}
                        />
                      ))
                    }
                    freeSolo
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              {/* Step 4: Review */}
              {index === 3 && (
                <Box sx={{ mb: 2 }}>
                  <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                        📋 Proposal Summary
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Title: {formData.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Description: {formData.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            Type: {getSelectedTypeInfo()?.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            Funding: {formData.funding > 0 ? `${formData.funding.toLocaleString()} DMT` : 'No funding'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            Tags: {formData.tags.join(', ') || 'No tags'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={loading}
                  sx={{ 
                    mr: 1,
                    background: 'linear-gradient(45deg, #00ffff, #0080ff)',
                    color: 'black',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: 'black' }} />
                  ) : index === steps.length - 1 ? (
                    <>
                      <SendIcon sx={{ mr: 1 }} />
                      Submit Proposal
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                {onCancel && (
                  <Button onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}; 