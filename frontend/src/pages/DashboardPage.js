import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper, Typography, Card, CardContent, Box } from '@material-ui/core';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import { 
  LocalHospital,
  Event,
  Assessment,
  Chat
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '64px', // Height of the header
  },
}));

const StatCard = ({ icon, title, value }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center">
        {icon}
        <Box ml={2}>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function DashboardPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <Sidebar />
      <main className={classes.content}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Your existing dashboard content */}
          </Grid>
        </Container>
      </main>
    </div>
  );
}

export default DashboardPage;
