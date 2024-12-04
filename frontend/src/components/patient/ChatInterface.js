import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send, Refresh } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const ChatWrapper = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  height: '90vh',
  display: 'flex',
  flexDirection: 'column'
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  scrollBehavior: 'smooth',
  marginBottom: theme.spacing(2)
}));

const MessageBubble = styled(Box)(({ theme, isBot }) => ({
  maxWidth: '80%',
  margin: '8px',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: isBot ? theme.palette.grey[100] : theme.palette.primary.main,
  color: isBot ? theme.palette.text.primary : theme.palette.common.white,
  alignSelf: isBot ? 'flex-start' : 'flex-end',
  wordWrap: 'break-word'
}));

const API_BASE_URL = 'http://k8s-default-backends-3d835ba603-ad3edaa62e54a151.elb.us-east-2.amazonaws.com/api';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNewSession = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setError('');
    startChat(newSessionId);
  };

  useEffect(() => {
    startNewSession();
  }, []);

  const startChat = async (newSessionId) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ session_id: newSessionId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.status === 'error') {
        setError(data.error);
      } else {
        setMessages([{ text: data.message, isBot: true }]);
      }
    } catch (error) {
      setError(`Error starting chat: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (userMessage.toLowerCase() === 'bye') {
        setMessages(prev => [...prev, { 
          text: "Chat session ended. Your medical report has been generated.", 
          isBot: true 
        }]);
        setTimeout(() => {
          startNewSession();
        }, 2000);
        return;
      }

      setMessages(prev => [...prev, { text: data.message, isBot: true }]);
    } catch (error) {
      setError(`Error sending message: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatWrapper>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h1">
            Medical Chat Assistant
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={startNewSession}
            disabled={loading}
            variant="outlined"
          >
            New Session
          </Button>
        </Box>
        
        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          </Fade>
        )}
        
        <MessageContainer>
          <Box display="flex" flexDirection="column">
            {messages.map((message, index) => (
              <MessageBubble key={index} isBot={message.isBot}>
                <Typography variant="body1">
                  {message.text}
                </Typography>
              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </MessageContainer>
        
        <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message... (type 'bye' to end chat)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                multiline
                maxRows={4}
                sx={{ backgroundColor: 'background.paper' }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                onClick={handleSend}
                disabled={loading || !input.trim()}
                sx={{ height: '100%' }}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </ChatWrapper>
  );
}

export default ChatInterface;
