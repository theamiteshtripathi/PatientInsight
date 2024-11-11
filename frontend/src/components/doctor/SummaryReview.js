import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  summaryContainer: {
    marginBottom: theme.spacing(3),
  },
  actions: {
    marginTop: theme.spacing(2),
  },
}));

function SummaryReview({ patientSummary }) {
  const classes = useStyles();
  const [editedSummary, setEditedSummary] = useState(patientSummary);

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">Patient Summary Review</Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        value={editedSummary}
        onChange={(e) => setEditedSummary(e.target.value)}
        variant="outlined"
        className={classes.summaryContainer}
      />
      <div className={classes.actions}>
        <Button variant="contained" color="primary">
          Approve Summary
        </Button>
      </div>
    </Paper>
  );
}
