import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function DashboardPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            MyHealth Online
          </Typography>
          <Button color="inherit">Log out</Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Welcome!
            </Typography>
            <Paper className={classes.paper}>
              <Typography variant="h6">Need advice for treatment of Covid-19?</Typography>
              <Typography paragraph>
                If you have tested positive for Covid-19 and have not yet seen a provider, you
                can try our E-Visit tool to get advice about treatment options. To get started and
                to learn more, click the Symptom Checker button and answer a few questions
                about your symptoms.
              </Typography>
              <Button variant="contained" color="primary">
                Symptom Checker
              </Button>
              <Button>Dismiss</Button>
            </Paper>
            <Paper className={classes.paper}>
              <Typography variant="h6">Atrius Flu Vaccine</Typography>
              <Typography paragraph>
                Flu Clinic scheduling is available! Appointments will run through October 18th,
                and new slots will open daily. If you cannot find a time, you may also ask for
                your vaccine during your regularly scheduled visits.
              </Typography>
              <Button variant="contained" color="primary">
                Schedule Now
              </Button>
              <Button>Dismiss</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>
              <Typography variant="h6">Care Team and Recent Providers</Typography>
              {/* Add provider information here */}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default DashboardPage;
