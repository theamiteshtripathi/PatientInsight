import React from 'react';
import ChatInterface from '../patient/ChatInterface';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
}));

function DoctorChat() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ChatInterface isDoctorView={true} />
    </div>
  );
}

export default DoctorChat;
