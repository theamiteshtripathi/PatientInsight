import React from 'react';
import {
  Box,
  Paper,
  Typography
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  MedicalServices as MedicalIcon,
  Chat as ChatIcon,
  Assignment as ReportIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';

function TimelineView() {
  const timelineEvents = [
    {
      id: 1,
      date: '2024-03-15',
      type: 'AI Consultation',
      title: 'Initial Symptom Assessment',
      description: 'Reported symptoms: Headache, Fever',
      icon: <ChatIcon />,
      color: 'primary'
    },
    {
      id: 2,
      date: '2024-03-16',
      type: 'Doctor Review',
      title: 'Doctor Assessment',
      description: 'Diagnosis confirmed, prescribed medication',
      icon: <MedicalIcon />,
      color: 'success'
    },
    {
      id: 3,
      date: '2024-03-20',
      type: 'Lab Report',
      title: 'Blood Test Results',
      description: 'Complete blood count analysis',
      icon: <ReportIcon />,
      color: 'info'
    },
    {
      id: 4,
      date: '2024-03-25',
      type: 'Follow-up',
      title: 'Follow-up Consultation',
      description: 'Review of treatment progress',
      icon: <HospitalIcon />,
      color: 'secondary'
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Medical Timeline
      </Typography>
      <Timeline position="alternate">
        {timelineEvents.map((event) => (
          <TimelineItem key={event.id}>
            <TimelineOppositeContent color="text.secondary">
              {event.date}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={event.color}>
                {event.icon}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {event.type}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {event.title}
                </Typography>
                <Typography variant="body2">
                  {event.description}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
}

export default TimelineView; 