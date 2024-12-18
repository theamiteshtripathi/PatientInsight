import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Divider,
  Badge,
  IconButton
} from '@mui/material';
import { 
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import DoctorSidebar from '../components/doctor/DoctorSidebar';

function DoctorChatPage() {
  // Dummy data for conversations
  const dummyConversations = [
    {
      id: 1,
      patient_name: 'John Doe',
      last_message: 'Thank you doctor, I will follow the prescription',
      unread: 2,
      last_time: '10:30 AM',
      avatar_color: '#1976d2'
    },
    {
      id: 2,
      patient_name: 'Sarah Wilson',
      last_message: 'When should I take the next dose?',
      unread: 0,
      last_time: '9:15 AM',
      avatar_color: '#388e3c'
    },
    {
      id: 3,
      patient_name: 'Mike Brown',
      last_message: 'I am feeling much better now',
      unread: 1,
      last_time: 'Yesterday',
      avatar_color: '#d32f2f'
    }
  ];

  // Dummy messages for selected chat
  const dummyMessages = [
    {
      id: 1,
      sender: 'patient',
      text: 'Hello Dr. Smith, I have been experiencing headaches lately',
      time: '9:00 AM'
    },
    {
      id: 2,
      sender: 'doctor',
      text: 'Hello! I am sorry to hear that. How long have you been having these headaches?',
      time: '9:02 AM'
    },
    {
      id: 3,
      sender: 'patient',
      text: 'For about a week now, especially in the morning',
      time: '9:05 AM'
    },
    {
      id: 4,
      sender: 'doctor',
      text: 'I see. Have you noticed any triggers? Changes in sleep pattern or stress levels?',
      time: '9:07 AM'
    }
  ];

  const [conversations] = useState(dummyConversations);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages] = useState(dummyMessages);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DoctorSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>Chat</Typography>
          
          <Paper sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
            {/* Conversations List */}
            <Box sx={{ 
              width: 300, 
              borderRight: 1, 
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Search Box */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Box>

              <List sx={{ flex: 1, overflow: 'auto' }}>
                {conversations.map((chat) => (
                  <ListItem 
                    key={chat.id}
                    button 
                    selected={selectedChat?.id === chat.id}
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent={chat.unread}
                        color="error"
                        overlap="circular"
                      >
                        <Avatar sx={{ bgcolor: chat.avatar_color }}>
                          {chat.patient_name[0]}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={chat.patient_name}
                      secondary={chat.last_message}
                      primaryTypographyProps={{
                        fontWeight: chat.unread ? 'bold' : 'normal'
                      }}
                      secondaryTypographyProps={{
                        noWrap: true
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {chat.last_time}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Chat Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: selectedChat.avatar_color }}>
                        {selectedChat.patient_name[0]}
                      </Avatar>
                      <Typography variant="h6">{selectedChat.patient_name}</Typography>
                    </Box>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  {/* Messages Area */}
                  <Box sx={{ 
                    flex: 1, 
                    p: 2, 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    {messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          alignSelf: msg.sender === 'doctor' ? 'flex-end' : 'flex-start',
                          maxWidth: '70%'
                        }}
                      >
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            backgroundColor: msg.sender === 'doctor' ? 'primary.main' : 'grey.100',
                            color: msg.sender === 'doctor' ? 'white' : 'text.primary',
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="body1">{msg.text}</Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              textAlign: 'right',
                              color: msg.sender === 'doctor' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                            }}
                          >
                            {msg.time}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <AttachFileIcon />
                      </IconButton>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        variant="outlined"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        onClick={handleSendMessage}
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flex: 1,
                  bgcolor: 'grey.50'
                }}>
                  <Typography color="text.secondary">
                    Select a conversation to start chatting
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default DoctorChatPage; 