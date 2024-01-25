import React, { useState } from 'react';
import { Typography, Grid, TextField, Button, Box, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import RCTSIcon from '../project/RCTS.png';
import Footer from '../Footer/Footer';
import Swal from 'sweetalert2';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
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
    Swal.fire({
      title: 'Signup Options',
      showCancelButton: true,
      showConfirmButton: false, // Remove the OK button 
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
  
       <>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <img src={RCTSIcon} style={{ width: '250px' }} alt="RCTS Icon" />
        <Box
          sx={{
            width: '350px',
            height: '430px',
            backgroundColor: '#e5f1fb',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderRadius: '15px',
            mt: '2%',
            boxShadow: '5px 5px 15px 0px rgba(0,0,0,0.2)',
            padding: '20px',
          }}
        >
          <Box>
            <Avatar sx={{ width: 56, height: 56 }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography className="loginTypography" sx={{ fontSize: 24, color: '#333333', mt: '2%' }}>
              Sign in
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  inputProps={{ style: { color: '#' } }}
                  value={formData.email}
                  onChange={handleEmailChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Password"
                  inputProps={{ style: { color: '#333333' } }}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  fullWidth
                />
              </Grid>
              <Grid container justifyContent="center">
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                  <Button variant="contained" onClick={handleSubmit}>
                    Login
                  </Button>
                  <Button variant="contained" onClick={showSignupAlert}>
                    Signup
                  </Button>
                </Grid>
                <Typography
                  variant="body2"
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue', marginTop: '20px' }}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
      <Footer />
    
    </>
  );
};

export default Login;
