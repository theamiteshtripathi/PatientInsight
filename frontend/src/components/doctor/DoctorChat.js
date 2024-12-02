import React from 'react';
import ChatInterface from '../patient/ChatInterface';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

function DoctorChat() {
  return (
    <Root>
      <ChatInterface isDoctorView={true} />
    </Root>
  );
}

export default DoctorChat;
