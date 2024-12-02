import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Stack,
  IconButton
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

function ChallengeProgress({ challenge }) {
  return (
    <Box sx={{ mb: 3, last: { mb: 0 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2">
          {challenge.title}
        </Typography>
        <IconButton size="small">
          <MoreIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Chip
          icon={<TimerIcon />}
          label={`${challenge.daysLeft} days left`}
          size="small"
          variant="outlined"
        />
        <Chip
          icon={<TrophyIcon />}
          label={`${challenge.progress}%`}
          size="small"
          color="primary"
        />
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={challenge.progress} 
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  );
}

function ActiveChallenges() {
  const [activeChallenges] = React.useState([
    {
      id: 1,
      title: '7-Day Hydration Challenge',
      progress: 57,
      daysLeft: 3
    },
    {
      id: 2,
      title: '30-Day Step Challenge',
      progress: 40,
      daysLeft: 18
    }
  ]);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Active Challenges
        </Typography>
        <Button size="small" color="primary">
          View All
        </Button>
      </Box>

      <Stack spacing={2}>
        {activeChallenges.map(challenge => (
          <ChallengeProgress key={challenge.id} challenge={challenge} />
        ))}
      </Stack>
    </Paper>
  );
}

export default ActiveChallenges; 