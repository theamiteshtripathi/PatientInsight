import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh'
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  width: '100%'
}));

function LoginPage() {
  const navigate = useNavigate();
  const { login, error, loading, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear any existing errors when component mounts
  useEffect(() => {
    setError(null);
  }, [setError]);

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <LoginContainer maxWidth="sm">
      <LoginPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '100%', mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: '#1976d2',
              textDecoration: 'none'
            }}
          >
            Sign up
          </Link>
        </Typography>
      </LoginPaper>
    </LoginContainer>
  );
}

export default LoginPage;
