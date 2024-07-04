import React, { useState } from 'react';
import { Typography, Grid, TextField, Button, Box, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import RCTSIcon from '../icons/RCTS.png';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null); // New error state

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResult = await onLogin(formData);

      if (loginResult && loginResult.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Credentials are correct.',
        });
      } else {
        setError(loginResult.error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid credentials');
    }
  };

  const navigate = useNavigate();

  const handleDevSignup = () => {
    console.log('Dev Signup clicked');
    navigate('/signupdev');
    Swal.close(); // Close SweetAlert popup
  };

  const handleOrgSignup = () => {
    console.log('Org Signup clicked');
    navigate('/signup');
    Swal.close(); // Close SweetAlert popup
  };

  const showSignupAlert = () => {
    setError(null); // Clear the error when showing the signup alert
    Swal.fire({
      title: 'Signup Options',
      showCancelButton: true,
      showConfirmButton: false,
      html: `
        <button id="devSignupBtn" class="swal2-confirm swal2-styled" style="margin-right: 10px; background-color: #2196f3; color: white;">Dev Signup</button>
        <button id="orgSignupBtn" class="swal2-confirm swal2-styled" style="margin-right: 10px; background-color: #2196f3; color: white;">Org Signup</button>
      `,
      didOpen: () => {
        document.getElementById('devSignupBtn').addEventListener('click', handleDevSignup);
        document.getElementById('orgSignupBtn').addEventListener('click', handleOrgSignup);
      },
    });
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password clicked');
    // Implement your logic here
  };

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh', // Half of the viewport height
    }}
  >
    <img src={RCTSIcon} style={{ width: '250px', marginBottom: '20px' }} alt="RCTS Icon" />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#e5f1fb',
        borderRadius: '15px',
        boxShadow: '5px 5px 15px 0px rgba(0,0,0,0.2)',
        padding: '20px',
        width: '350px',
      }}
    >
      <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
        <AccountCircleIcon sx={{ width: 48, height: 48 }} />
      </Avatar>
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Sign in
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={formData.email}
              onChange={handleEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              Login
            </Button>
          </Grid>
          {error && (
            <Typography variant="body2" sx={{ color: 'red', mt: 2 }}>
              {error}
            </Typography>
          )}
        </Grid>
      </form>
      <Typography
        variant="body2"
        sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue', mt: 2 }}
        onClick={handleForgotPassword}
      >
        Forgot Password?
      </Typography>
    </Box>
  </Box>
  );
};

export default Login;

