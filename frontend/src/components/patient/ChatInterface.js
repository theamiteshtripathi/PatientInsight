import {
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send } from '@mui/icons-material';

const ChatWrapper = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  height: '60vh',
  overflowY: 'auto',
  padding: theme.spacing(2)
}));

function ChatInterface() {
  return (
    <ChatWrapper>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Chat Interface
        </Typography>
        
        <MessageContainer>
          {/* Your chat messages here */}
        </MessageContainer>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={10}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              endIcon={<Send />}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </ChatWrapper>
  );
}

export default ChatInterface;
