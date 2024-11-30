import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Group as ParticipantsIcon,
  Add as AddIcon
} from '@mui/icons-material';

function ChallengeCard({ challenge, onJoin }) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="div">
              {challenge.title}
            </Typography>
            <TrophyIcon color={challenge.difficulty === 'easy' ? 'success' : 'warning'} />
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {challenge.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              icon={<TimerIcon />}
              label={`${challenge.duration} days`}
              size="small"
            />
            <Chip
              icon={<ParticipantsIcon />}
              label={`${challenge.participants} joined`}
              size="small"
            />
          </Box>

          <Typography variant="body2" gutterBottom>
            Progress
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={challenge.progress} 
            sx={{ mb: 1 }}
          />
        </CardContent>
        <CardActions sx={{ mt: 'auto', p: 2 }}>
          <Button
            variant={challenge.joined ? "outlined" : "contained"}
            fullWidth
            onClick={() => setOpenDialog(true)}
            startIcon={challenge.joined ? <TrophyIcon /> : <AddIcon />}
          >
            {challenge.joined ? 'View Progress' : 'Join Challenge'}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {challenge.joined ? 'Challenge Progress' : 'Join Challenge'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {challenge.joined 
              ? `You're ${challenge.progress}% through this challenge!`
              : `Ready to start the ${challenge.title}?`}
          </Typography>
          {/* Add more challenge details here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              onJoin(challenge.id);
              setOpenDialog(false);
            }}
          >
            {challenge.joined ? 'Update Progress' : 'Start Challenge'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function HealthChallenges() {
  const [challenges] = useState([
    {
      id: 1,
      title: '7-Day Hydration Challenge',
      description: 'Drink 2 liters of water daily for a week',
      duration: 7,
      participants: 156,
      progress: 40,
      difficulty: 'easy',
      joined: false
    },
    {
      id: 2,
      title: '30-Day Step Challenge',
      description: 'Walk 10,000 steps every day',
      duration: 30,
      participants: 342,
      progress: 65,
      difficulty: 'moderate',
      joined: true
    },
    // Add more challenges...
  ]);

  const handleJoinChallenge = (challengeId) => {
    console.log(`Joined challenge ${challengeId}`);
    // Add logic to join/update challenge
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Health Challenges
      </Typography>
      <Grid container spacing={3}>
        {challenges.map((challenge) => (
          <Grid item xs={12} md={6} key={challenge.id}>
            <ChallengeCard 
              challenge={challenge}
              onJoin={handleJoinChallenge}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HealthChallenges; 