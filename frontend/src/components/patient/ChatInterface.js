import React, { useState, useRef, useEffect } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Box, 
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  makeStyles 
} from '@material-ui/core';
import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    marginLeft: 240,
    marginTop: 64,
    height: `calc(100vh - 64px)`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    height: '100%',
    position: 'relative',
  },
  messageList: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    marginBottom: '100px',
  },
  message: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  botMessage: {
    backgroundColor: theme.palette.grey[200],
    alignSelf: 'flex-start',
  },
  inputContainer: {
    position: 'fixed',
    bottom: 0,
    left: 240,
    right: 0,
    padding: theme.spacing(3),
    backgroundColor: '#fff',
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    zIndex: 1000,
  },
  textField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(2),
    },
  },
  sendButton: {
    height: 56,
    width: 100,
    borderRadius: theme.spacing(2),
  }
}));

function ChatInterface() {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to your LLM backend
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ 
          text: "I understand your symptoms. Based on the information you've provided, I recommend scheduling an appointment with a doctor for a proper evaluation. Would you like me to help you schedule one?" 
        }), 1000)
      );

      const botMessage = {
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Header />
      <Sidebar />
      <main className={classes.content}>
        <div className={classes.chatContainer}>
          <List className={classes.messageList}>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                className={`${classes.message} ${
                  message.sender === 'user' ? classes.userMessage : classes.botMessage
                }`}
                style={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <ListItemText
                  primary={message.text}
                  secondary={message.timestamp.toLocaleTimeString()}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
          <div className={classes.inputContainer}>
            <TextField
              className={classes.textField}
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              className={classes.sendButton}
              variant="contained"
              color="primary"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatInterface;
