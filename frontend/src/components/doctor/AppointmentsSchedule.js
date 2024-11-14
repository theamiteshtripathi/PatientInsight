import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    height: '100%',
  },
  list: {
    width: '100%',
  },
}));

function AppointmentsSchedule() {
  const classes = useStyles();
  const [appointments] = useState([
    { id: 1, patient: 'John Doe', time: '09:00 AM', date: '2024-03-20', status: 'Scheduled' },
    { id: 2, patient: 'Jane Smith', time: '10:30 AM', date: '2024-03-20', status: 'Confirmed' },
  ]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            <List className={classes.list}>
              {appointments.map((appointment) => (
                <ListItem key={appointment.id}>
                  <ListItemText
                    primary={appointment.patient}
                    secondary={`${appointment.time} - ${appointment.status}`}
                  />
                  <ListItemSecondaryAction>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                    >
                      Start Session
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default AppointmentsSchedule; 