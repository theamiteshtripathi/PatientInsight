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
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send, Refresh, CheckCircleOutline } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const ChatWrapper = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  overflow: 'hidden'
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

const API_BASE_URL = 'http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api';

function ChatInterfaceLLM() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showReportDialog, setShowReportDialog] = useState(false);

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
      
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}/chat_llm/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          session_id: newSessionId,
          user_id: user?.id
        }),
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
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${API_BASE_URL}/chat_llm/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages,
          user_id: user?.id,
          session_id: sessionId
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
        setShowReportDialog(true);
        return;
      }

      setMessages(prev => [...prev, { text: data.message, isBot: true }]);
    } catch (error) {
      setError(`Error sending message: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
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
          p: 2, 
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h1">
            Talk About Your Doctor's review Report
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
        
        <MessageContainer
          sx={{
            height: '100%',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
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
        
        <Box 
          component="form" 
          onSubmit={(e) => e.preventDefault()} 
          sx={{ 
            mt: 2,
            flexShrink: 0
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                inputRef={inputRef}
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
                autoFocus
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
      
      <Dialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'success.main' 
        }}>
          <CheckCircleOutline />
          Report Generated Successfully
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your medical report has been generated and sent to our medical team for review. 
            You can track the status of your report in the Symptoms Checker page.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setShowReportDialog(false)}
            color="inherit"
          >
            Close
          </Button>
          <Button 
            onClick={() => setShowReportDialog(false)}
            variant="contained"
            color="primary"
            autoFocus
          >
            View Report Status
          </Button>
        </DialogActions>
      </Dialog>
    </ChatWrapper>
  );
}

export default ChatInterfaceLLM; 