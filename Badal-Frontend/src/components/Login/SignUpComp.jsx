import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AWS from "aws-sdk";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from 'sweetalert2';

const SignUpComp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
 
  AWS.config.update({
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
    endpoint: "http://10.8.0.13:9000", // Replace with your Minio endpoint
    s3ForcePathStyle: true,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          if (img.width <= 512 && img.height <= 320) {
            setFormData({ ...formData, avatar: file });
          } else {
            setErrors({
              ...errors,
              avatar: 'Please upload an image with dimensions not exceeding 512x320.',
            });
          }
        };
      };
    }
  };
  const handleDivClick = () => {
    // Trigger click on the hidden file input
    document.getElementById('avatar-upload').click();
  };

  const [formData, setFormData] = useState({
    OrgName: "",
    WebsiteUrl: "",
    GitlabID: "",
    orgType: "",
    ImgUrl: "",
    Address1: "",
    Address2: "",
    AreaName: "",
    City: "",
    state: "",
    pincode: "",
    country: "",
    roleName: "OrgManager",
    email: "",
    password: "",
    access: "True",
    confirmPassword: "",
    userGitLabId:"",
    IsNgo: false,
  });

  const organizationTypes = ["Healthcare", "livelihood", "Educational"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "IsNgo") {
      setFormData({ ...formData, IsNgo: checked });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }

    setErrors({ ...errors, [name]: undefined });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Organization Name
    if (!formData.OrgName.trim()) {
      newErrors.OrgName = "Organization Name is required";
    }

    // Validate Organization Type
    if (!formData.orgType) {
      newErrors.orgType = "Organization Type is required";
    }

    // Validate Website URL
    if (!formData.WebsiteUrl.trim()) {
      newErrors.WebsiteUrl = "Website URL is required";
    }

    // Validate Image
    if (!formData.avatar) {
      newErrors.avatar = "Image is required";
    } else if (formData.avatar.size > 5 * 1024 * 1024) {
      newErrors.avatar = "Image size should not exceed 5MB";
    } else {
      const img = new Image();
      img.src = URL.createObjectURL(formData.avatar);
      img.onload = () => {
        if (img.width > 512 || img.height > 320) {
          newErrors.avatar =
            "Please upload an image with dimensions not exceeding 512x320.";
        }
      };
    }

    // Validate Address Line 1
    if (!formData.Address1.trim()) {
      newErrors.Address1 = "Address Line 1 is required";
    }

    // Validate Address Line 2
    if (!formData.Address2.trim()) {
      newErrors.Address2 = "Address Line 2 is required";
    }

    // Validate Area Name
    if (!formData.AreaName.trim()) {
      newErrors.AreaName = "Area Name is required";
    }

    // Validate City
    if (!formData.City.trim()) {
      newErrors.City = "City is required";
    }

    // Validate State
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Validate Country
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Validate PinCode
    if (!formData.pincode.trim()) {
      newErrors.pincode = "PinCode is required";
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    // Validate Password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    // Validate Confirm Password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    try {
      const apiProgress = 50; // Progress for the first API call
      setProgress(apiProgress);
      const imageUrl = await uploadImageToMinio(formData.avatar);
      setFormData({ ...formData, ImgUrl: imageUrl });
  
      const createSubgroupResponse = await axios.post('http://10.8.0.13:5030/create-org-subgroup', {
        groupName: formData.OrgName.replace(/ /g, "_"),
        // description: 'Created in Badal Platform as an Organization',
        email: formData.email,
        password: formData.password,
        userName: formData.OrgName,
      });
  
      const gitlabId = createSubgroupResponse.data.subgroupId;
      const userGitLabId = createSubgroupResponse.data.userGitLabId;
      const updatedFormData = { ...formData, GitlabID: gitlabId, ImgUrl: imageUrl, userGitLabId: userGitLabId };
      const registerProgress = 100;
      setProgress(registerProgress);
      const registerResponse = await axios.post('http://10.8.0.13:5030/org-signup', updatedFormData);
  
      Swal.fire({
        title: 'Registration Successful!',
        text: 'Your Approval from Admin is pending. Kindly wait for 48 hrs.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/');
      });
  
      setFormData({});
    } catch (error) {
      console.error('Error during registration:', error);
  
      if (error.response) {
        const status = error.response.status;
        let errorMessage;
  // Below error codes are thrown by GitLab and they are not HTTP errors
        switch (status) {
          case 400:
            errorMessage = 'Organisation already exists.';
            break;
          case 404:
            errorMessage = 'User already exists.';
            break;
          case 409:
            errorMessage = 'Network connectivity error';
            break;
          case 500:
            errorMessage = 'Conflict. Another organization with the same name already exists,Please contact the administrator @ Arjun@rcts.com.';
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
  
      try {
        await axios.delete(`http://10.8.0.13:5030/delete-subgroup/${formData.GitlabID}`);
        console.log('GitLab Subgroup deleted successfully');
      } catch (deleteError) {
        console.error('Error deleting GitLab subgroup:', deleteError);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const uploadImageToMinio = async (file) => {
    try {
      const s3 = new AWS.S3();

      const bucketName = "psuw001";
      const key = `logos/${file.name}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
        ACL: "public-read",
      };

      const data = await s3.upload(uploadParams).promise();

      return data.Location;
    } catch (error) {
      console.error("Error uploading logo to Minio:", error);
      throw error;
    }
  };

  return (
    <Box
    sx={{
      width: "60%",
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
      Register your organization
    </Typography>
    {loading && <CircularProgress value={progress} sx={{ mt: 2 }} />}
    <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} container direction="column" spacing={2}>
          <Grid item>
            <TextField
              label="Organization Name"
              name="OrgName"
              value={formData.OrgName}
              onChange={handleChange}
              fullWidth
              error={!!errors.OrgName}
              helperText={errors.OrgName}
            />
          </Grid>
          <Grid item>
            <TextField
              select
              label="Organization Type"
              name="orgType"
              value={formData.orgType}
              onChange={handleChange}
              fullWidth
              error={!!errors.orgType}
              helperText={errors.orgType}
            >
              {organizationTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              label="Website URL"
              name="WebsiteUrl"
              value={formData.WebsiteUrl}
              onChange={handleChange}
              fullWidth
              error={!!errors.WebsiteUrl}
              helperText={errors.WebsiteUrl}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
      <div
        onClick={handleDivClick}
        style={{
          border: '2px dashed #aaaaaa',
          borderRadius: '8px',
          padding: '80px',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="avatar-upload"
        />

        <label htmlFor="avatar-upload">
          <Typography component="span">Upload Image</Typography>
        </label>
        {formData.avatar && (
          <img
            src={URL.createObjectURL(formData.avatar)}
            alt="Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )}
        <Typography color="error" marginTop="1vw">
          {errors.avatar}
        </Typography>
      </div>
      <Typography align="center" marginTop="1vw">
        Upload your logo in PNG & JPEG format with a max size of 5MB. You can reduce image size using{' '}
        <a href="https://www.reduceimages.com/" target="_blank" rel="noopener noreferrer">
          this link
        </a>
        .
      </Typography>
    </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Address Line 1"
            name="Address1"
            value={formData.Address1}
            onChange={handleChange}
            fullWidth
            error={!!errors.Address1}
            helperText={errors.Address1}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Address Line 2"
            name="Address2"
            value={formData.Address2}
            onChange={handleChange}
            fullWidth
            error={!!errors.Address2}
            helperText={errors.Address2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Area Name"
            name="AreaName"
            value={formData.AreaName}
            onChange={handleChange}
            fullWidth
            error={!!errors.AreaName}
            helperText={errors.AreaName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            name="City"
            value={formData.City}
            onChange={handleChange}
            fullWidth
            error={!!errors.City}
            helperText={errors.City}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            fullWidth
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="PinCode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            fullWidth
            error={!!errors.pincode}
            helperText={errors.pincode}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.IsNgo || false}
                onChange={handleChange}
                name="IsNgo"
              />
            }
            label="Are you an NGO?"
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
            error={!!errors.email}
            helperText={errors.email}
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
            error={!!errors.password}
            helperText={errors.password}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  </Box>
  );
};

export default SignUpComp;
