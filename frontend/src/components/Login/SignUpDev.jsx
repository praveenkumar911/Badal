import React, { useState,useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
const SignupDev = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    OrgID: "",
    GitlabID:"",
    roleName:"Developer",
    teamId:[]
  });

  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
    // Fetch organizations with roleId: "2" from the API
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:5030/org/role2');
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update the username when either firstName or lastName changes
    if (name === 'firstName' || name === 'lastName') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        username: `${prevData.firstName}${value}`, // Update the username
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

 
  
  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!data.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!data.email.trim()) { 
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    // Add more validations as needed for other fields
    return errors;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      try { 
        // Create GitLab user
        const createUserResponse = await axios.post('http://localhost:5030/create-user', {
          email: formData.email,
          name: `${formData.firstName}`,
          username: `${formData.firstName}${formData.lastName}`,
          password: `${formData.password}`,
        });
  
        // Capture GitLab user ID and update formData
        const gitlabUserId = createUserResponse.data.id;
        
        const updatedFormData = { ...formData, GitlabID: gitlabUserId };
   
        // Log GitlabID in useEffect to ensure it has been updated
        console.log('Form Data:', formData);
        setFormErrors({});
  
        // Send updated formData to /signup
        const signupResponse = await axios.post('http://localhost:5030/signup', updatedFormData);
  
        if (signupResponse.ok) {
          console.log('Signup successful');
          navigate('/');
          // Navigate to the desired route upon successful signup
        } else {
          console.error('Signup failed');
          navigate('/');
        }
  
      } catch (createUserError) {
        console.error('Error creating GitLab user:', createUserError);
  
        // If user creation fails, try to delete the user using the captured GitLab ID
        if (formData.GitlabID) {
          try {
            await axios.delete(`http://localhost:5030/delete-user/${formData.GitlabID}`);
            console.log('GitLab User deleted successfully.');
          } catch (deleteUserError) {
            console.error('Error deleting GitLab user:', deleteUserError);
          }
        }
  
        // Handle form submission error
        setFormErrors({ general: 'Failed to create user. Please try again.' });
      }
    } else {
      setFormErrors(errors);
    }
  };
  
   
  return (
    <Box
      sx={{
        width: "50%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto", // Center the form horizontally
      }}
    >
      <AccountCircleIcon sx={{ fontSize: 56, color: "#333333" }} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Create your account
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "80%", marginTop: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Organization"
              name="OrgID"
              value={formData.Org}
              onChange={handleChange}
              fullWidth
            >
              {organizations.map((org) => (
                <MenuItem key={org._id} value={org.orgId}>
                  {org.orgName}
                </MenuItem>
              ))} 
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Create Account
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SignupDev;