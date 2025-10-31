import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Flag as FlagIcon,
  Comment as CommentIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { AgentRating as AgentRatingType } from '../services/agentRegistryService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

interface AgentRatingProps {
  agentId: string;
  ratings: AgentRatingType[];
  onRatingSubmit?: (rating: number, review: string) => Promise<void>;
  onHelpfulVote?: (ratingId: string, helpful: boolean) => Promise<void>;
  onReportRating?: (ratingId: string, reason: string) => Promise<void>;
}

export const AgentRating: React.FC<AgentRatingProps> = ({
  agentId,
  ratings,
  onRatingSubmit,
  onHelpfulVote,
  onReportRating,
}) => {
  const { session } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState<AgentRatingType | null>(null);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    review: '',
  });
  const [reportForm, setReportForm] = useState({
    reason: '',
  });

  const handleSubmitRating = async () => {
    if (!session.isAuthenticated) {
      showError('Please connect your wallet to submit a rating');
      return;
    }

    if (ratingForm.review.length < 10) {
      showError('Review must be at least 10 characters long');
      return;
    }

    try {
      if (onRatingSubmit) {
        await onRatingSubmit(ratingForm.rating, ratingForm.review);
        showSuccess('Rating submitted successfully!');
        setShowRatingDialog(false);
        setRatingForm({ rating: 5, review: '' });
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
      showError('Failed to submit rating');
    }
  };

  const handleHelpfulVote = async (ratingId: string, helpful: boolean) => {
    if (!session.isAuthenticated) {
      showError('Please connect your wallet to vote');
      return;
    }

    try {
      if (onHelpfulVote) {
        await onHelpfulVote(ratingId, helpful);
        showSuccess(helpful ? 'Voted as helpful!' : 'Voted as not helpful');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      showError('Failed to submit vote');
    }
  };

  const handleReportRating = async () => {
    if (!session.isAuthenticated) {
      showError('Please connect your wallet to report');
      return;
    }

    if (!reportForm.reason.trim()) {
      showError('Please provide a reason for reporting');
      return;
    }

    try {
      if (onReportRating && selectedRating) {
        await onReportRating(selectedRating.id, reportForm.reason);
        showSuccess('Rating reported successfully');
        setShowReportDialog(false);
        setReportForm({ reason: '' });
        setSelectedRating(null);
      }
    } catch (error) {
      console.error('Failed to report rating:', error);
      showError('Failed to report rating');
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#4CAF50';
    if (rating >= 3) return '#FF9800';
    return '#F44336';
  };

  const getRatingText = (rating: number) => {
    if (rating === 5) return 'Excellent';
    if (rating === 4) return 'Very Good';
    if (rating === 3) return 'Good';
    if (rating === 2) return 'Fair';
    return 'Poor';
  };

  const sortedRatings = [...ratings].sort((a, b) => {
    // Sort by helpful votes first, then by rating, then by date
    if (a.helpful !== b.helpful) return b.helpful - a.helpful;
    if (a.rating !== b.rating) return b.rating - a.rating;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  const ratingDistribution = {
    5: ratings.filter(r => r.rating === 5).length,
    4: ratings.filter(r => r.rating === 4).length,
    3: ratings.filter(r => r.rating === 3).length,
    2: ratings.filter(r => r.rating === 2).length,
    1: ratings.filter(r => r.rating === 1).length,
  };

  return (
    <Box>
      {/* Rating Summary */}
      <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                Reviews ({ratings.length})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating value={averageRating} readOnly precision={0.1} />
                <Typography variant="body2" color="text.secondary">
                  {averageRating.toFixed(1)} out of 5
                </Typography>
              </Box>
            </Box>
            
            {session.isAuthenticated && (
              <Button
                variant="outlined"
                startIcon={<CommentIcon />}
                onClick={() => setShowRatingDialog(true)}
                sx={{ borderColor: '#00ffff', color: '#00ffff' }}
              >
                Write Review
              </Button>
            )}
          </Box>

          {/* Rating Distribution */}
          <Box sx={{ mt: 2 }}>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution];
              const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
              
              return (
                <Box key={stars} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {stars}★
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {count}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, mx: 2 }}>
                    <Box
                      sx={{
                        height: 8,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: getRatingColor(stars),
                          borderRadius: 4,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                    {percentage.toFixed(0)}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {sortedRatings.length > 0 ? (
        <List>
          {sortedRatings.map((rating) => (
            <Card key={rating.id} sx={{ mb: 2, background: 'rgba(25, 25, 25, 0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar sx={{ bgcolor: getRatingColor(rating.rating) }}>
                    {rating.userWallet.slice(0, 2).toUpperCase()}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={rating.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {getRatingText(rating.rating)}
                      </Typography>
                      <Chip
                        label={formatWalletAddress(rating.userWallet)}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      {rating.helpful > 0 && (
                        <Chip
                          label={`${rating.helpful} helpful`}
                          size="small"
                          sx={{ background: '#4CAF50', color: 'white', fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {rating.review}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      {new Date(rating.timestamp).toLocaleDateString()} at {new Date(rating.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Tooltip title="Helpful">
                      <IconButton
                        size="small"
                        onClick={() => handleHelpfulVote(rating.id, true)}
                        sx={{ color: '#4CAF50' }}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Not Helpful">
                      <IconButton
                        size="small"
                        onClick={() => handleHelpfulVote(rating.id, false)}
                        sx={{ color: '#F44336' }}
                      >
                        <ThumbDownIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Report">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedRating(rating);
                          setShowReportDialog(true);
                        }}
                        sx={{ color: '#FF9800' }}
                      >
                        <FlagIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CommentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Reviews Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Be the first to review this agent!
            </Typography>
            {session.isAuthenticated && (
              <Button
                variant="outlined"
                startIcon={<CommentIcon />}
                onClick={() => setShowRatingDialog(true)}
                sx={{ borderColor: '#00ffff', color: '#00ffff' }}
              >
                Write First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onClose={() => setShowRatingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <Typography component="legend" gutterBottom>
              Your Rating
            </Typography>
            <Rating
              value={ratingForm.rating}
              onChange={(_, value) => setRatingForm(prev => ({ ...prev, rating: value || 5 }))}
              size="large"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {getRatingText(ratingForm.rating)}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={ratingForm.review}
            onChange={(e) => setRatingForm(prev => ({ ...prev, review: e.target.value }))}
            placeholder="Share your experience with this agent. What did you like? What could be improved?"
            helperText={`${ratingForm.review.length}/500 characters`}
            inputProps={{ maxLength: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRatingDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRating} 
            variant="contained"
            disabled={ratingForm.review.length < 10}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Review</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please only report reviews that violate our community guidelines.
          </Alert>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for Report"
            value={reportForm.reason}
            onChange={(e) => setReportForm(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Please explain why you're reporting this review..."
            helperText="Your report will be reviewed by our team"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleReportRating} 
            variant="contained"
            color="error"
            disabled={!reportForm.reason.trim()}
          >
            Report Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 