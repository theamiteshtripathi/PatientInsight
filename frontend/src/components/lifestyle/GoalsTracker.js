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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

function GoalCard({ goal, onUpdate, onDelete }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [progress, setProgress] = useState(goal.progress);

  const handleProgressUpdate = () => {
    onUpdate(goal.id, { ...goal, progress: Math.min(progress + 10, 100) });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {goal.title}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => setOpenEdit(true)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(goal.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<FlagIcon />}
            label={goal.category}
            size="small"
            color="primary"
          />
          <Chip
            icon={<TimerIcon />}
            label={`${goal.duration} days`}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {goal.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">{goal.progress}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={goal.progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleProgressUpdate}
          startIcon={<CheckCircleIcon />}
          disabled={goal.progress >= 100}
        >
          Update Progress
        </Button>
      </CardActions>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          {/* Add edit form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function GoalsTracker() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Daily Meditation',
      description: 'Meditate for 10 minutes every day',
      category: 'Mental Wellness',
      duration: 30,
      progress: 60
    },
    {
      id: 2,
      title: 'Healthy Eating',
      description: 'Eat 5 servings of vegetables daily',
      category: 'Nutrition',
      duration: 14,
      progress: 40
    }
  ]);

  const [openNewGoal, setOpenNewGoal] = useState(false);

  const handleUpdateGoal = (goalId, updatedGoal) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? updatedGoal : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Your Health Goals</Typography>
        <Fab
          color="primary"
          size="small"
          onClick={() => setOpenNewGoal(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} md={6} key={goal.id}>
            <GoalCard
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openNewGoal} onClose={() => setOpenNewGoal(false)}>
        <DialogTitle>Add New Goal</DialogTitle>
        <DialogContent>
          {/* Add new goal form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewGoal(false)}>Cancel</Button>
          <Button variant="contained">Add Goal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GoalsTracker; 