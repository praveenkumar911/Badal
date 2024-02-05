import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const SignupDev = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    OrgID: "",
    GitlabID: "",
    roleName: "Developer",
    teamId: [],
  });

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://10.8.0.13:5030/org/role2');
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate password
    if (name === 'password') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

      if (!passwordRegex.test(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one uppercase letter, one digit, one special character, and be at least 6 characters long.',
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
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
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);

        const createUserResponse = await axios.post('http://10.8.0.13:5030/create-user', {
          email: formData.email,
          name: `${formData.firstName}`,
          username: `${formData.firstName}${formData.lastName}`,
          password: `${formData.password}`,
        });
 
        const gitlabUserId = createUserResponse.data.id;
        const updatedFormData = { ...formData, GitlabID: gitlabUserId,username: `${formData.firstName}${formData.lastName}` };
        setFormErrors({}); 

        const signupResponse = await axios.post('http://10.8.0.13:5030/signup', updatedFormData);

        if (signupResponse.status === 200) {
          Swal.fire({
            title: 'Registration Successful!',
            text: 'Your account has been created successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/');
          });
        } else {
          console.error('Signup failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);

        if (error.response) {
          const status = error.response.status;
          let errorMessage;

          switch (status) {
            case 400:
              errorMessage = 'Invalid input. Please check your data.';
              break;
            case 404:
              errorMessage = 'Not Found. Please try again later.';
              break;
            case 409:
              errorMessage = 'Conflict. Another user with the same email already exists.';
              break;
            case 500:
              errorMessage = 'Internal Server Error. Please contact the administrator.';
              break;
            default:
              errorMessage = 'An error occurred. Please try again later.';
          }

          Swal.fire({
            title: 'Registration Failed',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          console.error('Other error:', error.message);
        }
      } finally {
        setLoading(false);
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
        margin: "0 auto",
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
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SignupDev;
