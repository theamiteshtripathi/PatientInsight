import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  Container,
  Grid,
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Timeline as TimelineIcon,
  ViewList as ListIcon
} from '@mui/icons-material';
import ConsultationList from '../components/consultation/ConsultationList';
import ConsultationTimeline from '../components/consultation/ConsultationTimeline';
import ConsultationFilters from '../components/consultation/ConsultationFilters';
import FollowUpReminders from '../components/consultation/FollowUpReminders';

function ConsultationHistoryPage() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    severity: 'all',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5">Consultation History</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search consultations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon />
                </IconButton>
                <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'timeline' : 'list')}>
                  {viewMode === 'list' ? <TimelineIcon /> : <ListIcon />}
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          {/* Filters Section */}
          {showFilters && (
            <ConsultationFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          )}
        </Paper>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {viewMode === 'list' ? (
              <ConsultationList
                searchQuery={searchQuery}
                filters={filters}
              />
            ) : (
              <ConsultationTimeline
                searchQuery={searchQuery}
                filters={filters}
              />
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <FollowUpReminders />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export default ConsultationHistoryPage; 