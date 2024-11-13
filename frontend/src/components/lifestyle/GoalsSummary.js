import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Button,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

function CircularProgressWithLabel({ value, label }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function GoalsSummary() {
  const [goals] = React.useState({
    daily: {
      completed: 3,
      total: 5,
      progress: 60
    },
    weekly: {
      completed: 2,
      total: 4,
      progress: 50
    },
    monthly: {
      completed: 5,
      total: 8,
      progress: 62.5
    }
  });

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Goals Progress
        </Typography>
        <Button
          size="small"
          color="primary"
          startIcon={<TrendingUpIcon />}
        >
          Details
        </Button>
      </Box>

      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            Daily
          </Typography>
          <CircularProgressWithLabel value={goals.daily.progress} />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {goals.daily.completed}/{goals.daily.total} Completed
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            Weekly
          </Typography>
          <CircularProgressWithLabel value={goals.weekly.progress} />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {goals.weekly.completed}/{goals.weekly.total} Completed
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            Monthly
          </Typography>
          <CircularProgressWithLabel value={goals.monthly.progress} />
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {goals.monthly.completed}/{goals.monthly.total} Completed
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default GoalsSummary; 