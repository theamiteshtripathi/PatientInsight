import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  DirectionsRun as ExerciseIcon,
  Restaurant as NutritionIcon,
  LocalDrink as HydrationIcon,
  Bedtime as SleepIcon,
  SelfImprovement as WellnessIcon,
  ExpandMore as ExpandMoreIcon,
  BookmarkBorder as BookmarkIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function RecommendationCard({ title, icon, tips, category }) {
  const [expanded, setExpanded] = React.useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      exercise: 'success',
      nutrition: 'primary',
      hydration: 'info',
      sleep: 'secondary',
      wellness: 'warning'
    };
    return colors[category] || 'default';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Chip 
          label={category}
          color={getCategoryColor(category)}
          size="small"
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          {tips[0]}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ mt: 'auto' }}>
        <IconButton aria-label="bookmark">
          <BookmarkIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {tips.slice(1).map((tip, index) => (
            <Typography key={index} paragraph>
              • {tip}
            </Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

function PersonalizedRecommendations() {
  const recommendations = [
    {
      title: 'Exercise',
      icon: <ExerciseIcon color="success" />,
      category: 'exercise',
      tips: [
        'Take a 30-minute walk every morning',
        'Do stretching exercises during work breaks',
        'Try yoga for stress relief',
        'Consider swimming for low-impact cardio'
      ]
    },
    {
      title: 'Nutrition',
      icon: <NutritionIcon color="primary" />,
      category: 'nutrition',
      tips: [
        'Increase intake of leafy greens',
        'Choose whole grains over refined grains',
        'Include protein in every meal',
        'Limit processed foods'
      ]
    },
    // Add more categories...
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personalized Recommendations
      </Typography>
      <Grid container spacing={3}>
        {recommendations.map((rec, index) => (
          <Grid item xs={12} md={6} key={index}>
            <RecommendationCard {...rec} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PersonalizedRecommendations; 