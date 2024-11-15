import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LocalHospital as HospitalIcon,
  Home as HomeIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

function RecommendationsPanel() {
  const recommendations = [
    {
      type: 'Immediate Actions',
      items: [
        'Rest and monitor symptoms',
        'Stay hydrated',
        'Take prescribed medications'
      ],
      icon: <TimerIcon />,
      priority: 'high'
    },
    {
      type: 'Home Care',
      items: [
        'Apply cold compress',
        'Maintain good ventilation',
        'Light exercise if feeling up to it'
      ],
      icon: <HomeIcon />,
      priority: 'medium'
    },
    {
      type: 'Medical Attention',
      items: [
        'Schedule follow-up with primary care physician',
        'Bring current medication list to appointment'
      ],
      icon: <HospitalIcon />,
      priority: 'medium'
    }
  ];

  return (
    <Box>
      {recommendations.map((rec, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {rec.icon}
              <Typography>{rec.type}</Typography>
              <Chip
                label={rec.priority}
                size="small"
                color={rec.priority === 'high' ? 'error' : 'primary'}
                sx={{ ml: 1 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {rec.items.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default RecommendationsPanel; 