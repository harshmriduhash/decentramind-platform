import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Collapse,
  Alert,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingIcon,
  Verified as VerifiedIcon,
  FeaturedPlayList as FeaturedIcon,
} from '@mui/icons-material';
import { agentRegistryService, AgentMetadata, AgentSearchFilters } from '../services/agentRegistryService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

interface AgentListProps {
  title?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  maxAgents?: number;
  featured?: boolean;
  popular?: boolean;
}

export const AgentList: React.FC<AgentListProps> = ({
  title = 'Agent Registry',
  showFilters = true,
  showSearch = true,
  maxAgents = 50,
  featured = false,
  popular = false,
}) => {
  const { session } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AgentSearchFilters>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load agents based on props
  useEffect(() => {
    loadAgents();
  }, [featured, popular, page, filters]);

  const loadAgents = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;

      if (featured) {
        result = await agentRegistryService.getFeaturedAgents();
        setAgents(result);
        setTotalPages(1);
      } else if (popular) {
        result = await agentRegistryService.getPopularAgents();
        setAgents(result);
        setTotalPages(1);
      } else {
        const searchFilters: AgentSearchFilters = {
          ...filters,
          limit: maxAgents,
        };

        if (searchQuery) {
          // For now, we'll filter by name/description in the UI
          // In a real implementation, this would be done in the backend
        }

        result = await agentRegistryService.searchAgents(searchFilters);
        setAgents(result.agents);
        setTotalPages(Math.ceil(result.total / maxAgents));
      }

    } catch (error) {
      console.error('Failed to load agents:', error);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadAgents();
  };

  const handleFilterChange = (key: keyof AgentSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleViewAgent = async (agentId: string) => {
    try {
      await agentRegistryService.incrementViews(agentId);
      showInfo('Agent viewed');
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const handleDownloadAgent = async (agentId: string) => {
    try {
      await agentRegistryService.incrementDownloads(agentId);
      showSuccess('Agent downloaded successfully!');
    } catch (error) {
      console.error('Failed to download agent:', error);
      showError('Failed to download agent');
    }
  };

  const getDomainColor = (domain: string) => {
    const colors: { [key: string]: string } = {
      'Technical': '#2196F3',
      'Learning': '#4CAF50',
      'Health & Wellness': '#FF9800',
      'Creative': '#9C27B0',
      'Business': '#607D8B',
      'Science': '#795548',
    };
    return colors[domain] || '#757575';
  };

  const getDomainIcon = (domain: string) => {
    const icons: { [key: string]: string } = {
      'Technical': '⚙️',
      'Learning': '📚',
      'Health & Wellness': '💪',
      'Creative': '🎨',
      'Business': '💼',
      'Science': '🔬',
    };
    return icons[domain] || '🤖';
  };

  const filteredAgents = agents.filter(agent => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.description.toLowerCase().includes(query) ||
      agent.domain.toLowerCase().includes(query) ||
      agent.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {showSearch && (
            <TextField
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              size="small"
              sx={{ minWidth: 300 }}
            />
          )}
          
          {showFilters && (
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              sx={{ borderColor: '#00ffff', color: '#00ffff' }}
            >
              Filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter Panel */}
      {showFilters && (
        <Collapse in={showFilterPanel}>
          <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Domain</InputLabel>
                    <Select
                      value={filters.domain || ''}
                      onChange={(e) => handleFilterChange('domain', e.target.value || undefined)}
                      label="Domain"
                    >
                      <MenuItem value="">All Domains</MenuItem>
                      <MenuItem value="Technical">Technical</MenuItem>
                      <MenuItem value="Learning">Learning</MenuItem>
                      <MenuItem value="Health & Wellness">Health & Wellness</MenuItem>
                      <MenuItem value="Creative">Creative</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                      <MenuItem value="Science">Science</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Min Level</InputLabel>
                    <Select
                      value={filters.minLevel || ''}
                      onChange={(e) => handleFilterChange('minLevel', e.target.value || undefined)}
                      label="Min Level"
                    >
                      <MenuItem value="">Any Level</MenuItem>
                      <MenuItem value={1}>Level 1+</MenuItem>
                      <MenuItem value={5}>Level 5+</MenuItem>
                      <MenuItem value={10}>Level 10+</MenuItem>
                      <MenuItem value={20}>Level 20+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Min Rating</InputLabel>
                    <Select
                      value={filters.minRating || ''}
                      onChange={(e) => handleFilterChange('minRating', e.target.value || undefined)}
                      label="Min Rating"
                    >
                      <MenuItem value="">Any Rating</MenuItem>
                      <MenuItem value={1}>1+ Stars</MenuItem>
                      <MenuItem value={2}>2+ Stars</MenuItem>
                      <MenuItem value={3}>3+ Stars</MenuItem>
                      <MenuItem value={4}>4+ Stars</MenuItem>
                      <MenuItem value={5}>5 Stars</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filters.sortBy || 'created'}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      label="Sort By"
                    >
                      <MenuItem value="created">Recently Created</MenuItem>
                      <MenuItem value="updated">Recently Updated</MenuItem>
                      <MenuItem value="rating">Highest Rated</MenuItem>
                      <MenuItem value="level">Highest Level</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ minWidth: 80 }}>
                      Verified Only:
                    </Typography>
                    <Button
                      variant={filters.verified ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => handleFilterChange('verified', !filters.verified)}
                      sx={{ 
                        background: filters.verified ? '#4CAF50' : 'transparent',
                        color: filters.verified ? 'white' : '#4CAF50',
                        borderColor: '#4CAF50'
                      }}
                    >
                      <VerifiedIcon sx={{ mr: 1 }} />
                      Verified
                    </Button>

                    <Button
                      variant={filters.featured ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => handleFilterChange('featured', !filters.featured)}
                      sx={{ 
                        background: filters.featured ? '#FF9800' : 'transparent',
                        color: filters.featured ? 'white' : '#FF9800',
                        borderColor: '#FF9800'
                      }}
                    >
                      <FeaturedIcon sx={{ mr: 1 }} />
                      Featured
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Collapse>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Agent Grid */}
      {!loading && (
        <>
          <Grid container spacing={3}>
            {filteredAgents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent.id}>
                <Card 
                  sx={{ 
                    background: 'rgba(25, 25, 25, 0.9)', 
                    border: '2px solid #00ffff',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 255, 255, 0.3)',
                    }
                  }}
                >
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 1 }}>
                          {agent.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={agent.domain}
                            size="small"
                            sx={{ 
                              background: getDomainColor(agent.domain),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                            icon={<span>{getDomainIcon(agent.domain)}</span>}
                          />
                          {agent.verified && (
                            <Tooltip title="Verified Agent">
                              <VerifiedIcon color="success" fontSize="small" />
                            </Tooltip>
                          )}
                          {agent.featured && (
                            <Tooltip title="Featured Agent">
                              <FeaturedIcon color="warning" fontSize="small" />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                          Level {agent.level}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {agent.xp} XP
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {agent.description}
                    </Typography>

                    {/* Skills */}
                    <Box sx={{ mb: 2 }}>
                      {agent.skills.slice(0, 3).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                        />
                      ))}
                      {agent.skills.length > 3 && (
                        <Chip
                          label={`+${agent.skills.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={agent.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        ({agent.reviewCount} reviews)
                      </Typography>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {agent.views} views
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DownloadIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {agent.downloads} downloads
                        </Typography>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewAgent(agent.agentId)}
                        sx={{ borderColor: '#00ffff', color: '#00ffff', flex: 1 }}
                      >
                        View Details
                      </Button>
                      <Tooltip title="Download Agent">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadAgent(agent.agentId)}
                          sx={{ borderColor: '#2ed573', color: '#2ed573' }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#00ffff',
                    borderColor: '#00ffff',
                  },
                  '& .Mui-selected': {
                    background: '#00ffff',
                    color: 'black',
                  },
                }}
              />
            </Box>
          )}

          {/* No Results */}
          {filteredAgents.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No agents found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}; 