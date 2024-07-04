
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
  CircularProgress
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AWS from "aws-sdk";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SignUpComp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [fieldsDisabled, setFieldsDisabled] = useState(false); // State to control fields disabled status

  AWS.config.update({
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
    endpoint: "pl-minio.iiit.ac.in", // Replace with your Minio endpoint
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
    phone:"",
    size:'',
    description:"",
    gitlabUrl:'',
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
    // if (!formData.avatar) {
    //   newErrors.avatar = "Image is required";
    // } else if (formData.avatar.size > 5 * 1024 * 1024) {
    //   newErrors.avatar = "Image size should not exceed 5MB";
    // } else {
    //   const img = new Image();
    //   img.src = URL.createObjectURL(formData.avatar);
    //   img.onload = () => {
    //     if (img.width > 512 || img.height > 320) {
    //       newErrors.avatar = "Please upload an image with dimensions not exceeding 512x320.";
    //     }
    //   };
    // }

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

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.size.trim()) {
      newErrors.size = "Size is required";
    }

    // Validate Password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (formData.password === formData.OrgName) {
      newErrors.password = "Password must not match the organization name";
    } else if (formData.password === formData.email) {
      newErrors.password = "Password must not match the email address";
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

    setFieldsDisabled(true); // Disable all fields
    setLoading(true);
    try {
      const apiProgress = 50; // Progress for the first API call
      setProgress(apiProgress);
      const imageUrl = await uploadImageToMinio(formData.avatar);
      setFormData({ ...formData, ImgUrl: imageUrl });

      const createSubgroupResponse = await axios.post('http://10.8.0.14:5000/create-org-subgroup', {
        groupName: formData.OrgName.replace(/ /g, "_"),
        // description: 'Created in Badal Platform as an Organization',
        email: formData.email,
        password: formData.password,
        userName: formData.OrgName,
      });

      const gitlabId = createSubgroupResponse.data.subgroupId;
      const userGitLabId = createSubgroupResponse.data.userGitLabId;
      const userGitLaburl=createSubgroupResponse.data.gitlabUrl;
      const updatedFormData = { ...formData, GitlabID: gitlabId, ImgUrl: imageUrl, userGitLabId: userGitLabId ,gitlabUrl:userGitLaburl};
      const registerProgress = 100;
      setProgress(registerProgress);
      await axios.post('http://10.8.0.14:5000/org-signup', updatedFormData);

     // window.location.reload(); // Reload the page after successful signup

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

        console.error('Registration Failed:', errorMessage);
      } else {
        console.error('Other error:', error.message);
      }

      try {
        await axios.delete(`http://10.8.0.14:5000/delete-subgroup/${formData.GitlabID}`);
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
      console.error("Error uploading image to Minio:", error);
      throw error;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 5,
          padding: 4,
          width: "80%",
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 40 }} color="primary" />
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Organization Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization Name"
                name="OrgName"
                value={formData.OrgName}
                onChange={handleChange}
                error={!!errors.OrgName}
                helperText={errors.OrgName}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Organization Type"
                name="orgType"
                value={formData.orgType}
                onChange={handleChange}
                error={!!errors.orgType}
                helperText={errors.orgType}
                disabled={fieldsDisabled} // Disable field when loading
              >
                {organizationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website URL"
                name="WebsiteUrl"
                value={formData.WebsiteUrl}
                onChange={handleChange}
                error={!!errors.WebsiteUrl}
                helperText={errors.WebsiteUrl}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <div
                onClick={handleDivClick}
                style={{
                  border: "2px dashed #ccc",
                  padding: "20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {formData.avatar ? (
                  <Typography variant="body2">
                    {formData.avatar.name}
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    Click to upload logo (max 512x320)
                  </Typography>
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                disabled={fieldsDisabled} // Disable field when loading
              />
              {/* {errors.avatar && (
                <Typography color="error" variant="body2">
                  {errors.avatar}
                </Typography>
              )} */}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                name="Address1"
                value={formData.Address1}
                onChange={handleChange}
                error={!!errors.Address1}
                helperText={errors.Address1}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                name="Address2"
                value={formData.Address2}
                onChange={handleChange}
                error={!!errors.Address2}
                helperText={errors.Address2}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area Name"
                name="AreaName"
                value={formData.AreaName}
                onChange={handleChange}
                error={!!errors.AreaName}
                helperText={errors.AreaName}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                name="City"
                value={formData.City}
                onChange={handleChange}
                error={!!errors.City}
                helperText={errors.City}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={!!errors.country}
                helperText={errors.country}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="PinCode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                error={!!errors.pincode}
                helperText={errors.pincode}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                error={!!errors.size}
                helperText={errors.size}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={fieldsDisabled} // Disable field when loading
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="IsNgo"
                    checked={formData.IsNgo}
                    onChange={handleChange}
                    disabled={fieldsDisabled} // Disable field when loading
                  />
                }
                label="Is it a Non-Government Organization (NGO)?"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: "100%" }}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignUpComp;
