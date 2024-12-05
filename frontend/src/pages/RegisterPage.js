import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
  LinearProgress,
  Alert,
  Box
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) 
          ? 'Please enter a valid email address'
          : '';
      case 'password':
        return value.length < 8
          ? 'Password must be at least 8 characters long'
          : '';
      case 'confirmPassword':
        return value !== formData.password
          ? 'Passwords do not match'
          : '';
      default:
        return value.trim() === '' 
          ? 'This field is required'
          : '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      navigate('/login');
    } catch (error) {
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Account
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                required
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Username"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isLoading}
                InputProps={{
                  endAdornment: formData.username && (
                    <InputAdornment position="end">
                      {errors.username ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                InputProps={{
                  endAdornment: formData.email && (
                    <InputAdornment position="end">
                      {errors.email ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {formData.password && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength} 
                    color={getPasswordStrengthColor(passwordStrength)}
                  />
                  <Typography variant="caption" color="textSecondary">
                    Password Strength: {passwordStrength}%
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading || Object.values(errors).some(error => error)}
                sx={{ 
                  mt: 2,
                  height: 48,
                  position: 'relative'
                }}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
                {isLoading && (
                  <LinearProgress 
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0
                    }}
                  />
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Grid item>
            <Link 
              to="/login" 
              style={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ 
                  '&:hover': { 
                    textDecoration: 'underline' 
                  } 
                }}
              >
                Already have an account? Sign in
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
