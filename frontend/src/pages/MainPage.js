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
  Paper
} from '@material-ui/core';
import ChatInterface from '../components/chat/ChatInterface';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    color: '#fff'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5'
  },
  paper: {
    height: '100%',
    padding: theme.spacing(2)
  }
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function MainPage() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Patient Insight
          </Typography>
        </Toolbar>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          centered
          style={{ backgroundColor: '#1976d2' }}
        >
          <Tab label="Main Menu" style={{ color: '#fff' }} />
          <Tab label="Add New" style={{ color: '#fff' }} />
        </Tabs>
      </AppBar>

      <Container className={classes.content}>
        <TabPanel value={tabValue} index={0}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Welcome to Patient Insight
            </Typography>
            <ChatInterface />
          </Paper>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Add New Content
            </Typography>
            {/* Add your "Add New" content here */}
          </Paper>
        </TabPanel>
      </Container>
    </div>
  );
}

export default MainPage;
