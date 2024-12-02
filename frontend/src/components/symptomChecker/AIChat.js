import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

function AIChat({ sessionActive }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const initialPrompt = {
    type: 'ai',
    content: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll help you understand them better. When did they start?"
  };

  useEffect(() => {
    if (sessionActive) {
      setMessages([initialPrompt]);
    }
  }, [sessionActive]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { type: 'user', content: input }
    ];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          type: 'ai', 
          content: "I understand. Could you tell me if you've experienced these symptoms before? Also, are you currently taking any medications?"
        }
      ]);
    }, 1000);
  };

  return (
    <Box sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            {message.type === 'ai' && (
              <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>AI</Avatar>
            )}
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.type === 'user' ? 'primary.main' : 'grey.100',
                color: message.type === 'user' ? 'white' : 'text.primary'
              }}
            >
              <Typography>{message.content}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default AIChat; 