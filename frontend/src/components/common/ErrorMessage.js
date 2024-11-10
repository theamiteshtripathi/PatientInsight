import React from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
}));

function ErrorMessage({ message }) {
  const classes = useStyles();
  return (
    <Alert severity="error" className={classes.root}>
      {message}
    </Alert>
  );
}

export default ErrorMessage;
