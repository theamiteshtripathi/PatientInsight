import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Box,
  Typography
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    height: '60vh',
    display: 'flex',
    flexDirection: 'column'
  },
  messageList: {
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    backgroundColor: '#f8f9fa'
  },
  messageItem: {
    marginBottom: theme.spacing(1),
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    borderRadius: '20px',
    padding: theme.spacing(1, 2),
    maxWidth: '70%',
    marginLeft: 'auto'
  },
  botMessage: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: theme.spacing(1, 2),
    maxWidth: '70%'
  },
  inputContainer: {
    display: 'flex',
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0'
  },
  input: {
    flexGrow: 1,
    marginRight: theme.spacing(2)
  },
  sendButton: {
    minWidth: 'unset',
    borderRadius: '50%',
    padding: theme.spacing(1)
  }
}));

function ChatInterface() {
  const classes = useStyles();
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: 'bot' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "I'm processing your request. How else can I help you?",
          sender: 'bot'
        }]);
      }, 1000);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper elevation={3} className={classes.chatContainer}>
      <List className={classes.messageList}>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            className={classes.messageItem}
            style={{
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Box
              className={
                message.sender === 'user'
                  ? classes.userMessage
                  : classes.botMessage
              }
            >
              <Typography variant="body1">{message.text}</Typography>
            </Box>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          size="small"
        />
        <Button
          className={classes.sendButton}
          color="primary"
          variant="contained"
          onClick={handleSend}
          disabled={!newMessage.trim()}
        >
          <SendIcon />
        </Button>
      </div>
    </Paper>
  );
}

export default ChatInterface;
