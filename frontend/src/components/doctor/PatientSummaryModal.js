import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
} from '@material-ui/core';
import SummaryReview from './SummaryReview';

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 600,
  },
}));

function PatientSummaryModal({ open, onClose, patientSummary }) {
  const classes = useStyles();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      className={classes.dialog}
    >
      <DialogTitle>Review Patient Summary</DialogTitle>
      <DialogContent>
        <SummaryReview patientSummary={patientSummary} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 