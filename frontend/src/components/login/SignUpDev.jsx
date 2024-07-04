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
  const orgId = localStorage.getItem("orgId");
  const permissionString = localStorage.getItem("permissions");
  const permissions = permissionString ? permissionString.split(",") : [];
  const isP005Allowed = permissions.includes("P005");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get("http://10.8.0.12:5000/org/role2");
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

        const createUserResponse = await axios.post(
          "http://10.8.0.12:5000/create-user",
          {
            email: formData.email,
            name: `${formData.firstName}`,
            username: `${formData.firstName}${formData.lastName}`,
            password: `${formData.password}`,
          }
        );

        const gitlabUserId = createUserResponse.data.id;
        const updatedFormData = {
          ...formData,
          GitlabID: gitlabUserId,
          username: `${formData.firstName}${formData.lastName}`,
        };

        const signupResponse = await axios.post(
          "http://10.8.0.12:5000/signup",
          updatedFormData
        );

        if (signupResponse.status === 200) {
          setLoading(false);
          window.location.reload();
        } else {
          console.error("Signup failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
   
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            {isP005Allowed
              ? organizations
                  .filter((org) => org.isNgo === "false")
                  .map((org) => (
                    <MenuItem key={org._id} value={org.orgId}>
                      {org.orgName}
                    </MenuItem>
                  ))
              : orgId &&
                organizations
                  .filter((org) => org.orgId === orgId)
                  .map((org) => (
                    <MenuItem key={org._id} value={org.orgId}>
                      {org.orgName}
                    </MenuItem>
                  ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            {loading ? <CircularProgress size={24} /> : "Create Account"}
          </Button>
        </Grid>
      </Grid>
    </form>
  </div>
  
    
  );
};

export default SignupDev;