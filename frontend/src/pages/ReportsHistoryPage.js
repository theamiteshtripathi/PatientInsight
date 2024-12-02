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
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import ReportsDashboard from '../components/reports/ReportsDashboard';
import TimelineView from '../components/reports/TimelineView';
import NotificationPanel from '../components/reports/NotificationPanel';

function ReportsHistoryPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    dateRange: 'all',
    type: 'all'
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    handleFilterClose();
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <ReportsDashboard 
            searchQuery={searchQuery}
            filters={selectedFilters}
          />
        );
      case 1:
        return <TimelineView />;
      case 2:
        return <NotificationPanel />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Top Section - Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Reports & Medical History
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search reports..."
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
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={handleFilterClick}
                >
                  Filter
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="All Reports" />
              <Tab label="Timeline View" />
              <Tab label="Notifications" />
            </Tabs>
          </Box>
        </Paper>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
        >
          <MenuItem>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('status', 'all')}>
            All
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('status', 'pending')}>
            Pending Review
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('status', 'completed')}>
            Completed
          </MenuItem>
          <MenuItem>
            <Typography variant="subtitle2" color="textSecondary">
              Date Range
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('dateRange', 'week')}>
            Last Week
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('dateRange', 'month')}>
            Last Month
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('dateRange', 'year')}>
            Last Year
          </MenuItem>
        </Menu>

        {/* Main Content */}
        <Box sx={{ mt: 3 }}>
          {renderContent()}
        </Box>
      </Container>
    </MainLayout>
  );
}

export default ReportsHistoryPage; 