import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

function ResourceCard({ resource }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {resource.type === 'video' && (
        <CardMedia
          component="img"
          height="140"
          image={resource.thumbnail}
          alt={resource.title}
          sx={{ position: 'relative' }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <PlayIcon />
          </IconButton>
        </CardMedia>
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {resource.categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <Typography variant="h6" gutterBottom>
          {resource.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {resource.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Button
          size="small"
          startIcon={<ShareIcon />}
        >
          Share
        </Button>
        <IconButton
          onClick={() => setIsSaved(!isSaved)}
          color={isSaved ? 'primary' : 'default'}
        >
          {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}

function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [resources] = useState([
    {
      id: 1,
      type: 'article',
      title: 'Understanding Sleep Cycles',
      description: 'Learn about the importance of sleep cycles and how to improve your sleep quality.',
      categories: ['Sleep', 'Wellness'],
      thumbnail: '/path-to-thumbnail.jpg'
    },
    {
      id: 2,
      type: 'video',
      title: '15-Minute Morning Yoga',
      description: 'Start your day with this energizing yoga routine.',
      categories: ['Exercise', 'Mental Wellness'],
      thumbnail: '/path-to-thumbnail.jpg'
    }
  ]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search resources..."
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
      </Box>

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="All" />
        <Tab label="Articles" />
        <Tab label="Videos" />
        <Tab label="Saved" />
      </Tabs>

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} md={6} key={resource.id}>
            <ResourceCard resource={resource} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ResourceLibrary; 