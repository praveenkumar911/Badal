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
            Swal.fire({
              icon: 'error',
              title: 'Invalid Image Size',
              text: 'Please upload an image with dimensions not exceeding 512x320.',
            });
          }
        };
      };
    }
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
    roleName: "OrgManager", // Added field for NGO checkbox
    email: "",
    password: "",
    access:"False",
    confirmPassword:"",
    IsNgo:""
  });

  const organizationTypes = ["Healthcare", "livelihood", "Educational"];

  const [formErrors, setFormErrors] = useState({});

 
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
  
    if (name === "IsNgo") {
      // Set 'IsNgo' based on the checkbox state
      setFormData({ ...formData, IsNgo: checked });
      console.log(`IsNgo: ${checked}`);
    } else {
      // Handle other form fields
      setFormData({ ...formData, [name]: newValue });
    }
  
    // Print updated form data in the console
    console.log("Updated Form Data:", formData);
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      try {
        // Upload image to Minio
        const imageUrl = await uploadImageToMinio(formData.avatar);
        console.log(imageUrl);
        // Set ImgUrl in the state with the Minio URL
        setFormData({ ...formData, ImgUrl: imageUrl });

        // Create GitLab subgroup
        const createSubgroupResponse = await axios.post('http://localhost:5030/create-org-subgroup', {
          name: formData.OrgName.replace(/ /g, "_"),
          description: 'Your subgroup description here',
        });
        const gitlabId = createSubgroupResponse.data.id;

        // Update form data with GitLab ID
        const updatedFormData = { ...formData, GitlabID: gitlabId ,ImgUrl: imageUrl };

        // Register organization
        const registerResponse = await axios.post('http://localhost:5030/org-signup', updatedFormData);

        console.log('GitLab Subgroup Created:', createSubgroupResponse.data);
        console.log('Organization Registered:', registerResponse.data);

        Swal.fire({
          title: 'Registration Successful!',
          text: 'Your Approval from Admin is pending. Kindly wait for 48 hrs.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
           navigate('/');
        });

        // Clear form data and errors
        setFormData(formData);
        setFormErrors({});
      } catch (error) {
        console.error('Error during registration:', error);

        if (error.response) {
          console.error('Response error:', error.response.data);
        } else if (error.request) {
          console.error('Request error:', error.request);
        } else {
          console.error('Other error:', error.message);
        }

        // If an error occurs, delete the GitLab subgroup
        try {
          await axios.delete(`http://localhost:5030/delete-group/${formData.GitlabID}`);
          console.log('GitLab Subgroup deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting GitLab subgroup:', deleteError);
        }
      } finally {
        setLoading(false); // Set loading state to false
      }
    } else {
      setFormErrors(errors);
      setLoading(false); // Set loading state to false
    }
  };

  const uploadImageToMinio = async (file) => {
    try {
      const s3 = new AWS.S3();

      const bucketName = "psuw001"; // Replace with your Minio bucket name
      const key = `logos/${file.name}`; // Adjust the key as needed

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
const validateForm = (data) => {
  const errors = {};

  if (!data.OrgName) {
    errors.OrgName = "Organization name is required";
  }

  if (!data.WebsiteUrl) {
    errors.WebsiteUrl = "Website URL is required";
  } else if (!/^https?:\/\/[\w-]+(\.[\w-]+)+([\w-.,@?^=%&:/+#]*[\w@?^=%&/+#])?$/.test(data.WebsiteUrl)) {
    errors.WebsiteUrl = "Invalid website URL";
  }

  if (!data.orgType) {
    errors.orgType = "Organization type is required";
  }

  if (!data.Address1) {
    errors.Address1 = "Address line 1 is required";
  }

  if (!data.AreaName) {
    errors.AreaName = "Area name is required";
  }

  if (!data.City) {
    errors.City = "City is required";
  }

  if (!data.state) {
    errors.state = "State is required";
  }

  if (!data.pincode) {
    errors.pincode = "Pincode is required";
  } else if (!/^\d{6}$/.test(data.pincode)) {
    errors.pincode = "Invalid pincode";
  }

  if (!data.country) {
    errors.country = "Country is required";
  }

  if (!data.email) {
    errors.email = "Email is required for NGOs";
  }

  if (!data.password) {
    errors.password = "Password is required for NGOs";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Add more validations as needed for other fields
  return errors;
};
const [uploadedFileName, setUploadedFileName] = useState('');


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
        error={!!formErrors.OrgName}
        helperText={formErrors.OrgName}
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
        error={!!formErrors.WebsiteUrl}
        helperText={formErrors.WebsiteUrl}
      />
    </Grid>
  </Grid>
  <Grid item xs={12} sm={6}>
  <div
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
  </div>
  <Typography align="center" marginTop="1vw">Upload Your logo in PNG format with a max size of 5MB</Typography>
</Grid>



          <Grid item xs={12} sm={6}>
            <TextField
              label="Address Line 1"
              name="Address1"
              value={formData.Address1}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.Address1}
              helperText={formErrors.Address1}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address Line 2"
              name="Address2"
              value={formData.Address2}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Area Name"
              name="AreaName"
              value={formData.AreaName}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.AreaName}
              helperText={formErrors.AreaName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.City}
              helperText={formErrors.City}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.state}
              helperText={formErrors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.country}
              helperText={formErrors.country}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="PinCode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              fullWidth
              error={!!formErrors.pincode}
              helperText={formErrors.pincode}
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
            <>
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
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          error={!!formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
        />
      </Grid>
            </>

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
