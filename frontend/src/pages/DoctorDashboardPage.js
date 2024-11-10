import React, { useState } from 'react';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
  Paper,
  Grid,
} from '@material-ui/core';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Chat as ChatIcon,
} from '@material-ui/icons';
import PatientsList from '../components/doctor/PatientsList';
import AppointmentsSchedule from '../components/doctor/AppointmentsSchedule';
import MedicalReports from '../components/doctor/MedicalReports';
import ChatInterface from '../components/patient/ChatInterface';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 64,
  },
  toolbar: {
    paddingRight: 24,
  },
  title: {
    flexGrow: 1,
  },
  tabPanel: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function DoctorDashboardPage() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { loading, error } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Doctor Dashboard
          </Typography>
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          indicatorColor="secondary"
          textColor="inherit"
        >
          <Tab icon={<PeopleIcon />} label="Patients" />
          <Tab icon={<EventIcon />} label="Appointments" />
          <Tab icon={<AssessmentIcon />} label="Reports" />
          <Tab icon={<ChatIcon />} label="Chat" />
        </Tabs>
      </AppBar>

      <main className={classes.content}>
        <TabPanel value={tabValue} index={0}>
          <PatientsList />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AppointmentsSchedule />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <MedicalReports />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <ChatInterface />
        </TabPanel>
      </main>
    </div>
  );
}

export default DoctorDashboardPage;
