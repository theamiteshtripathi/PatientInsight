import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Button
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';

function DailyTipsCarousel() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [savedTips, setSavedTips] = useState([]);

  const tips = [
    {
      id: 1,
      category: 'Exercise',
      title: 'Morning Stretch Routine',
      content: 'Start your day with a 5-minute stretch to boost energy and flexibility.',
      difficulty: 'easy'
    },
    {
      id: 2,
      category: 'Nutrition',
      title: 'Healthy Snacking',
      content: 'Replace processed snacks with a handful of mixed nuts for better nutrition.',
      difficulty: 'easy'
    },
    // Add more tips...
  ];

  const handleNext = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrev = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const toggleSaved = (tipId) => {
    setSavedTips((prev) =>
      prev.includes(tipId)
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const currentTip = tips[currentTipIndex];

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 3,
        position: 'relative',
        background: 'linear-gradient(45deg, #f3f4f6 30%, #ffffff 90%)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Chip 
          label={currentTip.category}
          color="primary"
          size="small"
        />
        <Chip 
          label={currentTip.difficulty}
          color="secondary"
          size="small"
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        {currentTip.title}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {currentTip.content}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <IconButton onClick={() => handlePrev()}>
            <PrevIcon />
          </IconButton>
          <IconButton onClick={() => handleNext()}>
            <NextIcon />
          </IconButton>
        </Box>

        <Box>
          <IconButton 
            onClick={() => toggleSaved(currentTip.id)}
            color={savedTips.includes(currentTip.id) ? 'primary' : 'default'}
          >
            {savedTips.includes(currentTip.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
          <IconButton color="primary">
            <ThumbUpIcon />
          </IconButton>
          <IconButton color="error">
            <ThumbDownIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}

export default DailyTipsCarousel; 